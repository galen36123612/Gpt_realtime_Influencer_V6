import {
  DISTRICT_TO_CONSTITUENCY,
  TAIPEI_COUNCILORS,
  normalizeCouncilorTopic,
} from "../data/councilors.ts";
import type {
  CouncilorNameDetail,
  CouncilorPolicyTopic,
} from "../data/councilors.ts";

const TAIPEI_DISTRICTS = Object.keys(DISTRICT_TO_CONSTITUENCY).filter((district) =>
  district.endsWith("區")
);

export interface LocalConversationContext {
  activeDistrict?: string;
  activeConstituency?: number;
  activeCouncilorNames?: string[];
  activeTopic?: CouncilorPolicyTopic;
  activeToolDomain?: "councilor" | "media" | "village" | "policy";
  lastCouncilorToolResult?: unknown;
}

export type CouncilorIntent =
  | { type: "list_by_district"; district: string }
  | { type: "list_by_party"; district?: string; party: string }
  | { type: "topic_search"; topic: CouncilorPolicyTopic; party?: string }
  | { type: "profile"; name: string; names: string[] }
  | { type: "policy"; name: string; names: string[] }
  | { type: "relationship"; name: string; names: string[] }
  | { type: "events"; name: string; names: string[] }
  | { type: "public_activity_list"; party?: string }
  | { type: "policy_alignment_list"; party: string }
  | null;

export interface CouncilorRealtimeRoute {
  intent: Exclude<CouncilorIntent, null>;
  forcedTool:
    | "lookup_taipei_councilors"
    | "lookup_taipei_councilor_by_name"
    | null;
  args: Record<string, unknown>;
  detail: string;
  entities: string[];
  topic?: CouncilorPolicyTopic;
  cacheHit: boolean;
  cachedResult?: unknown;
  globalScope?: boolean;
}

export interface CouncilorRouteDecision {
  route: CouncilorRealtimeRoute | null;
  context: LocalConversationContext;
}

export function createInitialLocalConversationContext(): LocalConversationContext {
  return {};
}

function compact(input: string) {
  return String(input || "")
    .normalize("NFKC")
    .replace(/臺/g, "台")
    .replace(/[\s，。！？、,.!?：:；;（）()「」『』／/]/g, "");
}

function explicitDistrict(text: string) {
  const compacted = compact(text);
  return (
    TAIPEI_DISTRICTS.find((district) => {
      const base = district.replace(/區$/, "");
      return compacted.includes(district) || compacted.includes(base);
    }) || ""
  );
}

function explicitCouncilorNames(text: string) {
  const compacted = compact(text);
  return TAIPEI_COUNCILORS.filter(({ name }) => compacted.includes(compact(name))).map(
    ({ name }) => name
  );
}

function primaryTopic(text: string): CouncilorPolicyTopic | undefined {
  const compacted = compact(text).toLowerCase();
  const topics = normalizeCouncilorTopic(text);

  if (!topics.length) return undefined;
  if (/電梯|爬梯機|無障礙/.test(compacted)) return "電梯無障礙";
  if (/老屋|老宅|危老/.test(compacted)) return "老屋";
  if (/內湖交通/.test(compacted)) return "內湖交通";
  if (/行人/.test(compacted)) return "行人安全";
  if (/捷運|東環|南環|民汐線/.test(compacted)) return "捷運";
  if (/交通|接駁|公車|通勤|道路|youbike/.test(compacted)) return "交通";
  if (/公托|托育|臨托/.test(compacted)) return "公托";
  if (/母嬰/.test(compacted)) return "母嬰";
  if (/育兒|幼兒|親子/.test(compacted)) return "育兒";
  if (/市場|夜市|商圈|地方經濟/.test(compacted)) return "市場商圈";
  return topics[0];
}

function explicitParty(text: string) {
  const compacted = compact(text);
  if (/跟你同黨|跟你同黨派|你們黨|同黨議員|民進黨/.test(compacted)) {
    return "民主進步黨";
  }
  if (compacted.includes("國民黨")) return "中國國民黨";
  if (compacted.includes("民眾黨")) return "台灣民眾黨";
  if (compacted.includes("社民黨")) return "社會民主黨";
  if (compacted.includes("新黨")) return "新黨";
  if (compacted.includes("無黨籍")) return "無黨籍";
  return undefined;
}

function isVillageIntent(text: string) {
  return /里長|里辦公處|里辦公室|里辦/.test(compact(text));
}

export function isCouncilorMediaIntent(text: string) {
  const value = compact(text);
  return (
    /(?:最近|今天|昨天|這幾天|本週|上週).*(?:採訪|受訪|新聞|媒體|記者)/.test(value) ||
    /(?:採訪|受訪|新聞|媒體|記者).*(?:怎麼說|說了什麼|提到|評論)/.test(value) ||
    /\d{1,2}月\d{1,2}日.*(?:記者會|受訪|發言)/.test(value)
  );
}

function isPublicActivityList(text: string) {
  const value = compact(text);
  return (
    /(?:你跟)?哪些市?議員.*(?:公開活動|共同活動|同台|合作)/.test(value) ||
    /(?:公開活動|共同活動|同台|合作).*(?:哪些|哪幾位)市?議員/.test(value) ||
    /(?:你)?(?:有)?跟(?:其他)?市?議員.*(?:公開行程|公開站台|公開活動|共同活動|同台)/.test(
      value
    ) ||
    /其他市?議員.*(?:公開行程|公開站台|公開活動|共同活動|同台)/.test(value)
  );
}

function isPolicyAlignmentList(text: string) {
  const value = compact(text);
  return (
    /(?:有沒有|有哪些|哪些|有)市?議員.*(?:方向一樣|方向一致|政見一致|政策一致|理念一致)/.test(
      value
    ) ||
    /市?議員.*(?:跟你|和你).*(?:方向|政見|政策|理念).*(?:一樣|一致|相近)/.test(
      value
    )
  );
}

function referencedNames(
  text: string,
  context: LocalConversationContext
) {
  const explicit = explicitCouncilorNames(text);
  if (explicit.length) return explicit;

  const value = compact(text);
  if (
    /這兩位|那兩位|這些人|那些人|他們|她們|這幾位|剛剛那些/.test(value)
  ) {
    return context.activeCouncilorNames || [];
  }

  if (/^(?:那|這)?(?:他|她|這位|那位)/.test(value)) {
    return context.activeCouncilorNames?.slice(-1) || [];
  }

  if (/^(?:那|這).{0,8}(?:他|她)/.test(value)) {
    return context.activeCouncilorNames?.slice(-1) || [];
  }

  return [];
}

function hasPolicyIntent(text: string) {
  return /政見|訴求|政策|關心什麼|關注什麼|主張什麼|方向一樣/.test(compact(text));
}

function hasEventIntent(text: string) {
  return /一起去哪|一起跑過|一起掃過|共同活動|公開活動|有沒有同台|同台過|哪些活動/.test(
    compact(text)
  );
}

function hasRelationshipIntent(text: string) {
  return /合作|關係|熟嗎|connection|政策交集|支持他|支持她|採納|認同/.test(
    compact(text).toLowerCase()
  );
}

function hasProfileIntent(text: string) {
  return /背景|學歷|經歷|生日|出生|幾歲|年齡|黨籍|選區|服務處|電話|信箱|email|是誰/.test(
    compact(text).toLowerCase()
  );
}

function detailForIntent(intent: Exclude<CouncilorIntent, null>) {
  if (intent.type === "policy") return "policy" as CouncilorNameDetail;
  if (intent.type === "relationship") return "relationship" as CouncilorNameDetail;
  if (intent.type === "events") return "events" as CouncilorNameDetail;
  if (intent.type === "profile") return "profile" as CouncilorNameDetail;
  return "quick";
}

function cachedCouncilors(result: unknown): Array<Record<string, any>> {
  if (!result || typeof result !== "object") return [];
  const data = (result as { data?: unknown }).data;
  return Array.isArray(data) ? data.filter((item) => item && typeof item === "object") : [];
}

function cacheSupportsIntent(
  result: unknown,
  intent: Exclude<CouncilorIntent, null>
) {
  if (!("names" in intent) || !intent.names.length) return false;
  const cached = cachedCouncilors(result);
  const byName = new Map(cached.map((item) => [String(item.name || ""), item]));

  return intent.names.every((name) => {
    const item = byName.get(name);
    if (!item) return false;
    if (intent.type === "policy") return Boolean(item.policyTop3 || item.realtimeSummary);
    if (intent.type === "relationship") {
      return Boolean(item.relationToShen || item.realtimeSummary);
    }
    if (intent.type === "events") {
      return Boolean(
        item.confirmedPublicEvents ||
          item.confirmedPublicEventHighlights ||
          item.relationToShen?.confirmedPublicEvents
      );
    }
    if (intent.type === "profile") return Boolean(item.backgroundSummary || item.birthDate);
    return false;
  });
}

export function detectCouncilorIntent(
  transcript: string,
  context: LocalConversationContext = {}
): CouncilorIntent {
  const text = compact(transcript);
  if (!text || isVillageIntent(text) || isCouncilorMediaIntent(text)) return null;

  const district = explicitDistrict(text);
  const party = explicitParty(text);
  const topic = primaryTopic(text);
  const names = referencedNames(text, context);

  // A global activity question must never inherit a stale district.
  if (isPublicActivityList(text) && !names.length) {
    return { type: "public_activity_list", ...(party ? { party } : {}) };
  }

  if (isPolicyAlignmentList(text) && !names.length) {
    if (
      context.activeTopic &&
      context.activeToolDomain !== "village" &&
      context.activeToolDomain !== "media"
    ) {
      return {
        type: "topic_search",
        topic: context.activeTopic,
        party: "民主進步黨",
      };
    }

    return { type: "policy_alignment_list", party: "民主進步黨" };
  }

  if (names.length) {
    const named = { name: names[0], names };
    if (hasEventIntent(text)) return { type: "events", ...named };
    if (hasPolicyIntent(text)) return { type: "policy", ...named };
    if (hasRelationshipIntent(text)) return { type: "relationship", ...named };
    if (hasProfileIntent(text) || /議員/.test(text)) return { type: "profile", ...named };
    return { type: "profile", ...named };
  }

  if (/議員/.test(text) && topic) {
    return { type: "topic_search", topic, ...(party ? { party } : {}) };
  }

  if (/議員/.test(text) && party) {
    return { type: "list_by_party", ...(district ? { district } : {}), party };
  }

  if (/議員/.test(text) && district) {
    return { type: "list_by_district", district };
  }

  if (/有沒有議員.*方向一樣|哪些議員.*方向一樣/.test(text) && context.activeTopic) {
    return {
      type: "topic_search",
      topic: context.activeTopic,
      party: "民主進步黨",
    };
  }

  return null;
}

function routeForIntent(
  intent: Exclude<CouncilorIntent, null>,
  context: LocalConversationContext
): CouncilorRealtimeRoute {
  const detail = detailForIntent(intent);
  const entities = "names" in intent ? intent.names : [];

  if ("names" in intent) {
    const cacheHit = cacheSupportsIntent(context.lastCouncilorToolResult, intent);
    if (cacheHit) {
      return {
        intent,
        forcedTool: null,
        args: {},
        detail,
        entities,
        cacheHit: true,
        cachedResult: context.lastCouncilorToolResult,
      };
    }

    if (intent.names.length === 1) {
      return {
        intent,
        forcedTool: "lookup_taipei_councilor_by_name",
        args: { name: intent.name, detail },
        detail,
        entities,
        cacheHit: false,
      };
    }

    return {
      intent,
      forcedTool: "lookup_taipei_councilors",
      args: { names: intent.names, detail: "quick" },
      detail,
      entities,
      cacheHit: false,
    };
  }

  if (intent.type === "list_by_district") {
    return {
      intent,
      forcedTool: "lookup_taipei_councilors",
      args: { district: intent.district, detail: "quick" },
      detail,
      entities,
      cacheHit: false,
    };
  }

  if (intent.type === "list_by_party") {
    return {
      intent,
      forcedTool: "lookup_taipei_councilors",
      args: {
        ...(intent.district ? { district: intent.district } : {}),
        party: intent.party,
        detail: "quick",
      },
      detail,
      entities,
      cacheHit: false,
    };
  }

  if (intent.type === "topic_search") {
    return {
      intent,
      forcedTool: "lookup_taipei_councilors",
      args: {
        topic: intent.topic,
        ...(intent.party ? { party: intent.party } : {}),
        detail: "quick",
      },
      detail,
      entities,
      topic: intent.topic,
      cacheHit: false,
    };
  }

  if (intent.type === "policy_alignment_list") {
    return {
      intent,
      forcedTool: "lookup_taipei_councilors",
      args: {
        party: intent.party,
        detail: "quick",
      },
      detail,
      entities,
      cacheHit: false,
      globalScope: true,
    };
  }

  return {
    intent,
    forcedTool: "lookup_taipei_councilors",
    args: {
      ...(intent.party ? { party: intent.party } : {}),
      hasPublicEventWithShen: true,
      detail: "quick",
    },
    detail,
    entities,
    cacheHit: false,
    globalScope: true,
  };
}

/** Captures entities/topics first, then deterministically selects a councilor route. */
export function routeCouncilorTranscript(
  transcript: string,
  previousContext: LocalConversationContext = {}
): CouncilorRouteDecision {
  const district = explicitDistrict(transcript);
  const topic = primaryTopic(transcript);
  const names = explicitCouncilorNames(transcript);
  const context: LocalConversationContext = {
    ...previousContext,
    ...(district
      ? {
          activeDistrict: district,
          activeConstituency: DISTRICT_TO_CONSTITUENCY[district],
        }
      : {}),
    ...(topic
      ? {
          activeTopic: topic,
          activeToolDomain: "policy" as const,
        }
      : {}),
    ...(names.length ? { activeCouncilorNames: names } : {}),
  };
  const intent = detectCouncilorIntent(transcript, context);

  if (!intent) return { route: null, context };

  const route = routeForIntent(intent, context);
  return {
    route,
    context: {
      ...context,
      activeToolDomain: "councilor",
      ...(route.entities.length
        ? { activeCouncilorNames: route.entities }
        : {}),
      ...(route.topic ? { activeTopic: route.topic } : {}),
    },
  };
}

export function updateCouncilorContextFromResult(
  previousContext: LocalConversationContext,
  result: unknown
): LocalConversationContext {
  const data = cachedCouncilors(result);
  const names = data.map((item) => String(item.name || "")).filter(Boolean);
  const normalized =
    result && typeof result === "object"
      ? (result as { normalized?: Record<string, unknown> }).normalized
      : undefined;

  return {
    ...previousContext,
    activeToolDomain: "councilor",
    ...(names.length ? { activeCouncilorNames: names } : {}),
    ...(typeof normalized?.district === "string" && normalized.district
      ? { activeDistrict: normalized.district }
      : {}),
    ...(typeof normalized?.constituency === "number"
      ? { activeConstituency: normalized.constituency }
      : {}),
    lastCouncilorToolResult: result,
  };
}

export function createSilentLocalToolResponse(input: {
  forcedTool: string;
  args?: Record<string, unknown>;
  instructions: string;
  routeId: string;
}) {
  return {
    // Official Realtime semantics: text-only disables audio for this response.
    output_modalities: ["text"],
    tool_choice: { type: "function", name: input.forcedTool },
    max_output_tokens: 512,
    metadata: {
      response_purpose: "silent_local_tool",
      local_route_id: input.routeId,
    },
    instructions: `${input.instructions}\n只建立 ${input.forcedTool} 的 function call。不得輸出任何查詢前言、過場或給使用者看的文字。參數使用：${JSON.stringify(
      input.args || {}
    )}`,
  };
}

export function createLocalFinalAnswerResponse(input: {
  routeId?: string;
  instructions?: string;
  route?: CouncilorRealtimeRoute | null;
  toolName?: string | null;
  transcript?: string;
}) {
  const personaAnchor =
    "你是目前 session 中設定的 AI 市長沈伯洋。延續原本第一人稱、親切、有現場感的人格回答；你不是泛用語音助手，也不是站在旁邊介紹沈伯洋的第三人稱百科。";
  const routeGuidance = (() => {
    if (
      input.route?.intent.type === "list_by_district" ||
      input.route?.intent.type === "list_by_party"
    ) {
      return "這是完整名單查詢：data 裡每位議員的姓名都必須各出現一次，不得漏人、重複姓名或自行增補。先直接報完整姓名名單。";
    }

    if (
      input.route?.intent.type === "topic_search" ||
      input.route?.intent.type === "policy_alignment_list" ||
      input.route?.intent.type === "public_activity_list"
    ) {
      return "第一句先直接點出符合條件的具體議員姓名，再用精簡分組或例子補充；不得只講抽象政策而不報姓名。";
    }

    if (input.toolName === "lookup_taipei_village_chief") {
      return "若使用者只問里長是誰，只回答里名、行政區與現任里長姓名；沒有被問時不要朗讀電話、地址或多餘的查證提醒。";
    }

    return "依使用者實際問題選取相關欄位作答，不要朗讀整份資料。";
  })();

  const taskInstructions =
    input.instructions ||
    `直接根據剛取得的 function output 完整回答使用者原問題「${String(
      input.transcript || ""
    ).slice(0, 240)}」。只產生這一個最終答案；第一句就開始講實質答案，不要說我查一下、我看一下、我整理一下、我來說清楚或其他工具過場。${routeGuidance} found=true 且 status=current 時直接有把握回答，不要補大概或最好再查官方。不得捏造 function output 沒有的人名、英文名字、數字或事件。`;

  return {
    output_modalities: ["audio"],
    tool_choice: "none",
    metadata: {
      response_purpose: "local_tool_final_answer",
      ...(input.routeId ? { local_route_id: input.routeId } : {}),
    },
    instructions: `${personaAnchor}\n${taskInstructions}`,
  };
}

export function createCachedCouncilorFinalResponse(route: CouncilorRealtimeRoute) {
  return createLocalFinalAnswerResponse({
    route,
    instructions: `沿用上一輪已成功的 Councilor Local KB 結果回答這個 follow-up，不要再次查 Tool。intent=${route.intent.type}；entities=${route.entities.join(
      "、"
    )}；cached=${JSON.stringify(route.cachedResult)}。直接回答，不要提到快取或查詢流程。`,
  });
}

export function createCouncilorRouterLog(input: {
  transcript: string;
  route: CouncilorRealtimeRoute | null;
  context: LocalConversationContext;
  toolLatencyMs?: number;
  responseLatencyMs?: number;
}) {
  return {
    transcript: input.transcript,
    intent: input.route?.intent.type || null,
    entity: input.route?.entities || [],
    district: input.route?.globalScope ? null : input.context.activeDistrict || null,
    constituency: input.route?.globalScope
      ? null
      : input.context.activeConstituency || null,
    party:
      input.route?.args && typeof input.route.args.party === "string"
        ? input.route.args.party
        : null,
    topic: input.route?.topic || input.context.activeTopic || null,
    forcedTool: input.route?.forcedTool || null,
    detail: input.route?.detail || null,
    cacheHit: input.route?.cacheHit || false,
    toolLatencyMs: input.toolLatencyMs ?? null,
    responseLatencyMs: input.responseLatencyMs ?? null,
  };
}
