import { TAIPEI_COUNCILORS } from "../data/councilors.ts";
import { TAIPEI_VILLAGE_CHIEFS } from "../data/villageChiefs.ts";

export const APP_MANAGED_REALTIME_TOOL_NAMES = [
  "web_search",
  "lookup_taipei_village_chief",
  "lookup_taipei_councilors",
  "lookup_taipei_councilor_by_name",
] as const;

export type AppManagedRealtimeToolName =
  (typeof APP_MANAGED_REALTIME_TOOL_NAMES)[number];

const APP_MANAGED_REALTIME_TOOL_NAME_SET = new Set<string>(
  APP_MANAGED_REALTIME_TOOL_NAMES
);

const TAIPEI_DISTRICTS = [
  "松山區",
  "信義區",
  "大安區",
  "中山區",
  "中正區",
  "大同區",
  "萬華區",
  "文山區",
  "南港區",
  "內湖區",
  "士林區",
  "北投區",
] as const;

const CIVIC_CONTEXT_MAX_TURNS = 6;

function compactText(value: string) {
  return value
    .normalize("NFKC")
    .replace(/臺/g, "台")
    .replace(/[\s，。！？、,.!?：:；;（）()「」『』]/g, "");
}

function includesPlace(text: string, place: string, suffix: "區" | "里") {
  const normalizedPlace = compactText(place);
  const withoutSuffix = normalizedPlace.endsWith(suffix)
    ? normalizedPlace.slice(0, -1)
    : normalizedPlace;

  return text.includes(normalizedPlace) || text.includes(withoutSuffix);
}

function findKnownName(
  text: string,
  people: ReadonlyArray<{ name: string }>
) {
  return people.find(({ name }) => text.includes(compactText(name)))?.name || "";
}

function mostRecentKnownName(
  turns: string[],
  people: ReadonlyArray<{ name: string }>
) {
  for (const turn of [...turns].reverse()) {
    const name = findKnownName(compactText(turn), people);
    if (name) return name;
  }

  return "";
}

function mostRecentPlace(
  turns: string[],
  places: readonly string[],
  suffix: "區" | "里"
) {
  for (const turn of [...turns].reverse()) {
    const text = compactText(turn);
    const place = places.find((item) => includesPlace(text, item, suffix));
    if (place) return place;
  }

  return "";
}

function extractLikelyPersonName(value: string) {
  let text = compactText(value);

  text = text.replace(
    /台北市|臺北市|現任|市議員|議員|里長|里辦公處|里辦公室|里辦|生日|出生日期|幾歲|年齡|電話|手機|email|信箱|聯絡方式|聯絡|黨籍|選區|服務處|辦公室|背景|學歷|經歷|政策|關注|職責|工作|做什麼|什麼|公開合作|合作|關係|互動|攻防|是誰|有誰|哪些|名單|所有|全部|幾位|最年輕|最年長|民主進步黨|中國國民黨|台灣民眾黨|社會民主黨|民進黨|國民黨|民眾黨|社民黨|新黨|無黨籍|沈伯洋|幫我查一下|幫我查|查一下|我想問|想問|請問|我要問|我問|告訴我|你就|的/gi,
    ""
  );

  if (text.endsWith("區") || text.endsWith("里")) return "";
  return /^[\p{Script=Han}]{2,4}$/u.test(text) ? text : "";
}

function mostRecentNameHint(turns: string[]) {
  for (const turn of [...turns].reverse()) {
    const text = compactText(turn);
    const knownCouncilor = findKnownName(text, TAIPEI_COUNCILORS);
    const knownVillageChief = findKnownName(text, TAIPEI_VILLAGE_CHIEFS);
    const hint = knownCouncilor || knownVillageChief || extractLikelyPersonName(turn);

    if (hint) return hint;
  }

  return "";
}

function civicDomainForTurn(turn: string): "councilor" | "village_chief" | null {
  const text = compactText(turn);

  if (
    /里長|里辦公處|里辦公室|里辦/.test(text) ||
    findKnownName(text, TAIPEI_VILLAGE_CHIEFS)
  ) {
    return "village_chief";
  }

  if (/市議員|議員/.test(text) || findKnownName(text, TAIPEI_COUNCILORS)) {
    return "councilor";
  }

  return null;
}

export function isAppManagedRealtimeToolName(
  name: unknown
): name is AppManagedRealtimeToolName {
  return (
    typeof name === "string" &&
    APP_MANAGED_REALTIME_TOOL_NAME_SET.has(name)
  );
}

function normalizeDistrictArgument(value: unknown) {
  const compact = String(value ?? "")
    .trim()
    .replace(/\s+/g, "")
    .replace(/^(?:台北市|臺北市)/, "");

  return compact && !compact.endsWith("區") ? `${compact}區` : compact;
}

function normalizeVillageArgument(value: unknown) {
  const compact = String(value ?? "")
    .trim()
    .replace(/\s+/g, "")
    .replace(/^(?:台北市|臺北市)/, "")
    .replace(/^[^區]+區/, "");

  return compact && !compact.endsWith("里") ? `${compact}里` : compact;
}

function normalizeCouncilorNameArgument(value: unknown) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, "")
    .replace(/^(?:(?:台北市|臺北市)?市?議員)/, "")
    .replace(/市?議員$/, "");
}

function normalizeVillageChiefNameArgument(value: unknown) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, "")
    .replace(/^(?:台北市|臺北市)/, "")
    .replace(/^里長/, "")
    .replace(/里長$/, "");
}

function normalizePartyArgument(value: unknown) {
  const compact = String(value ?? "")
    .trim()
    .replace(/\s+/g, "");
  const aliases: Record<string, string> = {
    民進黨: "民主進步黨",
    國民黨: "中國國民黨",
    民眾黨: "台灣民眾黨",
    社民黨: "社會民主黨",
  };

  return aliases[compact] || compact;
}

/** Keeps model-generated arguments compatible with the exact local KB keys. */
export function normalizeTaipeiCivicToolArguments(
  toolName: unknown,
  rawArguments: unknown
): Record<string, unknown> {
  const args =
    rawArguments && typeof rawArguments === "object"
      ? { ...(rawArguments as Record<string, unknown>) }
      : {};

  if (toolName === "lookup_taipei_village_chief") {
    return {
      ...args,
      district: normalizeDistrictArgument(args.district),
      village: normalizeVillageArgument(args.village),
      name: normalizeVillageChiefNameArgument(args.name),
    };
  }

  if (toolName === "lookup_taipei_councilors") {
    return {
      ...args,
      district: normalizeDistrictArgument(args.district),
      party: normalizePartyArgument(args.party),
    };
  }

  if (toolName === "lookup_taipei_councilor_by_name") {
    return {
      ...args,
      name: normalizeCouncilorNameArgument(args.name),
    };
  }

  return args;
}

/** Fills tool arguments from recent turns when the user supplied details piecemeal. */
export function inferTaipeiCivicToolArguments(
  toolName: unknown,
  rawArguments: unknown,
  recentUserTurns: string[] = []
): Record<string, unknown> {
  const turns = recentUserTurns.slice(-CIVIC_CONTEXT_MAX_TURNS);
  const context = compactText(turns.join(" "));
  const args = normalizeTaipeiCivicToolArguments(toolName, rawArguments);

  if (toolName === "lookup_taipei_village_chief") {
    const knownChief = mostRecentKnownName(turns, TAIPEI_VILLAGE_CHIEFS);

    if (!args.name) {
      args.name = knownChief || mostRecentNameHint(turns);
    }

    if (!args.district) {
      args.district = mostRecentPlace(turns, TAIPEI_DISTRICTS, "區");
    }

    if (!args.village) {
      args.village = mostRecentPlace(
        turns,
        [...new Set(TAIPEI_VILLAGE_CHIEFS.map(({ village }) => village))],
        "里"
      );
    }
  }

  if (toolName === "lookup_taipei_councilor_by_name" && !args.name) {
    args.name =
      mostRecentKnownName(turns, TAIPEI_COUNCILORS) ||
      mostRecentNameHint(turns);
  }

  if (toolName === "lookup_taipei_councilors") {
    if (!args.district) {
      args.district = mostRecentPlace(turns, TAIPEI_DISTRICTS, "區");
    }

    if (!args.party) {
      const parties = [
        "民主進步黨",
        "中國國民黨",
        "台灣民眾黨",
        "社會民主黨",
        "無黨籍",
        "新黨",
        "民進黨",
        "國民黨",
        "民眾黨",
        "社民黨",
      ];
      const partyMatch = [...turns]
        .reverse()
        .map((turn) => {
          const turnText = compactText(turn);
          return parties.find((party) => turnText.includes(compactText(party)));
        })
        .find(Boolean);

      args.party = normalizePartyArgument(partyMatch);
    }

    if (!args.sortBy && context.includes("最年輕")) {
      args.sortBy = "youngest_first";
      args.limit ||= 1;
    } else if (!args.sortBy && context.includes("最年長")) {
      args.sortBy = "oldest_first";
      args.limit ||= 1;
    }

    if (!args.relationshipLevel) {
      if (/公開合作|合作過|競選合作/.test(context)) {
        args.relationshipLevel = "confirmed_campaign_cooperation";
      } else if (/政策攻防|公開攻防|對立/.test(context)) {
        args.relationshipLevel = "public_policy_opposition";
      } else if (/議題交集|公開議題/.test(context)) {
        args.relationshipLevel = "confirmed_public_issue_overlap";
      }
    }
  }

  return args;
}

/**
 * Selects a civic lookup only when the current utterance contains enough
 * location/name evidence to avoid forcing the model to invent tool arguments.
 */
export function selectTaipeiCivicTool(
  userText: string,
  recentUserTurns: string[] = []
): AppManagedRealtimeToolName | null {
  const text = compactText(userText);
  const recentTurns = recentUserTurns.slice(-CIVIC_CONTEXT_MAX_TURNS);

  if (!text) return null;

  const asksVillageChief =
    text.includes("里長") ||
    text.includes("里辦公處") ||
    text.includes("里辦公室") ||
    text.includes("里辦");

  if (asksVillageChief) {
    return "lookup_taipei_village_chief";
  }

  const knownVillageChief = findKnownName(text, TAIPEI_VILLAGE_CHIEFS);

  const knownCouncilor = findKnownName(text, TAIPEI_COUNCILORS);
  const asksCouncilorDetails =
    text.includes("議員") ||
    /電話|email|信箱|聯絡|黨籍|選區|服務處|辦公室|哪一區|是誰|生日|年齡|幾歲|學歷|經歷|背景|政策|關注|合作|關係|互動|攻防/i.test(
      text
    );

  if (knownCouncilor && asksCouncilorDetails) {
    return "lookup_taipei_councilor_by_name";
  }

  if (knownVillageChief && !knownCouncilor) {
    return "lookup_taipei_village_chief";
  }

  const asksCouncilor = /市議員|議員/.test(text);
  const asksCouncilorList =
    asksCouncilor &&
    /哪些|有誰|名單|所有|全部|幾位|最年輕|最年長|年齡|黨籍|民進黨|國民黨|民眾黨|社民黨|新黨|無黨籍|沈伯洋|合作|關係|互動|攻防/.test(
      text
    );
  const hasDistrict = TAIPEI_DISTRICTS.some((district) =>
    includesPlace(text, district, "區")
  );

  // List/ranking/location intent must win before free-form name extraction.
  // Otherwise phrases such as 「內湖區有哪些」 can be mistaken for a name.
  if (asksCouncilorList || (asksCouncilor && hasDistrict)) {
    return "lookup_taipei_councilors";
  }

  if (asksCouncilor) {
    const currentNameHint = extractLikelyPersonName(userText);
    const previousNameHint = mostRecentNameHint(recentTurns);

    if (knownCouncilor || currentNameHint || previousNameHint) {
      return "lookup_taipei_councilor_by_name";
    }
  }

  const recentDomain = [...recentTurns]
    .reverse()
    .map(civicDomainForTurn)
    .find(Boolean);
  const currentNameHint = extractLikelyPersonName(userText);
  const isFollowUp =
    Boolean(currentNameHint) ||
    /^(?:你)?(?:就)?幫我查|^(?:那|這|對|是|沒錯|剛剛)/.test(text);

  if (isFollowUp && recentDomain === "village_chief") {
    return "lookup_taipei_village_chief";
  }

  if (isFollowUp && recentDomain === "councilor") {
    return "lookup_taipei_councilor_by_name";
  }

  if (currentNameHint && /生日|出生日期|幾歲|年齡/.test(text)) {
    return "web_search";
  }

  return null;
}
