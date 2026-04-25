# 🎯 ClassWall · 匿名問答牆

5 小時 AI 程式開發實戰課程的成品 starter — 用 **Next.js + Supabase + Tailwind + shadcn/ui** 打造的匿名問答牆，搭配 GitHub Copilot 教學。

> 完整課程教材在 Notion：[AI 程式開發實戰](https://www.notion.so/AI-2fdad1e31336800ea9a1efb7069d7659)

## 學完你會擁有

- 一個自己的網站，掛在網路上手機可開
- 一個 GitHub repo，含完整開發歷程
- 和 AI 協作寫程式的基本能力
- 把資料庫課程的「一對多關聯」真的用出來

## 技術棧

- **前端**：Next.js 16 (App Router) + Tailwind CSS v4 + shadcn/ui
- **後端 / DB**：Supabase（PostgreSQL + Realtime）
- **部署**：Vercel
- **AI 助手**：GitHub Copilot

---

## 🚀 Quick Start

### 1. 環境需求

- Node.js >= 20.18.0（推薦用 [nvm](https://github.com/nvm-sh/nvm)）
- Git
- VS Code + GitHub Copilot（首次開啟會跳出推薦擴充）

### 2. Clone 並安裝

```bash
git clone https://github.com/<你的帳號>/classwall.git
cd classwall
nvm use         # 讀 .nvmrc 切到對的 Node 版本
npm install
```

### 3. 建 Supabase 專案

到 [supabase.com/dashboard](https://supabase.com/dashboard) 按 **New project** → 命名 `classwall` → 地區選 **Tokyo / Singapore** → 建立。

等專案 ready 後：

1. **跑 schema**：左側選單 `SQL Editor` → New query → 把 `supabase/migrations/0001_init.sql` 整個檔案內容貼進去 → Run。會建好 `questions` / `answers` 兩張表，並開啟 Realtime + RLS。
2. **拿 API keys**：左側 `Project Settings → API`，記下：
   - Project URL（`https://xxx.supabase.co`）
   - `anon` `public` key（長長的字串）

> ⚠️ **千萬不要**用 `service_role` key — 它是後台 admin 權限，不能放前端。

### 4. 設環境變數

```bash
cp .env.example .env.local
```

打開 `.env.local`，把 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 填上一步拿到的值。

### 5. 跑起來

```bash
npm run dev
```

開 [http://localhost:3000](http://localhost:3000) 應該看到：

- 🎯 ClassWall 標題（漸層）
- 發問表單
- 列表中有一筆 seed 問題
- 按 +1 後 likes 即時 +1（Realtime UPDATE）
- 開另一個分頁發問 → 第一個分頁也會即時跳出（Realtime INSERT）

---

## 🗺️ 對應 Notion 課程

這個 repo 已經做好「Step 1 建 repo」「Step 3 init Next.js」「Step 4 串 Supabase」「Step 5 Realtime + Likes」的完整成品，方便老師對照與 demo。學生上課時建議使用「Use this template」建自己的 repo，然後：

- **Step 2** — 跟著做，建自己的 Supabase 專案 + 跑 SQL（本 repo `supabase/migrations/0001_init.sql`）
- **Step 4 / Step 5** — 用 Copilot Chat 拆解現成 `src/app/page.tsx`、`src/components/question-*.tsx`，理解每段程式做什麼，然後改造（換樣式、加排序、加防狂按等）
- **Step 6** — 部署到 Vercel：在 [vercel.com/new](https://vercel.com/new) 匯入 repo，**記得在 Environment Variables 填 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY`**，按 Deploy。

---

## 📁 專案結構

```
src/
├── app/
│   ├── layout.tsx          # 根 layout + metadata
│   ├── page.tsx            # 首頁：列表 + 表單 + Realtime
│   └── globals.css         # Tailwind v4 + shadcn 主題
├── components/
│   ├── question-form.tsx   # 發問表單
│   ├── question-card.tsx   # 單張問題卡 + 按讚
│   └── ui/                 # shadcn 元件 (button, card, textarea)
├── lib/
│   ├── supabase.ts         # Supabase client
│   └── utils.ts            # cn() helper
└── types/
    └── database.ts         # Question / Answer types

supabase/
└── migrations/
    └── 0001_init.sql       # DB schema + RLS + Realtime + seed
```

---

## 🛠️ Scripts

```bash
npm run dev           # 開發伺服器
npm run build         # production build
npm run start         # 跑 production build
npm run lint          # ESLint
npm run format        # Prettier 自動格式化
npm run format:check  # 檢查格式（CI 用）
```

---

## 🐛 Troubleshooting

**`npm run dev` 噴 "缺少 Supabase 環境變數"**
→ `.env.local` 沒建好，或改完 `.env.local` 沒重啟 dev server。`Ctrl+C` 後重跑 `npm run dev`。

**頁面打開噴錯 / 看不到 seed 資料**
→ 檢查 Supabase 專案是否 SQL 跑成功（Table Editor 看得到 `questions`）；確認 `.env.local` 的 URL/key 跟 Dashboard 對得起來。

**發問成功但別的分頁沒即時更新**
→ Realtime 沒打開。在 Supabase Dashboard `Database → Replication` 看 `questions` 的 Realtime 開關，或重跑一次 `0001_init.sql` 中的 `alter publication` 那兩行。

**部署到 Vercel 後線上版壞掉**
→ 大部分是忘記設環境變數。Vercel Project → Settings → Environment Variables 加上 `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`，重新部署。

**Supabase 顯示專案 paused**
→ 免費方案 7 天無人活動會 pause，到 Dashboard 點 Restore 即可。

---

## 課後挑戰

- 防止同一人狂按 +1（提示：localStorage / IP 限流 / 登入制）
- 加上「答案」功能（已建好 `answers` 表，學生練習一對多 join）
- 加上「最熱問題本週榜」
- 自訂顯示風格 / 加入主題切換（已預備 dark mode tokens）
