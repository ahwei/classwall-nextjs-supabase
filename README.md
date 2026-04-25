# 🎮 AI 程式開發實戰 — ClassWall 匿名問答牆

5 小時，從 0 到上線，用 GitHub Copilot 帶你做出一個可以給全班用的網站 —— **ClassWall 匿名問答牆**。

> 完整課程（Notion）：[🎮 AI 程式開發實戰](https://www.notion.so/AI-2fdad1e31336800ea9a1efb7069d7659)

這個 repo 是課程的**完整成品 starter**：clone 下來、設好 `.env.local`、跑 SQL，就能立刻看到課程最後的樣子（含 Realtime + 按讚）。學生上課時建議用 **Use this template** 建立自己的 repo，搭配 Notion 教材一步一步做。

---

## 🎯 課程目標

學完之後，你會擁有：

- **一個自己的網站**掛在網路上，可以用手機打開
- 一個 **GitHub repo**，裡面有完整的開發歷程
- 學會和 **AI 協作寫程式**的基本能力
- 把資料庫正課學的知識**真的用出來**

## 🛠️ 技術棧

- **前端**：Next.js 16（App Router）+ Tailwind CSS v4 + shadcn/ui
- **後端 / 資料庫**：Supabase（PostgreSQL + Realtime）
- **部署**：Vercel
- **版本控制**：Git + GitHub
- **AI 助手**：GitHub Copilot

---

## 📚 課程大綱

對照 Notion 子頁面：

### 📖 基礎知識
- [前言](https://www.notion.so/2fdad1e3133680eeb434f8ef4aa390df)
- [課前準備](https://www.notion.so/34aad1e313368104b9dedf9edc39f681) — 註冊 GitHub / Supabase / Vercel、安裝 Node、Git、VS Code + Copilot
- [今天要做什麼：ClassWall 匿名問答牆](https://www.notion.so/ClassWall-34aad1e313368112bd65f911e5e881da)

### 🧱 核心工具
- [Git 教學](https://www.notion.so/Git-2fdad1e3133680448352c0749d5a579d)
- [AI 開發基本知識](https://www.notion.so/AI-2fdad1e3133680b58451eed065a63200)
- [開發工具介紹](https://www.notion.so/34aad1e31336816309e92cfac4b4e12c0)

### 🚀 實戰演練：從 0 到上線
- [Step 1：建立 GitHub Repo](https://www.notion.so/34aad1e31336816409ee2e0bec0dde993) — _本 starter 已建好；學生用 Use this template 取代_
- [Step 2：Supabase 建資料庫](https://www.notion.so/Step-2-Supabase-34aad1e3133681378631d3d180f37c13) — _跑 `supabase/migrations/0001_init.sql`_
- [Step 3：Next.js 專案啟動 + Copilot 實戰](https://www.notion.so/34aad1e31336818c8126f69176ea4896) — _本 starter 已 init；學生改用「Copilot 拆解現成程式碼」_
- [Step 4：串接 Supabase（讀取 + 新增）](https://www.notion.so/34aad1e3133681c9a572dedcc5ad0a52) — _對應 `src/lib/supabase.ts`、`src/app/page.tsx`_
- [Step 5：Realtime 即時更新 + 按讚功能](https://www.notion.so/34aad1e3133681fda623e60a62b8fa32) — _對應 `src/app/page.tsx` 的 channel subscribe_
- [Step 6：部署到 Vercel](https://www.notion.so/34aad1e31336815509aacf0dd576d6de7)

### 🎓 總結與延伸
- [課後挑戰 & 延伸](https://www.notion.so/34aad1e3133681019944cf942c5c75a0)

---

## 🚀 Quick Start

對應 Notion 的 **Step 1 → Step 2 → Step 4 → Step 6** 流程，照順序做：

### 1. 拿到專案（取代 Step 1）

選一種：

- **學生（推薦）**：在 GitHub 按 [Use this template](https://github.com/) → 建你自己的 `classwall` repo → clone
- **直接 clone**：
  ```bash
  git clone https://github.com/<你的帳號>/classwall.git
  cd classwall
  ```

### 2. 安裝 Node 套件（取代 Step 3）

```bash
nvm use         # 讀 .nvmrc 切到 Node 20.18+
npm install
```

### 3. 建 Supabase 專案（對應 [Step 2](https://www.notion.so/Step-2-Supabase-34aad1e3133681378631d3d180f37c13)）

到 [supabase.com/dashboard](https://supabase.com/dashboard) → **New project** → 命名 `classwall` → 地區選 **Tokyo / Singapore** → 建立。

等專案 ready：

1. 左側 `SQL Editor` → New query → 把 `supabase/migrations/0001_init.sql` **整個檔案**內容貼進去 → **Run**。
   - 會建好 `questions`、`answers` 表
   - 開啟 Realtime publication
   - 套用 RLS（讓匿名使用者可讀、可發問、可按讚）
   - 插入一筆 seed
2. 左側 `Project Settings → API`，記下：
   - **Project URL**（`https://xxx.supabase.co`）
   - **`anon` `public` key**

> ⚠️ 千萬不要用 `service_role` key —— 它是後台 admin 權限，不能放前端、不能 commit。

### 4. 設環境變數（對應 [Step 4](https://www.notion.so/34aad1e3133681c9a572dedcc5ad0a52)）

```bash
cp .env.example .env.local
```

打開 `.env.local`，把上一步拿到的值填進去：

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

### 5. 跑開發伺服器

```bash
npm run dev
```

打開 [http://localhost:3000](http://localhost:3000)，預期看到：

- 🎯 ClassWall 漸層標題
- 發問表單
- Seed 那筆問題
- 按 +1 → likes 即時 +1（[Step 5](https://www.notion.so/34aad1e3133681fda623e60a62b8fa32) Realtime UPDATE）
- 開另一個分頁發問 → 第一個分頁也會即時跳出（Realtime INSERT）

### 6. 部署到 Vercel（對應 [Step 6](https://www.notion.so/34aad1e31336815509aacf0dd576d6de7)）

```bash
git add .
git commit -m "完成 ClassWall v1"
git push
```

到 [vercel.com/new](https://vercel.com/new) → Import Git Repository → 選你的 `classwall` repo → 在 **Environment Variables** 區塊填上 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY` → **Deploy**。

完成後會拿到 `https://classwall-你的名字.vercel.app`，全班一起用！

> 之後每次 `git push`，Vercel 都會**自動重新部署**。

---

## 📁 專案結構

```
src/
├── app/
│   ├── layout.tsx          # 根 layout + metadata
│   ├── page.tsx            # 首頁：列表 + 表單 + Realtime ← Step 4/5
│   └── globals.css         # Tailwind v4 + shadcn 主題
├── components/
│   ├── question-form.tsx   # 發問表單                    ← Step 4
│   ├── question-card.tsx   # 單張問題卡 + 按讚            ← Step 5
│   └── ui/                 # shadcn 元件 (button, card, textarea)
├── lib/
│   ├── supabase.ts         # Supabase client             ← Step 4
│   └── utils.ts            # cn() helper
└── types/
    └── database.ts         # Question / Answer types

supabase/
└── migrations/
    └── 0001_init.sql       # DB schema + RLS + Realtime + seed ← Step 2
```

---

## 🛠️ Scripts

```bash
npm run dev           # 開發伺服器
npm run build         # production build
npm run start         # 跑 production build
npm run lint          # ESLint
npm run format        # Prettier 自動格式化
npm run format:check  # 檢查格式
```

---

## 🐛 Troubleshooting

**`npm run dev` 啟動但 console 跳「缺少 Supabase 環境變數」**
→ `.env.local` 沒建好，或改完沒重啟。`Ctrl+C` 後重跑 `npm run dev`。

**頁面打開噴錯 / 看不到 seed 資料**
→ 檢查 Supabase 專案 SQL 是否跑成功（Table Editor 應看到 `questions` 表有 1 筆）；確認 `.env.local` 的 URL/key 跟 Dashboard 對得起來。

**發問成功但別的分頁沒即時更新**
→ Realtime 沒打開。在 Supabase Dashboard `Database → Replication` 看 `questions` 的 Realtime 開關，或重跑一次 `0001_init.sql` 中 `alter publication` 那兩行。

**部署到 Vercel 後線上版壞掉**
→ 大部分是忘記設環境變數。Vercel Project → Settings → Environment Variables 加上兩把 key → Redeploy。

**Supabase 顯示專案 paused**
→ 免費方案 7 天無人活動會 pause，到 Dashboard 點 Restore 即可。

---

## 🎓 課後挑戰

對應 Notion [課後挑戰 & 延伸](https://www.notion.so/34aad1e3133681019944cf942c5c75a0)，可以試試看：

- **防止同一人狂按 +1**（提示：localStorage / IP 限流 / 登入制）
- **加上「答案」功能**（已預先建好 `answers` 表，練習一對多 join）
- **本週熱門問題榜**
- **加入主題切換**（已預備 dark mode tokens）
- **發問字數限制 / 不雅字過濾**
