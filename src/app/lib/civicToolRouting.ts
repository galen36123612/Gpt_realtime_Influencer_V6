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

/**
 * Selects a civic lookup only when the current utterance contains enough
 * location/name evidence to avoid forcing the model to invent tool arguments.
 */
export function selectTaipeiCivicTool(
  userText: string
): AppManagedRealtimeToolName | null {
  const text = compactText(userText);

  if (!text) return null;

  const asksVillageChief =
    text.includes("里長") ||
    text.includes("里辦公處") ||
    text.includes("里辦公室") ||
    text.includes("里辦");

  if (asksVillageChief) {
    const hasCompleteLocation = TAIPEI_VILLAGE_CHIEFS.some(
      ({ district, village }) =>
        includesPlace(text, district, "區") &&
        includesPlace(text, village, "里")
    );

    return hasCompleteLocation ? "lookup_taipei_village_chief" : null;
  }

  const knownCouncilor = TAIPEI_COUNCILORS.find(({ name }) =>
    text.includes(compactText(name))
  );
  const asksCouncilorDetails =
    text.includes("議員") ||
    /電話|email|信箱|聯絡|黨籍|選區|服務處|辦公室|哪一區|是誰|生日|年齡|幾歲|學歷|經歷|背景|政策|關注|合作|關係|互動|攻防/i.test(
      text
    );

  if (knownCouncilor && asksCouncilorDetails) {
    return "lookup_taipei_councilor_by_name";
  }

  const asksCouncilorList =
    text.includes("議員") &&
    /哪些|有誰|名單|所有|全部|幾位|最年輕|最年長|年齡|黨籍|民進黨|國民黨|民眾黨|社民黨|新黨|無黨籍|沈伯洋|合作|關係|互動|攻防/.test(
      text
    );
  const hasDistrict = TAIPEI_DISTRICTS.some((district) =>
    includesPlace(text, district, "區")
  );

  if (asksCouncilorList || (text.includes("議員") && hasDistrict)) {
    return "lookup_taipei_councilors";
  }

  return null;
}
