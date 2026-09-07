import assert from "node:assert/strict";
import test from "node:test";

import {
  LOOKUP_SHEN_MEDIA_KB_TOOL,
  SHEN_MEDIA_EVENTS,
  executeShenMediaKBTool,
  queryShenMediaKB,
} from "../src/app/data/shenMediaKB.ts";
import {
  inferShenMediaKBToolArguments,
  selectShenMediaKBTool,
} from "../src/app/lib/shenMediaRouting.ts";

test("ships a unique, source-backed Shen media snapshot", () => {
  assert.ok(SHEN_MEDIA_EVENTS.length >= 15);
  assert.equal(
    new Set(SHEN_MEDIA_EVENTS.map(({ id }) => id)).size,
    SHEN_MEDIA_EVENTS.length
  );
  assert.ok(
    SHEN_MEDIA_EVENTS.every(
      ({ sources }) => sources.length > 0 && sources.every(({ url }) => /^https:\/\//.test(url))
    )
  );
});

test("registers and dispatches lookup_shen_media_kb", () => {
  assert.equal(LOOKUP_SHEN_MEDIA_KB_TOOL.type, "function");
  assert.equal(LOOKUP_SHEN_MEDIA_KB_TOOL.name, "lookup_shen_media_kb");

  const handled = executeShenMediaKBTool("lookup_shen_media_kb", {
    query: "蔡英文 登記",
    limit: 3,
  });
  assert.equal(handled.handled, true);
  assert.equal(handled.result.found, true);
  assert.ok(
    handled.result.data.some(
      ({ id }) => id === "2026-09-02-registration-tsai"
    )
  );
  assert.deepEqual(executeShenMediaKBTool("web_search", {}), {
    handled: false,
  });
});

test("matches natural Chinese questions instead of requiring exact KB wording", () => {
  const registration = queryShenMediaKB({
    query: "蔡英文為什麼陪沈伯洋登記，還送了什麼？",
  });
  assert.equal(registration.found, true);
  assert.equal(registration.data[0]?.id, "2026-09-02-registration-tsai");

  const exchangeProgram = queryShenMediaKB({
    query: "蔣萬安小孩拿獎學金的利益迴避爭議",
  });
  assert.equal(exchangeProgram.found, true);
  assert.equal(
    exchangeProgram.data[0]?.id,
    "2026-09-04-05-chiang-son-exchange-program"
  );
});

test("tells App to search the web only when local data is absent", () => {
  const known = queryShenMediaKB({ query: "HEART 五大政見" });
  assert.equal(known.found, true);
  assert.equal(known.shouldSearchWeb, false);

  const unknown = queryShenMediaKB({ query: "完全未收錄的火星基地計畫" });
  assert.equal(unknown.found, false);
  assert.equal(unknown.shouldSearchWeb, true);
});

test("forces known campaign and interview topics to Local KB", () => {
  assert.equal(
    selectShenMediaKBTool("蔡英文為什麼陪你登記？"),
    "lookup_shen_media_kb"
  );
  assert.equal(
    selectShenMediaKBTool("昨天受訪說了什麼？", ["沈伯洋最近有什麼新聞"]),
    "lookup_shen_media_kb"
  );
  assert.equal(
    selectShenMediaKBTool("哪些市議員跟沈伯洋合作？"),
    null
  );
});

test("infers Taipei-relative dates from fragmented turns", () => {
  assert.deepEqual(
    inferShenMediaKBToolArguments(
      {},
      ["我想問沈伯洋", "昨天受訪說什麼"],
      new Date("2026-09-07T06:00:00Z")
    ),
    {
      query: "我想問沈伯洋 昨天受訪說什麼",
      dateFrom: "2026-09-06",
      dateTo: "2026-09-06",
      requiresLatest: false,
    }
  );
});
