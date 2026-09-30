import assert from "node:assert/strict";
import test from "node:test";

import {
  isShenPersonaProfileQuestion,
  normalizeShenNameVariants,
} from "../src/app/lib/personaRouting.ts";

test("normalizes common Shen name STT variants", () => {
  assert.equal(normalizeShenNameVariants("審柏楊基本資料"), "沈伯洋基本資料");
  assert.equal(normalizeShenNameVariants("沈柏洋你自我介紹"), "沈伯洋你自我介紹");
});

test("keeps AI mayor identity and profile questions out of Media KB", () => {
  for (const transcript of [
    "沈伯洋你自我介紹一下",
    "審柏楊你自我介紹一下",
    "妳應該是AI市長沈柏楊",
    "你的基本資料",
    "你結婚了嗎？",
  ]) {
    assert.equal(isShenPersonaProfileQuestion(transcript), true, transcript);
  }

  assert.equal(isShenPersonaProfileQuestion("沈伯洋昨天受訪說了什麼？"), false);
  assert.equal(isShenPersonaProfileQuestion("台北市中山區有哪些議員？"), false);
});
