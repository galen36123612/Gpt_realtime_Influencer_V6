import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateAge,
  COUNCILOR_ENRICHMENT,
  executeCouncilorTool,
  lookupCouncilorByName,
  queryCouncilors,
  resolveCouncilorConstituency,
  TAIPEI_COUNCILORS,
  TAIPEI_COUNCILOR_INDEXES,
  TAIPEI_COUNCILOR_META,
} from "../src/app/data/councilors.ts";
import { normalizeTaipeiCivicToolArguments } from "../src/app/lib/civicToolRouting.ts";

test("contains enrichment for every current Taipei councilor", () => {
  assert.equal(TAIPEI_COUNCILORS.length, 53);
  assert.equal(Object.keys(COUNCILOR_ENRICHMENT).length, 53);
  assert.equal(TAIPEI_COUNCILOR_META.count, 53);
  assert.equal(
    TAIPEI_COUNCILORS.every(
      (item) =>
        item.birthDate &&
        item.backgroundSummary &&
        item.policyTop3.length > 0 &&
        item.policyFocusTags.length > 0 &&
        item.relationToShen.relationshipTypes.length > 0 &&
        item.relationToShen.sharedPolicyTopics.length > 0 &&
        item.relationToShen.realtimeSummary.policies &&
        item.relationToShen.verifiedAt
    ),
    true
  );
});

test("returns an enriched named-councilor profile", () => {
  const result = lookupCouncilorByName("苗博雅");

  assert.equal(result.found, true);
  assert.equal(result.data[0]?.name, "苗博雅");
  assert.equal(result.data[0]?.birthDate, "1987-10-02");
  assert.equal(result.data[0]?.relationToShen.level, "confirmed_public_issue_overlap");
  assert.ok(result.data[0]?.backgroundSummary);
});

test("returns candidates for clarification without unnecessary web fallback", () => {
  const result = lookupCouncilorByName("苗博亞");

  assert.equal(result.found, false);
  assert.equal(result.reason, "ambiguous_name");
  assert.equal(result.needsClarification, true);
  assert.equal(result.shouldSearchWeb, false);
  assert.equal(result.shouldVerifyLatest, false);
  assert.equal(result.suggestions[0]?.name, "苗博雅");
});

test("calculates age at the birthday boundary", () => {
  assert.equal(calculateAge("1992-06-10", new Date(2026, 5, 9)), 33);
  assert.equal(calculateAge("1992-06-10", new Date(2026, 5, 10)), 34);
});

test("prebuilds V4 indexes and fully enriches all 18 current DPP councilors", () => {
  const dpp = TAIPEI_COUNCILORS.filter(
    (item) => item.status === "current" && item.party === "民主進步黨"
  );

  assert.equal(dpp.length, 18);
  assert.equal(
    dpp.every(
      (item) =>
        item.policyTop3.length === 3 &&
        item.policyFocusTags.length > 0 &&
        item.relationToShen.sharedPolicyTopics.length > 0 &&
        Boolean(item.relationToShen.realtimeSummary.relationship) &&
        item.relationToShen.confirmedPublicEvents.every(
          (event) => Boolean(event.eventType && event.summary && event.verifiedAt)
        )
    ),
    true
  );
  assert.equal(TAIPEI_COUNCILOR_INDEXES.byName.size, 53);
  assert.equal(TAIPEI_COUNCILOR_INDEXES.byConstituency.get(1)?.length, 11);
  assert.equal(TAIPEI_COUNCILOR_INDEXES.byParty.get("民主進步黨")?.length, 18);
  assert.ok((TAIPEI_COUNCILOR_INDEXES.byTopic.get("交通")?.length || 0) > 0);
  assert.ok(
    (TAIPEI_COUNCILOR_INDEXES.byRelationshipType.get("joint_local_visit")?.length || 0) > 0
  );
});

test("normalizes every district to its complete constituency roster", () => {
  const expected = [
    ["北投區", 1, 11],
    ["士林區", 1, 11],
    ["內湖區", 2, 8],
    ["南港區", 2, 8],
    ["松山區", 3, 6],
    ["信義區", 3, 6],
    ["中山區", 4, 7],
    ["大同區", 4, 7],
    ["中正區", 5, 7],
    ["萬華區", 5, 7],
    ["大安區", 6, 12],
    ["文山區", 6, 12],
  ] as const;

  for (const [district, constituency, count] of expected) {
    assert.deepEqual(resolveCouncilorConstituency(`臺北市 ${district}`), {
      district,
      constituency,
    });
    const result = queryCouncilors({ district });
    assert.equal(result.found, true, district);
    assert.equal(result.constituency, constituency, district);
    assert.equal(result.count, count, district);
    assert.equal(
      result.data.every((item: any) => item.constituency === constituency),
      true,
      district
    );
  }
});

test("keeps quick list payload compact for low-latency Realtime answers", () => {
  const result = queryCouncilors({
    hasPublicEventWithShen: true,
    detail: "quick",
  });
  const serialized = JSON.stringify(result);

  assert.equal(result.found, true);
  assert.ok(serialized.length < 30000, `quick payload was ${serialized.length} chars`);
  assert.equal(
    result.data.every(
      (item: any) =>
        !("policyTop3" in item) &&
        !("sharedPolicyTopics" in item.relationToShen) &&
        Array.isArray(item.confirmedPublicEventHighlights)
    ),
    true
  );
});

test("keeps 陳怡君 current office separate from 2026 nomination status", () => {
  const chen = TAIPEI_COUNCILORS.find(({ name }) => name === "陳怡君");
  assert.equal(chen?.status, "current");
  assert.equal(chen?.partyNomination2026?.status, "eligibility_revoked");
  assert.equal(chen?.partyNomination2026?.verifiedAt, "2026-02-25");
  assert.equal(TAIPEI_COUNCILORS.some(({ name }) => name === "趙怡翔"), false);
});

test("supports party, age-ranking, and public-relationship queries", () => {
  const normalized = normalizeTaipeiCivicToolArguments(
    "lookup_taipei_councilors",
    { party: "民進黨", sortBy: "youngest_first", limit: 1 }
  );
  const partyResult = executeCouncilorTool(
    "lookup_taipei_councilors",
    normalized
  );
  const relationshipResult = queryCouncilors({
    relationshipLevel: "confirmed_campaign_cooperation",
  });

  assert.equal(partyResult.handled, true);
  assert.equal(partyResult.result.found, true);
  assert.equal(partyResult.result.data.length, 1);
  assert.equal(partyResult.result.data[0]?.party, "民主進步黨");
  assert.equal(relationshipResult.found, true);
  assert.ok(relationshipResult.count > 0);
  assert.equal(
    relationshipResult.data.every(
      (item) =>
        item.relationToShen.level === "confirmed_campaign_cooperation"
    ),
    true
  );
});
