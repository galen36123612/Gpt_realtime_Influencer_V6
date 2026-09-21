import type { RealtimeSafetyIntent } from "./safetyInterrupt.ts";

export interface RealtimeTurn {
  id: string;
  sequence: number;
  rawTranscript: string;
  normalizedTranscript: string;
  userItemId?: string;
  safetyIntent: RealtimeSafetyIntent;
  createdAt: number;
  finalResponseClaimed: boolean;
}

export interface RealtimeTurnState {
  sequence: number;
  currentTurn: RealtimeTurn | null;
  responseTurnIds: Map<string, string>;
  assistantItemTurnIds: Map<string, string>;
  completedResponseIds: Set<string>;
}

const MAX_TRACKED_RESPONSES = 256;

function rememberBounded<T>(collection: Set<T>, value: T) {
  collection.add(value);
  while (collection.size > MAX_TRACKED_RESPONSES) {
    const oldest = collection.values().next().value;
    if (oldest === undefined) break;
    collection.delete(oldest);
  }
}

function rememberMapBounded<K, V>(collection: Map<K, V>, key: K, value: V) {
  collection.set(key, value);
  while (collection.size > MAX_TRACKED_RESPONSES) {
    const oldest = collection.keys().next().value;
    if (oldest === undefined) break;
    collection.delete(oldest);
  }
}

export function createRealtimeTurnState(): RealtimeTurnState {
  return {
    sequence: 0,
    currentTurn: null,
    responseTurnIds: new Map(),
    assistantItemTurnIds: new Map(),
    completedResponseIds: new Set(),
  };
}

export function beginRealtimeTurn(
  state: RealtimeTurnState,
  input: {
    rawTranscript: string;
    normalizedTranscript: string;
    userItemId?: string;
    safetyIntent: RealtimeSafetyIntent;
    now?: number;
  }
) {
  state.sequence += 1;
  const itemPart = String(input.userItemId || "").replace(/[^a-zA-Z0-9_-]/g, "");
  const turn: RealtimeTurn = {
    id: `turn_${state.sequence}_${itemPart || input.now || Date.now()}`,
    sequence: state.sequence,
    rawTranscript: input.rawTranscript,
    normalizedTranscript: input.normalizedTranscript,
    ...(input.userItemId ? { userItemId: input.userItemId } : {}),
    safetyIntent: input.safetyIntent,
    createdAt: input.now ?? Date.now(),
    finalResponseClaimed: false,
  };
  state.currentTurn = turn;
  return turn;
}

export function isCurrentRealtimeTurn(
  state: RealtimeTurnState,
  turnId: string | null | undefined
) {
  return Boolean(turnId && state.currentTurn?.id === turnId);
}

export function claimFinalResponseForTurn(
  state: RealtimeTurnState,
  turnId: string | null | undefined
) {
  if (!turnId) return true;
  if (!isCurrentRealtimeTurn(state, turnId)) return false;
  if (state.currentTurn!.finalResponseClaimed) return false;
  state.currentTurn!.finalResponseClaimed = true;
  return true;
}

function responseIdFromEvent(event: any) {
  return String(event?.response_id || event?.response?.id || "").trim();
}

function metadataTurnId(event: any) {
  return String(
    event?.response?.metadata?.turn_id || event?.metadata?.turn_id || ""
  ).trim();
}

export function observeRealtimeResponseTurn(
  state: RealtimeTurnState,
  event: any
) {
  const responseId = responseIdFromEvent(event);
  const turnId = metadataTurnId(event);
  if (responseId && turnId) {
    rememberMapBounded(state.responseTurnIds, responseId, turnId);
  }
  const resolvedTurnId = turnId || state.responseTurnIds.get(responseId) || "";
  const directItemId = String(
    event?.item_id || event?.output_item_id || event?.item?.id || ""
  ).trim();

  if (resolvedTurnId && directItemId) {
    rememberMapBounded(
      state.assistantItemTurnIds,
      directItemId,
      resolvedTurnId
    );
  }

  if (resolvedTurnId && Array.isArray(event?.response?.output)) {
    for (const outputItem of event.response.output) {
      const outputItemId = String(outputItem?.id || "").trim();
      if (outputItemId) {
        rememberMapBounded(
          state.assistantItemTurnIds,
          outputItemId,
          resolvedTurnId
        );
      }
    }
  }
  return {
    responseId,
    turnId: resolvedTurnId,
  };
}

export function realtimeEventTurnId(state: RealtimeTurnState, event: any) {
  const responseId = responseIdFromEvent(event);
  return metadataTurnId(event) || state.responseTurnIds.get(responseId) || "";
}

export function shouldDiscardRealtimeEvent(
  state: RealtimeTurnState,
  event: any
) {
  const type = String(event?.type || "");
  const itemId = String(
    event?.item_id || event?.output_item_id || event?.item?.id || ""
  ).trim();
  const itemTurnId = itemId ? state.assistantItemTurnIds.get(itemId) : "";

  if (itemTurnId && !isCurrentRealtimeTurn(state, itemTurnId)) return true;

  if (
    !type.startsWith("response.") &&
    !type.startsWith("output_text.") &&
    !type.startsWith("conversation.item.")
  ) {
    return false;
  }

  const responseId = responseIdFromEvent(event);
  if (responseId && state.completedResponseIds.has(responseId)) return true;

  const turnId = realtimeEventTurnId(state, event);
  return Boolean(turnId && !isCurrentRealtimeTurn(state, turnId));
}

export function markRealtimeResponseCompleted(
  state: RealtimeTurnState,
  responseId: string | null | undefined
) {
  if (responseId) rememberBounded(state.completedResponseIds, responseId);
}

export function resetRealtimeTurnState(state: RealtimeTurnState) {
  state.sequence = 0;
  state.currentTurn = null;
  state.responseTurnIds.clear();
  state.assistantItemTurnIds.clear();
  state.completedResponseIds.clear();
}
