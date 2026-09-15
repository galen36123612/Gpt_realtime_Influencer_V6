// 沈伯洋 2026 台北市長選戰｜新聞／公開受訪 Local KB
// Snapshot through: 2026-09-15 09:15 Asia/Taipei
//
// 用途：
// - 優先回答「已發生」的重大新聞、公開受訪、競選事件、政策發布。
// - 減少對已知歷史事件重複呼叫 web_search。
// - 不是永久即時新聞庫；若使用者問的時間晚於 snapshotThrough，或明確問「現在最新」且資料已過期，才需要再查 web。

export type ShenMediaCategory =
  | "campaign"
  | "registration"
  | "policy"
  | "debate"
  | "child_safety"
  | "city_governance"
  | "district"
  | "councilor_cooperation"
  | "public_interview"
  | "fact_check"
  | "opponent_controversy"
  | "international"
  | "personal_profile";

export type ShenMediaSourceType =
  | "official_campaign"
  | "official_government"
  | "major_media"
  | "secondary_media";

export interface ShenMediaSource {
  label: string;
  url: string;
  sourceType: ShenMediaSourceType;
  publishedAt?: string;
}

export interface ShenMediaEvent {
  id: string;
  date: string;
  title: string;
  categories: ShenMediaCategory[];
  priority: 1 | 2 | 3 | 4 | 5;
  districts?: string[];
  people?: string[];
  councilors?: string[];
  keywords: string[];
  keyFacts: string[];
  shenPublicPosition?: string[];
  answerGuidance: string;
  avoidClaims?: string[];
  sources: ShenMediaSource[];
}

export const SHEN_MEDIA_KB_META = {
  snapshotThrough: "2026-09-15T09:15:00+08:00",
  timezone: "Asia/Taipei",
  verifiedAt: "2026-09-15",
  scope:
    "2026 台北市長選戰重大新聞、公開受訪、政策發布、登記、重要市議員公開合作與主要攻防事件。",
  freshnessRule:
    "使用者問 snapshotThrough 以前已發生事件，可直接使用本 KB；若問更晚日期、今天最新且 runtime 已晚於 snapshot，才需 web_search。",
  electionProcedure: {
    registrationDate: "2026-09-02",
    numberDrawDate: "2026-10-23",
    candidateListAnnouncementDate: "2026-11-12",
    caution:
      "登記順序不等於選票號次；2026-10-23 抽號次前不得自行回答候選人是幾號。",
  },
} as const;

export const SHEN_MEDIA_EVENTS: ShenMediaEvent[] = [
  {
    id: "2026-09-11-14-japan-city-diplomacy",
    date: "2026-09-14",
    title: "訪日：成立日本後援會、旅日青年座談與城市外交交流",
    categories: ["international", "campaign", "city_governance", "public_interview"],
    priority: 4,
    people: ["沈伯洋"],
    keywords: [
      "訪日",
      "日本",
      "東京",
      "日本後援會",
      "旅日青年",
      "青年座談",
      "城市外交",
      "國會外交",
      "人才交流",
      "都市更新",
      "AI城市治理",
      "城市韌性",
      "海底電纜",
      "民間防衛",
    ],
    keyFacts: [
      "沈伯洋於 2026-09-11 啟程訪日，公開說明三項目標：國會外交、城市外交與成立日本後援會。",
      "9 月 12 日在東京舉行日本後援會成立活動，接觸旅日台灣人對台北市政與台灣未來的意見。",
      "9 月 13 日在東京惠比壽與約百名旅日台灣青年座談，討論人才回流與台日人才交流，也談都市更新、AI 城市治理、城市韌性、居住與就業。",
      "行程也包含與日本自民黨國會議員交流；9 月 14 日公開總結議題涵蓋產業、人才、都市更新、安全韌性、醫療與內容產業。",
    ],
    shenPublicPosition: [
      "海外後援網絡不只用於選舉，也可成為台北與國際產業、人才及城市治理交流的長期節點。",
      "台北的都市更新、AI 治理與安全韌性，可以吸收東京及旅日台灣青年的實務經驗。",
    ],
    answerGuidance:
      "若被問最近訪日做什麼，可直接說：我這次把國會外交、城市外交和日本後援網絡一起推進，也和旅日青年談人才、都更、AI 城市治理、居住與韌性；已公開的是交流方向，不要把尚未公布的拜會內容說成簽署合作。",
    avoidClaims: [
      "不要把交流或座談說成已簽署城市合作協議。",
      "未經雙方公開同意，不要自行補出未公布的日本官員姓名或閉門會談內容。",
    ],
    sources: [
      {
        label: "中央社 2026-09-11｜訪日三目標",
        url: "https://www.cna.com.tw/news/aloc/202609110254.aspx",
        sourceType: "major_media",
        publishedAt: "2026-09-11T17:57:00+08:00",
      },
      {
        label: "自由時報 2026-09-14｜訪日總結與旅日青年座談",
        url: "https://video.ltn.com.tw/article/NIPnDBZ3bFI/PLI7xntdRxhw1rpX3OIi9nX4jeQoPimc9q",
        sourceType: "major_media",
        publishedAt: "2026-09-14T15:01:00+08:00",
      },
    ],
  },
  {
    id: "2026-09-11-full-life-cycle-social-welfare",
    date: "2026-09-11",
    title: "全生命週期社福政策：長照、心理健康、兒少、身障與女性安全",
    categories: ["policy", "child_safety", "city_governance", "public_interview"],
    priority: 5,
    people: ["沈伯洋"],
    keywords: [
      "社福政策",
      "社會福利",
      "全生命週期",
      "臨時托老券",
      "敬老卡",
      "在宅醫療",
      "鐘點移工",
      "皮蛇疫苗",
      "心理諮商",
      "腸病毒疫苗",
      "親子同行卡",
      "兒少安全治理中心",
      "無障礙設計中心",
      "女性安全審計",
      "單身不孤獨服務專線",
    ],
    keyFacts: [
      "2026-09-11，沈伯洋舉辦台北社會福利政策座談會，提出從幼童、中壯年到長者、身障者與女性的全生命週期社福方案。",
      "長者政策包含敬老卡升級、臨時托老券、在宅醫療，以及透過都更與退場學校空間補足長照設施。",
      "中壯年方案包含 50 歲以上皮蛇疫苗一劑補助、15 至 65 歲免費心理諮商，並強化職場支持。",
      "兒少方案包含 0 至 6 歲幼兒免費腸病毒疫苗、親子同行卡，以及跨教育、社政、警政資料的兒少安全治理中心。",
      "另提出無障礙設計與爬梯機補助、女性安全審計，以及整合心理、社福與醫療的單身女性服務專線。",
    ],
    shenPublicPosition: [
      "社福不能是碎片化補助，而要以人的生命歷程整合醫療、住宅、就業、心理與照顧支持。",
      "市府應由被動分工轉為主動支持網，並用跨局處資料降低可預防的兒少風險。",
    ],
    answerGuidance:
      "回答最近社福政見時，先用『全生命週期』概括，再依使用者關心的族群挑 2 到 4 項具體措施；這些是政見與推動藍圖，不要說成已由北市府實施。",
    avoidClaims: [
      "不要把競選政見說成已編列完成或已經上路。",
      "不要把風險治理說成能保證所有兒虐事件不再發生。",
    ],
    sources: [
      {
        label: "沈伯洋競選官網｜社福政策",
        url: "https://puma.taipei/policies/%E7%A4%BE%E7%A6%8F%E6%94%BF%E7%AD%96",
        sourceType: "official_campaign",
        publishedAt: "2026-09-11",
      },
      {
        label: "Newtalk 2026-09-11｜台北社會福利政策座談會",
        url: "https://newtalk.tw/news/view/2026-09-11/1059220",
        sourceType: "major_media",
        publishedAt: "2026-09-11T16:17:00+08:00",
      },
    ],
  },
  {
    id: "2026-09-10-wang-wei-chung-interview",
    date: "2026-09-10",
    title: "王偉忠《欸！我說到哪裡了？》老市民發問專訪",
    categories: ["public_interview", "campaign", "city_governance", "personal_profile"],
    priority: 5,
    people: ["沈伯洋", "王偉忠", "蔣萬安"],
    keywords: [
      "王偉忠",
      "偉忠哥",
      "欸我說到哪裡了",
      "欸！我說到哪裡了？",
      "老市民發問",
      "中廣流行網",
      "i like radio",
      "市長考題",
      "異溫層",
      "破圈",
      "市長你給我聽好了",
      "1999",
      "市政願景",
      "城市文化",
      "城市美學",
      "都更",
    ],
    keyFacts: [
      "2026-09-10，沈伯洋接受王偉忠主持的中廣流行網《欸！我說到哪裡了？》『老市民發問』專訪。",
      "兩人談到沈伯洋的個人與從政經歷、台北市政願景、城市文化與政策執行，也討論『市長，你給我聽好了』LINE 市民意見平台。",
      "王偉忠在節目中肯定該市民平台的互動設計，並以『市長考題』追問市長角色、施政差異與執行面。",
      "沈伯洋隔日受訪表示談話愉快，王偉忠提出不少執行面與文化政策建議；他希望不同政治立場的人都能一起關心台北問題與解方。",
      "影片在上線後引發大量討論；媒體於 9 月 13 日報導已突破百萬觀看，但觀看數是特定時間截點，不等於選票或支持度。",
    ],
    shenPublicPosition: [
      "願意走進不同政治光譜的節目，讓市政政策接受追問，也聽取執行與文化界的意見。",
      "流量不代表選票，但能讓更多不同立場的人開始討論台北市政，就是有意義的交流。",
    ],
    answerGuidance:
      "若被問『有沒有上王偉忠節目』，直接回答有：9 月 10 日上《欸！我說到哪裡了？》接受『老市民發問』專訪。可摘要市長角色、市政執行、文化與市民平台；若問流量，必須加上統計日期，並清楚說觀看數不等於得票。",
    avoidClaims: [
      "不要把王偉忠的稱讚解讀成公開背書、支持沈伯洋或改變投票意向。",
      "不要把觀看數、留言或網路聲量直接說成民調或選票。",
      "不要自行宣稱已確定下一次合體的主持人、節目或時間。",
    ],
    sources: [
      {
        label: "中廣流行網 i like radio 2026-09-10｜完整專訪",
        url: "https://www.youtube.com/watch?v=jvAJlObFj6k",
        sourceType: "major_media",
        publishedAt: "2026-09-10",
      },
      {
        label: "中央社 2026-09-11｜沈伯洋回應王偉忠專訪",
        url: "https://www.cna.com.tw/news/aloc/202609110071.aspx",
        sourceType: "major_media",
        publishedAt: "2026-09-11T11:26:00+08:00",
      },
      {
        label: "TVBS 2026-09-13｜專訪觀看突破百萬與後續規劃",
        url: "https://news.tvbs.com.tw/politics/4021522",
        sourceType: "major_media",
        publishedAt: "2026-09-13T11:05:00+08:00",
      },
    ],
  },
  {
    id: "2026-09-09-taipei-speaks-up-platform",
    date: "2026-09-09",
    title: "『市長，你給我聽好了』LINE 市民心聲蒐集平台上線",
    categories: ["campaign", "city_governance", "policy", "public_interview"],
    priority: 5,
    people: ["沈伯洋"],
    keywords: [
      "市長你給我聽好了",
      "你給我聽好",
      "市民心聲",
      "LINE平台",
      "LINE市民意見",
      "市民意見蒐集",
      "市民變主角",
      "可愛動物",
      "排隊發言",
      "12行政區",
      "1999",
      "實體活動",
      "大數據分析",
    ],
    keyFacts: [
      "平台於 2026-09-08 晚間上線，9 月 9 日舉行『市長，你給我聽好了』市民心聲蒐集平台記者會。",
      "市民可透過 LINE 提出對台北市政的建議或感受，化身代表不同生活處境的可愛動物，在 12 個行政區特色背景中排隊發言。",
      "平台設計包含 12 區生活場景、排隊期間互動，以及議題分類；團隊規劃整理不同議題與地區意見，作為政策研擬材料。",
      "截至 9 月 9 日記者會時，平台註冊人數破萬並收到近 4000 則市政意見；9 月 11 日公開說法則為約 2 萬餘則留言。",
      "沈伯洋表示 10 月將規劃實體活動，讓市民面對面討論市政並回應蒐集到的問題。",
    ],
    shenPublicPosition: [
      "城市的主人是居民，選舉不應只有參選人講、市民聽，而要把麥克風交給市民。",
      "線上蒐集的意見要依議題與行政區整理，後續回應並轉化為城市痛點的政策解方。",
    ],
    answerGuidance:
      "被問這個平台是什麼時，先說它是 LINE 市民意見蒐集與互動平台，再說留言會按議題、行政區整理並銜接實體討論；人數與留言數一定要標示統計日期，不要當成現在即時數字。",
    avoidClaims: [
      "不要說所有留言都會直接變成政策或一定逐則由沈伯洋本人回覆。",
      "不要把註冊、留言數說成支持者數、民調或選票。",
    ],
    sources: [
      {
        label: "『市長，你給我聽好了』官方平台",
        url: "https://taipeispeaksup.org/",
        sourceType: "official_campaign",
        publishedAt: "2026-09-08",
      },
      {
        label: "中央社 2026-09-09｜市民心聲蒐集平台上線",
        url: "https://www.cna.com.tw/news/aipl/202609090125.aspx",
        sourceType: "major_media",
        publishedAt: "2026-09-09T13:02:00+08:00",
      },
    ],
  },
  {
    id: "2026-09-07-child-abuse-direct-talk-with-chiang",
    date: "2026-09-07",
    title: "與蔣萬安同場時當面提兒虐制度問題",
    categories: ["child_safety", "city_governance", "public_interview"],
    priority: 5,
    people: ["沈伯洋", "蔣萬安"],
    keywords: ["兒虐", "兒童保護", "系統性問題", "蔣萬安", "悄悄話", "計程車工會", "毒油", "問A答B"],
    keyFacts: [
      "2026-09-06 晚間，沈伯洋與蔣萬安在台北市計程車駕駛員職業工會中元普渡聯歡晚會同場。",
      "沈伯洋主動向蔣萬安表示，近期兒虐已成系統性問題，希望市府在制度上多幫忙。",
      "蔣萬安後續受訪轉談中央應說明毒油等問題；沈伯洋隔日受訪認為市府不應總把問題指向別人。",
    ],
    shenPublicPosition: [
      "政治競爭與兒童保護應分開，兒虐問題應回到制度與市府責任。",
      "兒虐是需要市府正視的系統性問題。",
    ],
    answerGuidance:
      "若被問『你最近跟蔣萬安碰面說什麼』，可直接回答：9 月 6 日晚間活動同場時，我當面跟他提兒虐制度問題，希望市府正視；這是我隔天公開還原的內容。",
    avoidClaims: ["不要說蔣萬安當場已答應改革。", "不要把任何單一兒虐案件責任直接歸給蔣萬安個人。"],
    sources: [
      { label: "華視新聞 2026-09-07", url: "https://news.cts.com.tw/cts/politics/202609/202609073075846.html", sourceType: "major_media", publishedAt: "2026-09-07T12:30:00+08:00" },
      { label: "TVBS 2026-09-07", url: "https://news.tvbs.com.tw/politics/4018534", sourceType: "major_media", publishedAt: "2026-09-07T10:25:00+08:00" },
    ],
  },
  {
    id: "2026-09-07-pop-radio-interview-citizen-project",
    date: "2026-09-07",
    title: "POP Radio 專訪：預告 9 月中推出市民參與企劃",
    categories: ["public_interview", "campaign", "personal_profile"],
    priority: 3,
    people: ["沈伯洋", "林書煒"],
    keywords: ["POP Radio", "POP最正點", "林書煒", "市民參與", "9月中", "新企劃", "妻女", "家庭", "選戰"],
    keyFacts: [
      "2026-09-07 上午，沈伯洋接受 POP Radio《POP最正點》專訪。",
      "訪談談及參選後生活、家庭互動與下一階段選戰規劃。",
      "他預告 9 月中將推出新的市民參與企劃，但當時尚未完整公布細節。",
    ],
    shenPublicPosition: ["下一階段選戰將增加市民直接參與與接受檢驗的設計。"],
    answerGuidance:
      "若被問『今天專訪有什麼新東西』，可說他預告 9 月中會推出市民參與新企劃；但細節尚未正式公布。",
    avoidClaims: ["不要把尚未公布的企劃說成已正式啟動。", "不要自行發明參加方式、獎項或政策內容。"],
    sources: [
      { label: "民視新聞 2026-09-07（轉述 POP Radio 專訪）", url: "https://www.ftvnews.com.tw/news/detail/2026907W0334", sourceType: "secondary_media", publishedAt: "2026-09-07T12:55:00+08:00" },
    ],
  },
  {
    id: "2026-09-06-cultural-governance",
    date: "2026-09-06",
    title: "大型文化活動與市政治理：主張不能只像放煙火",
    categories: ["city_governance", "public_interview"],
    priority: 3,
    districts: ["士林區"],
    people: ["沈伯洋"],
    keywords: ["大象來了", "10萬人", "士林", "文化活動", "長期規劃", "參加率", "無菸城市", "生生喝鮮奶"],
    keyFacts: [
      "沈伯洋針對大型文化活動與市府多項政策表示，政策不應只做一次性活動，而要有長期規劃與可被檢驗的參與結果。",
      "他同時提到無菸城市、生生喝鮮奶兌換等市政政策仍需檢討精進。",
    ],
    shenPublicPosition: ["城市活動不能只像放煙火，應追蹤參加率、配套與長期城市效益。"],
    answerGuidance:
      "若被問大型活動治理，可引用這次公開說法：活動不是人很多就算成功，還要看事前規劃、交通、參與方式與活動結束後是否留下長期效益。",
    sources: [
      { label: "中央社 2026-09-06", url: "https://www.cna.com.tw/news/aloc/202609060021.aspx", sourceType: "major_media", publishedAt: "2026-09-06" },
    ],
  },
  {
    id: "2026-09-05-debate-format",
    date: "2026-09-05",
    title: "公開表態期待台北市長辯論有交互詰問與市民參與",
    categories: ["debate", "campaign", "public_interview"],
    priority: 4,
    people: ["沈伯洋", "蔣萬安"],
    keywords: ["辯論", "市政辯論", "交互詰問", "追問", "市民參與", "蔣萬安", "政策發表會"],
    keyFacts: [
      "沈伯洋表示公辦政策發表會是最基本，並期待能有真正的辯論。",
      "他希望辯論包含參選人互相詰問、互相追問與市民參與環節。",
      "蔣萬安表示會勾選辯論選項，並願在適當場合以適合方式進行市政對話。",
    ],
    shenPublicPosition: ["辯論不應只有輪流念政見，而應有追問、交互詰問與市民參與。"],
    answerGuidance:
      "被問『敢不敢跟蔣萬安辯論』時可直接答敢，而且公開主張希望有互相追問與市民參與；不要只回答『政策最重要』來閃題。",
    sources: [
      { label: "中央社 2026-09-05", url: "https://www.cna.com.tw/news/aloc/202609050116.aspx", sourceType: "major_media", publishedAt: "2026-09-05" },
    ],
  },
  {
    id: "2026-09-04-05-chiang-son-exchange-program",
    date: "2026-09-05",
    title: "蔣萬安兒子國際交換學生爭議：保護孩子、檢驗程序與利益迴避",
    categories: ["opponent_controversy", "child_safety", "public_interview"],
    priority: 5,
    people: ["沈伯洋", "蔣萬安"],
    councilors: ["洪婉臻"],
    keywords: ["蔣萬安小孩", "蔣萬安兒子", "獎學金", "交換學生", "國際交換學生學習計畫", "美國籍", "公費", "利益迴避", "利益衝突", "洪婉臻", "未成年人"],
    keyFacts: [
      "較精確的事件名稱是台北市教育局『國際交換學生學習計畫』，不是一般意義的獎學金。",
      "蔣萬安大兒子錄取該計畫；北市教育局說計畫無國籍限制並依既定資格與程序甄選。",
      "蔣萬安表示未介入甄選，家庭後來決定不領教育局相關補助。",
      "民進黨議員洪婉臻在議會質疑利益衝突迴避自主檢核程序；蔣萬安回應已依教育局文件揭露父子關係與應揭露事項。",
      "截至本 KB snapshot，不能把事件直接說成已被認定違法。",
    ],
    shenPublicPosition: [
      "孩子本身優秀、申請或出國不應成為政治攻擊標的。",
      "政治檢驗應聚焦北市府處理程序、利益衝突揭露與是否採最高標準。",
      "政治人物的父母與政府更應把程序做完整，避免孩子被推到政治聚光燈下。",
    ],
    answerGuidance:
      "使用者說『蔣萬安小孩拿獎學金』時先溫和更正事件名稱，再回答：我不拿孩子來攻擊，真正該檢驗的是市長的孩子參加市府自己的競爭型計畫時，利益衝突揭露與程序有沒有用最高標準處理。",
    avoidClaims: [
      "不要說孩子靠特權錄取，除非有正式調查結論。",
      "不要說蔣萬安已經違法，截至 snapshot 沒有這種正式認定。",
      "不要討論未成年人的非必要私人資訊。",
    ],
    sources: [
      { label: "中央社 2026-09-04｜沈伯洋：保護孩子，焦點在市府程序", url: "https://www.cna.com.tw/news/aloc/202609040106.aspx", sourceType: "major_media", publishedAt: "2026-09-04" },
      { label: "中央社 2026-09-04｜洪婉臻質詢利益迴避，蔣萬安稱已揭露", url: "https://www.cna.com.tw/news/aloc/202609040256.aspx", sourceType: "major_media", publishedAt: "2026-09-04" },
      { label: "中央社 2026-09-05｜沈伯洋再談程序與利益衝突", url: "https://www.cna.com.tw/news/aloc/202609050066.aspx", sourceType: "major_media", publishedAt: "2026-09-05" },
      { label: "中央社 2026-09-04｜教育部否認曾查詢僑生身分", url: "https://www.cna.com.tw/news/ahel/202609040198.aspx", sourceType: "major_media", publishedAt: "2026-09-04" },
    ],
  },
  {
    id: "2026-09-02-registration-tsai",
    date: "2026-09-02",
    title: "正式完成台北市長參選登記，蔡英文陪同並送船舵",
    categories: ["registration", "campaign"],
    priority: 5,
    people: ["沈伯洋", "蔡英文", "吳思瑤", "吳沛憶", "王世堅"],
    keywords: ["登記", "參選登記", "蔡英文", "船舵", "舵輪", "洋流", "礁石", "26名議員", "26+1", "台北順起來", "航向新未來", "候選人號次", "幾號"],
    keyFacts: [
      "2026-09-02，沈伯洋赴台北市選舉委員會完成台北市長參選登記。",
      "前總統蔡英文公開陪同，並送沈伯洋象徵掌舵的船舵／舵輪。",
      "當天有 26 名民進黨台北市議員參選人，以及競選總幹事吳思瑤、執行總幹事吳沛憶、競總副主委王世堅等陪同。",
      "蔡英文以治理城市像開船比喻，強調不能等快撞上礁石才轉彎，政策與風險要比問題早一步。",
      "截至 2026-09-07，選票號次尚未抽籤；登記順序不等於候選人號次。",
    ],
    shenPublicPosition: [
      "登記當天把自己定位為問題解決者與開拓者，強調治理不能只在出事後貼 OK 繃。",
      "競選意象延伸為『洋流』與『航向新未來』。",
    ],
    answerGuidance:
      "被問『哪天登記』『蔡英文有沒有陪』『你現在幾號』時，本 KB 可直接回答前兩題；號次要明確說尚未抽，不得猜。",
    avoidClaims: ["不要說蔡英文是競總主委。", "不要說蔡英文會加入未來市府。", "不要把 26 名參選人永久當成最後正式當選或最終候選人名單。"],
    sources: [
      { label: "中央社 2026-09-02", url: "https://www.cna.com.tw/news/aipl/202609020063.aspx", sourceType: "major_media", publishedAt: "2026-09-02" },
    ],
  },
  {
    id: "2026-09-02-japan-city-diplomacy-factcheck",
    date: "2026-09-02",
    title: "規劃訪日談城市外交，並再澄清『所有交流都是統戰』誤解",
    categories: ["international", "fact_check", "public_interview"],
    priority: 3,
    people: ["沈伯洋", "洪申翰"],
    keywords: ["訪日", "日本", "東京", "城市外交", "都更", "運動驛站", "海外後援會", "統戰", "所有交流", "APEC", "南京"],
    keyFacts: [
      "沈伯洋表示規劃訪日，會討論國會外交與城市外交，並觀察東京都更與運動驛站等城市政策。",
      "他也提到成立海外後援會與蒐集海外民眾意見。",
      "針對『赴兩岸交流都是統戰』的說法，他再次澄清原意是中國會把交流納入統戰，因此國人赴中應注意風險，不是說所有交流本身都等於統戰。",
    ],
    shenPublicPosition: ["城市外交與國際政策學習可以和地方治理結合。", "對中國交流的核心立場是風險提醒，不是把所有交流一概定義成統戰。"],
    answerGuidance:
      "若被問『你是不是反對所有中國交流』，不要沿用錯誤標籤；直接說公開澄清是提醒中國會把交流納入統戰操作，國人赴中應注意風險。",
    sources: [
      { label: "中央社 2026-09-02", url: "https://www.cna.com.tw/news/aloc/202609020133.aspx", sourceType: "major_media", publishedAt: "2026-09-02" },
      { label: "沈伯洋競選官網闢謠專區", url: "https://puma.taipei/news", sourceType: "official_campaign" },
    ],
  },
  {
    id: "2026-09-01-tsai-line-good-friend",
    date: "2026-09-01",
    title: "蔡英文 LINE 以『一個好朋友』介紹沈伯洋並預告陪同登記",
    categories: ["campaign", "personal_profile"],
    priority: 4,
    people: ["沈伯洋", "蔡英文"],
    keywords: ["蔡英文", "LINE", "一個好朋友", "好朋友", "洋流", "陪同登記", "25+1"],
    keyFacts: [
      "2026-09-01 下午，蔡英文官方 LINE 發訊向台北朋友介紹『一個好朋友』，並導流至沈伯洋官方 LINE。",
      "同日競辦預告蔡英文將於 9 月 2 日陪同登記。",
    ],
    shenPublicPosition: ["蔡英文對這次參選有明確公開支持關係。"],
    answerGuidance:
      "被問『你跟蔡英文熟嗎』時可以說公開支持關係很明確，她甚至在官方 LINE 以『一個好朋友』介紹我；但私人熟度不要自行加戲。",
    avoidClaims: ["不要把『好朋友』自動升級為『最好的朋友』或私人決策夥伴。"],
    sources: [
      { label: "中央社 2026-09-01", url: "https://www.cna.com.tw/news/aipl/202609010359.aspx", sourceType: "major_media", publishedAt: "2026-09-01" },
    ],
  },
  {
    id: "2026-08-31-business-today-city-interview",
    date: "2026-08-31",
    title: "今周刊市政專訪：2500 億預算有感、老屋行動服務團、北士科台北研究院",
    categories: ["public_interview", "policy", "city_governance"],
    priority: 5,
    people: ["沈伯洋"],
    keywords: ["今周刊", "2500億", "預算", "老屋延壽", "行動服務團", "北士科", "台北研究院", "自行車橋", "內湖", "最後一哩", "運動驛站", "青年外流"],
    keyFacts: [
      "沈伯洋在《今周刊》專訪提出，若當選，希望讓市民感受到台北市約 2500 億元預算真正用在自己身上。",
      "他主張老屋延壽可成立『行動服務團』，主動到社區說明與協助，而不是只等住戶自己申請。",
      "北士科方面提到『台北研究院』、產業與人才政策，以及交通分流。",
      "交通構想包括北士科與內湖之間的分流、最後一哩與自行車橋等討論。",
      "也談到運動驛站、青年外流與生活隱形成本。",
    ],
    shenPublicPosition: [
      "市政成敗不能只看政策是否存在，而要看市民能不能實際使用。",
      "台北預算的價值要反映在市民生活的時間、便利與服務可及性。",
    ],
    answerGuidance:
      "這篇可回答『你怎麼管 2500 億預算』『老宅怎麼主動服務』『北士科怎麼發展』，不需要每次重新 web_search。",
    avoidClaims: ["2500 億是對台北市總預算規模的概括語言，不代表每一項政策已有逐筆財源表。"],
    sources: [
      { label: "今周刊 2026-08-31｜市政專訪", url: "https://www.businesstoday.com.tw/article/category/183027/post/202608240037/", sourceType: "major_media", publishedAt: "2026-08-31T14:55:00+08:00" },
    ],
  },
  {
    id: "2026-08-31-business-today-profile",
    date: "2026-08-31",
    title: "今周刊人物專訪：五分埔家族、法律犯罪學、動漫與戰鬥陀螺",
    categories: ["personal_profile", "public_interview"],
    priority: 3,
    people: ["沈伯洋", "沈土城", "李茂生"],
    keywords: ["今周刊", "五分埔", "復興寶寶", "楊過", "李茂生", "60分", "犯罪學", "Final Fantasy", "EVA", "初音未來", "戰鬥陀螺", "動漫", "父親", "沈土城"],
    keyFacts: [
      "人物專訪整理沈伯洋在台北成長、五分埔家族背景、復興體系求學、建中與台大法律等人生經歷。",
      "專訪談到李茂生課堂、刑法與犯罪學形成，以及從法律走向犯罪學、人權與公共事務的脈絡。",
      "也記錄其 Final Fantasy、EVA、初音未來、戰鬥陀螺等公開興趣。",
    ],
    shenPublicPosition: ["理解問題根源與拆解制度，是其法律、犯罪學與公共工作路徑的重要共同點。"],
    answerGuidance:
      "人物介紹、宅男興趣、為什麼研究犯罪學等問題可直接用這篇；不要把過去喜好講成永久的『目前最愛』。",
    sources: [
      { label: "今周刊 2026-08-31｜人物專訪", url: "https://www.businesstoday.com.tw/article/category/183027/post/202608260070/", sourceType: "major_media", publishedAt: "2026-08-31T14:55:00+08:00" },
    ],
  },
  {
    id: "2026-08-28-former-mayors",
    date: "2026-08-28",
    title: "向歷任台北市長請益：批評一個人不代表要丟掉他做對的事",
    categories: ["city_governance", "public_interview", "campaign"],
    priority: 4,
    districts: ["信義區"],
    people: ["沈伯洋", "馬英九", "陳水扁", "柯文哲", "郝龍斌"],
    keywords: ["歷任市長", "請益", "馬英九", "陳水扁", "柯文哲", "郝龍斌", "政策延續", "無菸城市", "專責單位"],
    keyFacts: [
      "沈伯洋表示會向歷任台北市長了解好的市政如何延續，以及政策推動時市府內部容易遇到的阻礙。",
      "即使對某些政治人物有不同立場或批評，也不代表要把對方做對的事情全部丟掉。",
      "同日談無菸城市時，批評政策若沒有整體計畫、配套與專責單位，容易導致基層揣摩上意。",
    ],
    shenPublicPosition: ["城市治理可以跨越政黨吸收有效做法。", "政策要有 owner、配套、資料與可追蹤執行架構。"],
    answerGuidance:
      "如果被問『你會不會把蔣萬安／柯文哲以前的政策全部推翻』，可以直接引用這個治理態度：對人有批評，不代表做對的事要丟掉。",
    sources: [
      { label: "中央社 2026-08-28", url: "https://www.cna.com.tw/news/aloc/202608280051.aspx", sourceType: "major_media", publishedAt: "2026-08-28" },
    ],
  },
  {
    id: "2026-08-23-weak-candidate-response",
    date: "2026-08-23",
    title: "回應『太弱』評價：因為弱，所以更要勤走基層",
    categories: ["campaign", "public_interview"],
    priority: 2,
    districts: ["中山區"],
    people: ["沈伯洋", "柯文哲"],
    keywords: ["太弱", "弱", "柯文哲", "勤走基層", "濱江市場", "選戰"],
    keyFacts: [
      "柯文哲評論沈伯洋太弱後，沈伯洋回應柯文哲當年參選時也曾被說弱但仍勝選。",
      "沈伯洋表示因為被認為弱，所以更要勤走基層。",
    ],
    shenPublicPosition: ["不把外界強弱評價當答案，而把基層接觸與市民信任視為要持續累積的工作。"],
    answerGuidance:
      "若被問『很多人說你選不贏』，可以用這則回答而不是硬吹民調：我知道外界會評強弱，我能做的是繼續把市民一個一個說服。",
    sources: [
      { label: "中央社 2026-08-23", url: "https://www.cna.com.tw/news/aipl/202608230061.aspx", sourceType: "major_media", publishedAt: "2026-08-23" },
    ],
  },
  {
    id: "2026-08-16-songshan-wufenpu",
    date: "2026-08-16",
    title: "松山信義地方主張：廣慈／奉天宮站通車後改善五分埔人流導引",
    categories: ["district", "councilor_cooperation", "policy"],
    priority: 4,
    districts: ["信義區", "松山區"],
    people: ["沈伯洋"],
    councilors: ["洪健益", "張文潔", "許淑華"],
    keywords: ["松山", "信義", "奉天宮", "廣慈奉天宮站", "五分埔", "商圈", "人流", "路口", "指示", "捷運", "洪健益", "張文潔", "許淑華"],
    keyFacts: [
      "沈伯洋與洪健益、張文潔、許淑華等公開同行走訪松山奉天宮與中坡福德市場。",
      "他提到信義線東延段廣慈／奉天宮站通車後，捷運周邊到五分埔商圈的動線、人流導引、路口交通設計與指示應改善。",
    ],
    shenPublicPosition: ["捷運通車不是終點，站點與商圈間最後的人流設計要真正讓地方受益。"],
    answerGuidance:
      "被問『松山／信義你公開講過什麼改善』時可用這件，不必憑印象硬湊三大問題。",
    sources: [
      { label: "中央社 2026-08-16", url: "https://www.cna.com.tw/news/aloc/202608160067.aspx", sourceType: "major_media", publishedAt: "2026-08-16" },
    ],
  },
  {
    id: "2026-08-12-councilor-joint-campaign",
    date: "2026-08-12",
    title: "與 26 名民進黨議員參選人聯合競選，建立『台北隊』",
    categories: ["councilor_cooperation", "campaign"],
    priority: 5,
    people: ["沈伯洋", "吳沛憶"],
    keywords: ["26名", "市議員參選人", "聯合競選", "聯合配票", "台北隊", "吳沛憶", "市議員合作"],
    keyFacts: [
      "2026-08-12，沈伯洋與 26 名民進黨台北市議員參選人共同出席聯合競選記者會。",
      "沈伯洋稱這是一支『台北隊』；北市黨部主委吳沛憶表示將採聯合配票策略。",
      "這能證明與民進黨議員參選體系有正式競選合作，但不能推論每位都是私人好友或已共同制定市政政策。",
    ],
    shenPublicPosition: ["市長與議員選舉採整體團隊方式合作，但地方議題與個別政策仍要分別看公開紀錄。"],
    answerGuidance:
      "被問『你跟民進黨議員有沒有合作』時，這是最強的整體性證據；如果問某一位具體合作，再查 councilors.ts 的 confirmedPublicEvents。",
    avoidClaims: ["不要把 26 名參選人說成全部是現任議員。", "不要把聯合競選說成未來市府人事名單。"],
    sources: [
      { label: "中央社 2026-08-12", url: "https://www.cna.com.tw/news/aloc/202608120083.aspx", sourceType: "major_media", publishedAt: "2026-08-12" },
    ],
  },
  {
    id: "2026-08-11-heart-platform",
    date: "2026-08-11",
    title: "發布 HEART 五大政見主軸",
    categories: ["policy", "campaign"],
    priority: 5,
    people: ["沈伯洋"],
    keywords: ["HEART", "Habitat", "Empower", "Accompany", "Resilience", "Time", "台北順起來", "婚育宅", "青年宅", "老宅延壽", "城市基金", "夜間市長", "永續長", "設計長"],
    keyFacts: [
      "2026-08-11，沈伯洋發布 HEART 五大政見主軸。",
      "H / Habitat 聚焦空間與居住；E / Empower 聚焦青年與機會；A / Accompany 聚焦陪伴與長照等；R / Resilience 聚焦城市韌性；T / Time 聚焦替市民省時間。",
      "公開內容包含婚育宅與青年宅、老宅延壽、城市基金、兩河流域、山徑、運動與家庭喘息，以及永續長、設計長、夜間市長等方向。",
    ],
    shenPublicPosition: ["城市政策不是各局處單點，而是以空間、機會、陪伴、韌性與時間組成政策生態系。"],
    answerGuidance:
      "被問『你的整體市政架構是什麼』時，這是目前最完整的總綱，不需要重新搜尋。",
    sources: [
      { label: "中央社 2026-08-11", url: "https://www.cna.com.tw/news/aloc/202608110044.aspx", sourceType: "major_media", publishedAt: "2026-08-11" },
    ],
  },
  {
    id: "2026-07-16-sports-policy",
    date: "2026-07-16",
    title: "首場政策發表聚焦運動：健身小巴、超級運動中心、國際足球場",
    categories: ["policy"],
    priority: 4,
    districts: ["北投區", "中山區"],
    people: ["沈伯洋", "吳思瑤", "陳培瑜", "石明謹", "劉柏君"],
    keywords: ["運動政策", "健身小巴", "國際足球場", "關渡", "花博", "超級市民運動中心", "運動平權", "河濱", "運動驛站"],
    keyFacts: [
      "沈伯洋提出小、中、大三層次運動政策。",
      "方向包含健身小巴到社區、每區增加小型特色運動據點、花博規劃超級市民運動中心，以及優先評估關渡國際級足球場。",
      "河濱空間也主張改善球場、遮陽、照明、AED 與接駁。",
    ],
    shenPublicPosition: ["運動政策不是只有蓋大型場館，而是從家門口、社區、城市場館到國際賽事形成完整生態系。"],
    answerGuidance:
      "被問『國際足球場是不是大撒幣』時，先說足球場只是大層次之一，前面還有社區運動與市民運動場館。",
    sources: [
      { label: "中央社 2026-07-16", url: "https://www.cna.com.tw/news/aipl/202607160060.aspx", sourceType: "major_media", publishedAt: "2026-07-16" },
    ],
  },
  {
    id: "2026-06-28-neihu-flood",
    date: "2026-06-28",
    title: "內湖淹水後主張預警、災中應變、災後造冊與補助恢復",
    categories: ["district", "city_governance", "policy"],
    priority: 5,
    districts: ["內湖區"],
    people: ["沈伯洋"],
    keywords: ["內湖淹水", "淹水", "防洪", "防災", "預警", "抽水", "消毒", "造冊", "家電補助", "災害準備金", "大湖溪"],
    keyFacts: [
      "2026-06-25 內湖淹水後，沈伯洋公開表示當天前往災區了解狀況。",
      "他以立委身分與中央協調災損救助；後續中央放寬部分家戶淹水與家電損失補助標準。",
      "其治理論述延伸為災前風險盤點與預警、災中通報與抽水調度、災後造冊、清潔消毒、補助與生活恢復。",
    ],
    shenPublicPosition: ["防災不能只在災後補助，而要把預警、現場應變與災後恢復連成完整流程。"],
    answerGuidance:
      "可說『我有參與現場了解與中央協調，之後中央放寬標準』；不能說『完全是因為我中央才改』。",
    avoidClaims: ["不要把中央政策改變的全部因果歸功於沈伯洋。"],
    sources: [
      { label: "沈伯洋競選官網 2026-06-26", url: "https://puma.taipei/policies/20260626", sourceType: "official_campaign", publishedAt: "2026-06-26" },
      { label: "沈伯洋競選官網每日受訪索引", url: "https://puma.taipei/videos", sourceType: "official_campaign" },
    ],
  },
  {
    id: "2026-06-17-neihu-traffic",
    date: "2026-06-17",
    title: "內湖交通五層方案：錯峰、彈性工時、捷運、最後一哩、住宅",
    categories: ["district", "policy", "city_governance"],
    priority: 5,
    districts: ["內湖區"],
    people: ["沈伯洋", "蔣萬安"],
    keywords: ["內湖交通", "內科", "塞車", "錯峰", "彈性工時", "捷運", "電動小巴", "最後一哩", "住宅", "ESG", "企業誘因"],
    keyFacts: [
      "沈伯洋公開提出內湖交通多層方案：企業錯峰上下班、彈性工時、持續捷運建設、電動小巴最後一哩、住宅與都市規劃。",
      "公開說法也提到用市府誘因鼓勵企業把彈性工時與 ESG 連結。",
      "沈伯洋自己也承認蔣市府曾提出部分類似方向，因此這題核心不是『誰先想到』，而是執行。",
      "北市府公開資料顯示，既有措施包含堤頂大道與瑞光路 358 巷分流、新增堤頂交流道北上入口引道、新闢東環幹線，以及內科與南軟雙園接駁。",
      "北市府公布內科 7 條幹道下午尖峰旅行時間平均下降 6.07%，其中港墘路降幅 11.45%；這些是市府公布成果，回答時應清楚歸因。",
    ],
    shenPublicPosition: [
      "東環段完成前的交通黑期不能只等捷運，要同步處理企業時間、接駁、住宅與既有交通。",
      "真正要驗收的是通勤時間、企業參與、接駁運量與執行結果。",
    ],
    answerGuidance:
      "被問『蔣萬安不是也想到這些』時要直接承認很多工具不是新發明，再把比較拉回企業誘因、最後一哩、通勤時間與 KPI。",
    sources: [
      { label: "沈伯洋競選官網 2026-06-17", url: "https://puma.taipei/policies/20260617", sourceType: "official_campaign", publishedAt: "2026-06-17" },
      { label: "臺北市政府：市府積極改善內湖交通，旅行時間下降 6.07%", url: "https://www.gov.taipei/News_Content.aspx?n=F0DDAF49B89E9413&s=B2603ED5E6FD0229", sourceType: "official_government", publishedAt: "2026-08-16" },
    ],
  },
];

function normalizeText(input: unknown) {
  return String(input ?? "")
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[，。！？、,.!?：:；;「」『』（）()\[\]【】]/g, "");
}

function normalizeQueryFocus(input: unknown) {
  return normalizeText(input).replace(
    /我想問|請問|幫我查一下|幫我查|告訴我|關於|沈伯洋|今天|昨日|昨天|最近|目前|現在|最新|新聞|消息|報導|公開受訪|受訪|專訪|公開表示|表示|說了|講了|談了|說|講|談|什麼|哪些|內容|一下|怎麼|為什麼|有沒有|是否|這件事|那件事|的|是|有/g,
    ""
  );
}

function dateInRange(date: string, from?: string, to?: string) {
  if (from && date < from) return false;
  if (to && date > to) return false;
  return true;
}

function eventSearchText(event: ShenMediaEvent) {
  return normalizeText(
    [
      event.title,
      ...event.categories,
      ...(event.districts || []),
      ...(event.people || []),
      ...(event.councilors || []),
      ...event.keywords,
      ...event.keyFacts,
      ...(event.shenPublicPosition || []),
      event.answerGuidance,
    ].join(" ")
  );
}

export interface ShenMediaKBQuery {
  query?: string;
  category?: ShenMediaCategory;
  district?: string;
  person?: string;
  councilor?: string;
  dateFrom?: string;
  dateTo?: string;
  latest?: boolean;
  limit?: number;
  requiresLatest?: boolean;
}

export function queryShenMediaKB(args: ShenMediaKBQuery = {}) {
  const q = normalizeText(args.query);
  const queryFocus = normalizeQueryFocus(args.query);
  const district = normalizeText(args.district);
  const person = normalizeText(args.person);
  const councilor = normalizeText(args.councilor);

  const filteredRows = SHEN_MEDIA_EVENTS.filter((event) => {
    if (!dateInRange(event.date, args.dateFrom, args.dateTo)) return false;
    if (args.category && !event.categories.includes(args.category)) return false;
    if (district && !(event.districts || []).some((d) => normalizeText(d).includes(district))) return false;
    if (person && !(event.people || []).some((p) => normalizeText(p).includes(person))) return false;
    if (councilor && !(event.councilors || []).some((c) => normalizeText(c).includes(councilor))) return false;
    return true;
  });

  let rows = filteredRows;
  let rankedByQuery = false;

  if (q && queryFocus) {
    rankedByQuery = true;
    const rawTokens = String(args.query || "")
      .split(/[\s，。！？、,.!?：:；;「」『』（）()\[\]【】]+/)
      .map(normalizeText)
      .filter((token) => token.length >= 2);

    rows = filteredRows
      .map((event) => {
        const haystack = eventSearchText(event);
        const searchableTerms = [
          event.title,
          ...(event.districts || []),
          ...(event.people || []),
          ...(event.councilors || []),
          ...event.keywords,
        ]
          .map(normalizeText)
          .filter((term) => term.length >= 2 && term !== "沈伯洋");
        const fieldScore = searchableTerms.reduce(
          (sum, term) =>
            sum +
            (q.includes(term) || term.includes(queryFocus) || queryFocus.includes(term)
              ? 3
              : 0),
          0
        );
        const tokenScore = rawTokens.reduce(
          (sum, token) => sum + (haystack.includes(token) ? 1 : 0),
          0
        );
        const score = (haystack.includes(q) ? 8 : 0) + fieldScore + tokenScore;
        return { event, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || b.event.priority - a.event.priority || b.event.date.localeCompare(a.event.date))
      .map((item) => item.event);
  }

  if (!rankedByQuery) {
    rows = [...rows].sort((a, b) => {
      if (args.latest !== false) return b.date.localeCompare(a.date) || b.priority - a.priority;
      return b.priority - a.priority || b.date.localeCompare(a.date);
    });
  }

  const requestedLimit = Number.isFinite(Number(args.limit)) && Number(args.limit) > 0
    ? Math.min(Math.floor(Number(args.limit)), 20)
    : 6;
  rows = rows.slice(0, requestedLimit);

  const snapshotMs = new Date(SHEN_MEDIA_KB_META.snapshotThrough).getTime();
  const shouldVerifyLatest = Boolean(args.requiresLatest) && Date.now() > snapshotMs;

  return {
    found: rows.length > 0,
    count: rows.length,
    data: rows,
    snapshotThrough: SHEN_MEDIA_KB_META.snapshotThrough,
    shouldSearchWeb: rows.length === 0,
    shouldVerifyLatest,
    freshnessMessage: shouldVerifyLatest
      ? `本 KB 最新只到 ${SHEN_MEDIA_KB_META.snapshotThrough}；使用者要求最新資訊，需再查 web。`
      : `這些事件已收錄於 Local KB，可直接回答，不必重複 web_search。`,
  };
}

export const LOOKUP_SHEN_MEDIA_KB_TOOL = {
  type: "function",
  name: "lookup_shen_media_kb",
  description:
    "查詢沈伯洋 2026 台北市長選戰的本地新聞／公開受訪 KB。涵蓋王偉忠《欸！我說到哪裡了？》專訪、『市長，你給我聽好了』平台、全齡社福政策、訪日城市外交、登記參選、蔡英文互動、辯論、兒虐、市政專訪、HEART、議員聯合競選、內湖交通、防災與運動政策等重大事件。對已收錄歷史事件應優先使用本工具，避免不必要 web_search。",
  parameters: {
    type: "object",
    properties: {
      query: { type: "string", description: "事件或關鍵字，例如：王偉忠、欸我說到哪裡了、市長你給我聽好了、社福、訪日、蔡英文、登記、兒虐、內湖交通、HEART。" },
      category: {
        type: "string",
        enum: ["campaign", "registration", "policy", "debate", "child_safety", "city_governance", "district", "councilor_cooperation", "public_interview", "fact_check", "opponent_controversy", "international", "personal_profile"],
      },
      district: { type: "string", description: "可選，例如內湖區、信義區、松山區。" },
      person: { type: "string", description: "可選，例如蔡英文、蔣萬安、沈伯洋。" },
      councilor: { type: "string", description: "可選，指定市議員姓名。" },
      dateFrom: { type: "string", description: "可選，YYYY-MM-DD。" },
      dateTo: { type: "string", description: "可選，YYYY-MM-DD。" },
      latest: { type: "boolean", description: "是否優先回傳日期最新事件，預設 true。" },
      limit: { type: "integer", minimum: 1, maximum: 20 },
      requiresLatest: { type: "boolean", description: "使用者是否明確問今天最新／現在最新。若 runtime 晚於 KB snapshot，工具會要求再查 web。" },
    },
    additionalProperties: false,
  },
} as const;

export const SHEN_MEDIA_KB_TOOL_INSTRUCTIONS = `
# SHEN MEDIA LOCAL KB

## 先用 lookup_shen_media_kb 的情況

以下已發生事件不要一上來就 web_search：
- 沈伯洋什麼時候登記參選
- 蔡英文為什麼陪同、送什麼、兩人公開關係
- 候選人現在幾號（KB 會提醒尚未抽號次）
- 蔣萬安兒子交換學生／「獎學金」爭議
- 沈伯洋對利益迴避、兒童保護的公開回答
- 市長辯論與交互詰問主張
- 2026-09-07 兒虐制度問題與蔣萬安同場互動
- 2026-09-09「市長，你給我聽好了」市民心聲平台
- 2026-09-10 王偉忠《欸！我說到哪裡了？》專訪
- 2026-09-11 全生命週期社福政策
- 2026-09-11 至 09-14 訪日、旅日青年座談與城市外交
- 2500 億預算、今周刊專訪
- 歷任市長請益
- HEART
- 26 名議員參選人聯合競選
- 松山／信義五分埔人流
- 內湖交通
- 內湖淹水防災
- 運動政策
- 個人長訪與公開興趣

## 路由原則
1. 使用者問已發生且在 snapshotThrough 以前：優先 Local KB。
2. 使用者問「昨天」：依 runtime 日期換算 dateFrom/dateTo 後查 Local KB。
3. 使用者問「今天／現在最新」：先查 Local KB；shouldVerifyLatest = true 才 web_search。
4. Local KB found = true 時，不得再靠模型記憶改寫日期、人物、事件內容。
5. Local KB 沒有支援的新聞，才 web_search。

## 蔣萬安子女事件
- 先把「獎學金」更正為較精確的「北市教育局國際交換學生學習計畫」。
- 保護未成年人。
- 孩子資格／能力、北市府程序、利益衝突揭露要分開。
- 沈伯洋公開立場：保護孩子，政治檢驗聚焦制度、程序、利益迴避。
- 不得說已被認定違法，除非日後正式調查／裁判有新結果。

## 蔡英文
- 2026-09-01 官方 LINE 用「一個好朋友」介紹沈伯洋。
- 2026-09-02 陪同登記、送船舵／舵輪。
- 不得推論蔡英文是競總主委或未來市府成員。

## 登記與號次
- 2026-09-02：完成登記。
- 2026-10-23：候選人號次抽籤。
- 登記順序 ≠ 選票號次。
`;

export function executeShenMediaKBTool(toolName: string, args: any) {
  if (toolName !== "lookup_shen_media_kb") return { handled: false as const };

  return {
    handled: true as const,
    result: queryShenMediaKB({
      query: typeof args?.query === "string" ? args.query : undefined,
      category: typeof args?.category === "string" ? args.category : undefined,
      district: typeof args?.district === "string" ? args.district : undefined,
      person: typeof args?.person === "string" ? args.person : undefined,
      councilor: typeof args?.councilor === "string" ? args.councilor : undefined,
      dateFrom: typeof args?.dateFrom === "string" ? args.dateFrom : undefined,
      dateTo: typeof args?.dateTo === "string" ? args.dateTo : undefined,
      latest: typeof args?.latest === "boolean" ? args.latest : undefined,
      limit: typeof args?.limit === "number" ? args.limit : undefined,
      requiresLatest: typeof args?.requiresLatest === "boolean" ? args.requiresLatest : undefined,
    }),
  };
}
