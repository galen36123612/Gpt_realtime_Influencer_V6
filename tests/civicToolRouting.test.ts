import assert from "node:assert/strict";
import test from "node:test";

import {
  isAppManagedRealtimeToolName,
  normalizeTaipeiCivicToolArguments,
  selectTaipeiCivicTool,
} from "../src/app/lib/civicToolRouting.ts";

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

test("routes a known councilor biography request to the enriched KB", () => {
  assert.equal(
    selectTaipeiCivicTool("苗博雅生日是哪一天？"),
    "lookup_taipei_councilor_by_name"
  );
});

test("routes councilor age ranking and Shen relationship questions", () => {
  assert.equal(
    selectTaipeiCivicTool("台北最年輕的市議員是誰？"),
    "lookup_taipei_councilors"
  );
  assert.equal(
    selectTaipeiCivicTool("哪些市議員跟沈伯洋有公開合作？"),
    "lookup_taipei_councilors"
  );
  assert.equal(selectTaipeiCivicTool("市議員的職責是什麼？"), null);
});

test("recognizes only App-owned tool names", () => {
  assert.equal(isAppManagedRealtimeToolName("web_search"), true);
  assert.equal(
    isAppManagedRealtimeToolName("lookup_taipei_village_chief"),
    true
  );
  assert.equal(isAppManagedRealtimeToolName("transferAgents"), false);
});

test("normalizes common model argument variants before local lookup", () => {
  assert.deepEqual(
    normalizeTaipeiCivicToolArguments("lookup_taipei_village_chief", {
      district: "臺北市內湖區",
      village: "內湖區西湖里",
    }),
    { district: "內湖區", village: "西湖里" }
  );
  assert.deepEqual(
    normalizeTaipeiCivicToolArguments("lookup_taipei_councilors", {
      district: "台北市內湖",
      party: "民進黨",
    }),
    { district: "內湖區", party: "民主進步黨" }
  );
  assert.deepEqual(
    normalizeTaipeiCivicToolArguments("lookup_taipei_councilor_by_name", {
      name: "臺北市議員 苗博雅",
    }),
    { name: "苗博雅" }
  );
});
