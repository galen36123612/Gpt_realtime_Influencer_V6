// 臺北市第14屆現任市議員 Local KB — Realtime Enriched V4
// Enriched: profile / policyTop3 / topic indexes / public relationship with 沈伯洋
// Roster verified: 2026-09-03; V4 schema/router: 2026-09-11
//
// IMPORTANT:
// 1. 「與沈伯洋的關係」只把可查證公開互動當作 confirmed。
// 2. possibleCityHallCollaborationAreas 是依公開背景與議題推估，不是既有合作協議。
// 3. 現任名單、黨籍與聯絡方式仍屬動態資料；若使用者問「最新」，應再查官方來源。

import {
  DPP_COUNCILOR_V4_BLUEPRINTS,
  fallbackCouncilorTopics,
  fallbackPolicyTop3,
  normalizeCouncilorTopic,
} from "./councilorV4.ts";

export { normalizeCouncilorTopic } from "./councilorV4.ts";

export type TaipeiCouncilorStatus = "current" | "uncertain" | "former";

export interface TaipeiCouncilorBase {
  id: string;
  constituency: number;
  constituencyName: string;
  districts: string[];
  name: string;
  party: string;
  email?: string;
  councilPhone?: string;
  councilOfficeAddress?: string;
  sourceUrl: string;
  verifiedAt: string;
  status: TaipeiCouncilorStatus;
}

/**
 * 目前現任名單以臺北市議會「現任議員」總表核對；
 * 聯絡方式以臺北市議會個人頁為主，少數以內政部地方公職人員資訊專區補足。
 * verifiedAt 代表本檔最後人工核對日期，不代表原始官方頁面發布日期。
 */
const TAIPEI_COUNCILORS_BASE: TaipeiCouncilorBase[] = [
  {
    id: "d1-01",
    constituency: 1,
    constituencyName: "第一選區（北投區、士林區）",
    districts: ["北投區", "士林區"],
    name: "黃瀞瑩",
    party: "台灣民眾黨",
    email: "tcc11103@tcc.gov.tw",
    councilPhone: "02-2729-7708#6025、6125",
    councilOfficeAddress: "台北市仁愛路4段507號625室",
    sourceUrl: "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2547",
    verifiedAt: "2026-09-03",
    status: "current",
  },
  {
    id: "d1-02",
    constituency: 1,
    constituencyName: "第一選區（北投區、士林區）",
    districts: ["北投區", "士林區"],
    name: "林延鳳",
    party: "民主進步黨",
    councilPhone: "02-2729-7708#6008",
    councilOfficeAddress: "台北市仁愛路4段507號608室",
    sourceUrl: "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2548",
    verifiedAt: "2026-09-03",
    status: "current",
  },
  {
    id: "d1-03",
    constituency: 1,
    constituencyName: "第一選區（北投區、士林區）",
    districts: ["北投區", "士林區"],
    name: "汪志冰",
    party: "中國國民黨",
    email: "tcc9105@tcc.gov.tw",
    councilPhone: "02-2723-8161；02-2729-7708#5012、5112",
    councilOfficeAddress: "台北市仁愛路4段507號511室",
    sourceUrl: "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2549",
    verifiedAt: "2026-09-03",
    status: "current",
  },
  {
    id: "d1-04",
    constituency: 1,
    constituencyName: "第一選區（北投區、士林區）",
    districts: ["北投區", "士林區"],
    name: "鍾佩玲",
    party: "民主進步黨",
    email: "tcc10702@tcc.gov.tw",
    councilPhone: "02-2729-7708#6027、6127",
    councilOfficeAddress: "台北市仁愛路4段507號627室",
    sourceUrl: "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2550",
    verifiedAt: "2026-09-03",
    status: "current",
  },
  {
    id: "d1-05",
    constituency: 1,
    constituencyName: "第一選區（北投區、士林區）",
    districts: ["北投區", "士林區"],
    name: "侯漢廷",
    party: "新黨",
    councilPhone: "02-2729-7708#6005",
    councilOfficeAddress: "台北市仁愛路4段507號605室",
    sourceUrl: "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2552",
    verifiedAt: "2026-09-03",
    status: "current",
  },
  {
    id: "d1-06",
    constituency: 1,
    constituencyName: "第一選區（北投區、士林區）",
    districts: ["北投區", "士林區"],
    name: "林杏兒",
    party: "中國國民黨",
    email: "tcc11102@tcc.gov.tw",
    councilPhone: "02-2729-7708#6010、6110",
    councilOfficeAddress: "台北市仁愛路4段507號610室",
    sourceUrl: "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2554",
    verifiedAt: "2026-09-03",
    status: "current",
  },
  {
    id: "d1-07",
    constituency: 1,
    constituencyName: "第一選區（北投區、士林區）",
    districts: ["北投區", "士林區"],
    name: "陳賢蔚",
    party: "民主進步黨",
    email: "tcc10720@tcc.gov.tw",
    councilPhone: "02-2729-7708#7037、7137",
    councilOfficeAddress: "台北市仁愛路4段507號737室",
    sourceUrl: "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2555",
    verifiedAt: "2026-09-03",
    status: "current",
  },
  {
    id: "d1-08",
    constituency: 1,
    constituencyName: "第一選區（北投區、士林區）",
    districts: ["北投區", "士林區"],
    name: "張斯綱",
    party: "中國國民黨",
    email: "tcc10701@tcc.gov.tw",
    councilPhone: "02-2729-7708#6011、6111；02-8866-5789（服務處）",
    councilOfficeAddress: "台北市仁愛路4段507號611室",
    sourceUrl: "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2556",
    verifiedAt: "2026-09-03",
    status: "current",
  },
  {
    id: "d1-09",
    constituency: 1,
    constituencyName: "第一選區（北投區、士林區）",
    districts: ["北投區", "士林區"],
    name: "陳慈慧",
    party: "民主進步黨",
    email: "tcc10301@tcc.gov.tw",
    councilPhone: "02-2729-7708#7041、7141；02-2813-6801（士林服務處）；02-2898-6899（北投服務處）",
    councilOfficeAddress: "台北市仁愛路4段507號741室",
    sourceUrl: "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2557",
    verifiedAt: "2026-09-03",
    status: "current",
  },
  {
    id: "d1-10",
    constituency: 1,
    constituencyName: "第一選區（北投區、士林區）",
    districts: ["北投區", "士林區"],
    name: "林世宗",
    party: "民主進步黨",
    email: "tcc9903@tcc.gov.tw",
    councilPhone: "02-8786-3259；02-2729-7708#5003、5103",
    councilOfficeAddress: "台北市仁愛路4段507號503室",
    sourceUrl: "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2558",
    verifiedAt: "2026-09-03",
    status: "current",
  },
  {
    id: "d1-11",
    constituency: 1,
    constituencyName: "第一選區（北投區、士林區）",
    districts: ["北投區", "士林區"],
    name: "陳重文",
    party: "中國國民黨",
    email: "tcc10304@tcc.gov.tw",
    councilPhone: "02-8780-6438；02-2729-7708#7032、7132",
    councilOfficeAddress: "台北市仁愛路4段507號732室",
    sourceUrl: "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2574",
    verifiedAt: "2026-09-03",
    status: "current",
  },
  {
    id: "d2-01",
    constituency: 2,
    constituencyName: "第二選區（內湖區、南港區）",
    districts: ["內湖區", "南港區"],
    name: "陳宥丞",
    party: "台灣民眾黨",
    email: "tcc11104@tcc.gov.tw",
    councilPhone: "02-2729-7708#7052、7152",
    councilOfficeAddress: "台北市仁愛路4段507號752室",
    sourceUrl: "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2562",
    verifiedAt: "2026-09-03",
    status: "current",
  },
  {
    id: "d2-02",
    constituency: 2,
    constituencyName: "第二選區（內湖區、南港區）",
    districts: ["內湖區", "南港區"],
    name: "游淑慧",
    party: "中國國民黨",
    email: "tcc10707@tcc.gov.tw",
    councilPhone: "02-2729-7708#6012、6112",
    councilOfficeAddress: "台北市仁愛路4段507號612室",
    sourceUrl: "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2563",
    verifiedAt: "2026-09-03",
    status: "current",
  },
  {
    id: "d2-03",
    constituency: 2,
    constituencyName: "第二選區（內湖區、南港區）",
    districts: ["內湖區", "南港區"],
    name: "李明賢",
    party: "中國國民黨",
    email: "tcc10706@tcc.gov.tw",
    councilPhone: "02-2729-7708#6015、6115",
    councilOfficeAddress: "台北市仁愛路4段507號615室",
    sourceUrl: "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2565",
    verifiedAt: "2026-09-03",
    status: "current",
  },
  {
    id: "d2-04",
    constituency: 2,
    constituencyName: "第二選區（內湖區、南港區）",
    districts: ["內湖區", "南港區"],
    name: "何孟樺",
    party: "民主進步黨",
    email: "tcc11105@tcc.gov.tw",
    councilPhone: "02-2729-7708#6019、6119；02-2630-5302（服務處）",
    councilOfficeAddress: "台北市仁愛路4段507號619室",
    sourceUrl: "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2566",
    verifiedAt: "2026-09-03",
    status: "current",
  },
  {
    id: "d2-05",
    constituency: 2,
    constituencyName: "第二選區（內湖區、南港區）",
    districts: ["內湖區", "南港區"],
    name: "闕枚莎",
    party: "中國國民黨",
    email: "ca95153@tcc.gov.tw",
    councilPhone: "02-8780-6441；02-2729-7708#5007、5107",
    councilOfficeAddress: "台北市仁愛路4段507號507室",
    sourceUrl: "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2567",
    verifiedAt: "2026-09-03",
    status: "current",
  },
  {
    id: "d2-06",
    constituency: 2,
    constituencyName: "第二選區（內湖區、南港區）",
    districts: ["內湖區", "南港區"],
    name: "王孝維",
    party: "民主進步黨",
    email: "tcc9505@tcc.gov.tw",
    councilPhone: "02-2729-7708#5002、5102；02-8792-8786（服務處）",
    councilOfficeAddress: "台北市仁愛路4段507號502室",
    sourceUrl: "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2568",
    verifiedAt: "2026-09-03",
    status: "current",
  },
  {
    id: "d2-07",
    constituency: 2,
    constituencyName: "第二選區（內湖區、南港區）",
    districts: ["內湖區", "南港區"],
    name: "李建昌",
    party: "民主進步黨",
    councilPhone: "02-2729-7708#7033",
    councilOfficeAddress: "台北市仁愛路4段507號733室",
    sourceUrl: "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2569",
    verifiedAt: "2026-09-03",
    status: "current",
  },
  {
    id: "d2-08",
    constituency: 2,
    constituencyName: "第二選區（內湖區、南港區）",
    districts: ["內湖區", "南港區"],
    name: "吳世正",
    party: "中國國民黨",
    email: "tcc8707@tcc.gov.tw",
    councilPhone: "02-2729-7708#6006",
    councilOfficeAddress: "台北市仁愛路4段507號606室",
    sourceUrl: "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2570",
    verifiedAt: "2026-09-03",
    status: "current",
  },
  {
    id: "d3-01",
    constituency: 3,
    constituencyName: "第三選區（松山區、信義區）",
    districts: ["松山區", "信義區"],
    name: "張文潔",
    party: "民主進步黨",
    email: "tcc11106@tcc.gov.tw",
    councilPhone: "02-2729-7708#7058、7158",
    councilOfficeAddress: "台北市仁愛路4段507號758室",
    sourceUrl: "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2575",
    verifiedAt: "2026-09-03",
    status: "current",
  },
  {
    id: "d3-02",
    constituency: 3,
    constituencyName: "第三選區（松山區、信義區）",
    districts: ["松山區", "信義區"],
    name: "許淑華",
    party: "民主進步黨",
    email: "suhua101@gmail.com",
    councilPhone: "02-8780-6452；02-2729-7708#6021、6121",
    councilOfficeAddress: "台北市仁愛路4段507號621室",
    sourceUrl: "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2576",
    verifiedAt: "2026-09-03",
    status: "current",
  },
  {
    id: "d3-03",
    constituency: 3,
    constituencyName: "第三選區（松山區、信義區）",
    districts: ["松山區", "信義區"],
    name: "詹為元",
    party: "中國國民黨",
    email: "tcc11107@tcc.gov.tw",
    councilPhone: "02-2729-7708#7049、7149",
    councilOfficeAddress: "台北市仁愛路4段507號749室",
    sourceUrl: "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2577",
    verifiedAt: "2026-09-03",
    status: "current",
  },
  {
    id: "d3-04",
    constituency: 3,
    constituencyName: "第三選區（松山區、信義區）",
    districts: ["松山區", "信義區"],
    name: "秦慧珠",
    party: "中國國民黨",
    email: "tcc7810@tcc.gov.tw",
    councilPhone: "02-8786-3256；02-2729-7708#7031、7131",
    councilOfficeAddress: "台北市仁愛路4段507號731室",
    sourceUrl: "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2580",
    verifiedAt: "2026-09-03",
    status: "current",
  },
  {
    id: "d3-05",
    constituency: 3,
    constituencyName: "第三選區（松山區、信義區）",
    districts: ["松山區", "信義區"],
    name: "戴錫欽",
    party: "中國國民黨",
    email: "tcc9109@tcc.gov.tw",
    councilPhone: "02-2729-7708#8202、8203",
    councilOfficeAddress: "台北市仁愛路4段507號議長室",
    sourceUrl: "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2581",
    verifiedAt: "2026-09-03",
    status: "current",
  },
  {
    id: "d3-06",
    constituency: 3,
    constituencyName: "第三選區（松山區、信義區）",
    districts: ["松山區", "信義區"],
    name: "洪健益",
    party: "民主進步黨",
    email: "tcc9509@tcc.gov.tw",
    councilPhone: "02-2729-7708#5006、5106；02-8787-5091（服務處）",
    councilOfficeAddress: "台北市仁愛路4段507號506室",
    sourceUrl: "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2582",
    verifiedAt: "2026-09-03",
    status: "current",
  },
  {
    id: "d4-01",
    constituency: 4,
    constituencyName: "第四選區（中山區、大同區）",
    districts: ["中山區", "大同區"],
    name: "陳炳甫",
    party: "中國國民黨",
    email: "tcc10308@tcc.gov.tw",
    councilPhone: "02-8780-6436；02-2729-7708#5005、5105",
    councilOfficeAddress: "台北市仁愛路4段507號505室",
    sourceUrl: "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2584",
    verifiedAt: "2026-09-03",
    status: "current",
  },
  {
    id: "d4-02",
    constituency: 4,
    constituencyName: "第四選區（中山區、大同區）",
    districts: ["中山區", "大同區"],
    name: "顏若芳",
    party: "民主進步黨",
    email: "tcc10307@tcc.gov.tw",
    councilPhone: "02-2729-7708#7043、7143；02-2595-6680（中山）；02-2591-6800（大同）；02-2532-8955（大直）",
    councilOfficeAddress: "台北市仁愛路4段507號743室",
    sourceUrl: "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2585",
    verifiedAt: "2026-09-03",
    status: "current",
  },
  {
    id: "d4-03",
    constituency: 4,
    constituencyName: "第四選區（中山區、大同區）",
    districts: ["中山區", "大同區"],
    name: "柳采葳",
    party: "中國國民黨",
    email: "tcc11108@tcc.gov.tw",
    councilPhone: "02-2729-7708#6018、6118",
    councilOfficeAddress: "台北市仁愛路4段507號618室",
    sourceUrl: "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2586",
    verifiedAt: "2026-09-03",
    status: "current",
  },
  {
    id: "d4-04",
    constituency: 4,
    constituencyName: "第四選區（中山區、大同區）",
    districts: ["中山區", "大同區"],
    name: "葉林傳",
    party: "中國國民黨",
    email: "tcc9907@tcc.gov.tw",
    councilPhone: "02-2729-7708#8103",
    councilOfficeAddress: "台北市仁愛路4段507號10樓副議長室",
    sourceUrl: "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2587",
    verifiedAt: "2026-09-03",
    status: "current",
  },
  {
    id: "d4-05",
    constituency: 4,
    constituencyName: "第四選區（中山區、大同區）",
    districts: ["中山區", "大同區"],
    name: "林珍羽",
    party: "台灣民眾黨",
    email: "tcc11109@tcc.gov.tw",
    councilPhone: "02-2729-7708#7035、7135",
    councilOfficeAddress: "台北市仁愛路4段507號735室",
    sourceUrl: "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2588",
    verifiedAt: "2026-09-03",
    status: "current",
  },
  {
    id: "d4-06",
    constituency: 4,
    constituencyName: "第四選區（中山區、大同區）",
    districts: ["中山區", "大同區"],
    name: "陳怡君",
    party: "民主進步黨",
    email: "tcc10711@tcc.gov.tw",
    councilPhone: "02-2729-7708#6028、6128；02-2509-1939（中山服務處）；02-2597-1939（大同服務處）",
    councilOfficeAddress: "台北市仁愛路4段507號628室",
    sourceUrl: "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2590",
    verifiedAt: "2026-09-03",
    status: "current",
  },
  {
    id: "d4-07",
    constituency: 4,
    constituencyName: "第四選區（中山區、大同區）",
    districts: ["中山區", "大同區"],
    name: "林亮君",
    party: "民主進步黨",
    email: "ok@sabrinalim.tw",
    councilPhone: "02-2729-7708#7047、7147；02-2557-0658（服務處）",
    councilOfficeAddress: "台北市仁愛路4段507號747室",
    sourceUrl: "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2591",
    verifiedAt: "2026-09-03",
    status: "current",
  },
  {
    id: "d5-01",
    constituency: 5,
    constituencyName: "第五選區（中正區、萬華區）",
    districts: ["中正區", "萬華區"],
    name: "應曉薇",
    party: "中國國民黨",
    email: "tcc9909@tcc.gov.tw",
    councilPhone: "02-2729-7708#6003；02-2305-0898（服務處）",
    councilOfficeAddress: "台北市仁愛路4段507號603室",
    sourceUrl: "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2592",
    verifiedAt: "2026-09-03",
    status: "current",
  },
  {
    id: "d5-02",
    constituency: 5,
    constituencyName: "第五選區（中正區、萬華區）",
    districts: ["中正區", "萬華區"],
    name: "郭昭巖",
    party: "中國國民黨",
    email: "tcc9908@tcc.gov.tw",
    councilPhone: "02-8780-6432；02-2729-7708#7042、7142",
    councilOfficeAddress: "台北市仁愛路4段507號742室",
    sourceUrl: "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2593",
    verifiedAt: "2026-09-03",
    status: "current",
  },
  {
    id: "d5-03",
    constituency: 5,
    constituencyName: "第五選區（中正區、萬華區）",
    districts: ["中正區", "萬華區"],
    name: "洪婉臻",
    party: "民主進步黨",
    email: "tcc11110@tcc.gov.tw",
    councilPhone: "02-2729-7708#7050",
    councilOfficeAddress: "台北市仁愛路4段507號750室",
    sourceUrl: "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2595",
    verifiedAt: "2026-09-03",
    status: "current",
  },
  {
    id: "d5-04",
    constituency: 5,
    constituencyName: "第五選區（中正區、萬華區）",
    districts: ["中正區", "萬華區"],
    name: "吳志剛",
    party: "中國國民黨",
    email: "tcc9513@tcc.gov.tw",
    councilPhone: "02-8780-6429；02-2729-7708#5009、5109；02-2305-9696（服務處）",
    councilOfficeAddress: "台北市仁愛路4段507號509室",
    sourceUrl: "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2596",
    verifiedAt: "2026-09-03",
    status: "current",
  },
  {
    id: "d5-05",
    constituency: 5,
    constituencyName: "第五選區（中正區、萬華區）",
    districts: ["中正區", "萬華區"],
    name: "徐立信",
    party: "無黨籍",
    email: "tcc10712@tcc.gov.tw",
    councilPhone: "0921-602-186",
    councilOfficeAddress: "台北市仁愛路4段507號623室",
    sourceUrl: "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2597",
    verifiedAt: "2026-09-03",
    status: "current",
  },
  {
    id: "d5-06",
    constituency: 5,
    constituencyName: "第五選區（中正區、萬華區）",
    districts: ["中正區", "萬華區"],
    name: "鍾小平",
    party: "中國國民黨",
    email: "tcc8719@tcc.gov.tw",
    councilPhone: "02-8786-3283；02-2729-7708#6009、6109",
    councilOfficeAddress: "台北市仁愛路4段507號609室",
    sourceUrl: "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2598",
    verifiedAt: "2026-09-03",
    status: "current",
  },
  {
    id: "d5-07",
    constituency: 5,
    constituencyName: "第五選區（中正區、萬華區）",
    districts: ["中正區", "萬華區"],
    name: "劉耀仁",
    party: "民主進步黨",
    email: "liu_lovetw@yahoo.com.tw",
    councilPhone: "02-8780-6413；02-2729-7708#6020、6120",
    councilOfficeAddress: "台北市萬華區艋舺大道116號",
    sourceUrl: "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2599",
    verifiedAt: "2026-09-03",
    status: "current",
  },
  {
    id: "d6-01",
    constituency: 6,
    constituencyName: "第六選區（大安區、文山區）",
    districts: ["大安區", "文山區"],
    name: "李柏毅",
    party: "中國國民黨",
    email: "tcc10715@tcc.gov.tw",
    councilPhone: "02-2729-7708#7057、7157",
    councilOfficeAddress: "台北市仁愛路4段507號757室",
    sourceUrl: "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2600",
    verifiedAt: "2026-09-03",
    status: "current",
  },
  {
    id: "d6-02",
    constituency: 6,
    constituencyName: "第六選區（大安區、文山區）",
    districts: ["大安區", "文山區"],
    name: "苗博雅",
    party: "社會民主黨",
    email: "service@voteformiao.tw",
    councilPhone: "02-2729-7708#7046、7146",
    councilOfficeAddress: "台北市仁愛路4段507號746室",
    sourceUrl: "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2602",
    verifiedAt: "2026-09-03",
    status: "current",
  },
  {
    id: "d6-03",
    constituency: 6,
    constituencyName: "第六選區（大安區、文山區）",
    districts: ["大安區", "文山區"],
    name: "曾獻瑩",
    party: "中國國民黨",
    email: "tcc11111@tcc.gov.tw",
    councilPhone: "02-2729-7708#5008",
    councilOfficeAddress: "台北市仁愛路4段507號508室",
    sourceUrl: "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2603",
    verifiedAt: "2026-09-03",
    status: "current",
  },
  {
    id: "d6-04",
    constituency: 6,
    constituencyName: "第六選區（大安區、文山區）",
    districts: ["大安區", "文山區"],
    name: "簡舒培",
    party: "民主進步黨",
    email: "tcc10311@tcc.gov.tw",
    councilPhone: "02-8780-6448；02-2729-7708#5104、5204",
    councilOfficeAddress: "台北市仁愛路4段507號504室",
    sourceUrl: "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2604",
    verifiedAt: "2026-09-03",
    status: "current",
  },
  {
    id: "d6-05",
    constituency: 6,
    constituencyName: "第六選區（大安區、文山區）",
    districts: ["大安區", "文山區"],
    name: "徐弘庭",
    party: "中國國民黨",
    email: "tcc10312@tcc.gov.tw",
    councilPhone: "02-8780-6918；02-2729-7708#5010",
    councilOfficeAddress: "台北市仁愛路4段507號510室",
    sourceUrl: "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2605",
    verifiedAt: "2026-09-03",
    status: "current",
  },
  {
    id: "d6-06",
    constituency: 6,
    constituencyName: "第六選區（大安區、文山區）",
    districts: ["大安區", "文山區"],
    name: "王欣儀",
    party: "中國國民黨",
    email: "tcc9116@tcc.gov.tw",
    councilPhone: "02-2729-7708#6004、6104",
    councilOfficeAddress: "台北市仁愛路4段507號604室",
    sourceUrl: "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2606",
    verifiedAt: "2026-09-03",
    status: "current",
  },
  {
    id: "d6-07",
    constituency: 6,
    constituencyName: "第六選區（大安區、文山區）",
    districts: ["大安區", "文山區"],
    name: "鍾沛君",
    party: "中國國民黨",
    email: "tcc10716@tcc.gov.tw",
    councilPhone: "02-2729-7708#6029、6129",
    councilOfficeAddress: "台北市仁愛路4段507號629室",
    sourceUrl: "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2608",
    verifiedAt: "2026-09-03",
    status: "current",
  },
  {
    id: "d6-08",
    constituency: 6,
    constituencyName: "第六選區（大安區、文山區）",
    districts: ["大安區", "文山區"],
    name: "陳錦祥",
    party: "中國國民黨",
    email: "tcc0741@tcc.gov.tw",
    councilPhone: "02-2709-1288、02-2934-3888；02-2729-7708#7039、7139",
    councilOfficeAddress: "台北市仁愛路4段507號739室",
    sourceUrl: "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2609",
    verifiedAt: "2026-09-03",
    status: "current",
  },
  {
    id: "d6-09",
    constituency: 6,
    constituencyName: "第六選區（大安區、文山區）",
    districts: ["大安區", "文山區"],
    name: "楊植斗",
    party: "中國國民黨",
    email: "tcc11114@tcc.gov.tw",
    councilPhone: "02-2729-7708#6017、6117",
    councilOfficeAddress: "台北市仁愛路4段507號617室",
    sourceUrl: "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2610",
    verifiedAt: "2026-09-03",
    status: "current",
  },
  {
    id: "d6-10",
    constituency: 6,
    constituencyName: "第六選區（大安區、文山區）",
    districts: ["大安區", "文山區"],
    name: "王閔生",
    party: "民主進步黨",
    email: "tcc10310@tcc.gov.tw",
    councilPhone: "02-8780-6451；02-2729-7708#7040、7140",
    councilOfficeAddress: "台北市仁愛路4段507號740室",
    sourceUrl: "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2611",
    verifiedAt: "2026-09-03",
    status: "current",
  },
  {
    id: "d6-11",
    constituency: 6,
    constituencyName: "第六選區（大安區、文山區）",
    districts: ["大安區", "文山區"],
    name: "耿葳",
    party: "中國國民黨",
    email: "tcc10718@tcc.gov.tw",
    councilPhone: "02-2729-7708#7030、7130",
    councilOfficeAddress: "台北市仁愛路4段507號730室",
    sourceUrl: "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2612",
    verifiedAt: "2026-09-03",
    status: "current",
  },
  {
    id: "d6-12",
    constituency: 6,
    constituencyName: "第六選區（大安區、文山區）",
    districts: ["大安區", "文山區"],
    name: "張志豪",
    party: "台灣民眾黨",
    email: "tcc11113@tcc.gov.tw",
    councilPhone: "02-2729-7708#7038、7138",
    councilOfficeAddress: "台北市仁愛路4段507號738室",
    sourceUrl: "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2613",
    verifiedAt: "2026-09-03",
    status: "current",
  },
  {
    id: "d7-01",
    constituency: 7,
    constituencyName: "第七選區（平地原住民）",
    districts: ["平地原住民"],
    name: "李芳儒",
    party: "中國國民黨",
    email: "tcc9913@tcc.gov.tw",
    councilPhone: "02-8780-6431；02-2729-7708#6022、6122",
    councilOfficeAddress: "台北市仁愛路4段507號622室",
    sourceUrl: "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2614",
    verifiedAt: "2026-09-03",
    status: "current",
  },
  {
    id: "d8-01",
    constituency: 8,
    constituencyName: "第八選區（山地原住民）",
    districts: ["山地原住民"],
    name: "李傅中武",
    party: "中國國民黨",
    email: "tcc9914@tcc.gov.tw",
    councilPhone: "02-2729-7708#5001、5101",
    councilOfficeAddress: "台北市仁愛路4段507號501室",
    sourceUrl: "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2615",
    verifiedAt: "2026-09-03",
    status: "current",
  },
];


export type CouncilorRelationshipLevel =
  | "confirmed_campaign_cooperation"
  | "confirmed_public_issue_overlap"
  | "public_policy_opposition"
  | "institutional_only"
  | "no_verified_direct_relationship";

export type CouncilorPolicyTopic =
  | "交通"
  | "捷運"
  | "行人安全"
  | "內湖交通"
  | "北士科"
  | "育兒"
  | "公托"
  | "母嬰"
  | "教育"
  | "青年"
  | "住宅"
  | "社宅"
  | "都更"
  | "老屋"
  | "電梯無障礙"
  | "長照"
  | "長者"
  | "身障"
  | "市場商圈"
  | "文化"
  | "運動"
  | "動保"
  | "河岸"
  | "環境"
  | "社子島"
  | "地方建設"
  | "AI數位"
  | "國際城市"
  | "防災";

export interface CouncilorPolicyItem {
  title: string;
  summary: string;
  tags: CouncilorPolicyTopic[];
  sourceUrl?: string;
  verifiedAt: string;
  status?: "current" | "historical" | "campaign";
}

export type ShenCouncilorEventType =
  | "formal_joint_campaign"
  | "joint_local_visit"
  | "public_policy_alignment"
  | "formal_endorsement"
  | "campaign_team_role"
  | "public_opposition"
  | "institutional_only";

interface LegacyPublicCollaborationEvent {
  date: string;
  description: string;
  sourceUrl: string;
}

export interface CouncilorShenPublicEvent {
  date: string;
  title: string;
  eventType: ShenCouncilorEventType;
  location?: string;
  summary: string;
  /** Backward-compatible text used by the existing answer prompt. */
  description: string;
  mediaEventId?: string;
  sourceUrl?: string;
  verifiedAt: string;
}

export interface CouncilorSharedPolicyTopic {
  topic: CouncilorPolicyTopic;
  strength: "strong" | "moderate" | "possible";
  shenPolicyRef?: string;
  rationale: string;
  evidence?: string[];
  caution?: string;
}

interface LegacyCouncilorShenRelationship {
  level: CouncilorRelationshipLevel;
  summary: string;
  confirmedPublicEvents: LegacyPublicCollaborationEvent[];
  /**
   * 依議員公開背景、選區與政策關注推估的「可能市政合作／議會協商領域」。
   * 不是既有協議，也不能說成雙方已共同推動。
   */
  possibleCityHallCollaborationAreas: string[];
  caution: string;
  verifiedAt: string;
}

export interface CouncilorShenRelationship
  extends Omit<LegacyCouncilorShenRelationship, "confirmedPublicEvents"> {
  confirmedPublicEvents: CouncilorShenPublicEvent[];
  relationshipTypes: ShenCouncilorEventType[];
  sharedPolicyTopics: CouncilorSharedPolicyTopic[];
  realtimeSummary: {
    relationship: string;
    policies: string;
    collaboration: string;
  };
}

export interface CouncilorNominationStatus {
  electionYear: 2026;
  status:
    | "nominated"
    | "primary_qualified"
    | "not_registered"
    | "eligibility_revoked"
    | "not_tracked";
  summary: string;
  sourceUrl?: string;
  verifiedAt: string;
}

interface LegacyCouncilorEnrichment {
  birthDate: string;
  backgroundSummary: string;
  education: string[];
  experience: string[];
  policyFocusTags: string[];
  profileSourceUrl: string;
  relationToShen: LegacyCouncilorShenRelationship;
}

export interface TaipeiCouncilor extends TaipeiCouncilorBase {
  /** ISO YYYY-MM-DD；年齡請動態計算，不要寫死。 */
  birthDate: string;
  backgroundSummary: string;
  education: string[];
  experience: string[];
  policyTop3: CouncilorPolicyItem[];
  policyFocusTags: CouncilorPolicyTopic[];
  profileSourceUrl: string;
  relationToShen: CouncilorShenRelationship;
  partyNomination2026?: CouncilorNominationStatus;
}

export const TAIPEI_COUNCILOR_META = {
  currentRosterSource: "https://www.tcc.gov.tw/cp.aspx?n=13898",
  profileSource: "臺北市議會現任議員個人頁",
  verifiedAt: "2026-09-03",
  count: 53,
  relationMethod:
    "confirmedPublicEvents 只記錄可查證的公開互動；possibleCityHallCollaborationAreas 是依公開背景/政見推估的未來市政協商領域，不能當成已存在合作。",
} as const;

export const COUNCILOR_ENRICHMENT: Record<
  string,
  LegacyCouncilorEnrichment
> = {
  "黃瀞瑩": {
    "birthDate": "1992-06-10",
    "backgroundSummary": "政治傳播背景，曾任臺北市政府副發言人，後投入民眾黨地方政治。",
    "education": [
      "倫敦大學金匠學院政治傳播碩士",
      "輔仁大學新聞傳播學系"
    ],
    "experience": [
      "臺北市政府副發言人",
      "台灣民眾黨地方政治工作"
    ],
    "policyFocusTags": [
      "青年",
      "城市溝通",
      "公共參與"
    ],
    "profileSourceUrl": "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2547",
    "relationToShen": {
      "level": "institutional_only",
      "summary": "截至目前查核，沒有找到可確認的沈伯洋競選合作紀錄；若沈任市長，主要關係會是市府與議會的法定監督、預算審議與選區協調。",
      "confirmedPublicEvents": [],
      "possibleCityHallCollaborationAreas": [
        "青年",
        "城市溝通",
        "公共參與"
      ],
      "caution": "可能合作領域是依議員公開背景／政策關注與選區議題推估，不是已達成的合作協議；不得推論私人熟度或人事安排。",
      "verifiedAt": "2026-09-03"
    }
  },
  "林延鳳": {
    "birthDate": "1982-04-17",
    "backgroundSummary": "公共政策與地方服務背景，長期投入士林北投地方政治。",
    "education": [
      "臺灣大學生物產業傳播暨發展研究所碩士"
    ],
    "experience": [
      "莊瑞雄北區服務處執行長",
      "地方服務與議會工作"
    ],
    "policyFocusTags": [
      "士林北投",
      "社福",
      "地方建設"
    ],
    "profileSourceUrl": "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2548",
    "relationToShen": {
      "level": "confirmed_campaign_cooperation",
      "summary": "已有公開聯合競選／地方行程合作；可確認政治合作，但不等於私人好友或已共同決定未來市府職位。",
      "confirmedPublicEvents": [
        {
          "date": "2026-06-07",
          "description": "沈伯洋赴社子市場及社子棒球場，林世宗、陳賢蔚、鍾佩玲、陳慈慧、林延鳳公開陪同；現場談社子島補償與地方發展。",
          "sourceUrl": "https://www.cna.com.tw/news/aloc/202606070045.aspx"
        },
        {
          "date": "2026-05-28",
          "description": "沈伯洋、吳思瑤與林延鳳、陳賢蔚、鍾佩玲、陳慈慧等會勘北士科文林變電所議題。",
          "sourceUrl": "https://newtalk.tw/news/view/2026-05-28/1037994"
        }
      ],
      "possibleCityHallCollaborationAreas": [
        "士林北投",
        "社福",
        "地方建設"
      ],
      "caution": "可能合作領域係依該議員公開關注議題、選區與沈伯洋政策推估；非既有政策協議，也不代表未來一定入閣。",
      "verifiedAt": "2026-09-03"
    }
  },
  "汪志冰": {
    "birthDate": "1957-04-20",
    "backgroundSummary": "資深市議員，具國際商務、公共行政與地方議會經驗。",
    "education": [
      "Eastern Michigan University 碩士",
      "東吳大學德文系"
    ],
    "experience": [
      "第9至13屆臺北市議員",
      "國民大會與經濟相關工作經驗"
    ],
    "policyFocusTags": [
      "財政",
      "地方建設",
      "市政監督"
    ],
    "profileSourceUrl": "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2549",
    "relationToShen": {
      "level": "institutional_only",
      "summary": "截至目前查核，沒有找到可確認的沈伯洋競選合作紀錄；若沈任市長，主要關係會是市府與議會的法定監督、預算審議與選區協調。",
      "confirmedPublicEvents": [],
      "possibleCityHallCollaborationAreas": [
        "財政",
        "地方建設",
        "市政監督"
      ],
      "caution": "可能合作領域是依議員公開背景／政策關注與選區議題推估，不是已達成的合作協議；不得推論私人熟度或人事安排。",
      "verifiedAt": "2026-09-03"
    }
  },
  "鍾佩玲": {
    "birthDate": "1979-03-27",
    "backgroundSummary": "媒體、幼教與地方服務背景，長期關注家庭與地方議題。",
    "education": [
      "政治大學EMBA",
      "世新大學口語傳播學系"
    ],
    "experience": [
      "壹電視／三立主播",
      "幼教相關顧問與地方服務"
    ],
    "policyFocusTags": [
      "育兒",
      "教育",
      "北士科"
    ],
    "profileSourceUrl": "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2550",
    "relationToShen": {
      "level": "confirmed_campaign_cooperation",
      "summary": "已有公開聯合競選／地方行程合作；可確認政治合作，但不等於私人好友或已共同決定未來市府職位。",
      "confirmedPublicEvents": [
        {
          "date": "2026-06-07",
          "description": "沈伯洋赴社子市場及社子棒球場，林世宗、陳賢蔚、鍾佩玲、陳慈慧、林延鳳公開陪同；現場談社子島補償與地方發展。",
          "sourceUrl": "https://www.cna.com.tw/news/aloc/202606070045.aspx"
        },
        {
          "date": "2026-05-28",
          "description": "沈伯洋、吳思瑤與林延鳳、陳賢蔚、鍾佩玲、陳慈慧等會勘北士科文林變電所議題。",
          "sourceUrl": "https://newtalk.tw/news/view/2026-05-28/1037994"
        }
      ],
      "possibleCityHallCollaborationAreas": [
        "育兒",
        "教育",
        "北士科"
      ],
      "caution": "可能合作領域係依該議員公開關注議題、選區與沈伯洋政策推估；非既有政策協議，也不代表未來一定入閣。",
      "verifiedAt": "2026-09-03"
    }
  },
  "侯漢廷": {
    "birthDate": "1988-10-30",
    "backgroundSummary": "政治學背景，新黨政治人物，長期從事公共評論與市政監督。",
    "education": [
      "臺灣大學政治學研究所碩士"
    ],
    "experience": [
      "臺北市議員",
      "新黨副秘書長"
    ],
    "policyFocusTags": [
      "財政",
      "公共安全",
      "市政監督"
    ],
    "profileSourceUrl": "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2552",
    "relationToShen": {
      "level": "institutional_only",
      "summary": "截至目前查核，沒有找到可確認的沈伯洋競選合作紀錄；若沈任市長，主要關係會是市府與議會的法定監督、預算審議與選區協調。",
      "confirmedPublicEvents": [],
      "possibleCityHallCollaborationAreas": [
        "財政",
        "公共安全",
        "市政監督"
      ],
      "caution": "可能合作領域是依議員公開背景／政策關注與選區議題推估，不是已達成的合作協議；不得推論私人熟度或人事安排。",
      "verifiedAt": "2026-09-03"
    }
  },
  "林杏兒": {
    "birthDate": "1981-01-05",
    "backgroundSummary": "公共事務與政黨組織背景，具國會與地方政治工作經驗。",
    "education": [
      "銘傳大學公共事務學碩士"
    ],
    "experience": [
      "國民黨發言與黨務工作",
      "立法委員辦公室工作"
    ],
    "policyFocusTags": [
      "地方建設",
      "社福",
      "議會監督"
    ],
    "profileSourceUrl": "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2554",
    "relationToShen": {
      "level": "institutional_only",
      "summary": "截至目前查核，沒有找到可確認的沈伯洋競選合作紀錄；若沈任市長，主要關係會是市府與議會的法定監督、預算審議與選區協調。",
      "confirmedPublicEvents": [],
      "possibleCityHallCollaborationAreas": [
        "地方建設",
        "社福",
        "議會監督"
      ],
      "caution": "可能合作領域是依議員公開背景／政策關注與選區議題推估，不是已達成的合作協議；不得推論私人熟度或人事安排。",
      "verifiedAt": "2026-09-03"
    }
  },
  "陳賢蔚": {
    "birthDate": "1977-07-12",
    "backgroundSummary": "工程、政治與地方服務背景，亦投入運動及身障公共事務。",
    "education": [
      "國立臺灣海洋大學工程相關學士",
      "臺灣大學政治學研究所進修"
    ],
    "experience": [
      "吳思瑤團隊主任",
      "運動與身障團體公共服務"
    ],
    "policyFocusTags": [
      "北士科",
      "運動",
      "無障礙",
      "地方建設"
    ],
    "profileSourceUrl": "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2555",
    "relationToShen": {
      "level": "confirmed_campaign_cooperation",
      "summary": "已有公開聯合競選／地方行程合作；可確認政治合作，但不等於私人好友或已共同決定未來市府職位。",
      "confirmedPublicEvents": [
        {
          "date": "2026-06-07",
          "description": "沈伯洋赴社子市場及社子棒球場，林世宗、陳賢蔚、鍾佩玲、陳慈慧、林延鳳公開陪同；現場談社子島補償與地方發展。",
          "sourceUrl": "https://www.cna.com.tw/news/aloc/202606070045.aspx"
        },
        {
          "date": "2026-05-28",
          "description": "沈伯洋、吳思瑤與林延鳳、陳賢蔚、鍾佩玲、陳慈慧等會勘北士科文林變電所議題。",
          "sourceUrl": "https://newtalk.tw/news/view/2026-05-28/1037994"
        }
      ],
      "possibleCityHallCollaborationAreas": [
        "北士科",
        "運動",
        "無障礙",
        "地方建設"
      ],
      "caution": "可能合作領域係依該議員公開關注議題、選區與沈伯洋政策推估；非既有政策協議，也不代表未來一定入閣。",
      "verifiedAt": "2026-09-03"
    }
  },
  "張斯綱": {
    "birthDate": "1971-09-09",
    "backgroundSummary": "法律、兩岸與公共政策背景，曾任國民黨發言人及多項公共職務。",
    "education": [
      "政治大學東亞研究所碩士",
      "輔仁大學法律系"
    ],
    "experience": [
      "國民黨發言人",
      "衛生行政與海基會相關經歷"
    ],
    "policyFocusTags": [
      "北士科",
      "城市治理",
      "衛生",
      "市政監督"
    ],
    "profileSourceUrl": "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2556",
    "relationToShen": {
      "level": "public_policy_opposition",
      "summary": "有公開政策／政治攻防紀錄；目前不應描述為與沈伯洋合作或私交密切。",
      "confirmedPublicEvents": [
        {
          "date": "2026-05-27",
          "description": "北士科文林變電所議題上，張斯綱與沈伯洋／綠營公開採不同責任歸因與政策論述。",
          "sourceUrl": "https://newtalk.tw/news/view/2026-05-27/1037630"
        }
      ],
      "possibleCityHallCollaborationAreas": [
        "北士科",
        "城市治理",
        "衛生",
        "市政監督"
      ],
      "caution": "列出的未來合作領域僅指若沈伯洋當市長，市府與議會依法可能在該議題協商、監督或審議；不是已存在的政治合作。",
      "verifiedAt": "2026-09-03"
    }
  },
  "陳慈慧": {
    "birthDate": "1983-11-22",
    "backgroundSummary": "地方服務與政黨政治背景，並長期參與棒球與社區事務。",
    "education": [
      "開南大學應用日語"
    ],
    "experience": [
      "姚文智服務處主任",
      "地方與棒球組織工作"
    ],
    "policyFocusTags": [
      "社子島",
      "體育",
      "地方建設"
    ],
    "profileSourceUrl": "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2557",
    "relationToShen": {
      "level": "confirmed_campaign_cooperation",
      "summary": "已有公開聯合競選／地方行程合作；可確認政治合作，但不等於私人好友或已共同決定未來市府職位。",
      "confirmedPublicEvents": [
        {
          "date": "2026-06-07",
          "description": "沈伯洋赴社子市場及社子棒球場，林世宗、陳賢蔚、鍾佩玲、陳慈慧、林延鳳公開陪同；現場談社子島補償與地方發展。",
          "sourceUrl": "https://www.cna.com.tw/news/aloc/202606070045.aspx"
        },
        {
          "date": "2026-05-28",
          "description": "沈伯洋、吳思瑤與林延鳳、陳賢蔚、鍾佩玲、陳慈慧等會勘北士科文林變電所議題。",
          "sourceUrl": "https://newtalk.tw/news/view/2026-05-28/1037994"
        }
      ],
      "possibleCityHallCollaborationAreas": [
        "社子島",
        "體育",
        "地方建設"
      ],
      "caution": "可能合作領域係依該議員公開關注議題、選區與沈伯洋政策推估；非既有政策協議，也不代表未來一定入閣。",
      "verifiedAt": "2026-09-03"
    }
  },
  "林世宗": {
    "birthDate": "1959-06-13",
    "backgroundSummary": "資深市議員，具商業、政黨與地方服務經驗。",
    "education": [
      "企業管理與中國研究相關碩士"
    ],
    "experience": [
      "第11至13屆臺北市議員",
      "民進黨中央評議相關職務"
    ],
    "policyFocusTags": [
      "社子島",
      "市場",
      "地方建設"
    ],
    "profileSourceUrl": "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2558",
    "relationToShen": {
      "level": "confirmed_campaign_cooperation",
      "summary": "已有公開聯合競選／地方行程合作；可確認政治合作，但不等於私人好友或已共同決定未來市府職位。",
      "confirmedPublicEvents": [
        {
          "date": "2026-06-07",
          "description": "沈伯洋赴社子市場及社子棒球場，林世宗、陳賢蔚、鍾佩玲、陳慈慧、林延鳳公開陪同；現場談社子島補償與地方發展。",
          "sourceUrl": "https://www.cna.com.tw/news/aloc/202606070045.aspx"
        }
      ],
      "possibleCityHallCollaborationAreas": [
        "社子島",
        "市場",
        "地方建設"
      ],
      "caution": "可能合作領域係依該議員公開關注議題、選區與沈伯洋政策推估；非既有政策協議，也不代表未來一定入閣。",
      "verifiedAt": "2026-09-03"
    }
  },
  "陳重文": {
    "birthDate": "1977-09-24",
    "backgroundSummary": "運動與公共管理背景，長期參與體育、健身與地方議會工作。",
    "education": [
      "國立體育大學博士／碩士"
    ],
    "experience": [
      "大專教學",
      "體育與健身相關組織"
    ],
    "policyFocusTags": [
      "運動",
      "健康",
      "地方建設"
    ],
    "profileSourceUrl": "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2574",
    "relationToShen": {
      "level": "institutional_only",
      "summary": "截至目前查核，沒有找到可確認的沈伯洋競選合作紀錄；若沈任市長，主要關係會是市府與議會的法定監督、預算審議與選區協調。",
      "confirmedPublicEvents": [],
      "possibleCityHallCollaborationAreas": [
        "運動",
        "健康",
        "地方建設"
      ],
      "caution": "可能合作領域是依議員公開背景／政策關注與選區議題推估，不是已達成的合作協議；不得推論私人熟度或人事安排。",
      "verifiedAt": "2026-09-03"
    }
  },
  "陳宥丞": {
    "birthDate": "1986-04-30",
    "backgroundSummary": "財經法律與地方政治背景，曾在黃珊珊團隊與民眾黨地方組織任職。",
    "education": [
      "真理大學財經法律系",
      "臺灣大學研究所進修"
    ],
    "experience": [
      "黃珊珊團隊",
      "民眾黨臺北地方黨務"
    ],
    "policyFocusTags": [
      "內湖交通",
      "青年",
      "城市治理"
    ],
    "profileSourceUrl": "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2562",
    "relationToShen": {
      "level": "institutional_only",
      "summary": "截至目前查核，沒有找到可確認的沈伯洋競選合作紀錄；若沈任市長，主要關係會是市府與議會的法定監督、預算審議與選區協調。",
      "confirmedPublicEvents": [],
      "possibleCityHallCollaborationAreas": [
        "內湖交通",
        "青年",
        "城市治理"
      ],
      "caution": "可能合作領域是依議員公開背景／政策關注與選區議題推估，不是已達成的合作協議；不得推論私人熟度或人事安排。",
      "verifiedAt": "2026-09-03"
    }
  },
  "游淑慧": {
    "birthDate": "1976-07-28",
    "backgroundSummary": "政治學與中央／地方行政背景，長期聚焦交通、都更與市政監督。",
    "education": [
      "臺灣大學政治學系"
    ],
    "experience": [
      "中央與臺北市政府行政經驗",
      "臺北市議員"
    ],
    "policyFocusTags": [
      "內湖交通",
      "都更",
      "育兒",
      "市政監督"
    ],
    "profileSourceUrl": "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2563",
    "relationToShen": {
      "level": "public_policy_opposition",
      "summary": "有公開政策／政治攻防紀錄；目前不應描述為與沈伯洋合作或私交密切。",
      "confirmedPublicEvents": [
        {
          "date": "2026-05-20",
          "description": "游淑慧公開批評沈伯洋「市民之鎚」資料運用；沈回應其議會質詢本身也納入資料庫，屬公開政策攻防。",
          "sourceUrl": "https://newtalk.tw/news/view/2026-05-20/1036242"
        }
      ],
      "possibleCityHallCollaborationAreas": [
        "內湖交通",
        "都更",
        "育兒",
        "市政監督"
      ],
      "caution": "列出的未來合作領域僅指若沈伯洋當市長，市府與議會依法可能在該議題協商、監督或審議；不是已存在的政治合作。",
      "verifiedAt": "2026-09-03"
    }
  },
  "李明賢": {
    "birthDate": "1973-09-30",
    "backgroundSummary": "政治學、媒體與政黨溝通背景，亦投入運動公共事務。",
    "education": [
      "臺灣大學政治學研究所碩士"
    ],
    "experience": [
      "國民黨文傳／溝通工作",
      "大專授課與運動組織"
    ],
    "policyFocusTags": [
      "國際城市交流",
      "內湖南港",
      "運動",
      "市政監督"
    ],
    "profileSourceUrl": "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2565",
    "relationToShen": {
      "level": "public_policy_opposition",
      "summary": "有公開政策／政治攻防紀錄；目前不應描述為與沈伯洋合作或私交密切。",
      "confirmedPublicEvents": [
        {
          "date": "2026-07-16",
          "description": "李明賢公開質疑沈伯洋訪美城市交流；沈回應地方走訪與國際城市學習可並行，屬公開政策攻防。",
          "sourceUrl": "https://newtalk.tw/news/view/2026-07-16/1047432"
        }
      ],
      "possibleCityHallCollaborationAreas": [
        "國際城市交流",
        "內湖南港",
        "運動",
        "市政監督"
      ],
      "caution": "列出的未來合作領域僅指若沈伯洋當市長，市府與議會依法可能在該議題協商、監督或審議；不是已存在的政治合作。",
      "verifiedAt": "2026-09-03"
    }
  },
  "何孟樺": {
    "birthDate": "1989-05-01",
    "backgroundSummary": "社會學、青年政治與國際事務背景，曾任民進黨青年部主任與發言人。",
    "education": [
      "清華大學社會學研究所碩士",
      "臺灣師範大學東亞學系"
    ],
    "experience": [
      "民進黨青年部主任／發言人",
      "總統府／國安相關日本事務工作"
    ],
    "policyFocusTags": [
      "內湖交通",
      "青年",
      "食安",
      "防災"
    ],
    "profileSourceUrl": "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2566",
    "relationToShen": {
      "level": "confirmed_campaign_cooperation",
      "summary": "已有公開聯合競選／地方行程合作；可確認政治合作，但不等於私人好友或已共同決定未來市府職位。",
      "confirmedPublicEvents": [
        {
          "date": "2026-06-06",
          "description": "沈伯洋赴內湖碧山巖，何孟樺、李建昌、王孝維公開陪同地方行程。",
          "sourceUrl": "https://www.cna.com.tw/news/aloc/202606060080.aspx"
        },
        {
          "date": "2026-07-17",
          "description": "沈伯洋赴西湖市場，王孝維、李建昌、何孟樺陪同；同日公開討論食品安全與市政監督。",
          "sourceUrl": "https://newtalk.tw/news/view/2026-07-17/1047680"
        }
      ],
      "possibleCityHallCollaborationAreas": [
        "內湖交通",
        "青年",
        "食安",
        "防災"
      ],
      "caution": "可能合作領域係依該議員公開關注議題、選區與沈伯洋政策推估；非既有政策協議，也不代表未來一定入閣。",
      "verifiedAt": "2026-09-03"
    }
  },
  "闕枚莎": {
    "birthDate": "1972-04-05",
    "backgroundSummary": "商管與國際教育背景，長期投入內湖南港地方議會。",
    "education": [
      "California State University, Fullerton MBA",
      "USC相關學歷"
    ],
    "experience": [
      "臺北市議員",
      "地方服務"
    ],
    "policyFocusTags": [
      "內湖交通",
      "地方建設",
      "市政監督"
    ],
    "profileSourceUrl": "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2567",
    "relationToShen": {
      "level": "institutional_only",
      "summary": "截至目前查核，沒有找到可確認的沈伯洋競選合作紀錄；若沈任市長，主要關係會是市府與議會的法定監督、預算審議與選區協調。",
      "confirmedPublicEvents": [],
      "possibleCityHallCollaborationAreas": [
        "內湖交通",
        "地方建設",
        "市政監督"
      ],
      "caution": "可能合作領域是依議員公開背景／政策關注與選區議題推估，不是已達成的合作協議；不得推論私人熟度或人事安排。",
      "verifiedAt": "2026-09-03"
    }
  },
  "王孝維": {
    "birthDate": "1961-06-10",
    "backgroundSummary": "教育行政、商管與資深議會背景，曾任民進黨團總召等職。",
    "education": [
      "臺北市立大學教育行政博士",
      "企業管理碩士"
    ],
    "experience": [
      "多屆臺北市議員",
      "民進黨議會黨團幹部"
    ],
    "policyFocusTags": [
      "內湖交通",
      "食安",
      "防災",
      "地方建設"
    ],
    "profileSourceUrl": "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2568",
    "relationToShen": {
      "level": "confirmed_campaign_cooperation",
      "summary": "已有公開聯合競選／地方行程合作；可確認政治合作，但不等於私人好友或已共同決定未來市府職位。",
      "confirmedPublicEvents": [
        {
          "date": "2026-06-06",
          "description": "沈伯洋赴內湖碧山巖，何孟樺、李建昌、王孝維公開陪同地方行程。",
          "sourceUrl": "https://www.cna.com.tw/news/aloc/202606060080.aspx"
        },
        {
          "date": "2026-07-17",
          "description": "沈伯洋赴西湖市場，王孝維、李建昌、何孟樺陪同；同日公開討論食品安全與市政監督。",
          "sourceUrl": "https://newtalk.tw/news/view/2026-07-17/1047680"
        }
      ],
      "possibleCityHallCollaborationAreas": [
        "內湖交通",
        "食安",
        "防災",
        "地方建設"
      ],
      "caution": "可能合作領域係依該議員公開關注議題、選區與沈伯洋政策推估；非既有政策協議，也不代表未來一定入閣。",
      "verifiedAt": "2026-09-03"
    }
  },
  "李建昌": {
    "birthDate": "1962-08-22",
    "backgroundSummary": "社會學與資深地方議會背景，長期參與民進黨團與兒少公共事務。",
    "education": [
      "臺灣大學社會學學士／碩士"
    ],
    "experience": [
      "第7至13屆臺北市議員",
      "民進黨團幹部",
      "兒少權益組織"
    ],
    "policyFocusTags": [
      "兒少",
      "食安",
      "內湖交通",
      "社福"
    ],
    "profileSourceUrl": "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2569",
    "relationToShen": {
      "level": "confirmed_campaign_cooperation",
      "summary": "已有公開聯合競選／地方行程合作；可確認政治合作，但不等於私人好友或已共同決定未來市府職位。",
      "confirmedPublicEvents": [
        {
          "date": "2026-06-06",
          "description": "沈伯洋赴內湖碧山巖，何孟樺、李建昌、王孝維公開陪同地方行程。",
          "sourceUrl": "https://www.cna.com.tw/news/aloc/202606060080.aspx"
        },
        {
          "date": "2026-07-17",
          "description": "沈伯洋赴西湖市場，王孝維、李建昌、何孟樺陪同；同日公開討論食品安全與市政監督。",
          "sourceUrl": "https://newtalk.tw/news/view/2026-07-17/1047680"
        }
      ],
      "possibleCityHallCollaborationAreas": [
        "兒少",
        "食安",
        "內湖交通",
        "社福"
      ],
      "caution": "可能合作領域係依該議員公開關注議題、選區與沈伯洋政策推估；非既有政策協議，也不代表未來一定入閣。",
      "verifiedAt": "2026-09-03"
    }
  },
  "吳世正": {
    "birthDate": "1963-04-11",
    "backgroundSummary": "政治學與新聞媒體背景，具主播、記者與多屆議會經驗。",
    "education": [
      "政治大學政治學學士／碩士"
    ],
    "experience": [
      "電視記者／主播",
      "第8至12屆臺北市議員"
    ],
    "policyFocusTags": [
      "地方建設",
      "運動",
      "市政監督"
    ],
    "profileSourceUrl": "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2570",
    "relationToShen": {
      "level": "institutional_only",
      "summary": "截至目前查核，沒有找到可確認的沈伯洋競選合作紀錄；若沈任市長，主要關係會是市府與議會的法定監督、預算審議與選區協調。",
      "confirmedPublicEvents": [],
      "possibleCityHallCollaborationAreas": [
        "地方建設",
        "運動",
        "市政監督"
      ],
      "caution": "可能合作領域是依議員公開背景／政策關注與選區議題推估，不是已達成的合作協議；不得推論私人熟度或人事安排。",
      "verifiedAt": "2026-09-03"
    }
  },
  "張文潔": {
    "birthDate": "1984-10-08",
    "backgroundSummary": "企業管理、政治與青年公民背景，長期投入松山信義地方服務。",
    "education": [
      "臺北大學企業管理相關學歷",
      "臺灣大學政治學研究所進修"
    ],
    "experience": [
      "張茂楠服務團隊",
      "青年公民與高齡服務組織"
    ],
    "policyFocusTags": [
      "信義線東延",
      "青年",
      "高齡",
      "商圈"
    ],
    "profileSourceUrl": "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2575",
    "relationToShen": {
      "level": "confirmed_campaign_cooperation",
      "summary": "已有公開聯合競選／地方行程合作；可確認政治合作，但不等於私人好友或已共同決定未來市府職位。",
      "confirmedPublicEvents": [
        {
          "date": "2026-06-13",
          "description": "沈伯洋與許淑華、洪健益、張文潔前往信義線東延段了解通車與工程安全。",
          "sourceUrl": "https://www.cna.com.tw/news/aloc/202606130072.aspx"
        },
        {
          "date": "2026-08-16",
          "description": "沈伯洋在洪健益、張文潔、許淑華陪同下赴松山奉天宮及中坡福德市場，談捷運、五分埔商圈導流與地方交通。",
          "sourceUrl": "https://www.cna.com.tw/news/aloc/202608160067.aspx"
        }
      ],
      "possibleCityHallCollaborationAreas": [
        "信義線東延",
        "青年",
        "高齡",
        "商圈"
      ],
      "caution": "可能合作領域係依該議員公開關注議題、選區與沈伯洋政策推估；非既有政策協議，也不代表未來一定入閣。",
      "verifiedAt": "2026-09-03"
    }
  },
  "許淑華": {
    "birthDate": "1973-05-22",
    "backgroundSummary": "藝術行政、政黨與資深議會背景，曾任民進黨中常委與黨團幹部。",
    "education": [
      "臺北藝術大學博士",
      "多項文化／管理相關碩士"
    ],
    "experience": [
      "第10至13屆臺北市議員",
      "民進黨中常委／議會黨團幹部"
    ],
    "policyFocusTags": [
      "交通",
      "社福",
      "文化",
      "商圈"
    ],
    "profileSourceUrl": "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2576",
    "relationToShen": {
      "level": "confirmed_campaign_cooperation",
      "summary": "已有公開聯合競選／地方行程合作；可確認政治合作，但不等於私人好友或已共同決定未來市府職位。",
      "confirmedPublicEvents": [
        {
          "date": "2026-06-13",
          "description": "沈伯洋與許淑華、洪健益、張文潔前往信義線東延段了解通車與工程安全。",
          "sourceUrl": "https://www.cna.com.tw/news/aloc/202606130072.aspx"
        },
        {
          "date": "2026-08-16",
          "description": "沈伯洋在洪健益、張文潔、許淑華陪同下赴松山奉天宮及中坡福德市場，談捷運、五分埔商圈導流與地方交通。",
          "sourceUrl": "https://www.cna.com.tw/news/aloc/202608160067.aspx"
        }
      ],
      "possibleCityHallCollaborationAreas": [
        "交通",
        "社福",
        "文化",
        "商圈"
      ],
      "caution": "可能合作領域係依該議員公開關注議題、選區與沈伯洋政策推估；非既有政策協議，也不代表未來一定入閣。",
      "verifiedAt": "2026-09-03"
    }
  },
  "詹為元": {
    "birthDate": "1983-07-29",
    "backgroundSummary": "東亞研究與國民黨政治幕僚背景，曾任市長選戰發言與立委助理。",
    "education": [
      "政治大學東亞研究所碩士"
    ],
    "experience": [
      "丁守中競選發言人",
      "蔣萬安立委辦公室助理",
      "國民黨黨務"
    ],
    "policyFocusTags": [
      "交通",
      "青年",
      "市政監督"
    ],
    "profileSourceUrl": "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2577",
    "relationToShen": {
      "level": "institutional_only",
      "summary": "截至目前查核，沒有找到可確認的沈伯洋競選合作紀錄；若沈任市長，主要關係會是市府與議會的法定監督、預算審議與選區協調。",
      "confirmedPublicEvents": [],
      "possibleCityHallCollaborationAreas": [
        "交通",
        "青年",
        "市政監督"
      ],
      "caution": "可能合作領域是依議員公開背景／政策關注與選區議題推估，不是已達成的合作協議；不得推論私人熟度或人事安排。",
      "verifiedAt": "2026-09-03"
    }
  },
  "秦慧珠": {
    "birthDate": "1955-03-27",
    "backgroundSummary": "政治、學術、媒體與國會經驗兼具的資深政治人物。",
    "education": [
      "文化大學博士",
      "臺灣大學政治學研究所碩士"
    ],
    "experience": [
      "立法委員",
      "臺北市議員",
      "地方觀光與學術媒體經歷"
    ],
    "policyFocusTags": [
      "交通",
      "觀光",
      "財政",
      "市政監督"
    ],
    "profileSourceUrl": "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2580",
    "relationToShen": {
      "level": "institutional_only",
      "summary": "截至目前查核，沒有找到可確認的沈伯洋競選合作紀錄；若沈任市長，主要關係會是市府與議會的法定監督、預算審議與選區協調。",
      "confirmedPublicEvents": [],
      "possibleCityHallCollaborationAreas": [
        "交通",
        "觀光",
        "財政",
        "市政監督"
      ],
      "caution": "可能合作領域是依議員公開背景／政策關注與選區議題推估，不是已達成的合作協議；不得推論私人熟度或人事安排。",
      "verifiedAt": "2026-09-03"
    }
  },
  "戴錫欽": {
    "birthDate": "1966-10-28",
    "backgroundSummary": "戰略、政治與長期議會背景，現任臺北市議會議長。",
    "education": [
      "淡江大學戰略研究所碩士",
      "東吳大學政治系"
    ],
    "experience": [
      "第9至13屆臺北市議員",
      "國民黨文傳工作",
      "臺北市議會議長"
    ],
    "policyFocusTags": [
      "議會治理",
      "交通",
      "市政協商"
    ],
    "profileSourceUrl": "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2581",
    "relationToShen": {
      "level": "institutional_only",
      "summary": "截至目前查核，沒有找到可確認的沈伯洋競選合作紀錄；若沈任市長，主要關係會是市府與議會的法定監督、預算審議與選區協調。",
      "confirmedPublicEvents": [],
      "possibleCityHallCollaborationAreas": [
        "議會治理",
        "交通",
        "市政協商"
      ],
      "caution": "可能合作領域是依議員公開背景／政策關注與選區議題推估，不是已達成的合作協議；不得推論私人熟度或人事安排。",
      "verifiedAt": "2026-09-03"
    }
  },
  "洪健益": {
    "birthDate": "1970-11-03",
    "backgroundSummary": "媒體、地方服務與資深議會背景，長期關注交通、都更與市場夜市。",
    "education": [
      "地方學校與進修背景"
    ],
    "experience": [
      "廣播主持",
      "競選／立委服務處主任",
      "第10至13屆臺北市議員"
    ],
    "policyFocusTags": [
      "信義線東延",
      "都更",
      "市場夜市",
      "社福"
    ],
    "profileSourceUrl": "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2582",
    "relationToShen": {
      "level": "confirmed_campaign_cooperation",
      "summary": "已有公開聯合競選／地方行程合作；可確認政治合作，但不等於私人好友或已共同決定未來市府職位。",
      "confirmedPublicEvents": [
        {
          "date": "2026-06-13",
          "description": "沈伯洋與許淑華、洪健益、張文潔前往信義線東延段了解通車與工程安全。",
          "sourceUrl": "https://www.cna.com.tw/news/aloc/202606130072.aspx"
        },
        {
          "date": "2026-08-16",
          "description": "沈伯洋在洪健益、張文潔、許淑華陪同下赴松山奉天宮及中坡福德市場，談捷運、五分埔商圈導流與地方交通。",
          "sourceUrl": "https://www.cna.com.tw/news/aloc/202608160067.aspx"
        }
      ],
      "possibleCityHallCollaborationAreas": [
        "信義線東延",
        "都更",
        "市場夜市",
        "社福"
      ],
      "caution": "可能合作領域係依該議員公開關注議題、選區與沈伯洋政策推估；非既有政策協議，也不代表未來一定入閣。",
      "verifiedAt": "2026-09-03"
    }
  },
  "陳炳甫": {
    "birthDate": "1971-04-01",
    "backgroundSummary": "企業管理、法律與體育組織背景，長期投入中山大同市政。",
    "education": [
      "臺灣大學商學研究所碩士",
      "日本法律相關學士"
    ],
    "experience": [
      "臺北市議員",
      "體育協會公共事務"
    ],
    "policyFocusTags": [
      "市場",
      "運動",
      "地方建設",
      "市政監督"
    ],
    "profileSourceUrl": "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2584",
    "relationToShen": {
      "level": "institutional_only",
      "summary": "截至目前查核，沒有找到可確認的沈伯洋競選合作紀錄；若沈任市長，主要關係會是市府與議會的法定監督、預算審議與選區協調。",
      "confirmedPublicEvents": [],
      "possibleCityHallCollaborationAreas": [
        "市場",
        "運動",
        "地方建設",
        "市政監督"
      ],
      "caution": "可能合作領域是依議員公開背景／政策關注與選區議題推估，不是已達成的合作協議；不得推論私人熟度或人事安排。",
      "verifiedAt": "2026-09-03"
    }
  },
  "顏若芳": {
    "birthDate": "1985-10-27",
    "backgroundSummary": "政治與政黨傳播背景，曾任民進黨發言人、青年部主任及選戰發言人。",
    "education": [
      "文化大學政治學系"
    ],
    "experience": [
      "民進黨發言人／青年部主任",
      "蔡英文競選發言工作"
    ],
    "policyFocusTags": [
      "市場商圈",
      "青年",
      "城市溝通",
      "中山大同"
    ],
    "profileSourceUrl": "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2585",
    "relationToShen": {
      "level": "confirmed_campaign_cooperation",
      "summary": "已有公開聯合競選／地方行程合作；可確認政治合作，但不等於私人好友或已共同決定未來市府職位。",
      "confirmedPublicEvents": [
        {
          "date": "2026-05-30",
          "description": "沈伯洋與顏若芳、林亮君走訪大龍市場，討論市場內外攤動線與商圈人流。",
          "sourceUrl": "https://www.cna.com.tw/news/aloc/202605300046.aspx"
        },
        {
          "date": "2026-06-04",
          "description": "沈伯洋赴榮星花園拜票，林亮君、顏若芳公開陪同；公開報導亦記載陳怡君到場。",
          "sourceUrl": "https://newtalk.tw/news/view/2026-06-04/1039172"
        }
      ],
      "possibleCityHallCollaborationAreas": [
        "市場商圈",
        "青年",
        "城市溝通",
        "中山大同"
      ],
      "caution": "可能合作領域係依該議員公開關注議題、選區與沈伯洋政策推估；非既有政策協議，也不代表未來一定入閣。",
      "verifiedAt": "2026-09-03"
    }
  },
  "柳采葳": {
    "birthDate": "1990-09-07",
    "backgroundSummary": "新聞媒體與政治傳播背景，曾任主播、主持人與政治記者。",
    "education": [
      "銘傳大學新聞學系",
      "臺灣大學政治學研究所進修"
    ],
    "experience": [
      "TVBS主播／主持人／政治記者"
    ],
    "policyFocusTags": [
      "夜間治理",
      "運動空間",
      "文化產業",
      "市政監督"
    ],
    "profileSourceUrl": "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2586",
    "relationToShen": {
      "level": "public_policy_opposition",
      "summary": "有公開政策／政治攻防紀錄；目前不應描述為與沈伯洋合作或私交密切。",
      "confirmedPublicEvents": [
        {
          "date": "2026-08-12",
          "description": "柳采葳公開質疑沈伯洋「運動驛站」的治安與隱私風險，形成運動空間政策攻防。",
          "sourceUrl": "https://newtalk.tw/news/view/2026-08-12/1052955"
        },
        {
          "date": "2026-08-16",
          "description": "柳采葳公開質疑沈伯洋「夜市長」制度設計，形成夜間治理政策攻防。",
          "sourceUrl": "https://news.tvbs.com.tw/politics/4008000"
        }
      ],
      "possibleCityHallCollaborationAreas": [
        "夜間治理",
        "運動空間",
        "文化產業",
        "市政監督"
      ],
      "caution": "列出的未來合作領域僅指若沈伯洋當市長，市府與議會依法可能在該議題協商、監督或審議；不是已存在的政治合作。",
      "verifiedAt": "2026-09-03"
    }
  },
  "葉林傳": {
    "birthDate": "1969-07-16",
    "backgroundSummary": "地方里政與議會背景深厚，曾任圓山里里長與里長聯誼組織職務。",
    "education": [
      "淡江大學中國大陸研究所碩士"
    ],
    "experience": [
      "圓山里里長",
      "里長聯誼組織",
      "臺北市議會副議長"
    ],
    "policyFocusTags": [
      "基層里政",
      "市場",
      "地方建設",
      "議會治理"
    ],
    "profileSourceUrl": "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2587",
    "relationToShen": {
      "level": "institutional_only",
      "summary": "截至目前查核，沒有找到可確認的沈伯洋競選合作紀錄；若沈任市長，主要關係會是市府與議會的法定監督、預算審議與選區協調。",
      "confirmedPublicEvents": [],
      "possibleCityHallCollaborationAreas": [
        "基層里政",
        "市場",
        "地方建設",
        "議會治理"
      ],
      "caution": "可能合作領域是依議員公開背景／政策關注與選區議題推估，不是已達成的合作協議；不得推論私人熟度或人事安排。",
      "verifiedAt": "2026-09-03"
    }
  },
  "林珍羽": {
    "birthDate": "1987-04-14",
    "backgroundSummary": "藝術、媒體與柯市府幕僚背景，曾任臺北市政府副發言人與民眾黨創黨發言人。",
    "education": [
      "臺南大學應用藝術相關學士"
    ],
    "experience": [
      "柯文哲隨行秘書",
      "臺北市政府副發言人",
      "民眾黨創黨發言人"
    ],
    "policyFocusTags": [
      "全齡照顧",
      "青年住宅",
      "都更",
      "城市治理"
    ],
    "profileSourceUrl": "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2588",
    "relationToShen": {
      "level": "institutional_only",
      "summary": "截至目前查核，沒有找到可確認的沈伯洋競選合作紀錄；若沈任市長，主要關係會是市府與議會的法定監督、預算審議與選區協調。",
      "confirmedPublicEvents": [],
      "possibleCityHallCollaborationAreas": [
        "全齡照顧",
        "青年住宅",
        "都更",
        "城市治理"
      ],
      "caution": "可能合作領域是依議員公開背景／政策關注與選區議題推估，不是已達成的合作協議；不得推論私人熟度或人事安排。",
      "verifiedAt": "2026-09-03"
    }
  },
  "陳怡君": {
    "birthDate": "1979-05-04",
    "backgroundSummary": "長期政黨與地方服務背景，歷任民進黨與政治幕僚相關職務。",
    "education": [
      "政治／公共事務相關進修"
    ],
    "experience": [
      "民進黨地方與黨務工作",
      "政治幕僚與地方服務"
    ],
    "policyFocusTags": [
      "中山大同",
      "市場商圈",
      "社福",
      "地方建設"
    ],
    "profileSourceUrl": "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2590",
    "relationToShen": {
      "level": "confirmed_campaign_cooperation",
      "summary": "已有公開聯合競選／地方行程合作；可確認政治合作，但不等於私人好友或已共同決定未來市府職位。",
      "confirmedPublicEvents": [
        {
          "date": "2026-06-04",
          "description": "沈伯洋赴榮星花園拜票，林亮君、顏若芳公開陪同；公開報導亦記載陳怡君到場。",
          "sourceUrl": "https://newtalk.tw/news/view/2026-06-04/1039172"
        }
      ],
      "possibleCityHallCollaborationAreas": [
        "中山大同",
        "市場商圈",
        "社福",
        "地方建設"
      ],
      "caution": "可能合作領域係依該議員公開關注議題、選區與沈伯洋政策推估；非既有政策協議，也不代表未來一定入閣。",
      "verifiedAt": "2026-09-03"
    }
  },
  "林亮君": {
    "birthDate": "1989-12-25",
    "backgroundSummary": "商管、科技法律與青年政治背景，曾任林昶佐幕僚並投入足球公共事務。",
    "education": [
      "臺灣師範大學企業管理學士",
      "清華大學科技法律研究所碩士"
    ],
    "experience": [
      "林昶佐國會幕僚",
      "臺北市足球協會相關職務"
    ],
    "policyFocusTags": [
      "市場商圈",
      "運動足球",
      "居住",
      "青年"
    ],
    "profileSourceUrl": "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2591",
    "relationToShen": {
      "level": "confirmed_campaign_cooperation",
      "summary": "已有公開聯合競選／地方行程合作；可確認政治合作，但不等於私人好友或已共同決定未來市府職位。",
      "confirmedPublicEvents": [
        {
          "date": "2026-05-30",
          "description": "沈伯洋與顏若芳、林亮君走訪大龍市場，討論市場內外攤動線與商圈人流。",
          "sourceUrl": "https://www.cna.com.tw/news/aloc/202605300046.aspx"
        },
        {
          "date": "2026-06-04",
          "description": "沈伯洋赴榮星花園拜票，林亮君、顏若芳公開陪同；公開報導亦記載陳怡君到場。",
          "sourceUrl": "https://newtalk.tw/news/view/2026-06-04/1039172"
        }
      ],
      "possibleCityHallCollaborationAreas": [
        "市場商圈",
        "運動足球",
        "居住",
        "青年"
      ],
      "caution": "可能合作領域係依該議員公開關注議題、選區與沈伯洋政策推估；非既有政策協議，也不代表未來一定入閣。",
      "verifiedAt": "2026-09-03"
    }
  },
  "應曉薇": {
    "birthDate": "1964-09-14",
    "backgroundSummary": "商管、婦女、新住民與更生保護公共事務背景，具多屆議會經驗。",
    "education": [
      "中原大學企業管理研究所碩士"
    ],
    "experience": [
      "多屆臺北市議員",
      "婦女／新住民／更生保護組織"
    ],
    "policyFocusTags": [
      "社福",
      "新住民",
      "地方建設",
      "市政監督"
    ],
    "profileSourceUrl": "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2592",
    "relationToShen": {
      "level": "institutional_only",
      "summary": "截至目前查核，沒有找到可確認的沈伯洋競選合作紀錄；若沈任市長，主要關係會是市府與議會的法定監督、預算審議與選區協調。",
      "confirmedPublicEvents": [],
      "possibleCityHallCollaborationAreas": [
        "社福",
        "新住民",
        "地方建設",
        "市政監督"
      ],
      "caution": "可能合作領域是依議員公開背景／政策關注與選區議題推估，不是已達成的合作協議；不得推論私人熟度或人事安排。",
      "verifiedAt": "2026-09-03"
    }
  },
  "郭昭巖": {
    "birthDate": "1969-02-08",
    "backgroundSummary": "兒少、婦女與統計背景，長期關注家庭、幼兒與新住民議題。",
    "education": [
      "文化大學兒童青少年福利研究所碩士",
      "輔仁大學統計系"
    ],
    "experience": [
      "婦女／新住民／兒少相關組織"
    ],
    "policyFocusTags": [
      "兒少",
      "育兒",
      "新住民",
      "社福"
    ],
    "profileSourceUrl": "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2593",
    "relationToShen": {
      "level": "institutional_only",
      "summary": "截至目前查核，沒有找到可確認的沈伯洋競選合作紀錄；若沈任市長，主要關係會是市府與議會的法定監督、預算審議與選區協調。",
      "confirmedPublicEvents": [],
      "possibleCityHallCollaborationAreas": [
        "兒少",
        "育兒",
        "新住民",
        "社福"
      ],
      "caution": "可能合作領域是依議員公開背景／政策關注與選區議題推估，不是已達成的合作協議；不得推論私人熟度或人事安排。",
      "verifiedAt": "2026-09-03"
    }
  },
  "洪婉臻": {
    "birthDate": "1983-07-17",
    "backgroundSummary": "國家發展、新聞與政治背景，曾任媒體記者主播及游錫堃辦公室幕僚。",
    "education": [
      "臺灣大學國家發展研究所法律組碩士",
      "文化大學新聞研究所碩士",
      "東吳大學政治系"
    ],
    "experience": [
      "記者／主播",
      "游錫堃辦公室工作"
    ],
    "policyFocusTags": [
      "萬華市場",
      "都更",
      "社福",
      "地方服務"
    ],
    "profileSourceUrl": "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2595",
    "relationToShen": {
      "level": "confirmed_campaign_cooperation",
      "summary": "已有公開聯合競選／地方行程合作；可確認政治合作，但不等於私人好友或已共同決定未來市府職位。",
      "confirmedPublicEvents": [
        {
          "date": "2026-07-18",
          "description": "沈伯洋走訪萬華三水街市場、直興市場，洪婉臻、劉耀仁公開陪同。",
          "sourceUrl": "https://www.cna.com.tw/news/aloc/202607180072.aspx"
        }
      ],
      "possibleCityHallCollaborationAreas": [
        "萬華市場",
        "都更",
        "社福",
        "地方服務"
      ],
      "caution": "可能合作領域係依該議員公開關注議題、選區與沈伯洋政策推估；非既有政策協議，也不代表未來一定入閣。",
      "verifiedAt": "2026-09-03"
    }
  },
  "吳志剛": {
    "birthDate": "1971-09-09",
    "backgroundSummary": "資訊管理、政黨與地方服務背景，長期投入萬華商圈與都市議題。",
    "education": [
      "Fairleigh Dickinson University 資訊管理碩士"
    ],
    "experience": [
      "國民黨中央常務委員",
      "客家與地方組織"
    ],
    "policyFocusTags": [
      "都更",
      "社福",
      "夜市商圈",
      "市政監督"
    ],
    "profileSourceUrl": "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2596",
    "relationToShen": {
      "level": "institutional_only",
      "summary": "截至目前查核，沒有找到可確認的沈伯洋競選合作紀錄；若沈任市長，主要關係會是市府與議會的法定監督、預算審議與選區協調。",
      "confirmedPublicEvents": [],
      "possibleCityHallCollaborationAreas": [
        "都更",
        "社福",
        "夜市商圈",
        "市政監督"
      ],
      "caution": "可能合作領域是依議員公開背景／政策關注與選區議題推估，不是已達成的合作協議；不得推論私人熟度或人事安排。",
      "verifiedAt": "2026-09-03"
    }
  },
  "徐立信": {
    "birthDate": "1975-04-03",
    "backgroundSummary": "法律專業與司法改革背景，曾任律師、國會助理並投入法律扶助。",
    "education": [
      "臺灣大學法律研究所碩士",
      "臺北大學法律系"
    ],
    "experience": [
      "律師",
      "立法委員助理",
      "法律扶助／司法改革相關工作"
    ],
    "policyFocusTags": [
      "法治",
      "都更",
      "市政監督",
      "弱勢"
    ],
    "profileSourceUrl": "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2597",
    "relationToShen": {
      "level": "institutional_only",
      "summary": "截至目前查核，沒有找到可確認的沈伯洋競選合作紀錄；若沈任市長，主要關係會是市府與議會的法定監督、預算審議與選區協調。",
      "confirmedPublicEvents": [],
      "possibleCityHallCollaborationAreas": [
        "法治",
        "都更",
        "市政監督",
        "弱勢"
      ],
      "caution": "可能合作領域是依議員公開背景／政策關注與選區議題推估，不是已達成的合作協議；不得推論私人熟度或人事安排。",
      "verifiedAt": "2026-09-03"
    }
  },
  "鍾小平": {
    "birthDate": "1962-08-27",
    "backgroundSummary": "政治學、教學與長期地方議會背景。",
    "education": [
      "臺灣大學政治學研究所碩士"
    ],
    "experience": [
      "臺北／新北地方議會經驗",
      "教師與基金會工作"
    ],
    "policyFocusTags": [
      "地方建設",
      "財政",
      "市政監督"
    ],
    "profileSourceUrl": "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2598",
    "relationToShen": {
      "level": "institutional_only",
      "summary": "截至目前查核，沒有找到可確認的沈伯洋競選合作紀錄；若沈任市長，主要關係會是市府與議會的法定監督、預算審議與選區協調。",
      "confirmedPublicEvents": [],
      "possibleCityHallCollaborationAreas": [
        "地方建設",
        "財政",
        "市政監督"
      ],
      "caution": "可能合作領域是依議員公開背景／政策關注與選區議題推估，不是已達成的合作協議；不得推論私人熟度或人事安排。",
      "verifiedAt": "2026-09-03"
    }
  },
  "劉耀仁": {
    "birthDate": "1968-10-16",
    "backgroundSummary": "政治學與資深議會背景，長期關注都更、社宅、托育與觀光。",
    "education": [
      "Indiana State University 政治學碩士"
    ],
    "experience": [
      "多屆臺北市議員",
      "民進黨議會黨團職務"
    ],
    "policyFocusTags": [
      "萬華市場",
      "都更",
      "社宅",
      "托育",
      "觀光"
    ],
    "profileSourceUrl": "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2599",
    "relationToShen": {
      "level": "confirmed_campaign_cooperation",
      "summary": "已有公開聯合競選／地方行程合作；可確認政治合作，但不等於私人好友或已共同決定未來市府職位。",
      "confirmedPublicEvents": [
        {
          "date": "2026-07-18",
          "description": "沈伯洋走訪萬華三水街市場、直興市場，洪婉臻、劉耀仁公開陪同。",
          "sourceUrl": "https://www.cna.com.tw/news/aloc/202607180072.aspx"
        }
      ],
      "possibleCityHallCollaborationAreas": [
        "萬華市場",
        "都更",
        "社宅",
        "托育"
      ],
      "caution": "可能合作領域係依該議員公開關注議題、選區與沈伯洋政策推估；非既有政策協議，也不代表未來一定入閣。",
      "verifiedAt": "2026-09-03"
    }
  },
  "李柏毅": {
    "birthDate": "1981-10-09",
    "backgroundSummary": "工程、科技與地方政治背景，曾任工程師與議員服務處主任。",
    "education": [
      "University of Southern California 航太／機械碩士",
      "長庚大學機械系"
    ],
    "experience": [
      "工程師",
      "李新服務處主任",
      "體育組織"
    ],
    "policyFocusTags": [
      "長照",
      "青年",
      "育兒",
      "科技"
    ],
    "profileSourceUrl": "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2600",
    "relationToShen": {
      "level": "institutional_only",
      "summary": "截至目前查核，沒有找到可確認的沈伯洋競選合作紀錄；若沈任市長，主要關係會是市府與議會的法定監督、預算審議與選區協調。",
      "confirmedPublicEvents": [],
      "possibleCityHallCollaborationAreas": [
        "長照",
        "青年",
        "育兒",
        "科技"
      ],
      "caution": "可能合作領域是依議員公開背景／政策關注與選區議題推估，不是已達成的合作協議；不得推論私人熟度或人事安排。",
      "verifiedAt": "2026-09-03"
    }
  },
  "苗博雅": {
    "birthDate": "1987-10-02",
    "backgroundSummary": "法律、人權與議會改革背景，長期關注交通、法治與公共治理。",
    "education": [
      "臺灣大學法律系"
    ],
    "experience": [
      "臺北市議員",
      "國際交流計畫 IVLP／EUVP",
      "足球公共事務"
    ],
    "policyFocusTags": [
      "食安",
      "交通",
      "人權",
      "議會改革",
      "足球"
    ],
    "profileSourceUrl": "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2602",
    "relationToShen": {
      "level": "confirmed_public_issue_overlap",
      "summary": "有可確認的公開議題交集，但目前沒有足夠資料把它說成固定競選夥伴或共同政策團隊。",
      "confirmedPublicEvents": [
        {
          "date": "2026-07-17",
          "description": "苗博雅先公開揭露蔣市府食安委員會出席問題，沈伯洋同日受訪引用此議題批評市府，屬公開議題交集，不代表共同政策協議。",
          "sourceUrl": "https://newtalk.tw/news/view/2026-07-17/1047680"
        }
      ],
      "possibleCityHallCollaborationAreas": [
        "食安",
        "交通",
        "人權",
        "議會改革"
      ],
      "caution": "議題交集不等於私人熟度、共同政黨或未來入閣安排。",
      "verifiedAt": "2026-09-03"
    }
  },
  "曾獻瑩": {
    "birthDate": "1976-03-16",
    "backgroundSummary": "企業管理、科技產業與家庭教育背景；2022年以無黨籍當選，現官方議會資料列中國國民黨。",
    "education": [
      "臺灣大學工商管理學士／碩士"
    ],
    "experience": [
      "科技產業工作與獎項",
      "家庭／教育相關組織"
    ],
    "policyFocusTags": [
      "科技",
      "教育",
      "家庭",
      "育兒"
    ],
    "profileSourceUrl": "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2603",
    "relationToShen": {
      "level": "institutional_only",
      "summary": "截至目前查核，沒有找到可確認的沈伯洋競選合作紀錄；若沈任市長，主要關係會是市府與議會的法定監督、預算審議與選區協調。",
      "confirmedPublicEvents": [],
      "possibleCityHallCollaborationAreas": [
        "科技",
        "教育",
        "家庭",
        "育兒"
      ],
      "caution": "可能合作領域是依議員公開背景／政策關注與選區議題推估，不是已達成的合作協議；不得推論私人熟度或人事安排。",
      "verifiedAt": "2026-09-03"
    }
  },
  "簡舒培": {
    "birthDate": "1977-06-27",
    "backgroundSummary": "政治、新聞與民進黨傳播背景，具政黨發言、選戰及議會工作經驗。",
    "education": [
      "臺灣大學政治學研究所碩士",
      "文化大學新聞學系"
    ],
    "experience": [
      "民進黨發言人",
      "蔡英文競選發言工作",
      "議會／國會幕僚"
    ],
    "policyFocusTags": [
      "交通",
      "育兒",
      "長照",
      "動物福利",
      "市政監督"
    ],
    "profileSourceUrl": "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2604",
    "relationToShen": {
      "level": "confirmed_campaign_cooperation",
      "summary": "已有公開聯合競選／地方行程合作；可確認政治合作，但不等於私人好友或已共同決定未來市府職位。",
      "confirmedPublicEvents": [
        {
          "date": "2026-06-20",
          "description": "沈伯洋與王閔生、簡舒培走訪景美集應廟及景美市場，蒐集文山地方與市政意見。",
          "sourceUrl": "https://puma.taipei/policies/20260620"
        }
      ],
      "possibleCityHallCollaborationAreas": [
        "交通",
        "育兒",
        "長照",
        "動物福利"
      ],
      "caution": "可能合作領域係依該議員公開關注議題、選區與沈伯洋政策推估；非既有政策協議，也不代表未來一定入閣。",
      "verifiedAt": "2026-09-03"
    }
  },
  "徐弘庭": {
    "birthDate": "1982-06-21",
    "backgroundSummary": "政治學與青年公共事務背景，曾任國會助理並參與國際交流。",
    "education": [
      "東吳大學政治學系"
    ],
    "experience": [
      "立法委員助理",
      "IVLP",
      "青年基金會公共事務"
    ],
    "policyFocusTags": [
      "青年",
      "交通",
      "財政",
      "市政監督"
    ],
    "profileSourceUrl": "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2605",
    "relationToShen": {
      "level": "institutional_only",
      "summary": "截至目前查核，沒有找到可確認的沈伯洋競選合作紀錄；若沈任市長，主要關係會是市府與議會的法定監督、預算審議與選區協調。",
      "confirmedPublicEvents": [],
      "possibleCityHallCollaborationAreas": [
        "青年",
        "交通",
        "財政",
        "市政監督"
      ],
      "caution": "可能合作領域是依議員公開背景／政策關注與選區議題推估，不是已達成的合作協議；不得推論私人熟度或人事安排。",
      "verifiedAt": "2026-09-03"
    }
  },
  "王欣儀": {
    "birthDate": "1970-06-24",
    "backgroundSummary": "法律、國家事務與商管背景，長期參與國民黨議會與黨務。",
    "education": [
      "臺灣師範大學國家事務與法律相關碩士",
      "東吳大學商學／政治背景"
    ],
    "experience": [
      "國民黨議會黨團與中央黨務",
      "臺北市議員"
    ],
    "policyFocusTags": [
      "教育",
      "地方建設",
      "市政監督"
    ],
    "profileSourceUrl": "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2606",
    "relationToShen": {
      "level": "institutional_only",
      "summary": "截至目前查核，沒有找到可確認的沈伯洋競選合作紀錄；若沈任市長，主要關係會是市府與議會的法定監督、預算審議與選區協調。",
      "confirmedPublicEvents": [],
      "possibleCityHallCollaborationAreas": [
        "教育",
        "地方建設",
        "市政監督"
      ],
      "caution": "可能合作領域是依議員公開背景／政策關注與選區議題推估，不是已達成的合作協議；不得推論私人熟度或人事安排。",
      "verifiedAt": "2026-09-03"
    }
  },
  "鍾沛君": {
    "birthDate": "1984-12-10",
    "backgroundSummary": "公共行政與媒體背景，曾任主播、記者及國民黨發言人。",
    "education": [
      "暨南國際大學公共行政相關學歷"
    ],
    "experience": [
      "TVBS主播",
      "三立記者",
      "國民黨發言人"
    ],
    "policyFocusTags": [
      "都更",
      "育兒",
      "淨零",
      "市政監督"
    ],
    "profileSourceUrl": "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2608",
    "relationToShen": {
      "level": "institutional_only",
      "summary": "截至目前查核，沒有找到可確認的沈伯洋競選合作紀錄；若沈任市長，主要關係會是市府與議會的法定監督、預算審議與選區協調。",
      "confirmedPublicEvents": [],
      "possibleCityHallCollaborationAreas": [
        "都更",
        "育兒",
        "淨零",
        "市政監督"
      ],
      "caution": "可能合作領域是依議員公開背景／政策關注與選區議題推估，不是已達成的合作協議；不得推論私人熟度或人事安排。",
      "verifiedAt": "2026-09-03"
    }
  },
  "陳錦祥": {
    "birthDate": "1959-07-07",
    "backgroundSummary": "資深議會政治人物，曾任副議長、議長，長期關注運動、都更與社福。",
    "education": [
      "地方與公共事務相關進修"
    ],
    "experience": [
      "八屆臺北市議員",
      "臺北市議會副議長／議長"
    ],
    "policyFocusTags": [
      "運動",
      "都更",
      "育兒",
      "長照"
    ],
    "profileSourceUrl": "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2609",
    "relationToShen": {
      "level": "institutional_only",
      "summary": "截至目前查核，沒有找到可確認的沈伯洋競選合作紀錄；若沈任市長，主要關係會是市府與議會的法定監督、預算審議與選區協調。",
      "confirmedPublicEvents": [],
      "possibleCityHallCollaborationAreas": [
        "運動",
        "都更",
        "育兒",
        "長照"
      ],
      "caution": "可能合作領域是依議員公開背景／政策關注與選區議題推估，不是已達成的合作協議；不得推論私人熟度或人事安排。",
      "verifiedAt": "2026-09-03"
    }
  },
  "楊植斗": {
    "birthDate": "1992-01-22",
    "backgroundSummary": "政治與國民黨青年幕僚背景，曾任立委服務團隊與黨發言職務。",
    "education": [
      "臺灣大學政治學系公共行政組"
    ],
    "experience": [
      "羅智強／王鴻薇團隊",
      "國民黨發言人"
    ],
    "policyFocusTags": [
      "都更",
      "育兒",
      "交通",
      "動物福利",
      "市政監督"
    ],
    "profileSourceUrl": "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2610",
    "relationToShen": {
      "level": "public_policy_opposition",
      "summary": "有公開政策／政治攻防紀錄；目前不應描述為與沈伯洋合作或私交密切。",
      "confirmedPublicEvents": [
        {
          "date": "2026-06-18",
          "description": "楊植斗公開要求沈伯洋就死刑議題表態，屬價值與政治攻防。",
          "sourceUrl": "https://newtalk.tw/news/view/2026-06-18/1042030"
        },
        {
          "date": "2026-08-21",
          "description": "楊植斗以「問A答B」等說法公開批評沈伯洋，屬競選政治攻防。",
          "sourceUrl": "https://newtalk.tw/news/view/2026-08-21/1054740"
        }
      ],
      "possibleCityHallCollaborationAreas": [
        "都更",
        "育兒",
        "交通",
        "動物福利"
      ],
      "caution": "列出的未來合作領域僅指若沈伯洋當市長，市府與議會依法可能在該議題協商、監督或審議；不是已存在的政治合作。",
      "verifiedAt": "2026-09-03"
    }
  },
  "王閔生": {
    "birthDate": "1975-09-15",
    "backgroundSummary": "社福、財經與民進黨黨政幕僚背景，具多屆市議員與黨團領導經驗。",
    "education": [
      "中正大學社會福利系，輔系財務金融"
    ],
    "experience": [
      "民進黨發言人／主席辦公室／青年部",
      "蘇貞昌秘書",
      "民進黨議會黨團總召"
    ],
    "policyFocusTags": [
      "文山交通",
      "社福",
      "育兒",
      "地方建設"
    ],
    "profileSourceUrl": "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2611",
    "relationToShen": {
      "level": "confirmed_campaign_cooperation",
      "summary": "已有公開聯合競選／地方行程合作；可確認政治合作，但不等於私人好友或已共同決定未來市府職位。",
      "confirmedPublicEvents": [
        {
          "date": "2026-06-20",
          "description": "沈伯洋與王閔生、簡舒培走訪景美集應廟及景美市場，蒐集文山地方與市政意見。",
          "sourceUrl": "https://puma.taipei/policies/20260620"
        }
      ],
      "possibleCityHallCollaborationAreas": [
        "文山交通",
        "社福",
        "育兒",
        "地方建設"
      ],
      "caution": "可能合作領域係依該議員公開關注議題、選區與沈伯洋政策推估；非既有政策協議，也不代表未來一定入閣。",
      "verifiedAt": "2026-09-03"
    }
  },
  "耿葳": {
    "birthDate": "1990-10-31",
    "backgroundSummary": "商管與教育背景，投入大安文山地方議會與青年公共事務。",
    "education": [
      "Johns Hopkins University 商管碩士",
      "臺灣師範大學教育相關學歷"
    ],
    "experience": [
      "第13屆臺北市議員"
    ],
    "policyFocusTags": [
      "青年",
      "教育",
      "地方建設",
      "市政監督"
    ],
    "profileSourceUrl": "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2612",
    "relationToShen": {
      "level": "institutional_only",
      "summary": "截至目前查核，沒有找到可確認的沈伯洋競選合作紀錄；若沈任市長，主要關係會是市府與議會的法定監督、預算審議與選區協調。",
      "confirmedPublicEvents": [],
      "possibleCityHallCollaborationAreas": [
        "青年",
        "教育",
        "地方建設",
        "市政監督"
      ],
      "caution": "可能合作領域是依議員公開背景／政策關注與選區議題推估，不是已達成的合作協議；不得推論私人熟度或人事安排。",
      "verifiedAt": "2026-09-03"
    }
  },
  "張志豪": {
    "birthDate": "1972-04-11",
    "backgroundSummary": "護理、航空與緊急救護背景，曾任航空機師並投入消防救援。",
    "education": [
      "輔仁大學護理系"
    ],
    "experience": [
      "航空機師",
      "義消／救援工作",
      "急重症研究協助"
    ],
    "policyFocusTags": [
      "公共安全",
      "防災",
      "健康",
      "交通"
    ],
    "profileSourceUrl": "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2613",
    "relationToShen": {
      "level": "institutional_only",
      "summary": "截至目前查核，沒有找到可確認的沈伯洋競選合作紀錄；若沈任市長，主要關係會是市府與議會的法定監督、預算審議與選區協調。",
      "confirmedPublicEvents": [],
      "possibleCityHallCollaborationAreas": [
        "公共安全",
        "防災",
        "健康",
        "交通"
      ],
      "caution": "可能合作領域是依議員公開背景／政策關注與選區議題推估，不是已達成的合作協議；不得推論私人熟度或人事安排。",
      "verifiedAt": "2026-09-03"
    }
  },
  "李芳儒": {
    "birthDate": "1969-12-06",
    "backgroundSummary": "公共政策、設計與都市原住民公共事務背景，具多屆議會經驗。",
    "education": [
      "淡江大學公共政策研究所碩士"
    ],
    "experience": [
      "第11至13屆臺北市議員",
      "設計相關背景"
    ],
    "policyFocusTags": [
      "原住民住宅",
      "長照",
      "語言文化",
      "就業"
    ],
    "profileSourceUrl": "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2614",
    "relationToShen": {
      "level": "institutional_only",
      "summary": "截至目前查核，沒有找到可確認的沈伯洋競選合作紀錄；若沈任市長，主要關係會是市府與議會的法定監督、預算審議與選區協調。",
      "confirmedPublicEvents": [],
      "possibleCityHallCollaborationAreas": [
        "原住民住宅",
        "長照",
        "語言文化",
        "就業"
      ],
      "caution": "可能合作領域是依議員公開背景／政策關注與選區議題推估，不是已達成的合作協議；不得推論私人熟度或人事安排。",
      "verifiedAt": "2026-09-03"
    }
  },
  "李傅中武": {
    "birthDate": "1973-04-04",
    "backgroundSummary": "國際商務、警政與都市原住民公共事務背景。",
    "education": [
      "淡江大學國際商務研究所碩士"
    ],
    "experience": [
      "警政工作",
      "國民黨黨務與原住民公共服務"
    ],
    "policyFocusTags": [
      "原住民青年就業",
      "長照",
      "語言文化",
      "住宅"
    ],
    "profileSourceUrl": "https://www.tcc.gov.tw/Councilor_Content.aspx?n=13898&s=2615",
    "relationToShen": {
      "level": "institutional_only",
      "summary": "截至目前查核，沒有找到可確認的沈伯洋競選合作紀錄；若沈任市長，主要關係會是市府與議會的法定監督、預算審議與選區協調。",
      "confirmedPublicEvents": [],
      "possibleCityHallCollaborationAreas": [
        "原住民青年就業",
        "長照",
        "語言文化",
        "住宅"
      ],
      "caution": "可能合作領域是依議員公開背景／政策關注與選區議題推估，不是已達成的合作協議；不得推論私人熟度或人事安排。",
      "verifiedAt": "2026-09-03"
    }
  }
};

export const TAIPEI_COUNCILORS: TaipeiCouncilor[] = TAIPEI_COUNCILORS_BASE.map(
  (base) => {
    const extra = COUNCILOR_ENRICHMENT[base.name];

    if (!extra) {
      throw new Error(`Missing councilor enrichment: ${base.name}`);
    }

    const blueprint = DPP_COUNCILOR_V4_BLUEPRINTS[base.name];
    const policyFocusTags =
      blueprint?.policyFocusTags || fallbackCouncilorTopics(extra.policyFocusTags);
    const policyTop3 = blueprint
      ? blueprint.policyTop3.map((item) => ({
          ...item,
          sourceUrl: extra.profileSourceUrl || base.sourceUrl,
          verifiedAt: extra.relationToShen.verifiedAt,
          status: "current" as const,
        }))
      : fallbackPolicyTop3(
          extra.policyFocusTags,
          extra.profileSourceUrl || base.sourceUrl,
          extra.relationToShen.verifiedAt
        );
    const confirmedPublicEvents = extra.relationToShen.confirmedPublicEvents.map(
      (event) => {
        const eventType: ShenCouncilorEventType =
          extra.relationToShen.level === "public_policy_opposition"
            ? "public_opposition"
            : extra.relationToShen.level === "confirmed_public_issue_overlap"
              ? "public_policy_alignment"
              : extra.relationToShen.level === "institutional_only"
                ? "institutional_only"
                : "joint_local_visit";
        const mediaEventId = event.sourceUrl.includes("202608160067")
          ? "2026-08-16-songshan-wufenpu"
          : undefined;

        return {
          date: event.date,
          title: `${event.date} 公開活動`,
          eventType,
          summary: event.description,
          description: event.description,
          ...(mediaEventId ? { mediaEventId } : {}),
          sourceUrl: event.sourceUrl,
          verifiedAt: extra.relationToShen.verifiedAt,
        };
      }
    );
    const relationshipTypes = [
      ...new Set(
        confirmedPublicEvents.length
          ? confirmedPublicEvents.map(({ eventType }) => eventType)
          : [
              extra.relationToShen.level === "public_policy_opposition"
                ? "public_opposition"
                : extra.relationToShen.level === "confirmed_public_issue_overlap"
                  ? "public_policy_alignment"
                  : extra.relationToShen.level === "institutional_only"
                    ? "institutional_only"
                    : "institutional_only",
            ]
      ),
    ] as ShenCouncilorEventType[];
    const sharedPolicyTopics =
      blueprint?.sharedPolicyTopics ||
      policyFocusTags.slice(0, 2).map((topic) => ({
        topic,
        strength: "possible" as const,
        rationale: `可依${topic}公開關注進一步確認市政協商空間。`,
        caution: "目前僅能視為可能政策交集，不能說成已達成合作。",
      }));
    const realtimeSummary =
      blueprint?.realtimeSummary || {
        relationship: extra.relationToShen.summary,
        policies: `其公開市政關注包括${policyFocusTags.slice(0, 4).join("、")}。`,
        collaboration: sharedPolicyTopics.length
          ? `可就${sharedPolicyTopics.map(({ topic }) => topic).join("、")}進一步討論。`
          : "目前沒有足夠資料把可能方向說成既有合作。",
      };

    return {
      ...base,
      ...extra,
      policyTop3,
      policyFocusTags,
      relationToShen: {
        ...extra.relationToShen,
        confirmedPublicEvents,
        relationshipTypes,
        sharedPolicyTopics,
        realtimeSummary,
      },
      ...(base.name === "陳怡君"
        ? {
            partyNomination2026: {
              electionYear: 2026 as const,
              status: "eligibility_revoked" as const,
              summary:
                "她仍列於第14屆臺北市議會現任議員名冊；但民進黨於2026-02-25撤銷其2026市議員參選資格。現任職務與下一屆黨內提名狀態分開記錄。",
              sourceUrl: "https://www.cna.com.tw/news/aipl/202602250282.aspx",
              verifiedAt: "2026-02-25",
            },
          }
        : {}),
      sourceUrl: extra.profileSourceUrl || base.sourceUrl,
    };
  }
);

export const DISTRICT_TO_CONSTITUENCY: Record<string, number> = {
  "士林區": 1,
  "北投區": 1,
  "內湖區": 2,
  "南港區": 2,
  "松山區": 3,
  "信義區": 3,
  "中山區": 4,
  "大同區": 4,
  "中正區": 5,
  "萬華區": 5,
  "大安區": 6,
  "文山區": 6,
  "平地原住民": 7,
  "山地原住民": 8,
};

function normalizeDistrict(input: string) {
  const value = String(input || "")
    .normalize("NFKC")
    .trim()
    .replace(/\s+/g, "")
    .replace(/臺/g, "台")
    .replace(/^台北市/, "");
  if (!value) return "";
  if (value === "平地原住民" || value === "山地原住民") return value;
  return value.endsWith("區") ? value : `${value}區`;
}

/** District queries always resolve to the complete multi-member constituency. */
export function resolveCouncilorConstituency(districtInput: string) {
  const district = normalizeDistrict(districtInput);

  return {
    district,
    constituency: DISTRICT_TO_CONSTITUENCY[district],
  };
}

function normalizeName(input: string) {
  return input
    .trim()
    .replace(/\s+/g, "")
    .replace(/^(?:(?:台北市|臺北市)?市?議員)/, "")
    .replace(/市?議員$/, "");
}

function editDistance(left: string, right: string) {
  const rows = Array.from({ length: left.length + 1 }, () =>
    Array<number>(right.length + 1).fill(0)
  );

  for (let i = 0; i <= left.length; i += 1) rows[i][0] = i;
  for (let j = 0; j <= right.length; j += 1) rows[0][j] = j;

  for (let i = 1; i <= left.length; i += 1) {
    for (let j = 1; j <= right.length; j += 1) {
      rows[i][j] = Math.min(
        rows[i - 1][j] + 1,
        rows[i][j - 1] + 1,
        rows[i - 1][j - 1] + (left[i - 1] === right[j - 1] ? 0 : 1)
      );
    }
  }

  return rows[left.length][right.length];
}

function suggestCouncilors(nameInput: string, limit = 5) {
  const name = normalizeName(nameInput);

  if (!name) return [];

  return TAIPEI_COUNCILORS.map((item) => ({
    item,
    distance: editDistance(name, normalizeName(item.name)),
    sameSurname: item.name[0] === name[0],
  }))
    .filter(({ distance, sameSurname }) => distance <= 1 || sameSurname)
    .sort(
      (a, b) =>
        Number(b.sameSurname) - Number(a.sameSurname) ||
        a.distance - b.distance ||
        a.item.name.localeCompare(b.item.name, "zh-Hant")
    )
    .slice(0, limit)
    .map(({ item }) => ({
      name: item.name,
      party: item.party,
      districts: item.districts,
    }));
}

function normalizeParty(input: string) {
  const value = String(input || "").trim().replace(/\s+/g, "");

  if (/跟你同黨|跟你同黨派|你們黨|同黨議員/.test(value)) {
    return "民主進步黨";
  }

  const aliases: Record<string, string> = {
    民進黨: "民主進步黨",
    國民黨: "中國國民黨",
    民眾黨: "台灣民眾黨",
    社民黨: "社會民主黨",
  };

  return aliases[value] || value;
}

function addToIndex<K>(map: Map<K, TaipeiCouncilor[]>, key: K, item: TaipeiCouncilor) {
  const current = map.get(key);
  if (current) current.push(item);
  else map.set(key, [item]);
}

const byName = new Map<string, TaipeiCouncilor>();
const byConstituency = new Map<number, TaipeiCouncilor[]>();
const byParty = new Map<string, TaipeiCouncilor[]>();
const byTopic = new Map<CouncilorPolicyTopic, TaipeiCouncilor[]>();
const byRelationshipType = new Map<ShenCouncilorEventType, TaipeiCouncilor[]>();

for (const councilor of TAIPEI_COUNCILORS) {
  if (councilor.status !== "current") continue;
  byName.set(normalizeName(councilor.name), councilor);
  addToIndex(byConstituency, councilor.constituency, councilor);
  addToIndex(byParty, normalizeParty(councilor.party), councilor);
  councilor.policyFocusTags.forEach((topic) => addToIndex(byTopic, topic, councilor));
  councilor.relationToShen.relationshipTypes.forEach((relationshipType) =>
    addToIndex(byRelationshipType, relationshipType, councilor)
  );
}

/** Module-level indexes are built once and reused by every Realtime tool call. */
export const TAIPEI_COUNCILOR_INDEXES = {
  byName,
  byConstituency,
  byParty,
  byTopic,
  byRelationshipType,
} as const;

export function calculateAge(
  birthDate: string,
  at: Date = new Date()
): number | null {
  const [year, month, day] = birthDate.split("-").map(Number);
  if (!year || !month || !day) return null;

  let age = at.getFullYear() - year;
  const hasHadBirthday =
    at.getMonth() + 1 > month ||
    (at.getMonth() + 1 === month && at.getDate() >= day);

  if (!hasHadBirthday) age -= 1;
  return age;
}

export type CouncilorSortBy =
  | "name"
  | "youngest_first"
  | "oldest_first";

export type CouncilorListDetail = "quick" | "standard" | "full";
export type CouncilorNameDetail =
  | "quick"
  | "profile"
  | "policy"
  | "relationship"
  | "events"
  | "full";

export interface CouncilorQuery {
  district?: string;
  constituency?: number;
  names?: string[];
  party?: string;
  topic?: string;
  relationshipType?: ShenCouncilorEventType;
  hasPublicEventWithShen?: boolean;
  relationshipLevel?: CouncilorRelationshipLevel;
  detail?: CouncilorListDetail;
  sortBy?: CouncilorSortBy;
  limit?: number;
}

function councilorIdentity(item: TaipeiCouncilor) {
  return {
    name: item.name,
    party: item.party,
    constituency: item.constituency,
    constituencyName: item.constituencyName,
    districts: item.districts,
    status: item.status,
    verifiedAt: item.verifiedAt,
  };
}

function projectCouncilor(
  item: TaipeiCouncilor,
  detail: CouncilorListDetail | CouncilorNameDetail
): Record<string, any> {
  const identity = councilorIdentity(item);
  const currentAge = calculateAge(item.birthDate);
  const quick = {
    ...identity,
    policyTop3: item.policyTop3,
    policyFocusTags: item.policyFocusTags,
    relationToShen: {
      level: item.relationToShen.level,
      summary: item.relationToShen.summary,
      relationshipTypes: item.relationToShen.relationshipTypes,
      sharedPolicyTopics: item.relationToShen.sharedPolicyTopics,
      realtimeSummary: item.relationToShen.realtimeSummary,
      confirmedPublicEvents: item.relationToShen.confirmedPublicEvents.slice(0, 3),
      caution: item.relationToShen.caution,
      verifiedAt: item.relationToShen.verifiedAt,
    },
    ...(item.partyNomination2026
      ? { partyNomination2026: item.partyNomination2026 }
      : {}),
  };

  if (detail === "quick") return quick;

  if (detail === "profile") {
    return {
      ...identity,
      birthDate: item.birthDate,
      currentAge,
      backgroundSummary: item.backgroundSummary,
      education: item.education,
      experience: item.experience,
      ...(item.partyNomination2026
        ? { partyNomination2026: item.partyNomination2026 }
        : {}),
    };
  }

  if (detail === "policy") {
    return {
      ...identity,
      policyTop3: item.policyTop3,
      policyFocusTags: item.policyFocusTags,
      sharedPolicyTopics: item.relationToShen.sharedPolicyTopics,
      realtimeSummary: item.relationToShen.realtimeSummary,
    };
  }

  if (detail === "relationship") {
    return {
      ...identity,
      relationToShen: {
        ...item.relationToShen,
        confirmedPublicEvents: item.relationToShen.confirmedPublicEvents.slice(0, 3),
      },
    };
  }

  if (detail === "events") {
    return {
      ...identity,
      confirmedPublicEvents: item.relationToShen.confirmedPublicEvents,
      realtimeSummary: item.relationToShen.realtimeSummary,
    };
  }

  if (detail === "standard") {
    return {
      ...quick,
      birthDate: item.birthDate,
      currentAge,
      backgroundSummary: item.backgroundSummary,
      education: item.education,
      experience: item.experience,
    };
  }

  return { ...item, currentAge };
}

function intersectCouncilors(
  current: TaipeiCouncilor[],
  indexed: TaipeiCouncilor[] | undefined
) {
  if (!indexed) return [];
  const ids = new Set(indexed.map(({ id }) => id));
  return current.filter(({ id }) => ids.has(id));
}

export function queryCouncilors(query: CouncilorQuery = {}) {
  const resolvedDistrict = query.district
    ? resolveCouncilorConstituency(String(query.district))
    : { district: "", constituency: undefined };
  const district = resolvedDistrict.district;
  const explicitConstituency = Number(query.constituency || 0);
  const constituency =
    resolvedDistrict.constituency ||
    (Number.isInteger(explicitConstituency) && explicitConstituency >= 1 && explicitConstituency <= 8
      ? explicitConstituency
      : undefined);
  const party = query.party ? normalizeParty(String(query.party)) : "";
  const normalizedTopics = query.topic
    ? normalizeCouncilorTopic(String(query.topic))
    : [];
  const detail: CouncilorListDetail = query.detail || "quick";

  if (district) {
    if (!constituency) {
      return {
        found: false as const,
        reason: "invalid_district" as const,
        needsClarification: true,
        shouldSearchWeb: false,
        shouldVerifyLatest: false,
        normalized: { district },
        message: "找不到對應的臺北市議員選區。",
      };
    }
  }

  if (query.topic && !normalizedTopics.length) {
    return {
      found: false as const,
      reason: "ambiguous_topic" as const,
      needsClarification: true,
      shouldSearchWeb: false,
      shouldVerifyLatest: false,
      normalized: {
        district: district || undefined,
        constituency,
        party: party || undefined,
        topic: String(query.topic),
      },
      message: "我還不能確定你指的是哪一類政策，請補一個主題，例如交通、育兒、老屋或市場。",
    };
  }

  let members = constituency
    ? [...(byConstituency.get(constituency) || [])]
    : TAIPEI_COUNCILORS.filter((item) => item.status === "current");

  if (query.names?.length) {
    const requestedNames = new Set(query.names.map(normalizeName));
    members = members.filter((item) => requestedNames.has(normalizeName(item.name)));
  }

  if (party) {
    members = intersectCouncilors(members, byParty.get(party));
  }

  if (normalizedTopics.length) {
    const topicIds = new Set(
      normalizedTopics.flatMap((topic) =>
        (byTopic.get(topic) || []).map(({ id }) => id)
      )
    );
    members = members.filter(({ id }) => topicIds.has(id));
  }

  if (query.relationshipType) {
    members = intersectCouncilors(
      members,
      byRelationshipType.get(query.relationshipType)
    );
  }

  if (query.hasPublicEventWithShen) {
    members = members.filter(
      (item) => item.relationToShen.confirmedPublicEvents.length > 0
    );
  }

  if (query.relationshipLevel) {
    members = members.filter(
      (item) =>
        item.relationToShen.level === query.relationshipLevel
    );
  }

  const sortBy = query.sortBy || "name";

  members = [...members].sort((a, b) => {
    if (sortBy === "youngest_first") {
      return b.birthDate.localeCompare(a.birthDate);
    }

    if (sortBy === "oldest_first") {
      return a.birthDate.localeCompare(b.birthDate);
    }

    return a.name.localeCompare(b.name, "zh-Hant");
  });

  const requestedLimit = Number(query.limit || 0);
  const limit =
    Number.isFinite(requestedLimit) && requestedLimit > 0
      ? Math.min(Math.floor(requestedLimit), 53)
      : undefined;

  if (limit) {
    members = members.slice(0, limit);
  }

  return {
    found: members.length > 0 as true | false,
    mode: normalizedTopics.length
      ? "topic" as const
      : query.relationshipType || query.hasPublicEventWithShen || query.relationshipLevel
        ? "relationship" as const
        : constituency
          ? (district ? "district" as const : "constituency" as const)
          : party
            ? "party" as const
            : "all" as const,
    normalized: {
      district: district || undefined,
      constituency,
      names: query.names?.length ? query.names.map(normalizeName) : undefined,
      party: party || undefined,
      topic: normalizedTopics.length ? normalizedTopics.join("、") : undefined,
      relationshipType: query.relationshipType,
      hasPublicEventWithShen: query.hasPublicEventWithShen,
      detail,
    },
    district: district || undefined,
    constituency,
    constituencyName:
      constituency
        ? members[0]?.constituencyName ||
          TAIPEI_COUNCILORS.find(
            (item) => item.constituency === constituency
          )?.constituencyName
        : undefined,
    filters: {
      names: query.names?.length ? query.names.map(normalizeName) : undefined,
      party: party || undefined,
      topic: normalizedTopics.length ? normalizedTopics : undefined,
      relationshipType: query.relationshipType,
      hasPublicEventWithShen: query.hasPublicEventWithShen,
      relationshipLevel: query.relationshipLevel,
      detail,
      sortBy,
      limit,
    },
    count: members.length,
    data: members.map((item) => projectCouncilor(item, detail)),
    verifiedAt: TAIPEI_COUNCILOR_META.verifiedAt,
    shouldSearchWeb: false,
    shouldVerifyLatest: false,
  };
}

export function lookupCouncilorsByDistrict(
  districtInput: string
) {
  return queryCouncilors({
    district: districtInput,
    sortBy: "name",
  });
}

export function lookupCouncilorByName(
  nameInput: string,
  detail: CouncilorNameDetail = "full"
) {
  const name = normalizeName(nameInput);
  const match = byName.get(name);

  if (!match) {
    const suggestions = suggestCouncilors(name);
    return {
      found: false as const,
      mode: "name" as const,
      reason: suggestions.length ? "ambiguous_name" as const : "not_found" as const,
      normalized: { name, detail },
      suggestions,
      needsClarification: suggestions.length > 0,
      shouldSearchWeb: suggestions.length === 0,
      shouldVerifyLatest: suggestions.length === 0,
      message: suggestions.length
        ? "姓名可能有語音或用字差異，請從候選人中確認，不需要先查網路。"
        : "本地現任市議員沒有相符姓名，需要查最新官方名冊。",
    };
  }

  return {
    found: true as const,
    mode: "name" as const,
    normalized: { name, detail },
    data: [projectCouncilor(match, detail)],
    verifiedAt: TAIPEI_COUNCILOR_META.verifiedAt,
    shouldSearchWeb: false,
    shouldVerifyLatest: match.status !== "current",
  };
}

export const LOOKUP_TAIPEI_COUNCILORS_TOOL = {
  type: "function",
  name: "lookup_taipei_councilors",
  description:
    "查詢臺北市現任市議員 Realtime Enriched V4。行政區會先轉成完整複數選區；支援黨籍、政策主題、與沈伯洋的公開關係或共同活動。預設 quick 以降低延遲。",
  parameters: {
    type: "object",
    properties: {
      district: {
        type: "string",
        description:
          "可選。臺北市行政區，例如內湖區、大安區、文山區；原住民選區可填平地原住民或山地原住民。",
      },
      constituency: {
        type: "integer",
        minimum: 1,
        maximum: 8,
        description: "可選。已正規化的臺北市議員選區編號。",
      },
      names: {
        type: "array",
        items: { type: "string" },
        description: "可選。follow-up 指涉多位已知議員時使用，例如上一輪的『這兩位』。",
      },
      party: {
        type: "string",
        description:
          "可選。依黨籍篩選，例如民主進步黨、中國國民黨、台灣民眾黨、社會民主黨、新黨、無黨籍。",
      },
      topic: {
        type: "string",
        description: "可選。自然語言政策主題，例如交通、捷運、老屋加裝電梯、育兒、青年或市場；Tool 會做 alias normalization。",
      },
      relationshipType: {
        type: "string",
        enum: [
          "formal_joint_campaign",
          "joint_local_visit",
          "public_policy_alignment",
          "formal_endorsement",
          "campaign_team_role",
          "public_opposition",
          "institutional_only",
        ],
        description: "可選。與沈伯洋的公開關係／事件類型。",
      },
      hasPublicEventWithShen: {
        type: "boolean",
        description: "可選。true 時只回傳有可查證共同公開活動的議員，預設全台北。",
      },
      detail: {
        type: "string",
        enum: ["quick", "standard", "full"],
        description: "輸出細節。Realtime 預設 quick；standard 加背景學經歷；full 才含完整聯絡與來源。",
      },
      relationshipLevel: {
        type: "string",
        enum: [
          "confirmed_campaign_cooperation",
          "confirmed_public_issue_overlap",
          "public_policy_opposition",
          "institutional_only",
          "no_verified_direct_relationship",
        ],
        description:
          "可選。依與沈伯洋目前可查證的公開關係層級篩選。",
      },
      sortBy: {
        type: "string",
        enum: [
          "name",
          "youngest_first",
          "oldest_first",
        ],
        description:
          "可選。姓名、最年輕優先、最年長優先。",
      },
      limit: {
        type: "integer",
        minimum: 1,
        maximum: 53,
        description: "可選。最多回傳幾位。",
      },
    },
    additionalProperties: false,
  },
} as const;

export const LOOKUP_TAIPEI_COUNCILOR_BY_NAME_TOOL = {
  type: "function",
  name: "lookup_taipei_councilor_by_name",
  description:
    "依姓名查詢臺北市現任市議員。除了黨籍、選區與聯絡方式，也會回傳生日、背景、政策關注，以及與沈伯洋目前可查證的公開互動與可能市政協商領域。",
  parameters: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description:
          "市議員姓名，例如何孟樺、苗博雅、黃瀞瑩。",
      },
      detail: {
        type: "string",
        enum: ["quick", "profile", "policy", "relationship", "events", "full"],
        description: "依問題選擇輸出：背景=profile、政見=policy、關係／合作=relationship、共同活動=events；Realtime 一般查詢用 quick。",
      },
    },
    required: ["name"],
    additionalProperties: false,
  },
} as const;

export const TAIPEI_COUNCILOR_TOOL_INSTRUCTIONS = `
# TAIPEI COUNCILOR LOCAL TOOL — REALTIME ENRICHED V4

這份資料包含 53 位現任臺北市議員的：
- 姓名
- 黨籍
- 選區
- 生日
- 動態計算年齡
- 公開背景
- 學經歷
- 政策關注標籤
- 三項代表政策與 topic alias
- 公開聯絡方式
- 與沈伯洋目前可查證的公開關係
- 公開活動 eventType / mediaEventId
- sharedPolicyTopics 與可直接口語轉述的 realtimeSummary
- 可能的未來市政協商／合作領域

## Silent deterministic tool

App 會在 transcript completed 後決定 Tool 與 detail。Local Tool 查詢前禁止說：
- 我查一下
- 我看一下資料
- 我整理一下
- 讓我想一下

Function output 回來後只建立一次 final assistant response，直接講答案。

## 查區域
使用者問：
- 「內湖有哪些市議員？」
- 「我是大安區，我的市議員有哪些？」

呼叫 lookup_taipei_councilors，帶 district。

district 一律先轉 constituency，回完整複數選區 current 名單：
- 北投／士林 → 1
- 內湖／南港 → 2
- 松山／信義 → 3
- 中山／大同 → 4
- 中正／萬華 → 5
- 大安／文山 → 6

不得用單一 district tag 篩掉同選區議員。

「跟你同黨／跟你同黨派／你們黨／同黨議員」固定為 party=民主進步黨。

## 查政策與關係

- 政見／訴求／政策 → by_name detail=policy
- 背景／學歷／經歷／年齡 → by_name detail=profile
- 跟沈伯洋關係／怎麼合作 → by_name detail=relationship
- 一起去哪／同台／公開活動 → by_name detail=events
- 哪些議員關心某主題 → list topic=...
- 哪些議員與沈伯洋有公開活動 → list hasPublicEventWithShen=true，預設全台北

## 查年齡
使用者問：
- 「台北最年輕市議員是誰？」
- 「民進黨最年長的市議員？」

呼叫 lookup_taipei_councilors：
- sortBy = youngest_first / oldest_first
- 需要時加 party
- 通常 limit = 1

不要再靠模型記憶回答年齡排名。

## 查和沈伯洋的關係
使用者問：
- 「哪些市議員跟沈伯洋有公開合作？」
- 「他跟哪個議員合作過？」

可以用 relationshipLevel =
confirmed_campaign_cooperation。

若直接問某人：
呼叫 lookup_taipei_councilor_by_name。

### 關係欄位最重要規則

confirmedPublicEvents：
= 有來源可查證的公開互動。

possibleCityHallCollaborationAreas：
= 依公開背景、政策關注與選區推估的未來市政協商領域。

兩者完全不同。

禁止把 possibleCityHallCollaborationAreas 說成：
- 「我們已經在合作」
- 「我們共同提出」
- 「我們已經談好」
- 「他會加入我的市府」

除非 confirmedPublicEvents 或最新正式資料真的支持。

同黨不等於私交。
一起掃街不等於共同制定政策。
公開政策攻防不等於私人關係不好。

## 現任名單防呆

工具回傳哪些姓名，就回答哪些姓名。

不得在 tool output 之外，
再用模型記憶補入：
- 王世堅
- 王鴻薇
- 徐巧芯
- 吳沛憶
- 趙怡翔
- 其他前議員／已轉任者

如果使用者明確問：
「今天最新還是現任嗎？」
或 relationToShen.verifiedAt 已過舊，
再用 web_search 查：
1. 臺北市議會
2. 內政部
3. 沈伯洋官方網站／完整公開報導

## Realtime 回答節奏

使用者只問「有哪些議員」：
先列姓名＋黨籍。

使用者問「這個議員是誰」：
用 1 到 3 句說生日／背景／重點。

使用者問「跟沈伯洋什麼關係」：
先說 evidence level 的人話版本，
再講 1 個最具體公開事件。

不要一次朗讀整份履歷。

Tool found=true 且 status=current 時直接有把握回答，不要補「大概／最好再查官方」。
只有 not_found、ambiguous、stale 或 shouldVerifyLatest=true 才澄清或查 Web。
`;

export function executeCouncilorTool(
  toolName: string,
  args: any
) {
  if (toolName === "lookup_taipei_councilors") {
    return {
      handled: true as const,
      result: queryCouncilors({
        district:
          typeof args?.district === "string"
            ? args.district
            : undefined,
        constituency:
          typeof args?.constituency === "number"
            ? args.constituency
            : undefined,
        names:
          Array.isArray(args?.names)
            ? args.names.map((name: unknown) => String(name))
            : undefined,
        party:
          typeof args?.party === "string"
            ? args.party
            : undefined,
        topic:
          typeof args?.topic === "string"
            ? args.topic
            : undefined,
        relationshipType:
          typeof args?.relationshipType === "string"
            ? args.relationshipType
            : undefined,
        hasPublicEventWithShen:
          typeof args?.hasPublicEventWithShen === "boolean"
            ? args.hasPublicEventWithShen
            : undefined,
        detail:
          typeof args?.detail === "string"
            ? args.detail
            : "quick",
        relationshipLevel:
          typeof args?.relationshipLevel === "string"
            ? args.relationshipLevel
            : undefined,
        sortBy:
          typeof args?.sortBy === "string"
            ? args.sortBy
            : undefined,
        limit:
          typeof args?.limit === "number"
            ? args.limit
            : undefined,
      }),
    };
  }

  if (toolName === "lookup_taipei_councilor_by_name") {
    return {
      handled: true as const,
      result: lookupCouncilorByName(
        String(args?.name || ""),
        typeof args?.detail === "string" ? args.detail : "quick"
      ),
    };
  }

  return { handled: false as const };
}
