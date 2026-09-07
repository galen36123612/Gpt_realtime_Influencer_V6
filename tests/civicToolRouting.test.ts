import assert from "node:assert/strict";
import test from "node:test";

import {
  inferTaipeiCivicToolArguments,
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

test("uses the village KB without requiring both district and village", () => {
  assert.equal(
    selectTaipeiCivicTool("西湖里的里長是誰？"),
    "lookup_taipei_village_chief"
  );
  assert.equal(
    selectTaipeiCivicTool("紀建漢"),
    "lookup_taipei_village_chief"
  );
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

test("routes fragmented civic questions using recent user turns", () => {
  assert.equal(
    selectTaipeiCivicTool("台北市議員", ["我想問王微紅生日"]),
    "lookup_taipei_councilor_by_name"
  );
  assert.equal(
    selectTaipeiCivicTool("王微", ["台北市議員"]),
    "lookup_taipei_councilor_by_name"
  );
  assert.equal(
    selectTaipeiCivicTool("里長", ["紀建漢"]),
    "lookup_taipei_village_chief"
  );
  assert.equal(
    selectTaipeiCivicTool("你就幫我查", ["里長 紀建漢"]),
    "lookup_taipei_village_chief"
  );
});

test("uses web search for an unknown person birthday instead of stalling", () => {
  assert.equal(selectTaipeiCivicTool("我想問王微紅生日"), "web_search");
});

test("infers names and list filters from fragmented turns", () => {
  assert.deepEqual(
    inferTaipeiCivicToolArguments(
      "lookup_taipei_village_chief",
      {},
      ["紀建漢", "里長"]
    ),
    { district: "", village: "", name: "紀建漢" }
  );
  assert.deepEqual(
    inferTaipeiCivicToolArguments(
      "lookup_taipei_councilor_by_name",
      {},
      ["我想問王微紅生日", "台北市議員"]
    ),
    { name: "王微紅" }
  );
  assert.deepEqual(
    inferTaipeiCivicToolArguments(
      "lookup_taipei_councilor_by_name",
      {},
      ["先問苗博雅", "改問黃瀞瑩"]
    ),
    { name: "黃瀞瑩" }
  );
  assert.deepEqual(
    inferTaipeiCivicToolArguments(
      "lookup_taipei_councilors",
      {},
      ["民進黨最年輕的台北市議員"]
    ),
    {
      district: "",
      party: "民主進步黨",
      sortBy: "youngest_first",
      limit: 1,
    }
  );
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
    { district: "內湖區", village: "西湖里", name: "" }
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
