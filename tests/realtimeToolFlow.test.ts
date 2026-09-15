import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("live App uses the stable forced-tool lifecycle and hides persona control text", () => {
  const source = readFileSync(
    new URL("../src/app/App.tsx", import.meta.url),
    "utf8"
  );
  const liveApp = source.slice(source.lastIndexOf("// 0902 Add councilors data"));

  assert.match(liveApp, /create_response: false/);
  assert.match(liveApp, /createSilentLocalToolResponse\(/);
  assert.match(liveApp, /processAppManagedToolCalls\(functionCalls\)/);
  assert.doesNotMatch(liveApp, /createSyntheticFunctionCallEvent/);
  assert.doesNotMatch(liveApp, /createShenPersonaContextEvent/);
  assert.doesNotMatch(
    liveApp,
    /eventType === "response\.function_call_arguments\.done"[\s\S]{0,240}processAppManagedToolCalls/
  );
  assert.ok(
    liveApp.indexOf("isShenPersonaProfileQuestion(normalizedText)") <
      liveApp.indexOf("routeShenMediaTranscript(")
  );
  assert.match(liveApp, /media comparison fast path/);
  assert.match(liveApp, /REALTIME_RESPONSE_TRACE/);
});

test("transcript runtime suppresses every silent Local Tool output event", () => {
  const source = readFileSync(
    new URL("../src/app/hooks/useHandleServerEvent.ts", import.meta.url),
    "utf8"
  );
  const liveHook = source.slice(source.lastIndexOf("//0513 fixing user, assistant bubble"));

  assert.match(liveHook, /shouldSuppressRealtimeAssistantOutput/);
  assert.match(liveHook, /isHidden: true/);
});
