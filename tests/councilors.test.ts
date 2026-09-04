import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateAge,
  COUNCILOR_ENRICHMENT,
  executeCouncilorTool,
  lookupCouncilorByName,
  queryCouncilors,
  TAIPEI_COUNCILORS,
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
        item.policyFocusTags.length > 0 &&
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

test("calculates age at the birthday boundary", () => {
  assert.equal(calculateAge("1992-06-10", new Date(2026, 5, 9)), 33);
  assert.equal(calculateAge("1992-06-10", new Date(2026, 5, 10)), 34);
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
