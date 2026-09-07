export const SHEN_MEDIA_TOOL_NAME = "lookup_shen_media_kb" as const;

const MAX_CONTEXT_TURNS = 6;

function compactText(value: string) {
  return value
    .normalize("NFKC")
    .replace(/臺/g, "台")
    .replace(/[\s，。！？、,.!?：:；;（）()「」『』]/g, "");
}

const SHEN_MEDIA_TOPIC_PATTERN =
  /HEART|蔡英文|陪同登記|參選登記|選票號次|抽號次|船舵|舵輪|洋流|交換學生|獎學金|利益迴避|利益衝突|兒虐|兒童保護|交互詰問|市長辯論|2500億|今周刊|POP最正點|POPRadio|林書煒|市民參與企劃|歷任市長|五分埔|廣慈|奉天宮|台北隊|聯合競選|聯合配票|健身小巴|超級運動中心|國際足球場|內湖交通|內湖淹水|老屋延壽|行動服務團|北士科|台北研究院|無菸城市|訪日|城市外交|統戰|太弱|勤走基層/i;

const MEDIA_OR_CAMPAIGN_INTENT_PATTERN =
  /新聞|媒體|報導|受訪|專訪|公開說法|公開表示|表態|回應|爭議|事件|最近|最新|今天|昨天|目前|現在|選戰|競選|參選|登記|政見|政策|市政主張|行程|活動/;

const CIVIC_DIRECTORY_PATTERN =
  /(?:里長|里辦公處|里辦公室)|(?:市議員|議員).*(?:哪些|有誰|名單|幾位|電話|Email|信箱|聯絡|黨籍|選區|服務處|辦公室|生日|年齡|幾歲|學歷|經歷|背景)/i;

/**
 * Deterministically routes known Shen campaign/news questions to the local KB.
 * This sits before the model's automatic tool selection so known historical
 * events do not accidentally go straight to web search.
 */
export function selectShenMediaKBTool(
  userText: string,
  recentUserTurns: string[] = []
): typeof SHEN_MEDIA_TOOL_NAME | null {
  const text = compactText(userText);
  if (!text || CIVIC_DIRECTORY_PATTERN.test(text)) return null;

  if (SHEN_MEDIA_TOPIC_PATTERN.test(text)) {
    return SHEN_MEDIA_TOOL_NAME;
  }

  const recentContext = recentUserTurns
    .slice(-MAX_CONTEXT_TURNS)
    .map(compactText)
    .join(" ");
  const hasShenContext = /沈伯洋|Puma/i.test(text) || /沈伯洋|Puma/i.test(recentContext);

  if (hasShenContext && MEDIA_OR_CAMPAIGN_INTENT_PATTERN.test(text)) {
    return SHEN_MEDIA_TOOL_NAME;
  }

  const isMediaFollowUp =
    /^(?:那|這|所以|他|你)?(?:今天|昨天|最近|最新|目前|現在)?(?:受訪|專訪|新聞|報導|說法|回應|行程|活動)/.test(
      text
    );

  if (
    isMediaFollowUp &&
    (SHEN_MEDIA_TOPIC_PATTERN.test(recentContext) || hasShenContext)
  ) {
    return SHEN_MEDIA_TOOL_NAME;
  }

  return null;
}

function taipeiDateParts(now: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function offsetIsoDate(isoDate: string, days: number) {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/** Adds relative dates and missing query context to model-generated arguments. */
export function inferShenMediaKBToolArguments(
  rawArguments: unknown,
  recentUserTurns: string[] = [],
  now = new Date()
): Record<string, unknown> {
  const args =
    rawArguments && typeof rawArguments === "object"
      ? { ...(rawArguments as Record<string, unknown>) }
      : {};
  const turns = recentUserTurns.slice(-MAX_CONTEXT_TURNS).filter(Boolean);
  const context = turns.join(" ");
  const compactContext = compactText(context);
  const today = taipeiDateParts(now);

  if (!args.query && context) {
    args.query = context;
  }

  if (!args.dateFrom && !args.dateTo) {
    if (/昨天|昨日/.test(compactContext)) {
      const yesterday = offsetIsoDate(today, -1);
      args.dateFrom = yesterday;
      args.dateTo = yesterday;
    } else if (/今天|今日/.test(compactContext)) {
      args.dateFrom = today;
      args.dateTo = today;
    }
  }

  if (typeof args.requiresLatest !== "boolean") {
    args.requiresLatest = /今天最新|現在最新|目前最新|最新消息|最新新聞|截至現在/.test(
      compactContext
    );
  }

  return args;
}
