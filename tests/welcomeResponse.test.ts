import assert from "node:assert/strict";
import test from "node:test";

import {
  WELCOME_MESSAGE,
  createWelcomeResponseEvent,
  sanitizeWelcomeTranscript,
} from "../src/app/lib/welcomeResponse.ts";

test("creates an isolated exact welcome response", () => {
  const event = createWelcomeResponseEvent();

  assert.equal(event.type, "response.create");
  assert.deepEqual(event.response.input, []);
  assert.deepEqual(event.response.output_modalities, ["audio"]);
  assert.equal(event.response.tool_choice, "none");
  assert.ok(event.response.instructions.endsWith(WELCOME_MESSAGE));
  assert.equal(event.response.instructions.match(/你的市長沈伯洋向您問好！/g)?.length, 1);
});

test("hides the accidental welcome preamble from the screenshot", () => {
  assert.equal(
    sanitizeWelcomeTranscript("好的，讓我先用一句簡單的開場白跟您打個招呼。"),
    null
  );
});

test("keeps only the canonical greeting when a short preface is included", () => {
  assert.equal(
    sanitizeWelcomeTranscript(`好的，${WELCOME_MESSAGE}請問今天想聊什麼？`),
    WELCOME_MESSAGE
  );
});

test("does not change ordinary assistant replies", () => {
  assert.equal(
    sanitizeWelcomeTranscript("內湖交通要同時處理錯峰、接駁與最後一哩。"),
    "內湖交通要同時處理錯峰、接駁與最後一哩。"
  );
});
