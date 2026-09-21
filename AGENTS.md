# AI 市長沈伯洋 Realtime 專案指令

這個 repository 已從 OpenAI Realtime 範例改造成「AI 市長沈伯洋」語音產品。`README.md` 的通用 demo 說明已過時；開始工作前先讀 [`docs/CODEX_PROJECT_HANDOFF.md`](docs/CODEX_PROJECT_HANDOFF.md)。

## 與使用者合作

- 預設以台灣繁體中文溝通，先講結果，再補必要技術細節。
- 未經使用者明確同意，不得合併正式版、直接修改 `main`、關閉既有 PR 或把 preview 部署成 production。
- 功能修改先從使用者指定的最新版 preview branch 分支；沒有指定時，先確認目前 PR stack，不能把舊 `App.tsx`、舊 prompt 或附件整份覆蓋最新版。
- 使用者通常要先試 Vercel Preview；交付時提供 PR、preview URL、測試結果與尚未解決的風險。
- 新的對話紀錄是 regression evidence。修正實際失敗句型時，應新增測試，不要只加 prompt 句子。

## 不可破壞的產品行為

- 身分是第一人稱「AI 市長沈伯洋」。只有被明確問是否真人時才說明是 AI 分身。
- Welcome message 必須只出現一次，而且只能是：`你的市長沈伯洋向您問好！`
- Local Tool 一律 silent：Tool 前不可產生可見或可聽的 assistant bridge，不說「我查一下／我整理一下／讓我確認」。
- 每個 finalized user utterance 建立自己的 turn id；新回合要取消或忽略舊 generation、舊 tool result、舊 UI/TTS callback。
- 每個 user turn 最多一次 final assistant response。function output 後只建立一次 final audio response。
- 最新一句優先；自傷、自殺、傷人、炸彈或立即危險必須中斷舊主題重新分類。
- 家庭、生育、收養原因等私人問題只能走固定 privacy boundary，不得推測配偶或新增私人故事。
- Councilor／Village／Media 的姓名、名單、聯絡方式、政策、公開關係與日期以 Local KB 或最新正式來源為準，不得靠模型記憶補資料。
- `found=true` 且資料仍 current 時直接、有把握地回答；只有 `not_found`、`ambiguous`、`stale` 或 `shouldVerifyLatest=true` 才澄清或 web fallback。
- 政治比較先承認可查證成果，再講具體差異；不把政治評價寫成客觀事實，也不攻擊未成年人。

## Active source of truth

- Active `App.tsx` 從最後一個 `// 0902 Add councilors data and villageChief data version` 後的未註解 `"use client";` 開始。檔案前面有大量歷史註解版本，不要修改那些舊區塊。
- Live prompt：`src/app/prompts/shenMayor.system.v21.ts`。
- `src/app/agentConfigs/simpleExample.ts` 保留 V20 做 A/B regression，但 live `greeter` 必須引用 V21。
- Realtime turn、安全、隱私、ASR 與 entity guard：`src/app/runtime/`。
- Deterministic councilor routing：`src/app/lib/councilorRealtimeRouter.ts`。
- General civic routing：`src/app/lib/civicToolRouting.ts`。
- Media routing：`src/app/lib/shenMediaRouting.ts`。
- KB：`src/app/data/councilors.ts`、`villageChiefs.ts`、`shenMediaKB.ts`。
- UI assistant event suppression：`src/app/hooks/useHandleServerEvent.ts`。

## Compatibility contract

除非使用者明確要求 breaking change，保留以下 tool／export／import path：

- `lookup_taipei_councilors`
- `lookup_taipei_councilor_by_name`
- `lookup_taipei_village_chief`
- `lookup_shen_media_kb`
- `TAIPEI_COUNCILORS`
- `LOOKUP_TAIPEI_COUNCILORS_TOOL`
- `LOOKUP_TAIPEI_COUNCILOR_BY_NAME_TOOL`
- `TAIPEI_COUNCILOR_TOOL_INSTRUCTIONS`
- `executeCouncilorTool`
- 既有 Village／Media executor 與 App import path

不要破壞 Realtime 音訊、barge-in、Transcript UI、滿意度、logging、Media KB 或 Village KB。

## Councilor invariants

- 行政區先映射到完整選區，不得用單一 district tag 篩選：士林／北投→1、內湖／南港→2、松山／信義→3、中山／大同→4、中正／萬華→5、大安／文山→6。
- 問單一行政區時回傳該選區全部 current councilors。
- 「跟你同黨／你們黨／同黨議員」固定解析為民主進步黨。
- 保留 conversation context，但全台北公開活動查詢不得被 stale district 綁住。
- Topic tag 只用於搜尋與 quick summary。具體提案／質詢／日期／市府回應／落實狀態要用 `specificPolicyRecords`，不得虛構案號或完成狀態。
- 趙怡翔不是現任台北市議員；陳怡君現任職務與 2026 黨內提名狀態要分開。

## 驗證

目前 `package.json` 與 `package-lock.json` 在 PR #8 基底已不同步，`npm ci` 會失敗。未經使用者同意不要順手重寫 lockfile。

```bash
npm install --package-lock=false --ignore-scripts --no-audit --no-fund
node --test tests/*.test.ts
./node_modules/.bin/tsc --noEmit
OPENAI_API_KEY=sk-build-placeholder npm run build
git diff --check
```

- 專案沒有 `npm test` script；測試請用 `node --test tests/*.test.ts`。
- Build placeholder 只為通過既有 API route 的 import-time client construction；不得把 placeholder 部署或提交。
- 不提交 `.env*`、API key、Vercel token、GitHub token、`node_modules/`、`.next/`、`next-env.d.ts` 或 `tsconfig.tsbuildinfo`。
- 每次 routing、prompt、KB 或 Realtime lifecycle 修改後都要跑完整 tests、type-check、build。

## Git 與部署

- 截至 2026-09-21，preview stack 是 PR #7 → PR #8 → PR #9；詳見 handoff 文件。不要假設 PR #9 直接以 `main` 為 base。
- 建議每個新任務使用獨立 worktree／branch，以目前要測試的最上層 preview PR 為 base。
- GitHub、Vercel、OpenAI API、plugins 與 MCP 登入是帳號／裝置層設定，不會隨 repository 移轉；不得把憑證寫進本檔。

