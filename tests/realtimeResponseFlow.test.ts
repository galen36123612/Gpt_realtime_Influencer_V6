import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  createDirectAnswerResponse,
  createDirectWebSearchArguments,
  createShenPersonaContextEvent,
  createSyntheticFunctionCallEvent,
  createSyntheticFunctionOutputEvent,
  isBridgeOnlyAssistantResponse,
  isShenPersonaProfileQuestion,
  normalizeShenNameVariants,
} from "../src/app/lib/realtimeResponseFlow.ts";

test("direct Local Tool flow appends a complete function call and output", () => {
  const call = createSyntheticFunctionCallEvent({
    callId: "route-1-local",
    toolName: "lookup_taipei_councilor_by_name",
    args: { name: "林亮君", detail: "events" },
  });
  const output = createSyntheticFunctionOutputEvent({
    callId: "route-1-local",
    output: '{"found":true}',
  });

  assert.deepEqual(call.item, {
    type: "function_call",
    call_id: "route-1-local",
    name: "lookup_taipei_councilor_by_name",
    arguments: '{"name":"林亮君","detail":"events"}',
    status: "completed",
  });
  assert.deepEqual(output.item, {
    type: "function_call_output",
    call_id: "route-1-local",
    output: '{"found":true}',
  });
});

test("ordinary direct answers inherit the complete session persona", () => {
  const response = createDirectAnswerResponse({});

  assert.deepEqual(response.output_modalities, ["audio"]);
  assert.equal(response.tool_choice, "auto");
  assert.equal("instructions" in response, false);

  const noTools = createDirectAnswerResponse({ allowTools: false });
  assert.equal(noTools.tool_choice, "none");
  assert.equal("instructions" in noTools, false);

  const retry = createDirectAnswerResponse({ purpose: "bridge_retry" });
  assert.equal(retry.tool_choice, "none");
  assert.equal("instructions" in retry, false);
});

test("inaudible response asks once instead of repeating the welcome", () => {
  const response = createDirectAnswerResponse({ purpose: "inaudible" });

  assert.equal(response.metadata.response_purpose, "inaudible");
  assert.match(response.instructions!, /沒有聽清楚/);
  assert.doesNotMatch(response.instructions!, /自我介紹一下|市長沈伯洋向您問好/);
});

test("normalizes Shen name STT variants and identifies persona profile questions", () => {
  assert.equal(normalizeShenNameVariants("審柏楊基本資料"), "沈伯洋基本資料");
  assert.equal(normalizeShenNameVariants("沈柏洋你自我介紹"), "沈伯洋你自我介紹");

  for (const transcript of [
    "沈伯洋你自我介紹一下",
    "沈柏楊你自我介紹",
    "妳應該是AI市長審柏楊",
    "沈伯洋基本資料",
    "你結婚了嗎？",
  ]) {
    assert.equal(isShenPersonaProfileQuestion(transcript), true, transcript);
  }

  assert.equal(isShenPersonaProfileQuestion("沈伯洋昨天受訪說了什麼？"), false);
  assert.equal(isShenPersonaProfileQuestion("中山區有哪些市議員？"), false);
});

test("persona context uses a system item and the canonical Shen name", () => {
  const event = createShenPersonaContextEvent("審柏楊基本資料");

  assert.equal(event.type, "conversation.item.create");
  assert.equal(event.item.role, "system");
  assert.match(event.item.content[0].text, /AI 市長沈伯洋/);
  assert.match(event.item.content[0].text, /使用者本回合：沈伯洋基本資料/);
});

test("detects transcript examples that stopped at a spoken bridge", () => {
  for (const text of [
    "好，我來用一個很直觀的方式回答，既說清楚這個問題。",
    "我來說清楚我這方面的定位，讓你知道可以怎麼理解。",
    "接下來我用一個清楚的方式回答。",
  ]) {
    assert.equal(isBridgeOnlyAssistantResponse(text), true, text);
  }

  assert.equal(
    isBridgeOnlyAssistantResponse(
      "內湖交通要先做企業錯峰、最後一哩接駁，再用通勤時間 KPI 驗證成效。"
    ),
    false
  );
});

test("builds a bounded direct web query without another model tool-selection turn", () => {
  const args = createDirectWebSearchArguments(
    "蔣市府現在有做內湖交通改善嗎？",
    ["你會怎麼改善內湖交通？"]
  );

  assert.match(args.query, /內湖交通.*最新公開資料/);
  assert.equal(args.recency_days, 90);
  assert.ok(args.query.length <= 607);
});

test("live App waits for response.done and directly executes deterministic Local Tools", () => {
  const source = readFileSync(
    new URL("../src/app/App.tsx", import.meta.url),
    "utf8"
  );
  const liveApp = source.slice(source.lastIndexOf("// 0902 Add councilors data"));

  assert.match(liveApp, /void runDirectLocalTool\(/);
  assert.match(liveApp, /createSyntheticFunctionCallEvent\(/);
  assert.match(liveApp, /create_response: false/);
  assert.ok(
    liveApp.indexOf("isShenPersonaProfileQuestion(normalizedText)") <
      liveApp.indexOf("selectShenMediaKBTool(normalizedText")
  );
  assert.doesNotMatch(
    liveApp,
    /eventType === "response\.function_call_arguments\.done"[\s\S]{0,260}processAppManagedToolCalls/
  );
});
