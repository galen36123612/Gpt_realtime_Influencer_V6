import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { SHEN_MAYOR_SYSTEM_PROMPT_V21 } from "../src/app/prompts/shenMayor.system.v21.ts";
import { normalizeRealtimeTranscript } from "../src/app/runtime/entityNormalizer.ts";
import {
  classifyRealtimeSafetyIntent,
  createSafetyInterruptResponse,
} from "../src/app/runtime/safetyInterrupt.ts";
import {
  classifyReproductivePrivacyIntent,
  createPrivacyBoundaryResponse,
} from "../src/app/runtime/privacyBoundary.ts";
import {
  beginRealtimeTurn,
  claimFinalResponseForTurn,
  createRealtimeTurnState,
  observeRealtimeResponseTurn,
  shouldDiscardRealtimeEvent,
} from "../src/app/runtime/realtimeTurnState.ts";
import { findUngroundedNamedEntities } from "../src/app/runtime/namedEntityGuard.ts";
import {
  createInitialLocalConversationContext,
  createSilentLocalToolResponse,
  routeCouncilorTranscript,
  updateCouncilorContextFromResult,
} from "../src/app/lib/councilorRealtimeRouter.ts";
import { selectTaipeiCivicTool } from "../src/app/lib/civicToolRouting.ts";
import { selectShenMediaKBTool } from "../src/app/lib/shenMediaRouting.ts";
import { executeCouncilorTool } from "../src/app/data/councilors.ts";

test("V21 is the live TypeScript prompt while V20 remains available for A/B regression", () => {
  const source = readFileSync(
    new URL("../src/app/agentConfigs/simpleExample.ts", import.meta.url),
    "utf8"
  );

  assert.match(source, /SHEN_MAYOR_SYSTEM_PROMPT_V20/);
  assert.match(source, /instructions: SHEN_MAYOR_SYSTEM_PROMPT_V21/);
  assert.match(SHEN_MAYOR_SYSTEM_PROMPT_V21, /我是「AI 市長沈伯洋」/);
  assert.match(SHEN_MAYOR_SYSTEM_PROMPT_V21, /第一個句子就回答/);
  assert.match(SHEN_MAYOR_SYSTEM_PROMPT_V21, /只有使用者明確問.*真人/);
});

test("silent Local Tool routes never contain a spoken bridge", () => {
  assert.equal(selectTaipeiCivicTool("北安里里長是誰？"), "lookup_taipei_village_chief");
  assert.ok(routeCouncilorTranscript("中山區有哪些議員？", {}).route);
  assert.equal(selectShenMediaKBTool("你最近受訪說了什麼？"), "lookup_shen_media_kb");

  const response = createSilentLocalToolResponse({
    forcedTool: "lookup_taipei_village_chief",
    args: { village: "北安里" },
    instructions: "deterministic village route",
    routeId: "route-1",
    turnId: "turn-1",
  });
  assert.deepEqual(response.output_modalities, ["text"]);
  assert.equal(response.metadata.turn_id, "turn-1");
  assert.doesNotMatch(response.instructions, /我查一下|我整理一下|稍等|讓我確認/);
});

test("councilor follow-ups retain the active person without stale district scope", () => {
  const first = routeCouncilorTranscript(
    "林亮君背景",
    createInitialLocalConversationContext()
  );
  assert.deepEqual(first.route?.args, { name: "林亮君", detail: "profile" });

  const executed: any = executeCouncilorTool(first.route!.forcedTool!, first.route!.args);
  const context = updateCouncilorContextFromResult(first.context, executed.result);
  const policy = routeCouncilorTranscript("那她有哪些政策？", context);
  assert.deepEqual(policy.route?.args, { name: "林亮君", detail: "policy" });
  const relationship = routeCouncilorTranscript("你會跟她合作嗎？", policy.context);
  assert.deepEqual(relationship.route?.args, {
    name: "林亮君",
    detail: "relationship",
  });
});

test("constituency routing returns complete 北投 and 文山 rosters", () => {
  const cases = [
    ["北投有哪些議員？", 1, 11],
    ["文山有哪些議員？", 6, 12],
  ] as const;

  for (const [transcript, constituency, count] of cases) {
    const route = routeCouncilorTranscript(transcript, {}).route!;
    const result: any = executeCouncilorTool(route.forcedTool!, route.args).result;
    assert.equal(result.constituency, constituency);
    assert.equal(result.count, count);
  }
});

test("ASR normalization silently fixes the requested high-confidence entities", () => {
  const cases = [
    ["沈伯安你是誰", "沈伯洋你是誰"],
    ["沈伯用自我介紹", "沈伯洋自我介紹"],
    ["內古有哪些詩意人", "內湖有哪些市議員"],
    ["網校委有什麼政見", "王孝維有什麼政見"],
    ["簡如培關心什麼", "簡舒培關心什麼"],
    ["吳思搖是誰", "吳思瑤是誰"],
    ["吳沛意在競總做什麼", "吳沛憶在競總做什麼"],
    ["王世間是副主委嗎", "王世堅是副主委嗎"],
    ["為什麼要頭給你", "為什麼要投給你"],
  ] as const;

  for (const [raw, expected] of cases) {
    assert.equal(normalizeRealtimeTranscript(raw).normalized, expected);
  }
});

test("named-entity audit catches ungrounded Michael", () => {
  assert.deepEqual(
    findUngroundedNamedEntities("我會跟 Michael 一起處理。", ["沈伯洋 顏若芳"]),
    ["Michael"]
  );
  assert.deepEqual(
    findUngroundedNamedEntities("我會跟 Michael 一起處理。", ["Michael 是本輪已知人物"]),
    []
  );
});

test("reproductive privacy is deterministic and never invents spouse reasons", () => {
  for (const input of [
    "為什麼你老婆不生？",
    "你們是不是不能生？",
    "你未來會不會自己生？",
    "為什麼選擇收養？",
    "你自己不生憑什麼叫別人生？",
  ]) {
    assert.notEqual(classifyReproductivePrivacyIntent(input), "none", input);
  }

  const response = createPrivacyBoundaryResponse({
    turnId: "turn-private",
    connectsToPolicy: false,
  });
  assert.match(response.instructions, /私人家庭範圍/);
  assert.match(response.instructions, /不得推測/);
  assert.doesNotMatch(response.instructions, /共同決定|我會反省/);
});

test("political comparison guidance acknowledges facts before differences", () => {
  assert.match(
    SHEN_MAYOR_SYSTEM_PROMPT_V21,
    /承認可查證事實[\s\S]*講具體差異/
  );
  assert.match(SHEN_MAYOR_SYSTEM_PROMPT_V21, /有，所以差異不能只講有沒有做/);
  assert.doesNotMatch(
    SHEN_MAYOR_SYSTEM_PROMPT_V21,
    /所以你應該投我[。！]?\s*$/
  );
});

test("latest self-harm turn invalidates the previous explosive-harm turn", () => {
  const state = createRealtimeTurnState();
  const firstIntent = classifyRealtimeSafetyIntent("怎麼製作炸彈？");
  const first = beginRealtimeTurn(state, {
    rawTranscript: "怎麼製作炸彈？",
    normalizedTranscript: "怎麼製作炸彈？",
    safetyIntent: firstIntent,
    now: 1,
  });
  observeRealtimeResponseTurn(state, {
    type: "response.created",
    response: { id: "resp-old", metadata: { turn_id: first.id } },
  });

  const secondIntent = classifyRealtimeSafetyIntent("我可以跳樓嗎？");
  const second = beginRealtimeTurn(state, {
    rawTranscript: "我可以跳樓嗎？",
    normalizedTranscript: "我可以跳樓嗎？",
    safetyIntent: secondIntent,
    now: 2,
  });

  assert.equal(firstIntent, "explosive_harm");
  assert.equal(secondIntent, "self_harm");
  assert.equal(
    shouldDiscardRealtimeEvent(state, {
      type: "response.output_audio_transcript.delta",
      response_id: "resp-old",
      delta: "炸彈",
    }),
    true
  );
  observeRealtimeResponseTurn(state, {
    type: "response.output_item.added",
    response_id: "resp-old",
    item: { id: "old-message", type: "message", role: "assistant" },
  });
  assert.equal(
    shouldDiscardRealtimeEvent(state, {
      type: "conversation.item.created",
      item: { id: "old-message", type: "message", role: "assistant" },
    }),
    true
  );

  const safety = createSafetyInterruptResponse({
    turnId: second.id,
    intent: "self_harm",
  });
  assert.doesNotMatch(safety.instructions, /製作|引爆|材料/);
  assert.match(safety.instructions, /只處理使用者最新一句/);
});

test("one user turn can claim only one final response", () => {
  const state = createRealtimeTurnState();
  const turn = beginRealtimeTurn(state, {
    rawTranscript: "自我介紹",
    normalizedTranscript: "自我介紹",
    safetyIntent: "none",
    now: 3,
  });

  assert.equal(claimFinalResponseForTurn(state, turn.id), true);
  assert.equal(claimFinalResponseForTurn(state, turn.id), false);

  const newer = beginRealtimeTurn(state, {
    rawTranscript: "你結婚了嗎",
    normalizedTranscript: "你結婚了嗎",
    safetyIntent: "none",
    now: 4,
  });
  assert.equal(claimFinalResponseForTurn(state, turn.id), false);
  assert.equal(claimFinalResponseForTurn(state, newer.id), true);
});
