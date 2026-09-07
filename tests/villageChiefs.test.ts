import assert from "node:assert/strict";
import test from "node:test";

import {
  executeVillageChiefTool,
  lookupVillageChiefByName,
  lookupVillageChiefsByVillage,
  LOOKUP_TAIPEI_VILLAGE_CHIEF_TOOL,
} from "../src/app/data/villageChiefs.ts";

test("finds a village chief directly by name", () => {
  const result = lookupVillageChiefByName("紀建漢");

  assert.equal(result.found, true);
  assert.equal(result.count, 1);
  assert.equal(result.data[0]?.district, "士林區");
  assert.equal(result.data[0]?.village, "後港里");
});

test("returns useful candidates for a likely name typo", () => {
  const result = lookupVillageChiefByName("紀建翰");

  assert.equal(result.found, false);
  assert.equal(result.shouldSearchWeb, true);
  assert.equal(result.suggestions.some((item) => item.name === "紀建漢"), true);
});

test("can search by village without requiring a district", () => {
  const result = lookupVillageChiefsByVillage("西湖里");

  assert.equal(result.found, true);
  assert.ok(result.count >= 1);
  assert.equal(result.data.some((item) => item.village === "西湖里"), true);
});

test("tool accepts any useful hint and executes a name-only lookup", () => {
  assert.equal(
    "required" in LOOKUP_TAIPEI_VILLAGE_CHIEF_TOOL.parameters,
    false
  );

  const executed = executeVillageChiefTool("lookup_taipei_village_chief", {
    name: "紀建漢",
  });

  assert.equal(executed.handled, true);
  if (
    !executed.handled ||
    !executed.result.found ||
    !Array.isArray(executed.result.data)
  ) {
    assert.fail("expected a name lookup with an array result");
  }

  assert.equal(executed.result.data[0]?.name, "紀建漢");
});
