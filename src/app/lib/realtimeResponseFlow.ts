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
  const defaultInstructions =
    purpose === "inaudible"
      ? "只說：『我剛剛沒有聽清楚，可以再說一次嗎？』不要自我介紹，不要增加其他內容。"
      : "直接完整回答使用者最新問題。第一句就是實質答案；不要只說稍後回答，不要說我來說明、我整理一下、我先查一下或讓我想一下。不得插入對話與可靠資料中沒有的英文名字、人名、數字或事件。若是以 AI 市長角色回答未來施政，清楚區分政策立場與正式承諾，但不要退回泛稱自己只是語音助手。";

  return {
    output_modalities: ["audio"],
    tool_choice:
      purpose === "direct_answer" && input.allowTools !== false
        ? "auto"
        : "none",
    metadata: { response_purpose: purpose },
    instructions: input.instructions || defaultInstructions,
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
