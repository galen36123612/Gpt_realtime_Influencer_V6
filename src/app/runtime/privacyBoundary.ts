export type ReproductivePrivacyIntent =
  | "spouse_pregnancy"
  | "fertility"
  | "reproductive_plan"
  | "adoption_reason"
  | "none";

export function classifyReproductivePrivacyIntent(
  transcript: string
): ReproductivePrivacyIntent {
  const text = String(transcript || "")
    .normalize("NFKC")
    .replace(/[\s，。！？、,.!?：:；;（）()「」『』]/g, "");

  if (/為什麼.*(?:收養|領養)|(?:收養|領養).*原因/.test(text)) {
    return "adoption_reason";
  }
  if (/老婆|太太|妻子|配偶/.test(text) && /懷孕|不生|生孩子|想不想生/.test(text)) {
    return "spouse_pregnancy";
  }
  if (/不孕|不能生|生殖|受孕|人工生殖/.test(text)) {
    return "fertility";
  }
  if (/(?:你|自己).{0,4}不生(?:小孩|孩子)?|你自己不生/.test(text)) {
    return "reproductive_plan";
  }
  if (/以後|未來|計畫/.test(text) && /生小孩|生孩子|自己生|再生/.test(text)) {
    return "reproductive_plan";
  }
  return "none";
}

export function createPrivacyBoundaryResponse(input: {
  turnId: string;
  connectsToPolicy: boolean;
}) {
  return {
    output_modalities: ["audio"],
    tool_choice: "none",
    max_output_tokens: 180,
    metadata: {
      response_purpose: "reproductive_privacy_boundary",
      turn_id: input.turnId,
    },
    instructions: input.connectsToPolicy
      ? "第一句逐字回答：『這是我跟太太的私人家庭範圍，我不替她公開說明。』接著只補一句：『我的家庭規劃是私人選擇；育兒政策要不要成立，可以直接檢驗托育夠不夠、家庭成本有沒有下降、家長有沒有拿回時間。』不得推測配偶原因、懷孕、生育能力或共同決策過程。"
      : "只回答：『這是我跟太太的私人家庭範圍，我不替她公開說明。』不得推測配偶原因、懷孕、生育能力、選擇收養的私人原因或未來生育計畫。",
  };
}
