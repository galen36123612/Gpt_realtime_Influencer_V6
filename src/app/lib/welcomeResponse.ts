export const WELCOME_MESSAGE = "你的市長沈伯洋向您問好！";

const COMPACT_WELCOME_MESSAGE = compactText(WELCOME_MESSAGE);

function compactText(value: string) {
  return value.replace(/[\s，。！？、,.!?：:；;（）()「」『』]/g, "");
}

/** Builds an isolated response so the model says the greeting without a preface. */
export function createWelcomeResponseEvent() {
  return {
    type: "response.create",
    response: {
      input: [],
      output_modalities: ["audio"],
      tool_choice: "none",
      metadata: { response_purpose: "welcome" },
      instructions: `Say exactly the following Traditional Chinese sentence, with no preface, acknowledgement, explanation, or additional words:\n${WELCOME_MESSAGE}`,
    },
  } as const;
}

/**
 * Keeps accidental model planning such as 「讓我先用一句開場白」 out of
 * the transcript. If the greeting and a short preface arrive together, only
 * the canonical greeting is shown.
 */
export function sanitizeWelcomeTranscript(text: string): string | null {
  const trimmed = String(text || "").trim();
  const compact = compactText(trimmed);

  if (
    compact.includes(COMPACT_WELCOME_MESSAGE) &&
    compact.length <= COMPACT_WELCOME_MESSAGE.length + 40
  ) {
    return WELCOME_MESSAGE;
  }

  if (
    compact.length <= 50 &&
    /開場白|打個招呼/.test(compact) &&
    /好的|讓我|我先|先用|先說|說一句/.test(compact)
  ) {
    return null;
  }

  return trimmed;
}
