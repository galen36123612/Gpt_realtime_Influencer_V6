import assert from "node:assert/strict";
import test from "node:test";

import { resolveRealtimeAssistantItemId } from "../src/app/lib/realtimeTranscriptIds.ts";

test("does not create a provisional transcript item from response_id", () => {
  const aliases: Record<string, string> = {};

  assert.equal(
    resolveRealtimeAssistantItemId(
      { response_id: "resp_welcome", output_index: 0 },
      aliases
    ),
    undefined
  );
  assert.deepEqual(aliases, {});
});

test("pins all events for one response output to one concrete item ID", () => {
  const aliases: Record<string, string> = {};

  assert.equal(
    resolveRealtimeAssistantItemId(
      {
        response_id: "resp_welcome",
        output_index: 0,
        item: { id: "msg_welcome" },
      },
      aliases
    ),
    "msg_welcome"
  );
  assert.equal(
    resolveRealtimeAssistantItemId(
      {
        response_id: "resp_welcome",
        output_index: 0,
        item_id: "msg_duplicate_alias",
      },
      aliases
    ),
    "msg_welcome"
  );
  assert.equal(
    resolveRealtimeAssistantItemId(
      { response_id: "resp_welcome", output_index: 0 },
      aliases
    ),
    "msg_welcome"
  );
});

test("keeps separate output items distinct", () => {
  const aliases: Record<string, string> = {};

  assert.equal(
    resolveRealtimeAssistantItemId(
      { response_id: "resp_1", output_index: 0, item_id: "msg_1" },
      aliases
    ),
    "msg_1"
  );
  assert.equal(
    resolveRealtimeAssistantItemId(
      { response_id: "resp_1", output_index: 1, item_id: "msg_2" },
      aliases
    ),
    "msg_2"
  );
});
