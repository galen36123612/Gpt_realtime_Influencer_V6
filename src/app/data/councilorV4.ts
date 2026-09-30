import type {
  CouncilorPolicyItem,
  CouncilorPolicyTopic,
  CouncilorSharedPolicyTopic,
} from "./councilors.ts";

export interface CouncilorV4Blueprint {
  policyTop3: Array<
    Pick<CouncilorPolicyItem, "title" | "summary" | "tags">
  >;
  policyFocusTags: CouncilorPolicyTopic[];
  sharedPolicyTopics: CouncilorSharedPolicyTopic[];
  realtimeSummary: {
    relationship: string;
    policies: string;
    collaboration: string;
  };
}

const TOPIC_ALIASES: Array<{
  topics: CouncilorPolicyTopic[];
  aliases: string[];
}> = [
  {
    topics: ["交通", "捷運", "行人安全", "內湖交通"],
    aliases: [
      "交通",
      "捷運",
      "接駁",
      "公車",
      "通勤",
      "行人",
      "道路",
      "內湖交通",
      "東環",
      "南環",
      "民汐線",
      "youbike",
      "信義線東延",
      "文山交通",
    ],
  },
  {
    topics: ["老屋", "都更", "電梯無障礙", "住宅"],
    aliases: ["老屋", "老宅", "危老", "都更", "電梯", "加裝電梯", "無障礙", "爬梯機", "居住"],
  },
  {
    topics: ["育兒", "公托", "母嬰"],
    aliases: ["育兒", "托育", "公托", "臨托", "母嬰", "幼兒", "親子", "兒少"],
  },
  {
    topics: ["青年", "社宅", "AI數位"],
    aliases: ["青年", "年輕人", "租屋", "社宅", "創業", "ai", "數位"],
  },
  {
    topics: ["市場商圈", "地方建設"],
    aliases: ["市場", "夜市", "商圈", "地方經濟", "地方建設", "地方服務", "中山大同", "士林北投", "萬華市場"],
  },
  { topics: ["北士科"], aliases: ["北士科", "文林變電所"] },
  { topics: ["教育"], aliases: ["教育", "校園", "學校"] },
  { topics: ["長照", "長者"], aliases: ["長照", "長者", "高齡", "老人", "社福"] },
  { topics: ["身障", "電梯無障礙"], aliases: ["身障", "無障礙", "運動平權"] },
  { topics: ["文化", "國際城市"], aliases: ["文化", "城市外交", "國際城市", "城市溝通"] },
  { topics: ["運動"], aliases: ["運動", "足球", "棒球", "體育"] },
  { topics: ["動保"], aliases: ["動保", "動物", "毛小孩", "動物福利"] },
  { topics: ["河岸", "環境"], aliases: ["河岸", "河濱", "環境", "永續"] },
  { topics: ["社子島"], aliases: ["社子島", "社子"] },
  { topics: ["防災"], aliases: ["防災", "韌性", "淹水", "救災"] },
];

function compact(input: string) {
  return String(input || "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/臺/g, "台")
    .replace(/[\s，。！？、,.!?：:；;（）()「」『』／/]/g, "");
}

/** Normalizes natural-language aliases to one or more stable policy topics. */
export function normalizeCouncilorTopic(
  input: string
): CouncilorPolicyTopic[] {
  const text = compact(input);

  if (!text) return [];

  const matches = new Set<CouncilorPolicyTopic>();

  for (const group of TOPIC_ALIASES) {
    if (group.aliases.some((alias) => text.includes(compact(alias)))) {
      group.topics.forEach((topic) => matches.add(topic));
    }
  }

  return [...matches];
}

function policy(
  title: string,
  summary: string,
  tags: CouncilorPolicyTopic[]
) {
  return { title, summary, tags };
}

function shared(
  topic: CouncilorPolicyTopic,
  strength: CouncilorSharedPolicyTopic["strength"],
  rationale: string,
  shenPolicyRef?: string
): CouncilorSharedPolicyTopic {
  return {
    topic,
    strength,
    rationale,
    ...(shenPolicyRef ? { shenPolicyRef } : {}),
    caution: "這是依雙方公開政策整理出的可能市政合作方向，不代表已達成共同提案或人事安排。",
  };
}

function blueprint(input: {
  policyTop3: CouncilorV4Blueprint["policyTop3"];
  policyFocusTags: CouncilorPolicyTopic[];
  sharedPolicyTopics: CouncilorSharedPolicyTopic[];
  relationship: string;
  policies: string;
  collaboration: string;
}): CouncilorV4Blueprint {
  return {
    policyTop3: input.policyTop3,
    policyFocusTags: input.policyFocusTags,
    sharedPolicyTopics: input.sharedPolicyTopics,
    realtimeSummary: {
      relationship: input.relationship,
      policies: input.policies,
      collaboration: input.collaboration,
    },
  };
}

/**
 * The 18 current DPP councilors are the first fully enriched V4 cohort.
 * Current office status remains sourced from the council roster; nomination
 * status is deliberately stored separately by councilors.ts.
 */
export const DPP_COUNCILOR_V4_BLUEPRINTS: Record<
  string,
  CouncilorV4Blueprint
> = {
  林延鳳: blueprint({
    policyTop3: [
      policy("老屋電梯與無障礙改善", "推動老屋加裝電梯及高齡、身障友善的社區改善。", ["老屋", "電梯無障礙", "長者", "身障"]),
      policy("長者與社區照顧", "關注長者生活支持、社福與在地照顧網絡。", ["長者", "長照"]),
      policy("士林北投地方建設", "從地方服務出發處理公共設施與生活環境。", ["地方建設"]),
    ],
    policyFocusTags: ["電梯無障礙", "老屋", "長者", "長照", "地方建設"],
    sharedPolicyTopics: [
      shared("電梯無障礙", "strong", "與老宅延壽及高齡友善方向直接相接。", "HEART/Habitat"),
      shared("長者", "moderate", "可從在地照顧與社區支持銜接。", "HEART/Accompany"),
    ],
    relationship: "我跟林延鳳一起參與過士林北投的社子與北士科公開地方行程。",
    policies: "她的重點包括老屋電梯、長者照顧與士林北投地方建設。",
    collaboration: "老宅延壽、電梯無障礙與社區照顧是很明確的政策交集。",
  }),
  鍾佩玲: blueprint({
    policyTop3: [
      policy("育兒與公共托育", "關注家庭育兒支持、托育量能與親子服務。", ["育兒", "公托", "母嬰"]),
      policy("教育環境", "從幼教與地方服務經驗改善校園及家庭支持。", ["教育", "育兒"]),
      policy("北士科周邊發展", "關注北士科建設與地方生活需求的平衡。", ["北士科", "地方建設"]),
    ],
    policyFocusTags: ["育兒", "公托", "母嬰", "教育", "北士科", "地方建設"],
    sharedPolicyTopics: [shared("育兒", "strong", "可銜接婚育家庭與公共托育支持。", "HEART/Accompany"), shared("北士科", "moderate", "可在產業發展與地方需求間協調。")],
    relationship: "我跟鍾佩玲一起跑過社子地方行程，也共同參與北士科議題會勘。",
    policies: "她關注育兒、公托、教育與北士科周邊發展。",
    collaboration: "育兒支持與北士科地方需求是可往下對接的方向。",
  }),
  陳賢蔚: blueprint({
    policyTop3: [
      policy("北士科與地方建設", "關注北士科公共設施、能源與周邊發展。", ["北士科", "地方建設"]),
      policy("運動城市", "推動運動參與和公共運動設施。", ["運動"]),
      policy("身障與無障礙", "改善身障者使用公共空間與運動資源的條件。", ["身障", "電梯無障礙"]),
    ],
    policyFocusTags: ["北士科", "地方建設", "運動", "身障", "電梯無障礙"],
    sharedPolicyTopics: [shared("運動", "strong", "可與運動平權及社區運動設施政策銜接。"), shared("身障", "strong", "公共設施無障礙是共同可推進的方向。")],
    relationship: "我跟陳賢蔚一起跑過社子行程，也共同參與北士科公開會勘。",
    policies: "他關注北士科、運動、身障權益與地方建設。",
    collaboration: "運動平權、無障礙與北士科公共設施可形成合作議題。",
  }),
  陳慈慧: blueprint({
    policyTop3: [
      policy("社子島發展", "關注社子島居民權益、補償與地方發展。", ["社子島", "地方建設"]),
      policy("社區運動", "從棒球及社區經驗推動運動參與。", ["運動"]),
      policy("在地生活建設", "改善士林北投地方公共服務與生活環境。", ["地方建設"]),
    ],
    policyFocusTags: ["社子島", "運動", "地方建設"],
    sharedPolicyTopics: [shared("社子島", "strong", "可就居民權益與長期發展方案協調。", "HEART/Habitat"), shared("運動", "moderate", "可銜接社區運動與公共空間政策。")],
    relationship: "我跟陳慈慧一起跑過社子市場與社子棒球場的公開地方行程。",
    policies: "她的重點是社子島、社區運動與地方建設。",
    collaboration: "社子島居民權益、運動空間和地方建設是可對接的方向。",
  }),
  林世宗: blueprint({
    policyTop3: [
      policy("社子島與地方發展", "關注社子島居民需求及地方發展方案。", ["社子島", "地方建設"]),
      policy("市場商圈", "改善傳統市場環境與地方經濟。", ["市場商圈"]),
      policy("社區公共建設", "持續處理士林北投的基礎生活建設。", ["地方建設"]),
    ],
    policyFocusTags: ["社子島", "市場商圈", "地方建設"],
    sharedPolicyTopics: [shared("社子島", "strong", "可就居民補償與城市空間政策協調。"), shared("市場商圈", "moderate", "可從市場更新與地方經濟著手。")],
    relationship: "我跟林世宗一起跑過社子市場與社子棒球場的公開地方行程。",
    policies: "他長期關注社子島、市場與士林北投地方建設。",
    collaboration: "社子島、傳統市場和地方公共建設是可協調的市政方向。",
  }),
  何孟樺: blueprint({
    policyTop3: [
      policy("內湖交通", "改善內湖通勤、公共運輸與道路系統。", ["內湖交通", "交通", "捷運"]),
      policy("青年城市", "擴大青年參與、居住與發展機會。", ["青年", "住宅", "社宅"]),
      policy("城市防災", "強化極端天候下的防災與韌性治理。", ["防災", "環境"]),
    ],
    policyFocusTags: ["內湖交通", "交通", "捷運", "青年", "住宅", "社宅", "防災"],
    sharedPolicyTopics: [shared("內湖交通", "strong", "與替市民節省通勤時間的方向一致。", "HEART/Time"), shared("青年", "strong", "可銜接青年住宅與城市機會。", "HEART/Empower")],
    relationship: "我跟何孟樺一起跑過內湖碧山巖與西湖市場等公開地方行程。",
    policies: "她關注內湖交通、青年機會與城市防災。",
    collaboration: "內湖交通、青年居住和城市韌性是明確交集。",
  }),
  王孝維: blueprint({
    policyTop3: [
      policy("內湖交通改善", "推進內湖南港道路、公共運輸與通勤改善。", ["內湖交通", "交通", "捷運"]),
      policy("城市安全與防災", "關注防災、食安與地方治理執行。", ["防災", "地方建設"]),
      policy("地方公共建設", "處理內湖南港公共設施與生活需求。", ["地方建設"]),
    ],
    policyFocusTags: ["內湖交通", "交通", "捷運", "防災", "地方建設"],
    sharedPolicyTopics: [shared("內湖交通", "strong", "可共同推進通勤時間與運輸效率改善。", "HEART/Time"), shared("防災", "moderate", "可銜接城市韌性治理。", "HEART/Resilience")],
    relationship: "我跟王孝維一起跑過內湖碧山巖與西湖市場等公開地方行程。",
    policies: "他關注內湖交通、防災與地方公共建設。",
    collaboration: "交通效率和防災韌性是最容易接起來的市政議題。",
  }),
  李建昌: blueprint({
    policyTop3: [
      policy("兒少與育兒支持", "關注兒少權益、托育與家庭支持。", ["育兒", "公托", "教育"]),
      policy("內湖交通", "改善內湖通勤與公共運輸問題。", ["內湖交通", "交通"]),
      policy("社會照顧", "強化兒少、家庭與弱勢支持。", ["長照", "長者"]),
    ],
    policyFocusTags: ["育兒", "公托", "教育", "內湖交通", "交通", "長照"],
    sharedPolicyTopics: [shared("育兒", "strong", "可銜接家庭支持與公共托育。", "HEART/Accompany"), shared("內湖交通", "strong", "可共同處理通勤效率。", "HEART/Time")],
    relationship: "我跟李建昌一起跑過內湖碧山巖與西湖市場等公開地方行程。",
    policies: "他長期關注兒少、育兒、內湖交通與社會照顧。",
    collaboration: "家庭支持與內湖交通是具體可合作的領域。",
  }),
  洪健益: blueprint({
    policyTop3: [
      policy("捷運與接駁", "關注信義線東延及捷運站到地方商圈的交通銜接。", ["捷運", "交通"]),
      policy("都市更新", "推動老舊社區與都市空間改善。", ["都更", "老屋", "住宅"]),
      policy("市場夜市與商圈", "改善市場夜市環境及商圈人流。", ["市場商圈", "地方建設"]),
    ],
    policyFocusTags: ["捷運", "交通", "都更", "老屋", "住宅", "市場商圈", "地方建設"],
    sharedPolicyTopics: [shared("捷運", "strong", "可銜接捷運通車後的最後一哩與商圈導流。", "HEART/Time"), shared("都更", "moderate", "可從老宅延壽與社區更新協調。", "HEART/Habitat")],
    relationship: "我跟洪健益一起會勘信義線東延，也走訪松山奉天宮與中坡福德市場。",
    policies: "他關注捷運、都更、市場夜市與地方社福。",
    collaboration: "捷運接駁、商圈人流與老舊社區更新都能往下合作。",
  }),
  張文潔: blueprint({
    policyTop3: [
      policy("捷運與地方交通", "改善信義線東延及周邊通勤動線。", ["捷運", "交通"]),
      policy("青年與居住", "關注青年參與、居住與城市機會。", ["青年", "住宅", "社宅"]),
      policy("高齡與商圈", "兼顧高齡服務和在地商圈發展。", ["長者", "市場商圈"]),
    ],
    policyFocusTags: ["捷運", "交通", "青年", "住宅", "社宅", "長者", "市場商圈"],
    sharedPolicyTopics: [shared("捷運", "strong", "可銜接交通省時與站點周邊設計。", "HEART/Time"), shared("青年", "moderate", "可從青年居住與城市機會合作。", "HEART/Empower")],
    relationship: "我跟張文潔一起會勘信義線東延，也走訪松山奉天宮與中坡福德市場。",
    policies: "她關注捷運、青年居住、高齡服務與商圈。",
    collaboration: "交通接駁、青年居住和地方商圈是共同可推進的方向。",
  }),
  許淑華: blueprint({
    policyTop3: [
      policy("老屋電梯與都市更新", "改善老屋加裝電梯、無障礙與社區更新條件。", ["老屋", "電梯無障礙", "都更", "住宅"]),
      policy("交通與捷運", "關注地方交通及捷運建設效益。", ["交通", "捷運"]),
      policy("文化與商圈", "結合文化治理與地方商圈發展。", ["文化", "市場商圈"]),
    ],
    policyFocusTags: ["老屋", "電梯無障礙", "都更", "住宅", "交通", "捷運", "文化", "市場商圈"],
    sharedPolicyTopics: [shared("電梯無障礙", "strong", "與老宅延壽及高齡友善政策直接相接。", "HEART/Habitat"), shared("交通", "strong", "可從捷運接駁與地方動線推進。", "HEART/Time")],
    relationship: "我跟許淑華一起會勘信義線東延，也走訪松山奉天宮與中坡福德市場。",
    policies: "她關注老屋電梯、都更、交通、文化與商圈。",
    collaboration: "老宅延壽、電梯無障礙及交通改善是很明確的政策交集。",
  }),
  林亮君: blueprint({
    policyTop3: [
      policy("行人與交通安全", "改善行人空間、道路設計與日常交通安全。", ["行人安全", "交通"]),
      policy("青年居住", "關注青年租屋、住宅與社宅支持。", ["青年", "住宅", "社宅"]),
      policy("托育與城市連結", "推進托育、長者友善及城市交流。", ["育兒", "公托", "長者", "國際城市"]),
    ],
    policyFocusTags: ["行人安全", "交通", "青年", "住宅", "社宅", "育兒", "公托", "長者", "國際城市", "市場商圈"],
    sharedPolicyTopics: [shared("行人安全", "strong", "可從街道安全與公共空間設計合作。", "HEART/Time"), shared("青年", "strong", "可銜接青年居住與城市機會。", "HEART/Empower")],
    relationship: "我跟林亮君一起跑過大龍市場、榮星花園等中山大同公開地方行程。",
    policies: "她長期關注行人交通安全、青年居住、托育、長者與城市外交。",
    collaboration: "交通安全、青年居住與地方公共空間，是我們很容易接起來的市政議題。",
  }),
  顏若芳: blueprint({
    policyTop3: [
      policy("母嬰與育兒支持", "強化母嬰照顧、育兒支持與公共托育。", ["母嬰", "育兒", "公托"]),
      policy("智慧交通", "以數位與交通治理改善通勤和道路使用體驗。", ["交通", "AI數位"]),
      policy("河岸文化與國際城市", "串連河岸、文化與城市國際交流。", ["河岸", "文化", "國際城市"]),
    ],
    policyFocusTags: ["母嬰", "育兒", "公托", "交通", "AI數位", "河岸", "文化", "國際城市", "市場商圈"],
    sharedPolicyTopics: [shared("育兒", "strong", "可銜接婚育家庭與公共托育政策。", "HEART/Accompany"), shared("交通", "strong", "可從智慧交通與市民省時推進。", "HEART/Time"), shared("河岸", "moderate", "可連結兩河流域和公共空間。", "HEART/Habitat")],
    relationship: "我跟顏若芳是台北隊公開合作夥伴，也一起跑過中山大同地方行程。",
    policies: "她比較明確的政策主軸是母嬰育兒、智慧交通、河岸文化與國際城市。",
    collaboration: "我們在育兒、交通和地方公共空間上有政策交集，進市府後可以從這些地方需求往下對接。",
  }),
  陳怡君: blueprint({
    policyTop3: [
      policy("市場商圈", "關注中山大同市場環境與地方商圈。", ["市場商圈", "地方建設"]),
      policy("長者與社福", "推進長者生活支持與在地社福。", ["長者", "長照"]),
      policy("地方公共建設", "處理中山大同生活環境與公共設施需求。", ["地方建設"]),
    ],
    policyFocusTags: ["市場商圈", "地方建設", "長者", "長照"],
    sharedPolicyTopics: [shared("市場商圈", "moderate", "可從市場更新與地方經濟改善協調。"), shared("長者", "moderate", "可銜接長照與家庭支持。", "HEART/Accompany")],
    relationship: "公開紀錄顯示陳怡君曾出席我在榮星花園的地方行程；這和她的現任議員身分、2026 黨內提名資格是三件不同的事。",
    policies: "她關注市場商圈、長者社福與中山大同地方建設。",
    collaboration: "市場環境與長者照顧可形成議題協調，但不能把公開同場說成已談好的合作。",
  }),
  洪婉臻: blueprint({
    policyTop3: [
      policy("萬華市場與地方經濟", "改善傳統市場環境及在地經濟。", ["市場商圈", "地方建設"]),
      policy("都市更新", "關注萬華老舊社區與居住環境更新。", ["都更", "老屋", "住宅"]),
      policy("社福與地方服務", "強化地方服務及弱勢支持。", ["長者", "地方建設"]),
    ],
    policyFocusTags: ["市場商圈", "地方建設", "都更", "老屋", "住宅", "長者"],
    sharedPolicyTopics: [shared("市場商圈", "strong", "可從市場更新與街區活化合作。"), shared("都更", "moderate", "可銜接老宅延壽和社區更新。", "HEART/Habitat")],
    relationship: "我跟洪婉臻一起走訪過萬華三水街市場與直興市場。",
    policies: "她關注萬華市場、都更、社福與地方服務。",
    collaboration: "市場更新、街區活化和老舊社區改善是具體交集。",
  }),
  劉耀仁: blueprint({
    policyTop3: [
      policy("都市更新與老屋", "推動萬華老舊社區更新及居住改善。", ["都更", "老屋", "住宅"]),
      policy("社宅與托育", "關注社會住宅、托育及家庭支持。", ["社宅", "公托", "育兒"]),
      policy("市場與觀光", "改善市場商圈並串連地方觀光。", ["市場商圈", "文化"]),
    ],
    policyFocusTags: ["都更", "老屋", "住宅", "社宅", "公托", "育兒", "市場商圈", "文化"],
    sharedPolicyTopics: [shared("都更", "strong", "可銜接老宅延壽與社區更新。", "HEART/Habitat"), shared("育兒", "strong", "可連結婚育住宅與托育支持。", "HEART/Accompany")],
    relationship: "我跟劉耀仁一起走訪過萬華三水街市場與直興市場。",
    policies: "他長期關注都更、社宅、托育與市場觀光。",
    collaboration: "老宅更新、婚育住宅及市場活化是可合作的市政方向。",
  }),
  王閔生: blueprint({
    policyTop3: [
      policy("文山交通", "改善文山公共運輸、道路與通勤動線。", ["交通", "捷運"]),
      policy("育兒與家庭支持", "推進托育、家庭與社福支持。", ["育兒", "公托"]),
      policy("社區照顧", "強化長照及地方公共服務。", ["長照", "長者", "地方建設"]),
    ],
    policyFocusTags: ["交通", "捷運", "育兒", "公托", "長照", "長者", "地方建設"],
    sharedPolicyTopics: [shared("交通", "strong", "可從文山通勤與公共運輸效率合作。", "HEART/Time"), shared("育兒", "strong", "可銜接家庭支持。", "HEART/Accompany")],
    relationship: "我跟王閔生一起走訪過景美集應廟與景美市場。",
    policies: "他關注文山交通、育兒、社福與地方建設。",
    collaboration: "交通、家庭支持和社區照顧是容易接起來的方向。",
  }),
  簡舒培: blueprint({
    policyTop3: [
      policy("交通改善", "改善大安文山公共運輸與道路安全。", ["交通", "捷運", "行人安全"]),
      policy("育兒與長照", "強化家庭育兒與長照支持。", ["育兒", "公托", "長照", "長者"]),
      policy("動物福利", "推進動物保護與城市友善環境。", ["動保", "環境"]),
    ],
    policyFocusTags: ["交通", "捷運", "行人安全", "育兒", "公托", "長照", "長者", "動保", "環境"],
    sharedPolicyTopics: [shared("交通", "strong", "可共同改善通勤與道路安全。", "HEART/Time"), shared("長照", "strong", "可銜接家庭照顧與喘息支持。", "HEART/Accompany")],
    relationship: "我跟簡舒培一起走訪過景美集應廟與景美市場。",
    policies: "她關注交通、育兒、長照與動物福利。",
    collaboration: "交通安全、家庭照顧與動物友善是具體可協作的議題。",
  }),
};

export function fallbackCouncilorTopics(
  legacyTags: string[]
): CouncilorPolicyTopic[] {
  const normalized = normalizeCouncilorTopic(legacyTags.join(" "));
  return normalized.length ? normalized : ["地方建設"];
}

export function fallbackPolicyTop3(
  legacyTags: string[],
  sourceUrl: string,
  verifiedAt: string
): CouncilorPolicyItem[] {
  const topics = fallbackCouncilorTopics(legacyTags).slice(0, 3);

  return topics.map((topic) => ({
    title: topic,
    summary: `公開資料顯示其市政關注包含${topic}。`,
    tags: [topic],
    sourceUrl,
    verifiedAt,
    status: "current",
  }));
}
