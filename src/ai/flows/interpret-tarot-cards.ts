
/**
 * @fileOverview A tarot card interpretation AI agent.
 */

import { getAIInstance } from "@/ai/llm-provider";
import { z } from "genkit";

export const InterpretTarotCardsInputSchema = z.object({
  question: z.string().describe("The user\u2019s question or area of concern."),
  oshoCard: z
    .object({
      name: z.string().describe("The English name of the Osho Zen card."),
      chineseName: z
        .string()
        .describe("The Chinese name of the Osho Zen card."),
    })
    .describe(
      "The drawn Osho Zen card which serves as the core spiritual theme.",
    ),
  cards: z
    .array(z.string().describe("The names of the drawn Rider-Waite cards."))
    .describe("The array of drawn Rider-Waite tarot cards."),
  llmConfig: z
    .object({
      provider: z.enum(["google", "openai", "anthropic"]),
      model: z.string(),
      apiKey: z.string(),
    })
    .describe("LLM configuration selected by the user."),
});
export type InterpretTarotCardsInput = z.infer<
  typeof InterpretTarotCardsInputSchema
>;

export const InterpretTarotCardsOutputSchema = z.object({
  interpretation: z
    .string()
    .describe("The AI\u2019s interpretation of the tarot reading."),
});
export type InterpretTarotCardsOutput = z.infer<
  typeof InterpretTarotCardsOutputSchema
>;

export async function interpretTarotCards(
  input: InterpretTarotCardsInput,
): Promise<InterpretTarotCardsOutput> {
  const ai = getAIInstance(input.llmConfig);

  const prompt = ai.definePrompt({
    name: "interpretTarotCardsPrompt",
    input: { schema: InterpretTarotCardsInputSchema },
    output: { schema: InterpretTarotCardsOutputSchema },
    prompt: `你是一位融合東西方智慧的塔羅解讀師，精通奧修禪卡（Osho Zen Tarot）與偉特塔羅（Rider-Waite Tarot）。

━━━ 本次占卜資訊 ━━━
問卜者問題：{{question}}

━━━ 本次抽牌 ━━━

🌿 奧修禪卡（主牌 — 靈性核心）
{{oshoCard.name}}（{{oshoCard.chineseName}}）

🃏 偉特塔羅（輔牌 — 現實呈現）
{{#each cards}}- {{this}}
{{/each}}

━━━ 解讀規則 ━━━

**第一段：奧修禪卡解讀（主軸）**
深入解析「{{oshoCard.name}}」的禪意核心。
此牌在問卜者的問題中，揭示了什麼樣的內在狀態或靈性課題？
奧修禪卡不評判對錯，而是映照當下的真實——請從這個角度切入。

**第二段：偉特牌解讀（呼應主牌）**
這些偉特牌如何在現實層面呈現了奧修禪卡所揭示的靈性課題？
若為逆位，此牌暗示問卜者在哪個面向尚有阻力或尚未接受的功課？
牌名請以中英文並列，遵循以下翻譯規則：
  Pentacles = 錢幣、Swords = 寶劍、Cups = 聖杯、Wands = 權杖

**第三段：整合結語**
將奧修禪卡與所有偉特牌的訊息織合成一段給問卜者的指引：
- 奧修禪卡指引的靈性方向是什麼？
- 現實中有哪些具體的行動或態度轉換值得考慮？
- 結尾以溫暖而有力量的話語收尾，不要給出過於確定性的預測。

請以溫暖、洞察力強、富含禪意的語調書寫，回應語言：繁體中文。`,
  });

  const { output } = await prompt(input);
  return output!;
}
