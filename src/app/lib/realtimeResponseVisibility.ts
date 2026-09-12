export const SILENT_LOCAL_TOOL_RESPONSE_PURPOSE = "silent_local_tool";

export interface RealtimeResponseVisibilityState {
  silentResponseIds: Set<string>;
  silentAssistantItemIds: Set<string>;
}

export function createRealtimeResponseVisibilityState(): RealtimeResponseVisibilityState {
  return {
    silentResponseIds: new Set<string>(),
    silentAssistantItemIds: new Set<string>(),
  };
}

function responseIdFromEvent(event: any) {
  return String(event?.response_id || event?.response?.id || "").trim();
}

function responsePurposeFromEvent(event: any) {
  return String(
    event?.response?.metadata?.response_purpose ||
      event?.metadata?.response_purpose ||
      ""
  ).trim();
}

function itemIdFromEvent(event: any) {
  return String(
    event?.item_id || event?.output_item_id || event?.item?.id || ""
  ).trim();
}

function isAssistantMessage(item: any) {
  return item?.role === "assistant" || item?.type === "message";
}

function rememberBounded(set: Set<string>, value: string, maxSize = 256) {
  if (!value) return;
  set.add(value);

  while (set.size > maxSize) {
    const oldest = set.values().next().value;
    if (!oldest) break;
    set.delete(oldest);
  }
}

/**
 * Realtime may emit assistant text alongside a forced function call. Keep
 * response metadata as the source of truth and mark every assistant item from
 * a silent Local Tool response so the transcript cannot expose tool narration.
 */
export function observeRealtimeResponseVisibility(
  event: any,
  state: RealtimeResponseVisibilityState
) {
  const responseId = responseIdFromEvent(event);
  const responsePurpose = responsePurposeFromEvent(event);

  if (
    responseId &&
    responsePurpose === SILENT_LOCAL_TOOL_RESPONSE_PURPOSE
  ) {
    rememberBounded(state.silentResponseIds, responseId);
  }

  const isSilentResponse =
    responsePurpose === SILENT_LOCAL_TOOL_RESPONSE_PURPOSE ||
    (responseId ? state.silentResponseIds.has(responseId) : false);

  if (isSilentResponse && isAssistantMessage(event?.item)) {
    rememberBounded(state.silentAssistantItemIds, itemIdFromEvent(event));
  }

  if (isSilentResponse && Array.isArray(event?.response?.output)) {
    for (const outputItem of event.response.output) {
      if (isAssistantMessage(outputItem)) {
        rememberBounded(
          state.silentAssistantItemIds,
          String(outputItem?.id || "").trim()
        );
      }
    }
  }

  return {
    responseId,
    responsePurpose,
    isSilentResponse,
    itemId: itemIdFromEvent(event),
  };
}

export function shouldSuppressRealtimeAssistantOutput(
  event: any,
  state: RealtimeResponseVisibilityState
) {
  const observed = observeRealtimeResponseVisibility(event, state);
  const type = String(event?.type || "");
  const isSilentItem = observed.itemId
    ? state.silentAssistantItemIds.has(observed.itemId)
    : false;

  if (!observed.isSilentResponse && !isSilentItem) return false;

  return (
    type === "conversation.item.created" ||
    type === "conversation.item.added" ||
    type === "conversation.item.delta" ||
    type.startsWith("response.") ||
    type.startsWith("output_text.")
  );
}

export function summarizeRealtimeResponse(event: any) {
  const response = event?.response || {};
  const output = Array.isArray(response?.output) ? response.output : [];

  return {
    responseId: String(response?.id || event?.response_id || "") || null,
    responsePurpose:
      String(response?.metadata?.response_purpose || "") || null,
    localRouteId: String(response?.metadata?.local_route_id || "") || null,
    status: String(response?.status || "") || null,
    outputTypes: output.map((item: any) => String(item?.type || "unknown")),
    functionCalls: output
      .filter((item: any) => item?.type === "function_call")
      .map((item: any) => String(item?.name || "unknown")),
    assistantMessageCount: output.filter(
      (item: any) => item?.type === "message" && item?.role === "assistant"
    ).length,
  };
}
