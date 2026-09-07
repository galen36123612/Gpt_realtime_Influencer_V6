import assert from "node:assert/strict";
import test from "node:test";

import {
  executeVillageChiefTool,
  lookupVillageChiefByName,
  lookupVillageChiefByVillage,
  LOOKUP_TAIPEI_VILLAGE_CHIEF_TOOL,
  normalizeVillageChiefToolArgs,
} from "../src/app/data/villageChiefs.ts";

test("finds a village chief directly by name", () => {
  const result = lookupVillageChiefByName("紀建漢");

  assert.equal(result.found, true);
  if (!result.found) {
    assert.fail("expected a unique chief-name result");
  }
  assert.equal(result.data.district, "士林區");
  assert.equal(result.data.village, "後港里");
});

test("marks an unknown chief name for latest-data verification", () => {
  const executed = executeVillageChiefTool("lookup_taipei_village_chief", {
    name: "紀建翰",
  });

  assert.equal(executed.handled, true);
  if (!executed.handled || executed.result.found) {
    assert.fail("expected an unknown-name result");
  }
  assert.equal(executed.result.reason, "name_not_found");
  assert.equal(executed.result.shouldVerifyLatest, true);
});

test("can search by village without requiring a district", () => {
  const result = lookupVillageChiefByVillage("西湖里");

  assert.equal(result.found, true);
  if (!result.found) {
    assert.fail("expected a unique village result");
  }
  assert.equal(result.data.village, "西湖里");
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
  if (!executed.handled || !executed.result.found) {
    assert.fail("expected a name lookup result");
  }

  assert.equal(executed.result.data.name, "紀建漢");
});

test("rescues a village token that the model placed in name", () => {
  const executed = executeVillageChiefTool("lookup_taipei_village_chief", {
    name: "北安里",
  });

  assert.equal(executed.handled, true);
  if (!executed.handled || !executed.result.found) {
    assert.fail("expected 北安里 to resolve from the local KB");
  }

  assert.equal(executed.result.data.district, "中山區");
  assert.equal(executed.result.data.village, "北安里");
  assert.equal(executed.result.data.name, "陳小康");
  assert.equal(executed.result.data.officePhone, "02-2533-7936");
});

test("location fields win over a guessed name for 內湖里長", () => {
  assert.deepEqual(
    normalizeVillageChiefToolArgs({
      district: "內湖區",
      village: "內湖里",
      name: "內湖",
    }),
    {
      district: "內湖區",
      village: "內湖里",
      name: "",
      raw: {
        district: "內湖區",
        village: "內湖里",
        name: "內湖",
      },
      routing: {
        ignoredGuessedName: "內湖",
        rescuedVillageFromName: false,
      },
    }
  );

  const executed = executeVillageChiefTool("lookup_taipei_village_chief", {
    district: "內湖區",
    village: "內湖里",
    name: "內湖",
  });

  assert.equal(executed.handled, true);
  if (!executed.handled || !executed.result.found) {
    assert.fail("expected 內湖里 to resolve from the local KB");
  }

  assert.equal(executed.result.data.name, "許昌華");
  assert.equal(executed.result.data.officePhone, "02-2792-8228");
});

test("retries a unique village locally when the district is wrong", () => {
  const executed = executeVillageChiefTool("lookup_taipei_village_chief", {
    district: "中山區",
    village: "內湖里",
  });

  assert.equal(executed.handled, true);
  if (!executed.handled || !executed.result.found) {
    assert.fail("expected the village-only local fallback to succeed");
  }

  assert.equal(executed.result.resolutionMode, "village_only_after_location_miss");
  assert.equal(executed.result.data.district, "內湖區");
  assert.equal(executed.result.data.name, "許昌華");
});
