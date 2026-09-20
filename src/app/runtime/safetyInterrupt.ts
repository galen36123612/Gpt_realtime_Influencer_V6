export type RealtimeSafetyIntent =
  | "self_harm"
  | "harm_to_others"
  | "explosive_harm"
  | "immediate_danger"
  | "none";

export function classifyRealtimeSafetyIntent(
  transcript: string
): RealtimeSafetyIntent {
  const text = String(transcript || "")
    .normalize("NFKC")
    .replace(/[\s，。！？、,.!?：:；;（）()「」『』]/g, "");

  if (!text) return "none";

  if (
    /(?:我|自己).{0,8}(?:想死|不想活|自殺|輕生|跳樓|割腕|傷害自己)|(?:可以|能不能|要不要).{0,4}(?:跳樓|自殺|去死)|活不下去/.test(
      text
    )
  ) {
    return "self_harm";
  }

  if (
    /(?:現在|立刻|馬上).{0,8}(?:有人要傷害我|有人追殺|有生命危險|會爆炸|失火|火災)|(?:救命|正在流血|被攻擊)/.test(
      text
    )
  ) {
    return "immediate_danger";
  }

  if (
    /(?:怎麼|如何|教我|步驟|方法|材料).{0,8}(?:做|製作|組裝|引爆).{0,4}(?:炸彈|爆裂物)|(?:炸彈|爆裂物).{0,8}(?:怎麼做|製作方法|引爆)/.test(
      text
    )
  ) {
    return "explosive_harm";
  }

  if (
    /(?:我要|想要|怎麼|如何|教我).{0,8}(?:殺人|傷人|攻擊他|傷害他人|下毒)/.test(
      text
    )
  ) {
    return "harm_to_others";
  }

  return "none";
}

export function createSafetyInterruptResponse(input: {
  turnId: string;
  intent: Exclude<RealtimeSafetyIntent, "none">;
}) {
  const instructions =
    input.intent === "self_harm"
      ? "只處理使用者最新一句的自傷安全需求，不得延續上一題，也不得提及任何先前的炸彈或傷害內容。第一句直接、溫和地請對方現在先不要靠近高處或危險物，確認他是否正處於立即危險；鼓勵立刻聯絡當地緊急服務、身邊可信任的人並不要獨處。不要說教，不要給自傷方法。"
      : input.intent === "immediate_danger"
        ? "只處理使用者最新一句的立即危險。第一句請對方先離開危險位置並聯絡當地緊急服務或身邊能立即協助的人；用簡短、清楚的安全步驟回答，不延續上一題。"
        : "拒絕提供造成傷害、炸彈或攻擊他人的操作方法；簡短說明可以協助安全、合法的防災或危機處理資訊。只回答最新一句，不延續舊主題的操作細節。";

  return {
    output_modalities: ["audio"],
    tool_choice: "none",
    max_output_tokens: 280,
    metadata: {
      response_purpose: "latest_turn_safety_interrupt",
      turn_id: input.turnId,
      safety_intent: input.intent,
    },
    instructions,
  };
}

