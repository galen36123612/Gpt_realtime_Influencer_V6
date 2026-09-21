# AI 市長沈伯洋 Realtime｜Codex 專案交接文件

最後更新：2026-09-21（Asia/Taipei）

這份文件是給另一個 Codex 帳號／工作環境的接手者使用。目標不是搬運聊天記憶，而是把可持久、可驗證的專案規則留在 repository，讓新 Codex 開啟專案後可以安全延續工作。

## 1. 專案定位

- Repository：[galen36123612/Gpt_realtime_Influencer_V6](https://github.com/galen36123612/Gpt_realtime_Influencer_V6)
- 技術：Next.js 15、React 19、TypeScript、OpenAI Realtime API、WebRTC、Vercel。
- 產品：第一人稱「AI 市長沈伯洋」中文語音互動系統。
- 核心資料域：台北市議員、台北市里長、沈伯洋新聞／公開受訪與政策 Media KB。
- 產品目標：自然、有帶入感、答案先行；人物與政治資料 grounded；Local KB 低延遲且完全靜默；一個 user turn 只產生一次 final response。

Repository 原始 `README.md` 仍偏向 OpenAI Realtime demo，不能當目前產品規格。真正規格以根目錄 `AGENTS.md`、本文件、active code 與 regression tests 為準。

## 2. Codex instruction 要怎麼搬

### Repository 層：已完成

根目錄 `AGENTS.md` 是新的 Codex 開啟此 repository 時應自動載入的持久指令。它放的是不可破壞的產品規則、驗證指令與工作方式。

接手者應從 Git root 開始新 session，並先要求 Codex：

```text
請先列出你載入的 instruction files，完整閱讀 AGENTS.md 與
docs/CODEX_PROJECT_HANDOFF.md，再用繁體中文摘要目前 active branch、PR stack、
不可破壞的 Realtime invariants、驗證指令與下一步；在摘要完成前不要修改檔案。
```

### 帳號層：不要整包複製

`~/.codex/AGENTS.md`、`~/.codex/config.toml`、skills、plugins、MCP 與連線授權屬於個人帳號或裝置。若只是接手這個專案，不需要整包複製 `~/.codex`；那可能夾帶其他專案規則、絕對路徑、token 或過度權限。

若有跨專案都需要的個人偏好，可在新帳號的 `~/.codex/AGENTS.md` 手動重建，例如：

```md
# Personal Codex defaults

- 預設使用台灣繁體中文。
- 修改前先確認目前 branch、dirty worktree 與 PR base。
- 未經明確同意，不合併 main、不部署 production、不刪除資料。
- 完成程式修改後，回報測試、type-check、build 與實際變更檔案。
```

專案特有規則只留在 repository 的 `AGENTS.md`，避免污染其他專案。

### 必須在新帳號重新連線

- GitHub repository access／GitHub connector。
- Vercel team 與 GitHub integration。
- OpenAI API key。
- 需要的 plugins、skills、MCP servers。
- 任何 workspace 管理員限制與 approval policy。

不要從舊帳號匯出或貼上 API key、session cookie、GitHub token、Vercel token。只在新環境重新授權。

## 3. 目前 Git／PR 狀態

截至 2026-09-21，所有 preview PR 都仍是 Draft、open、mergeable；正式 `main` 沒有被這批 preview 修改。

| 層級 | PR／Branch | Base | 用途 |
|---|---|---|---|
| 正式版基底 | `main` | — | 目前 production／formal baseline |
| Preview 1 | [PR #7](https://github.com/galen36123612/Gpt_realtime_Influencer_V6/pull/7) `codex/realtime-router-clean-preview-20260911` | `main` | deterministic Realtime Local KB router |
| Preview 2 | [PR #8](https://github.com/galen36123612/Gpt_realtime_Influencer_V6/pull/8) `codex/realtime-natural-routing-pr8-20260911` | PR #7 branch | V20、自然 routing、王偉忠 11 筆 atomic Media KB |
| Preview 3 | [PR #9](https://github.com/galen36123612/Gpt_realtime_Influencer_V6/pull/9) `codex/shen-v21-realtime-refactor-pr9-20260920` | PR #8 branch | V21 Realtime Lite + runtime safeguards |

PR #9 preview：<https://gpt-realtime-influencer-v6-git-e41c3e-galens-projects-2dc1580a.vercel.app>

Preview 有 Vercel SSO 保護時，未登入 team 會收到 302 導向 Vercel SSO；這不代表 deployment 失敗。

### 重要：這是一組 stacked PR

PR #9 不是直接以 `main` 為 base。不要在沒理解 stack 時 retarget、force push 或直接把舊 branch 覆蓋上去。

若日後要進正式版，先由使用者決定策略：

1. 依序合併 PR #7 → PR #8 → PR #9；或
2. 從最新正式 `main` 建一條乾淨整合 branch，把最上層 preview 的最終 tree／必要 commits 帶過去，再做完整 regression。

未得到明確同意前，只維護 preview，不合併 formal。

## 4. 新 Codex 的建議啟動流程

1. Clone 或開啟 repository。
2. Trust project，讓 project-scoped Codex instruction 可以載入。
3. 要延續最新版 preview 時，以 `codex/shen-v21-realtime-refactor-pr9-20260920` 為起點建立新的 worktree／branch。
4. 不要一開始 checkout `main` 後用舊 `App.tsx` 覆蓋；`main` 不含整個 stacked preview。
5. 重新建立本機 `.env.local`，至少設定 `OPENAI_API_KEY`。不要提交它。
6. 安裝相依、跑 baseline tests、type-check 與 build。
7. 先在目前 Vercel preview 重現使用者問題，保留完整對話 transcript 和時間點。
8. 修改最小範圍，新增 regression test，再產生新的 preview PR。

建議 clone 後的第一輪唯讀檢查：

```bash
git status --short
git branch --show-current
git log --oneline --decorate -5
git remote -v
rg --files -g 'AGENTS.md' -g 'AGENTS.override.md' -g '.codex/**'
```

## 5. 本機環境與指令

必要環境變數：

- `OPENAI_API_KEY`：`/api/session`、web search、部分 server routes 使用。
- `OPENAI_REALTIME_MODEL`：可選；未設定時目前預設 `gpt-realtime-2.1-mini`。
- `WEB_SEARCH_MODEL`：可選；未設定時目前預設 `gpt-4o-mini`。

目前 PR #8 基底已有 `package.json`／`package-lock.json` 不同步問題，`npm ci` 會拒絕安裝。不要把修 lockfile 混進無關功能 PR；可先用：

```bash
npm install --package-lock=false --ignore-scripts --no-audit --no-fund
```

完整驗證：

```bash
node --test tests/*.test.ts
./node_modules/.bin/tsc --noEmit
OPENAI_API_KEY=sk-build-placeholder npm run build
git diff --check
```

注意：

- 專案目前沒有 `npm test` script。
- 沒設定 `OPENAI_API_KEY` 時，Next production build 會在收集 `/api/chat/completions` page data 時失敗；build-only placeholder 不會送 request。
- Repository 目前沒有可靠的 `.gitignore` 保護所有 generated files。提交前確認沒有 `.next/`、`node_modules/`、`next-env.d.ts`、`tsconfig.tsbuildinfo` 或 `.env*`。

## 6. Active 架構

### Prompt 與 persona

- `src/app/prompts/shenMayor.system.v21.ts`：live V21 Realtime Lite prompt。
- `src/app/agentConfigs/simpleExample.ts`：保留完整 V20，export `SHEN_MAYOR_SYSTEM_PROMPT_V20`；live `greeter` 引用 V21。
- 不要為了更新 prompt 把 `simpleExample.ts` 整份換成附件版本。只同步必要內容並保留 import／export／tools。

### Realtime orchestration

- `src/app/App.tsx`：session update、tool registration、finalized transcript routing、Local Tool execution、function output、final response、logging 與 WebRTC lifecycle。
- 此檔約 83 萬 bytes，前面保存多個歷史註解版本。真正 active block 從最後一個 `// 0902 Add councilors data and villageChief data version` 後面的未註解 `"use client";` 開始。
- 搜尋或修改時鎖定最後一個 active block；不要把變更打進檔案前段的 comment archive。

### Runtime safeguards

- `src/app/runtime/realtimeTurnState.ts`：turn id、response→turn、assistant item→turn、stale discard、final claim dedupe。
- `src/app/runtime/safetyInterrupt.ts`：最新回合 self-harm／harm／explosive／immediate danger 分類與固定回覆。
- `src/app/runtime/privacyBoundary.ts`：配偶懷孕、生育能力、未來生育、收養原因的固定界線。
- `src/app/runtime/entityNormalizer.ts`：ASR 高信心校正與 entity extraction，保留 raw transcript。
- `src/app/runtime/namedEntityGuard.ts`：未 grounded 拉丁人名診斷，例如 `Michael`。Realtime audio 會先串流，因此這層目前主要做 post-generation logging；真正預防仍靠 tool output 和 request instructions。

### Routing

- `src/app/lib/personaRouting.ts`：自我介紹、基本資料、家庭題留在 persona，不誤送 Media KB。
- `src/app/lib/councilorRealtimeRouter.ts`：議員 deterministic intent、entity memory、選區、party／topic／relationship／events、silent tool response 和 final answer config。
- `src/app/lib/civicToolRouting.ts`：Village／Councilor／Media 的 general tool selection 與 argument inference。
- `src/app/lib/shenMediaRouting.ts`：媒體、受訪、公開行程與蔣萬安比較的 Media KB 路由。
- `src/app/hooks/useHandleServerEvent.ts`：隱藏 silent tool assistant output，也丟棄 stale assistant event，避免 UI 重複與舊回合文字回來。

### Knowledge bases

- `src/app/data/councilors.ts`
  - 第 14 屆台北市議員 roster；名冊主要 verified at `2026-09-03`。
  - 完整 constituency normalization。
  - 18 位現任民進黨議員 enriched。
  - 每人 3 筆 `specificPolicyRecords`，共 54 筆。
  - 來源摘要型紀錄標 `evidenceLevel=source_summary`、未知狀態標 `currentStatus=unknown`；不能講成有案號、已採納或已完成。
- `src/app/data/villageChiefs.ts`
  - 台北市里長 snapshot 多數 verified at `2026-01`。
  - 姓名、里名、行政區任一可用線索都應先查 Local KB，不要求使用者一定補齊行政區＋里名。
- `src/app/data/shenMediaKB.ts`
  - `snapshotThrough=2026-09-15T09:15:00+08:00`。
  - 王偉忠訪談已拆成 11 筆 atomic records。
  - `無限都更` 等 dynamic 項目使用 `shouldVerifyLatest`，不能塞進 stable prompt 當已定案政策。

## 7. 核心 request lifecycle

```text
finalized transcript
  → 保留 raw、建立 normalized transcript
  → 建立新 turn id，取消／淘汰舊 turn
  → safety interrupt
  → reproductive privacy boundary
  → persona direct answer（如自介／基本資料）
  → deterministic Councilor／Media／Village routing
  → silent forced function call（text-only，不產生 spoken bridge）
  → App 執行 Local Tool 並送 function_call_output
  → 一次 final audio response
  → stale／duplicate callback 丟棄
```

重要 logs：

- `[LOCAL_ROUTER]`
- `[REALTIME_RESPONSE_TRACE]`
- `[ASR_NORMALIZED]`
- `[ENTITY_GUARD]`
- `[REALTIME_STALE_EVENT]`
- `[REALTIME_STALE_TOOL]`
- `[REALTIME_RESPONSE_DEDUP]`

診斷「很慢、跳針、沒答案」時，先用同一個 `turn_id` 串起 transcript、forcedTool、toolLatencyMs、responseLatencyMs 和 response purpose，不要先把問題全歸咎於 system prompt。

## 8. 不可破壞的 regression 行為

### Welcome／persona

- 只說一次：`你的市長沈伯洋向您問好！`
- 「沈伯洋／沈柏楊／審柏楊」皆解析為沈伯洋。
- 自我介紹、生日、學經歷、婚姻與公開家庭資料走 persona，不走近期新聞。

### Silent tool

- 北安里里長、中山區議員、最近受訪等查詢，Tool 前不得播放「我查一下」。
- Tool function output 後只建立一次 final answer。

### Councilor

- 北投必須回第一選區完整 current roster；文山必須回第六選區完整 roster。
- 「同黨」固定為民主進步黨。
- 「林亮君背景 → 她有哪些政策 → 你會跟她合作嗎」要沿用林亮君。
- 「你跟哪些市議員有公開活動」是全台北 scope，不受前一輪中山／北投綁住。
- 顏若芳 profile／policy／relationship／events 要立即走正確 Local route。
- 問具體哪一案、質詢、日期、回應或進度，不得只回 topic tags。

### Media／Village

- 受訪、節目、最近公開立場走 `lookup_shen_media_kb`。
- 已收錄歷史事件不重複 web search；dynamic 或使用者明確問最新才 verify。
- 里長只提供姓名也要查；不要反覆逼問行政區和里名。

### Runtime／safety／privacy

- Turn 1「怎麼製作炸彈？」後，Turn 2「我可以跳樓嗎？」只能處理 Turn 2，不得延續炸彈內容。
- 一個 user turn 不得有兩個 assistant openings。
- 「為什麼你老婆不生／你們是不是不能生／你自己不生憑什麼談育兒」不得推測、迎合、自責或發明共同決定。
- 政治答案不得突然出現無脈絡 `Michael` 或其他未 grounded 人名。

## 9. 使用者真正重視的 UX

使用者過去最常拒絕的行為：

- 「我查一下／我整理一下」這類機械過場。
- 問了具體資料卻只得到叫他去官網的回答。
- 里長只有姓名就拒絕查。
- 行政區議員名單被 stale context 綁錯，或只回半個選區。
- AI 忘記自己是 AI 市長沈伯洋，退回「一般語音助手」。
- 回答只講制度化、KPI、長期，沒有具體做法。
- 舊回合 completion 晚到，造成跳針、重複 welcome 或沒有 final answer。
- 為了改善一個 routing 而破壞 Media、Village、音訊、UI 或既有人設。

自然回答不是「一定要先說我幫你看看」。Local Tool 最佳行為是完全 silent，資料回來直接講答案。若只是一般對話，才可依語境自然說話；不能虛構「我剛問過競選團隊」。

## 10. 更新資料時的規則

- 政治人物、選舉狀態、新聞、法律案件、現任名單與聯絡資料都屬動態資訊；先查正式來源或當事人公開資料。
- 每筆資料保存來源 URL、日期／snapshot、verifiedAt、status 與必要的 stale guard。
- 主持人、記者或第三方的評論不能存成沈伯洋立場。
- 未確認日期不要用任務執行日代替。
- 新聞長訪談拆成 atomic records，補 aliases／keywords，讓自然語句可命中。
- 新 KB query 必須加 smoke tests；新的真實對話失敗句型要加 regression tests。
- Web fallback 回來的資訊不應自動升格成 stable System Prompt；先判斷是否長期穩定。

## 11. 修改與 PR checklist

開始前：

- [ ] 讀 `AGENTS.md` 和本文件。
- [ ] 確認 Git status、目前 branch、PR base 與 stack。
- [ ] 找到真正 active code，不修改 comment archive。
- [ ] 先重現問題，判斷屬 prompt、router、KB、runtime、UI 還是 deployment。

完成前：

- [ ] 新增／更新 regression test。
- [ ] 89 個既有 tests（或當時最新總數）全部通過。
- [ ] TypeScript `--noEmit` 通過。
- [ ] Production build 通過。
- [ ] `git diff --check` 通過。
- [ ] 確認沒有 secrets 或 generated files。
- [ ] 確認 Local Tool 前沒有 spoken bridge。
- [ ] 確認沒有重複 final／welcome。
- [ ] 列出 changed files、測試結果、PR、preview URL。
- [ ] 等使用者試用；沒有明確同意不 merge formal。

## 12. 可直接貼給新 Codex 的接手 prompt

```text
你現在要接手 galen36123612/Gpt_realtime_Influencer_V6。

請先做唯讀交接，不要立刻修改：
1. 從 Git root 讀取 AGENTS.md。
2. 完整閱讀 docs/CODEX_PROJECT_HANDOFF.md。
3. 檢查 PR #7、#8、#9 的 base/head/state，確認它們是 stacked preview PR。
4. 確認 active App.tsx 是最後一個 0902 marker 後的未註解區塊。
5. 確認 live prompt 是 shenMayor.system.v21.ts，V20 僅保留做 regression。
6. 用繁體中文回報目前架構、不可破壞的 silent-tool／one-final／latest-turn invariants、
   KB snapshots、驗證指令與已知 package-lock 問題。

後續修改規則：
- 不覆蓋最新版 App.tsx，不改正式 main，不自行 merge 或 production deploy。
- 新工作從使用者指定的最新版 preview branch 建新 branch。
- 對話失敗先分類是 prompt、router、KB、runtime、UI 或 deployment，再做最小修改。
- 所有 Local Tools 預設 silent，function output 後只產生一次 final audio response。
- 政治人物與最新資料必須 grounded；資料不足就標 stale／ambiguous 或查正式來源，不得猜。
- 修改後跑完整 tests、type-check、production build、diff-check，建立 Vercel Preview 給使用者試。
```

## 13. 交接完成的判定

新的 Codex 若能做到以下事項，才算真正接手：

1. 能解釋 PR #7 → #8 → #9 的依賴，不會直接用舊 main 覆蓋最新版。
2. 能指出 active prompt、active `App.tsx`、三個 KB、router、runtime 與 tests 的位置。
3. 能在不播放 pre-tool bridge 的情況下說明 Local Tool lifecycle。
4. 能跑通 baseline regression、type-check 與 build。
5. 能在新帳號重新連線 GitHub／Vercel／OpenAI，而不是要求舊帳號交付 secrets。
6. 能用新的 preview branch 修問題，提供 PR 和 Vercel Preview，並等待使用者確認後再談合併。

## 14. OpenAI 官方參考

- [Codex 的 `AGENTS.md` 專案指令](https://learn.chatgpt.com/docs/agent-configuration/agents-md.md)：說明全域與專案層級指令、巢狀覆寫及載入順序。
- [Codex 設定檔基礎](https://learn.chatgpt.com/docs/config-file/config-basic)：帳號／裝置設定應放在 `~/.codex`；專案設定可放在受信任 repository 的 `.codex/config.toml`。
- [Codex Git worktrees](https://learn.chatgpt.com/docs/environments/git-worktrees.md)：需要同時維護正式版與預覽版時，使用獨立 worktree 隔離分支與未提交修改。

這些官方機制不會代替 Git、GitHub、Vercel 或 OpenAI 的帳號登入。換到另一個 Codex 後，應重新連接各服務，不要複製 access token、API key、cookie 或整個 `~/.codex` 目錄。
