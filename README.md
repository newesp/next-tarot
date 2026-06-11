# 神秘指引 (Mystic Guide) - AI 塔羅占卜

這是一個由 AI 驅動的互動式塔羅牌占卜網站。融合了東方禪意的「奧修禪卡」與西方神祕學的「偉特塔羅」，為您提供深度的靈性指引與現實建議。

## ✨ 核心特色

- **雙牌組融合解讀**：
  - **奧修禪卡（主軸）**：每次占卜抽取一張正位的奧修禪卡，作為本次問題的靈性核心與內在狀態映照。專屬的青綠色禪意視覺設計。
  - **偉特塔羅（輔助）**：搭配抽取多張偉特塔羅牌（支援 3 張或 5 張牌陣，包含正逆位），將靈性課題對應到現實生活中的具體挑戰。
- **無牌陣 AI 深度解讀**：利用先進的 LLM（大型語言模型）打破傳統固定牌陣的限制，提供三段式的綜合解析（奧修主軸 -> 偉特呼應 -> 整合結語）。
- **自訂 AI 模型 (BYOK)**：
  - 支援動態切換解牌引擎，內建支援 **Google Gemini**、**OpenAI** 與 **Anthropic Claude**。
  - 使用者可於介面中輸入自己的 API Key，金鑰僅安全地保存在瀏覽器的 `localStorage` 中，不會上傳至伺服器。
- **現代化流暢 UI**：採用流暢的 3D 翻牌動畫、響應式設計 (RWD)，完美支援手機與桌面裝置。

## 🛠 技術棧 (Tech Stack)

- **框架**：[Next.js 15](https://nextjs.org/) (App Router), [React 19](https://react.dev/)
- **樣式與 UI**：[Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), Lucide Icons
- **狀態管理**：[Jotai](https://jotai.org/) (結合 localStorage 實現設定持久化)
- **AI 串接**：[Firebase Genkit](https://firebase.google.com/docs/genkit) (`@genkit-ai/google-genai`, `genkitx-openai`, `genkitx-anthropic`)
- **語言**：TypeScript

## 🚀 快速開始 (Getting Started)

### 1. 安裝依賴套件

請確保您的環境安裝了 Node.js (建議 v20+)，然後執行：

```bash
npm install
```

### 2. 環境變數設定

如果您希望提供預設的 AI 服務，可以在根目錄建立 `.env` 或 `.env.local` 檔案：

```env
GEMINI_API_KEY=your_default_gemini_api_key
```
*(註：使用者仍可透過網頁右上角的設定按鈕，覆寫並使用自己的 API Key)*

### 3. 啟動開發伺服器

```bash
npm run dev
```

開啟瀏覽器前往 [http://localhost:3000](http://localhost:3000) 即可開始體驗！

## 📂 專案結構簡介

- `src/app/`：Next.js App Router 頁面與 Server Actions。
  - `page.tsx`：首頁與抽牌互動主邏輯。
  - `actions.ts`：與 AI 溝通的伺服器端行為。
- `src/ai/`：Genkit AI 相關配置與流程。
  - `flows/interpret-tarot-cards.ts`：定義 AI 塔羅解牌的 Prompt 與流程。
  - `llm-provider.ts`：動態建立 LLM 實體的工廠函數。
- `src/components/`：可複用的 React UI 元件 (包含抽牌的 `OshoCard` 與 `TarotCard`)。
- `src/lib/`：輔助函式與資料。
  - `osho-zen-deck.ts`：79 張奧修禪卡資料庫與圖片解析邏輯。
  - `tarot-deck.ts`：78 張偉特塔羅資料庫。
  - `settings.ts`：管理使用者設定的 Jotai Atom。

## 📄 授權 (License)

此專案僅供學習與交流使用。
- 奧修禪卡圖像版權歸 OSHO International Foundation 所有。
- 偉特塔羅牌圖像屬公共領域 (Public Domain)。
