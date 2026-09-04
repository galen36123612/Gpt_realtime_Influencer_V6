import assert from "node:assert/strict";
import test from "node:test";

import {
  isAppManagedRealtimeToolName,
  selectTaipeiCivicTool,
} from "../src/app/lib/civicToolRouting.ts";
import {
  lookupCouncilorByName,
  lookupCouncilorsByDistrict,
} from "../src/app/data/councilors.ts";
import { lookupVillageChief } from "../src/app/data/villageChiefs.ts";

test("routes a complete village-chief request to the local lookup", () => {
  assert.equal(
    selectTaipeiCivicTool("請問臺北市內湖區西湖里的里長電話？"),
    "lookup_taipei_village_chief"
  );
});

test("does not force a village lookup when the district is missing", () => {
  assert.equal(selectTaipeiCivicTool("西湖里的里長是誰？"), null);
});

test("routes district and named-councilor requests separately", () => {
  assert.equal(
    selectTaipeiCivicTool("內湖有哪些市議員？"),
    "lookup_taipei_councilors"
  );
  assert.equal(
    selectTaipeiCivicTool("苗博雅議員的電話是多少？"),
    "lookup_taipei_councilor_by_name"
  );
});

test("does not force a councilor contact lookup for unrelated biography", () => {
  assert.equal(selectTaipeiCivicTool("苗博雅生日是哪一天？"), null);
});

test("recognizes only App-owned tool names", () => {
  assert.equal(isAppManagedRealtimeToolName("web_search"), true);
  assert.equal(
    isAppManagedRealtimeToolName("lookup_taipei_village_chief"),
    true
  );
  assert.equal(isAppManagedRealtimeToolName("transferAgents"), false);
});

test("lookup normalization accepts common model argument variants", () => {
  assert.equal(
    lookupVillageChief("臺北市內湖區", "內湖區西湖里").found,
    true
  );
  assert.equal(lookupCouncilorsByDistrict("台北市內湖").found, true);
  assert.equal(lookupCouncilorByName("苗博雅議員").found, true);
  assert.equal(lookupCouncilorByName("臺北市議員 苗博雅").found, true);
});
