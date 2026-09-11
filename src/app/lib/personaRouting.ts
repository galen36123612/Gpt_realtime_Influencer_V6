export function normalizeShenNameVariants(rawText: string) {
  return String(rawText || "")
    .normalize("NFKC")
    .replace(/[沈審][伯柏][洋楊陽揚]/g, "沈伯洋");
}

/** Keeps self/profile questions in the full session persona instead of Media KB. */
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

  return /^(?:你|妳)(?:有|的|今年|現在|可以|能)?(?:自我介紹|介紹一下|基本資料|基本介紹|是誰|生日|幾歲|多大|哪裡人|在哪裡長大|什麼學歷|有哪些經歷|什麼背景|結婚|婚姻|太太|妻子|老婆|配偶|女兒|小孩|孩子|家人|家庭)/.test(
    text
  );
}
