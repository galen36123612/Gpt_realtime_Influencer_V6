import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  LOOKUP_SHEN_MEDIA_KB_TOOL,
  SHEN_MEDIA_EVENTS,
  SHEN_MEDIA_KB_META,
  executeShenMediaKBTool,
  queryShenMediaKB,
} from "../src/app/data/shenMediaKB.ts";
import {
  inferShenMediaKBToolArguments,
  routeShenMediaTranscript,
  selectShenMediaKBTool,
} from "../src/app/lib/shenMediaRouting.ts";

test("ships a unique, source-backed Shen media snapshot", () => {
  assert.ok(SHEN_MEDIA_EVENTS.length >= 22);
  assert.equal(SHEN_MEDIA_KB_META.verifiedAt, "2026-09-15");
  assert.equal(
    SHEN_MEDIA_KB_META.snapshotThrough,
    "2026-09-15T09:15:00+08:00"
  );
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

test("answers the Wang Wei-chung interview from the refreshed Local KB", () => {
  const interview = queryShenMediaKB({
    query: "你上王偉忠的欸我說到哪裡了談了什麼？",
    limit: 3,
  });

  assert.equal(interview.found, true);
  assert.equal(interview.data[0]?.id, "2026-09-10-wwc-first-election-self-positioning");
  assert.match(interview.data[0]?.title || "", /王偉忠專訪/);
  assert.ok(
    interview.data[0]?.sources.some(
      ({ url }) => url === "https://www.youtube.com/watch?v=jvAJlObFj6k"
    )
  );
});

const WANG_WEI_CHUNG_ATOMIC_IDS = [
  "2026-09-10-wwc-first-election-self-positioning",
  "2026-09-10-wwc-kuma-civil-defense",
  "2026-09-10-wwc-chiang-child-conflict-of-interest",
  "2026-09-10-wwc-twin-city-forum",
  "2026-09-10-wwc-cross-strait-risk-management",
  "2026-09-10-wwc-chiang-planning-execution",
  "2026-09-10-wwc-k-shaped-economy-youth",
  "2026-09-10-wwc-cultural-trails",
  "2026-09-10-wwc-sports-frequency-indoor",
  "2026-09-10-wwc-city-vision-five-values",
  "2026-09-10-wwc-music-ecosystem-night-governance",
] as const;

test("stores the Wang Wei-chung interview as 11 atomic, source-dated records", () => {
  const records = SHEN_MEDIA_EVENTS.filter(({ id }) =>
    id.startsWith("2026-09-10-wwc-")
  );

  assert.equal(records.length, 11);
  assert.deepEqual(records.map(({ id }) => id), WANG_WEI_CHUNG_ATOMIC_IDS);
  assert.equal(
    SHEN_MEDIA_EVENTS.some(({ id }) => id === "2026-09-10-wang-wei-chung-interview"),
    false
  );
  assert.ok(records.every(({ date }) => date === "2026-09-10"));
  assert.ok(
    records.every(({ sources }) =>
      sources.some(
        ({ url, publishedAt }) =>
          url === "https://www.youtube.com/watch?v=jvAJlObFj6k" &&
          publishedAt === "2026-09-10"
      )
    )
  );
});

test("maps all 11 requested interview phrasings to their atomic Local KB records", () => {
  const cases = [
    ["黑熊是不是民兵？", "2026-09-10-wwc-kuma-civil-defense"],
    ["你是不是鼓吹戰爭？", "2026-09-10-wwc-kuma-civil-defense"],
    ["蔣萬安小孩交換學生你怎麼看？", "2026-09-10-wwc-chiang-child-conflict-of-interest"],
    ["你為什麼不辦雙城論壇？", "2026-09-10-wwc-twin-city-forum"],
    ["你是不是反對兩岸交流？", "2026-09-10-wwc-cross-strait-risk-management"],
    ["你跟蔣萬安最大的差別？", "2026-09-10-wwc-chiang-planning-execution"],
    ["你希望台北人怎麼生活？", "2026-09-10-wwc-city-vision-five-values"],
    ["什麼是文化山徑？", "2026-09-10-wwc-cultural-trails"],
    ["你運動政策想解決什麼？", "2026-09-10-wwc-sports-frequency-indoor"],
    ["音樂生態系是什麼？", "2026-09-10-wwc-music-ecosystem-night-governance"],
    ["夜間市長是什麼？", "2026-09-10-wwc-music-ecosystem-night-governance"],
  ] as const;

  for (const [query, expectedId] of cases) {
    const result = queryShenMediaKB({ query, limit: 1 });
    assert.equal(result.data[0]?.id, expectedId, query);
    assert.equal(selectShenMediaKBTool(query), "lookup_shen_media_kb", query);
  }
});

test("keeps host context out of Shen positions and guards unverified figures", () => {
  const records = SHEN_MEDIA_EVENTS.filter(({ id }) =>
    id.startsWith("2026-09-10-wwc-")
  );
  const attributedShenClaims = records
    .flatMap(({ keyFacts, shenPublicPosition = [] }) => [
      ...keyFacts,
      ...shenPublicPosition,
    ])
    .join(" ");

  assert.doesNotMatch(attributedShenClaims, /王偉忠(?:說|認為|主張)/);
  assert.doesNotMatch(attributedShenClaims, /三成|五成|27／28 萬|下降 60%/);
});

test("treats the unlimited-renewal preview as stale-sensitive, not stable policy", () => {
  const cityVision = queryShenMediaKB({ query: "你希望台北人怎麼生活？", limit: 1 });
  assert.equal(cityVision.shouldVerifyLatest, false);

  const renewal = queryShenMediaKB({ query: "無限都更現在是什麼方案？", limit: 1 });
  assert.equal(renewal.data[0]?.id, "2026-09-10-wwc-city-vision-five-values");
  assert.equal(renewal.data[0]?.shouldVerifyLatest, true);
  assert.equal(renewal.shouldVerifyLatest, true);
});

test("syncs the active simpleExample System Prompt to V20 without dynamic claims", () => {
  const source = readFileSync(
    new URL("../src/app/agentConfigs/simpleExample.ts", import.meta.url),
    "utf8"
  );
  const activePrompt = source.match(
    /const greeter:[\s\S]*?instructions:\s*`([\s\S]*?)`,\n\s*tools:/
  )?.[1];

  assert.ok(activePrompt);
  assert.match(activePrompt, /System Prompt V20/);
  assert.match(activePrompt, /黑熊學院與民防怎麼解釋/);
  assert.match(activePrompt, /安心、悠閒、不孤獨、有未來、而且美/);
  assert.match(activePrompt, /文化山徑/);
  assert.match(activePrompt, /夜間市長不是多一個官/);
  assert.doesNotMatch(activePrompt, /無限都更|27／28 萬|下降 60%|民調認知度/);
});

test("includes the citizen platform, social-welfare package and Japan visit", () => {
  const platform = queryShenMediaKB({ query: "市長你給我聽好了 LINE平台" });
  assert.equal(platform.data[0]?.id, "2026-09-09-taipei-speaks-up-platform");
  assert.match(platform.data[0]?.keyFacts.join(" "), /近 4000 則/);

  const welfare = queryShenMediaKB({ query: "社福政策 臨時托老券 腸病毒疫苗" });
  assert.equal(
    welfare.data[0]?.id,
    "2026-09-11-full-life-cycle-social-welfare"
  );
  assert.match(welfare.data[0]?.keyFacts.join(" "), /女性安全審計/);

  const japan = queryShenMediaKB({ query: "訪日 日本後援會 旅日青年" });
  assert.equal(japan.data[0]?.id, "2026-09-11-14-japan-city-diplomacy");
  assert.match(japan.data[0]?.keyFacts.join(" "), /AI 城市治理/);
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
  assert.equal(
    selectShenMediaKBTool("你上王偉忠的節目談了什麼？"),
    "lookup_shen_media_kb"
  );
  assert.equal(
    selectShenMediaKBTool("市長你給我聽好了是什麼？"),
    "lookup_shen_media_kb"
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

test("routes omitted-topic Chiang follow-up to one-record Local KB fast path", () => {
  const route = routeShenMediaTranscript(
    "這些蔣萬安沒有做嗎？",
    ["那你會怎麼解決內湖交通呢？"],
    "內湖交通"
  );

  assert.ok(route);
  assert.equal(route.intent, "incumbent_policy_comparison");
  assert.equal(route.topic, "內湖交通");
  assert.equal(route.fastPath, true);
  assert.deepEqual(route.args, {
    query: "內湖交通 蔣萬安 市府措施 執行比較",
    person: "蔣萬安",
    latest: true,
    limit: 1,
    requiresLatest: false,
  });

  const executed = executeShenMediaKBTool(route.toolName, route.args);
  assert.equal(executed.handled, true);
  assert.equal(executed.result.found, true);
  assert.equal(executed.result.count, 1);
  assert.equal(executed.result.data[0]?.id, "2026-06-17-neihu-traffic");
  assert.match(executed.result.data[0]?.keyFacts.join(" "), /瑞光路 358 巷/);
  assert.match(executed.result.data[0]?.keyFacts.join(" "), /6\.07%/);
  assert.ok(
    executed.result.data[0]?.sources.some(
      ({ sourceType }: { sourceType: string }) =>
        sourceType === "official_government"
    )
  );
  assert.equal(executed.result.shouldSearchWeb, false);
  assert.equal(executed.result.shouldVerifyLatest, false);
});

test("latest Chiang comparison keeps the normal Tool and Web-freshness path", () => {
  const route = routeShenMediaTranscript(
    "蔣萬安目前最新做到哪裡，不是也有做嗎？",
    ["我們剛剛在談內湖交通"],
    "內湖交通"
  );

  assert.ok(route);
  assert.equal(route.intent, "incumbent_policy_comparison");
  assert.equal(route.fastPath, false);
  assert.equal(route.args.requiresLatest, true);
});
