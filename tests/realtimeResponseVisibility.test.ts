import assert from "node:assert/strict";
import test from "node:test";

import {
  createRealtimeResponseVisibilityState,
  shouldSuppressRealtimeAssistantOutput,
  summarizeRealtimeResponse,
} from "../src/app/lib/realtimeResponseVisibility.ts";

test("silent Local Tool responses never expose assistant narration", () => {
  const state = createRealtimeResponseVisibilityState();

  assert.equal(
    shouldSuppressRealtimeAssistantOutput(
      {
        type: "response.created",
        response: {
          id: "resp-silent",
          metadata: {
            response_purpose: "silent_local_tool",
            local_route_id: "route-1",
          },
        },
      },
      state
    ),
    true
  );

  assert.equal(
    shouldSuppressRealtimeAssistantOutput(
      {
        type: "response.output_item.added",
        response_id: "resp-silent",
        item: { id: "msg-bridge", type: "message", role: "assistant" },
      },
      state
    ),
    true
  );

  assert.equal(
    shouldSuppressRealtimeAssistantOutput(
      {
        type: "response.text.delta",
        response_id: "resp-silent",
        item_id: "msg-bridge",
        delta: "我幫你查一下",
      },
      state
    ),
    true
  );

  assert.equal(
    shouldSuppressRealtimeAssistantOutput(
      {
        type: "conversation.item.created",
        item: {
          id: "msg-bridge",
          type: "message",
          role: "assistant",
          content: [{ type: "text", text: "Let me pull that up." }],
        },
      },
      state
    ),
    true
  );
});

test("normal final responses remain visible", () => {
  const state = createRealtimeResponseVisibilityState();

  assert.equal(
    shouldSuppressRealtimeAssistantOutput(
      {
        type: "response.created",
        response: {
          id: "resp-final",
          metadata: { response_purpose: "local_tool_final_answer" },
        },
      },
      state
    ),
    false
  );

  assert.equal(
    shouldSuppressRealtimeAssistantOutput(
      {
        type: "response.output_audio_transcript.delta",
        response_id: "resp-final",
        item_id: "msg-final",
        delta: "北安里里長是陳玉娟。",
      },
      state
    ),
    false
  );
});

test("response diagnostics report mixed message and function output", () => {
  assert.deepEqual(
    summarizeRealtimeResponse({
      type: "response.done",
      response: {
        id: "resp-1",
        status: "completed",
        metadata: {
          response_purpose: "silent_local_tool",
          local_route_id: "route-1",
        },
        output: [
          { type: "message", role: "assistant" },
          { type: "function_call", name: "lookup_taipei_councilors" },
        ],
      },
    }),
    {
      responseId: "resp-1",
      responsePurpose: "silent_local_tool",
      localRouteId: "route-1",
      status: "completed",
      outputTypes: ["message", "function_call"],
      functionCalls: ["lookup_taipei_councilors"],
      assistantMessageCount: 1,
    }
  );
});
