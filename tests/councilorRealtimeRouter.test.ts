import assert from "node:assert/strict";
import test from "node:test";

import {
  createCachedCouncilorFinalResponse,
  createInitialLocalConversationContext,
  createLocalFinalAnswerResponse,
  createSilentLocalToolResponse,
  routeCouncilorTranscript,
  updateCouncilorContextFromResult,
} from "../src/app/lib/councilorRealtimeRouter.ts";
import { executeCouncilorTool } from "../src/app/data/councilors.ts";
import { selectTaipeiCivicTool } from "../src/app/lib/civicToolRouting.ts";
import { selectShenMediaKBTool } from "../src/app/lib/shenMediaRouting.ts";

function requireRoute(text: string, context = createInitialLocalConversationContext()) {
  const decision = routeCouncilorTranscript(text, context);
  assert.ok(decision.route, `expected Councilor route for: ${text}`);
  return decision;
}

test("T1 顏若芳政策：deterministic by-name policy route", () => {
  const { route } = requireRoute("顏若芳有提什麼政見？");
  assert.equal(route?.forcedTool, "lookup_taipei_councilor_by_name");
  assert.deepEqual(route?.args, { name: "顏若芳", detail: "policy" });

  const executed: any = executeCouncilorTool(route!.forcedTool!, route!.args);
  assert.equal(executed.handled, true);
  assert.equal(executed.result.found, true);
  const result = executed.result.data[0];
  assert.equal(result.name, "顏若芳");
  assert.equal(result.policyTop3.length, 3);
  assert.match(result.realtimeSummary.policies, /母嬰育兒.*智慧交通.*河岸文化.*國際城市/);
  assert.equal(executed.result.shouldVerifyLatest, false);
});

test("T2 顏若芳 connection：relationship route and grounded summary", () => {
  const { route } = requireRoute("你跟顏若芳會怎麼合作？");
  assert.deepEqual(route?.args, { name: "顏若芳", detail: "relationship" });

  const executed: any = executeCouncilorTool(route!.forcedTool!, route!.args);
  assert.equal(executed.result.found, true);
  const relation = executed.result.data[0].relationToShen;
  assert.match(relation.realtimeSummary.relationship, /台北隊公開合作夥伴/);
  assert.match(relation.realtimeSummary.collaboration, /育兒.*交通.*地方公共空間/);
  assert.ok(relation.confirmedPublicEvents.length > 0);
});

test("T3 林亮君公開活動：events route includes 大龍市場", () => {
  const { route } = requireRoute("你跟林亮君一起去哪？");
  assert.deepEqual(route?.args, { name: "林亮君", detail: "events" });

  const executed: any = executeCouncilorTool(route!.forcedTool!, route!.args);
  assert.equal(executed.result.found, true);
  assert.equal(
    executed.result.data[0].confirmedPublicEvents.some((event: any) =>
      event.summary.includes("大龍市場")
    ),
    true
  );
});

test("T4 交通議員：DPP + normalized transportation topic", () => {
  const { route } = requireRoute("哪些民進黨議員關心交通？");
  assert.equal(route?.forcedTool, "lookup_taipei_councilors");
  assert.deepEqual(route?.args, {
    topic: "交通",
    party: "民主進步黨",
    detail: "quick",
  });

  const executed: any = executeCouncilorTool(route!.forcedTool!, route!.args);
  assert.equal(executed.result.found, true);
  const names = executed.result.data.map((item: any) => item.name);
  for (const expected of ["何孟樺", "王孝維", "李建昌", "洪健益", "許淑華", "林亮君", "王閔生"]) {
    assert.ok(names.includes(expected), expected);
  }
});

test("T5 Topic carryover：老屋電梯 follow-up uses DPP topic search", () => {
  const first = routeCouncilorTranscript(
    "你怎麼改善老屋加裝電梯？",
    createInitialLocalConversationContext()
  );
  assert.equal(first.route, null);
  assert.equal(first.context.activeTopic, "電梯無障礙");

  const second = requireRoute("有沒有議員跟你方向一樣？", first.context);
  assert.deepEqual(second.route?.args, {
    topic: "電梯無障礙",
    party: "民主進步黨",
    detail: "quick",
  });

  const executed: any = executeCouncilorTool(second.route!.forcedTool!, second.route!.args);
  const names = executed.result.data.map((item: any) => item.name);
  assert.ok(names.includes("林延鳳"));
  assert.ok(names.includes("許淑華"));
});

test("T6 同黨：文山 resolves to constituency 6 and DPP", () => {
  const { route } = requireRoute("文山區哪些議員跟你同黨？");
  assert.deepEqual(route?.args, {
    district: "文山區",
    party: "民主進步黨",
    detail: "quick",
  });

  const executed: any = executeCouncilorTool(route!.forcedTool!, route!.args);
  assert.equal(executed.result.constituency, 6);
  assert.deepEqual(
    executed.result.data.map((item: any) => item.name).sort(),
    ["王閔生", "簡舒培"].sort()
  );
});

test("T7 北投完整名單：returns every current constituency-1 councilor", () => {
  const { route } = requireRoute("北投區有哪些市議員？");
  assert.deepEqual(route?.args, { district: "北投區", detail: "quick" });

  const executed: any = executeCouncilorTool(route!.forcedTool!, route!.args);
  assert.equal(executed.result.constituency, 1);
  assert.equal(executed.result.count, 11);
  assert.equal(
    executed.result.data.every((item: any) => item.constituency === 1 && item.status === "current"),
    true
  );
});

test("T8 全台北公開合作：does not inherit stale 中山 district", () => {
  const first = requireRoute("中山區有哪些市議員？");
  const firstResult = executeCouncilorTool(first.route!.forcedTool!, first.route!.args);
  const context = updateCouncilorContextFromResult(first.context, firstResult.result);
  assert.equal(context.activeDistrict, "中山區");

  const second = requireRoute("那你跟哪些市議員有公開活動？", context);
  assert.equal(second.route?.globalScope, true);
  assert.equal("district" in second.route!.args, false);
  assert.deepEqual(second.route?.args, {
    hasPublicEventWithShen: true,
    detail: "quick",
  });

  const executed: any = executeCouncilorTool(second.route!.forcedTool!, second.route!.args);
  const constituencies = new Set(executed.result.data.map((item: any) => item.constituency));
  assert.ok(constituencies.size > 1);
});

test("routes natural public-trip wording without waiting for the model", () => {
  for (const text of [
    "那你有跟其他市議員一起公開行程嗎？",
    "你有跟其他市議員有公開行程或公開站台嗎？",
  ]) {
    const { route } = requireRoute(text);
    assert.equal(route?.intent.type, "public_activity_list", text);
    assert.deepEqual(
      route?.args,
      { hasPublicEventWithShen: true, detail: "quick" },
      text
    );
  }
});

test("T9 最近媒體：Media KB wins over Councilor routing", () => {
  const councilor = routeCouncilorTranscript(
    "最近你有什麼採訪？",
    createInitialLocalConversationContext()
  );
  assert.equal(councilor.route, null);
  assert.equal(selectShenMediaKBTool("最近你有什麼採訪？"), "lookup_shen_media_kb");
});

test("T10 里長：Village KB wins and answers 北安里", () => {
  const text = "北安里里長是誰？";
  assert.equal(routeCouncilorTranscript(text, {}).route, null);
  assert.equal(selectTaipeiCivicTool(text), "lookup_taipei_village_chief");
});

test("顏若芳四種 intent immediately choose the exact local detail", () => {
  const cases = [
    ["顏若芳政見", "policy"],
    ["顏若芳背景", "profile"],
    ["顏若芳合作", "relationship"],
    ["顏若芳共同活動", "events"],
  ] as const;

  for (const [text, detail] of cases) {
    const { route } = requireRoute(text);
    assert.equal(route?.forcedTool, "lookup_taipei_councilor_by_name", text);
    assert.deepEqual(route?.args, { name: "顏若芳", detail }, text);
  }
});

test("follow-up 這兩位 reuses a successful quick result without another tool", () => {
  const first = requireRoute("文山區哪些議員跟你同黨？");
  const executed: any = executeCouncilorTool(first.route!.forcedTool!, first.route!.args);
  const context = updateCouncilorContextFromResult(first.context, executed.result);
  const followUp = requireRoute("這兩位的政見？", context);

  assert.equal(followUp.route?.cacheHit, true);
  assert.equal(followUp.route?.forcedTool, null);
  assert.deepEqual(followUp.route?.entities.sort(), ["王閔生", "簡舒培"].sort());

  const cachedResponse = createCachedCouncilorFinalResponse(followUp.route!);
  assert.deepEqual(cachedResponse.output_modalities, ["audio"]);
  assert.equal(cachedResponse.tool_choice, "none");
});

test("does not apply a stale topic after a Village turn", () => {
  const { route } = requireRoute("那有議員跟你提的政見方向一致嗎？", {
    activeTopic: "內湖交通",
    activeToolDomain: "village",
  });

  assert.equal(route?.intent.type, "policy_alignment_list");
  assert.deepEqual(route?.args, {
    party: "民主進步黨",
    detail: "quick",
  });
});

test("resolves a support follow-up to the active councilor", () => {
  const first = requireRoute("林世宗提了什麼政見？");
  const executed: any = executeCouncilorTool(first.route!.forcedTool!, first.route!.args);
  const context = updateCouncilorContextFromResult(first.context, executed.result);
  const followUp = requireRoute("那市長你會支持他嗎？", context);

  assert.equal(followUp.route?.intent.type, "relationship");
  assert.deepEqual(followUp.route?.entities, ["林世宗"]);
  assert.equal(followUp.route?.cacheHit, true);
});

test("a known councilor name alone defaults to a profile route", () => {
  const { route } = requireRoute("那顏若芳呢？");
  assert.deepEqual(route?.args, { name: "顏若芳", detail: "profile" });
});

test("district final instructions require an exact non-duplicated roster", () => {
  const { route } = requireRoute("北投區有哪些市議員？");
  const final = createLocalFinalAnswerResponse({
    routeId: "route-district",
    route,
    transcript: "北投區有哪些市議員？",
  });

  assert.match(final.instructions, /每位議員的姓名都必須各出現一次/);
  assert.match(final.instructions, /不得漏人、重複姓名/);
});

test("all forced Local Tools are silent and only the final response uses audio", () => {
  const silent = createSilentLocalToolResponse({
    forcedTool: "lookup_taipei_councilor_by_name",
    args: { name: "顏若芳", detail: "policy" },
    instructions: "deterministic",
    routeId: "route-1",
  });
  const final = createLocalFinalAnswerResponse({ routeId: "route-1" });

  assert.deepEqual(silent.output_modalities, ["text"]);
  assert.deepEqual(silent.tool_choice, {
    type: "function",
    name: "lookup_taipei_councilor_by_name",
  });
  assert.equal(silent.metadata.response_purpose, "silent_local_tool");
  assert.equal(/我查一下|我看一下資料|我整理一下|讓我想一下/.test(silent.instructions), false);

  assert.deepEqual(final.output_modalities, ["audio"]);
  assert.equal(final.tool_choice, "none");
  assert.equal(final.metadata.response_purpose, "local_tool_final_answer");
});
