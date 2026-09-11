export function createSyntheticFunctionCallEvent(input: {
  callId: string;
  toolName: string;
  args: Record<string, unknown>;
}) {
  return {
    type: "conversation.item.create",
    item: {
      type: "function_call",
      call_id: input.callId,
      name: input.toolName,
      arguments: JSON.stringify(input.args),
      status: "completed",
    },
  };
}

export function createSyntheticFunctionOutputEvent(input: {
  callId: string;
  output: string;
}) {
  return {
    type: "conversation.item.create",
    item: {
      type: "function_call_output",
      call_id: input.callId,
      output: input.output,
    },
  };
}

export function createDirectAnswerResponse(input: {
  purpose?: "direct_answer" | "bridge_retry" | "inaudible";
  instructions?: string;
  allowTools?: boolean;
}) {
  const purpose = input.purpose || "direct_answer";
  const response: {
    output_modalities: string[];
    tool_choice: string;
    metadata: { response_purpose: typeof purpose };
    instructions?: string;
  } = {
    output_modalities: ["audio"],
    tool_choice:
      purpose === "direct_answer" && input.allowTools !== false
        ? "auto"
        : "none",
    metadata: { response_purpose: purpose },
  };

  if (input.instructions?.trim()) {
    return { ...response, instructions: input.instructions };
  }

  if (purpose === "inaudible") {
    return {
      ...response,
      instructions:
        "只說：『我剛剛沒有聽清楚，可以再說一次嗎？』不要自我介紹，不要增加其他內容。",
    };
  }

  // Ordinary and bridge-retry responses intentionally inherit the full session
  // instructions. Supplying response-level instructions here can mask the AI
  // mayor identity and make the model fall back to a generic voice assistant.
  return response;
}

export function normalizeShenNameVariants(rawText: string) {
  return String(rawText || "")
    .normalize("NFKC")
    .replace(/[沈審][伯柏][洋楊陽揚]/g, "沈伯洋");
}

/**
 * Profile/identity questions are answered from the active AI-mayor persona and
 * its Fact Bank, not from the recent-media router.
 */
export function isShenPersonaProfileQuestion(rawText: string) {
  const text = normalizeShenNameVariants(rawText)
    .replace(/\s+/g, "")
    .replace(/[，。！？、,.!?：:；;「」『』（）()]/g, "");

  if (!text) return false;

  if (
    /(?:你|妳)?應該是(?:AI)?市長沈伯洋|(?:你|妳)是(?:AI)?市長沈伯洋/.test(
      text
    )
  ) {
    return true;
  }

  const profileSignal =
    /自我介紹|介紹一下|基本資料|基本介紹|你是誰|是誰|生日|出生|幾歲|年齡|哪裡人|哪裡長大|學歷|經歷|背景|結婚|婚姻|太太|妻子|老婆|配偶|女兒|小孩|孩子|家人|家庭/;

  if (text.includes("沈伯洋") && profileSignal.test(text)) return true;

  return /^(?:你|妳)(?:有|的|今年|現在|可以|能)?(?:自我介紹|介紹一下|是誰|生日|幾歲|多大|哪裡人|在哪裡長大|什麼學歷|有哪些經歷|什麼背景|結婚|婚姻|太太|妻子|老婆|配偶|女兒|小孩|孩子|家人|家庭)/.test(
    text
  );
}

export function createShenPersonaContextEvent(rawTranscript: string) {
  const normalizedTranscript = normalizeShenNameVariants(rawTranscript).slice(
    0,
    240
  );

  return {
    type: "conversation.item.create",
    item: {
      type: "message",
      role: "system",
      content: [
        {
          type: "input_text",
          text: `本回合是在詢問 AI 市長沈伯洋本人的身分或公開人物資料。語音轉錄中的「沈柏楊／審柏楊／沈柏洋」都指沈伯洋。請依目前 session 的完整人格與 MY PROFILE Fact Bank，以自然、有現場感的第一人稱直接回答，不要退回泛稱自己是語音助手，也不要把人物基本資料誤當成近期新聞查詢。使用者本回合：${normalizedTranscript}`,
        },
      ],
    },
  };
}

/** Detects a response that only promises an answer but never supplies it. */
export function isBridgeOnlyAssistantResponse(rawText: string) {
  const text = String(rawText || "")
    .normalize("NFKC")
    .replace(/\s+/g, "")
    .replace(/[，。！？、,.!?：:；;「」『』]/g, "");

  if (!text || text.length > 72) return false;

  const bridgeSignal =
    /我.{0,28}(?:查|看|整理|確認|說明|回答|說清楚|分析)|讓我|接下來我/;
  const substantiveSignal =
    /(?:第一|第二|包括|例如|目前有|現任|重點是|答案是|里長是|議員有|因為|所以|但是|不過).{4,}/;

  return bridgeSignal.test(text) && !substantiveSignal.test(text);
}

export function createDirectWebSearchArguments(
  transcript: string,
  recentTurns: string[] = []
) {
  const context = [...recentTurns.slice(-3), transcript]
    .map((turn) => String(turn || "").trim())
    .filter(Boolean)
    .join("；")
    .slice(0, 600);

  return {
    query: `${context} 最新公開資料`.trim(),
    recency_days: 90,
  };
}
