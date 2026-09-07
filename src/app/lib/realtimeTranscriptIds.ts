export type RealtimeAssistantItemIdMap = Record<string, string>;

function getOutputIndex(event: any) {
  const value = Number(event?.output_index);
  return Number.isInteger(value) && value >= 0 ? value : 0;
}

function getResponseId(event: any) {
  return String(event?.response_id || event?.response?.id || "").trim();
}

function getConcreteItemId(event: any) {
  return String(
    event?.item_id || event?.output_item_id || event?.item?.id || ""
  ).trim();
}

/**
 * Realtime transcript events for one output can arrive through several event
 * families. Keep one stable item ID for each response output and never use a
 * response ID as a transcript item ID; doing so creates a second bubble when
 * the concrete item ID arrives later.
 */
export function resolveRealtimeAssistantItemId(
  event: any,
  itemIdsByResponseOutput: RealtimeAssistantItemIdMap
): string | undefined {
  const responseId = getResponseId(event);
  const concreteItemId = getConcreteItemId(event);

  if (!responseId) {
    return concreteItemId || undefined;
  }

  const responseOutputKey = `${responseId}:${getOutputIndex(event)}`;
  const knownItemId = itemIdsByResponseOutput[responseOutputKey];

  if (knownItemId) {
    return knownItemId;
  }

  if (concreteItemId) {
    itemIdsByResponseOutput[responseOutputKey] = concreteItemId;
    return concreteItemId;
  }

  return undefined;
}
