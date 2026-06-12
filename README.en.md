# Mystic Guide - AI Tarot Reading

This is an AI-driven interactive tarot reading web application. It blends the Eastern Zen philosophy of the "Osho Zen Tarot" with Western mysticism of the "Rider-Waite Tarot," providing you with deep spiritual guidance and practical advice for reality.

## ✨ Core Features

- **Dual Deck Integration**:
  - **Osho Zen Tarot (Core)**: In each reading, an upright Osho Zen card is drawn to serve as the spiritual core and a reflection of your inner state for the current question. It features an exclusive teal, zen-inspired visual design.
  - **Rider-Waite Tarot (Supporting)**: Draws multiple Rider-Waite tarot cards (supports 3-card or 5-card spreads, including reversals) to map the spiritual lessons to specific challenges in real life.
- **Spreadless AI Deep Interpretation**: Utilizes advanced LLMs (Large Language Models) to break the limitations of traditional fixed spreads, offering a comprehensive three-part analysis (Osho core -> Rider-Waite resonance -> integrated conclusion).
- **Conversational UI (Follow-up Questions)**: After the reading is complete, it provides a chat-like input interface, allowing you to have a deep conversation and ask follow-up questions with the AI based on the current spread.
- **Bring Your Own Key (BYOK)**:
  - Supports dynamically switching the reading engine. Built-in support for **Google Gemini**, **OpenAI**, and **Anthropic Claude**.
  - Users can enter their own API Keys in the UI. Keys are securely stored only in the browser's `localStorage` and are not uploaded to any server.
- **Modern & Fluid UI**: Features smooth 3D card-flipping animations and responsive web design (RWD), perfectly supporting both mobile and desktop devices.

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router), [React 19](https://react.dev/)
- **Styling & UI**: [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), Lucide Icons
- **State Management**: [Jotai](https://jotai.org/) (combined with localStorage for settings persistence)
- **AI Integration**: [Firebase Genkit](https://firebase.google.com/docs/genkit) (`@genkit-ai/google-genai`, `genkitx-openai`, `genkitx-anthropic`)
- **Language**: TypeScript

## 🚀 Getting Started

### 1. Install Dependencies

Please make sure you have Node.js installed (v20+ is recommended), then run:

```bash
npm install
```

### 2. Environment Variables Configuration

If you want to provide a default AI service, you can create a `.env` or `.env.local` file in the root directory:

```env
GEMINI_API_KEY=your_default_gemini_api_key
```
*(Note: Users can still overwrite this and use their own API Key via the settings button in the top right corner of the web page)*

### 3. Start the Development Server

```bash
npm run dev
```

Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to start the experience!

## 📂 Project Structure Overview

- `src/app/`: Next.js App Router pages and Server Actions.
  - `page.tsx`: Home page and main logic for card drawing interaction.
  - `actions.ts`: Server-side actions for communicating with the AI.
- `src/ai/`: Genkit AI configurations and flows.
  - `flows/interpret-tarot-cards.ts`: Defines the AI tarot reading prompt and flow.
  - `flows/continue-tarot-chat.ts`: Defines the AI flow for follow-up questions and chat history context.
  - `llm-provider.ts`: Factory function to dynamically create LLM instances.
- `src/components/`: Reusable React UI components (including `OshoCard` and `TarotCard` for drawing).
- `src/lib/`: Helper functions and data.
  - `osho-zen-deck.ts`: Database for 79 Osho Zen cards and image parsing logic.
  - `tarot-deck.ts`: Database for 78 Rider-Waite tarot cards.
  - `settings.ts`: Jotai Atom for managing user settings.

## 📄 License

This project is for learning and communication purposes only.
- Copyright of Osho Zen Tarot images belongs to OSHO International Foundation.
- Rider-Waite Tarot card images are in the Public Domain.
