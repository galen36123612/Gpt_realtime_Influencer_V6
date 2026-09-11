import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  createDirectAnswerResponse,
  createDirectWebSearchArguments,
  createSyntheticFunctionCallEvent,
  createSyntheticFunctionOutputEvent,
  isBridgeOnlyAssistantResponse,
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

test("direct answer prompt forbids bridge-only and invented names", () => {
  const response = createDirectAnswerResponse({});

  assert.deepEqual(response.output_modalities, ["audio"]);
  assert.equal(response.tool_choice, "auto");
  assert.match(response.instructions, /第一句就是實質答案/);
  assert.match(response.instructions, /不得插入.*英文名字/);
});

test("inaudible response asks once instead of repeating the welcome", () => {
  const response = createDirectAnswerResponse({ purpose: "inaudible" });

  assert.equal(response.metadata.response_purpose, "inaudible");
  assert.match(response.instructions, /沒有聽清楚/);
  assert.doesNotMatch(response.instructions, /自我介紹一下|市長沈伯洋向您問好/);
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
  assert.doesNotMatch(
    liveApp,
    /eventType === "response\.function_call_arguments\.done"[\s\S]{0,260}processAppManagedToolCalls/
  );
});
