import { getAIInstance } from "@/ai/llm-provider";
import { z, MessageData } from "genkit";

export const ContinueTarotChatInputSchema = z.object({
  question: z.string().describe("The user's follow-up question."),
  history: z.array(
    z.object({
      role: z.enum(["user", "model", "system"]),
      content: z.string(),
    })
  ).describe("Previous conversation history."),
  oshoCard: z.object({
    name: z.string(),
    chineseName: z.string(),
  }),
  cards: z.array(z.string()),
  llmConfig: z.object({
    provider: z.enum(["google", "openai", "anthropic"]),
    model: z.string(),
    apiKey: z.string(),
  }),
});

export type ContinueTarotChatInput = z.infer<typeof ContinueTarotChatInputSchema>;

export async function continueTarotChat(
  input: ContinueTarotChatInput,
): Promise<{ reply: string }> {
  const ai = getAIInstance(input.llmConfig);

  const systemMessage = `你是一位融合東西方智慧的塔羅解讀師，精通奧修禪卡與偉特塔羅。
問卜者剛才抽出了：
🌿 奧修禪卡（主牌 — 靈性核心）
${input.oshoCard.name}（${input.oshoCard.chineseName}）

🃏 偉特塔羅（輔牌 — 現實呈現）
${input.cards.map((c) => "- " + c).join("\n")}

請根據原本的解牌脈絡，回答問卜者的後續提問。語氣要溫暖、具洞察力且富含禪意，回應語言：繁體中文。`;

  // Map history to Genkit MessageData format
  const formattedHistory: MessageData[] = [
    { role: "system", content: [{ text: systemMessage }] },
    ...input.history.map((msg) => ({
      role: msg.role,
      content: [{ text: msg.content }],
    } as MessageData)),
  ];

  const response = await ai.generate({
    messages: formattedHistory,
    prompt: input.question,
  });

  return { reply: response.text };
}
