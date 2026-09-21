import { TAIPEI_COUNCILORS } from "../data/councilors.ts";
import { TAIPEI_VILLAGE_CHIEFS } from "../data/villageChiefs.ts";

export interface EntityNormalizationCorrection {
  from: string;
  to: string;
  confidence: "high";
}

export interface NormalizedRealtimeTranscript {
  raw: string;
  normalized: string;
  corrections: EntityNormalizationCorrection[];
  entities: {
    people: string[];
    districts: string[];
    villages: string[];
    policies: string[];
  };
}

const HIGH_CONFIDENCE_REPLACEMENTS: ReadonlyArray<readonly [RegExp, string]> = [
  [/[沈審][伯柏][洋楊陽揚安用]/g, "沈伯洋"],
  [/蔣萬岸/g, "蔣萬安"],
  [/內古/g, "內湖"],
  [/北投居/g, "北投區"],
  [/詩意人|市意人/g, "市議員"],
  [/網校委/g, "王孝維"],
  [/簡如培/g, "簡舒培"],
  [/吳思搖/g, "吳思瑤"],
  [/吳沛意/g, "吳沛憶"],
  [/王世間/g, "王世堅"],
  [/頭給你/g, "投給你"],
] as const;

const STABLE_CAMPAIGN_PEOPLE = ["吳思瑤", "吳沛憶", "王世堅"] as const;

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

const STABLE_POLICY_NAMES = [
  "十二區家庭一站通",
  "家庭喘息支持",
  "親子同行卡",
  "城市青年基金",
  "青年 AI 使用平台",
  "青年圓夢計畫",
  "老屋延壽",
  "夜間市長",
  "文化山徑",
  "雙城論壇",
  "黑熊學院",
] as const;

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function canonicalDistrict(value: string) {
  const compact = value.replace(/^台北市|^臺北市/, "");
  return compact.endsWith("區") ? compact : `${compact}區`;
}

/**
 * Applies only explicit, high-confidence corrections. The raw transcript stays
 * available for UI/logging while routing consumes normalized.
 */
export function normalizeRealtimeTranscript(
  rawTranscript: string
): NormalizedRealtimeTranscript {
  const raw = String(rawTranscript || "").normalize("NFKC");
  let normalized = raw.replace(/臺/g, "台");
  const corrections: EntityNormalizationCorrection[] = [];

  for (const [pattern, replacement] of HIGH_CONFIDENCE_REPLACEMENTS) {
    normalized = normalized.replace(pattern, (match) => {
      if (match !== replacement) {
        corrections.push({ from: match, to: replacement, confidence: "high" });
      }
      return replacement;
    });
  }

  const people = unique([
    ...(normalized.includes("沈伯洋") ? ["沈伯洋"] : []),
    ...(normalized.includes("蔣萬安") ? ["蔣萬安"] : []),
    ...STABLE_CAMPAIGN_PEOPLE.filter((name) => normalized.includes(name)),
    ...TAIPEI_COUNCILORS.filter(({ name }) => normalized.includes(name)).map(
      ({ name }) => name
    ),
    ...TAIPEI_VILLAGE_CHIEFS.filter(({ name }) => normalized.includes(name)).map(
      ({ name }) => name
    ),
  ]);
  const districts = unique(
    TAIPEI_DISTRICTS.filter((district) => {
      const base = district.replace(/區$/, "");
      return normalized.includes(district) || normalized.includes(base);
    }).map(canonicalDistrict)
  );
  const villages = unique(
    TAIPEI_VILLAGE_CHIEFS.filter(({ village }) => normalized.includes(village)).map(
      ({ village }) => village
    )
  );
  const policies = STABLE_POLICY_NAMES.filter((name) =>
    normalized.toLowerCase().includes(name.toLowerCase())
  );

  return {
    raw,
    normalized,
    corrections,
    entities: { people, districts, villages, policies },
  };
}
