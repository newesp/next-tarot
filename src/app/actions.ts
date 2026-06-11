"use server";

import { interpretTarotCards } from "@/ai/flows/interpret-tarot-cards";
import { z } from "zod";

const interpretationInputSchema = z.object({
  question: z.string(),
  oshoCard: z.object({
    name: z.string(),
    chineseName: z.string(),
  }),
  cards: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      reversed: z.boolean(),
      flipped: z.boolean(),
      image: z.string(),
      fallbackImageUrl: z.string(),
      hint: z.string(),
    }),
  ),
  llmConfig: z.object({
    provider: z.enum(["google", "openai", "anthropic"]),
    model: z.string(),
    apiKey: z.string(),
  }),
});

export async function getTarotInterpretation(
  input: z.infer<typeof interpretationInputSchema>,
) {
  try {
    const validatedInput = interpretationInputSchema.parse(input);
    const cardNames = validatedInput.cards.map(
      (card, index) =>
        `第${index + 1}張：${card.name}${card.reversed ? " (逆位)" : ""}`,
    );

    const result = await interpretTarotCards({
      question: validatedInput.question,
      oshoCard: validatedInput.oshoCard,
      cards: cardNames,
      llmConfig: validatedInput.llmConfig,
    });

    return { success: true, interpretation: result.interpretation };
  } catch (error) {
    console.error("取得塔羅牌解讀時發生錯誤:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: "輸入無效。" };
    }
    return { success: false, error: "從 AI 取得解讀失敗。" };
  }
}
