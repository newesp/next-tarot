"use server";
/**
 * @fileOverview Presents the AI's interpretation of the tarot reading, including explanations of each card's meaning and their combined significance.
 *
 * - presentTarotReadingResults - A function that presents the tarot reading results.
 * - PresentTarotReadingResultsInput - The input type for the presentTarotReadingResults function.
 * - PresentTarotReadingResultsOutput - The return type for the presentTarotReadingResults function.
 */

import { ai } from "@/ai/genkit";
import { z } from "genkit";

const PresentTarotReadingResultsInputSchema = z.object({
  question: z
    .string()
    .describe("The user provided question for the tarot reading."),
  spreadType: z
    .enum(["3-card", "5-card"])
    .describe("The type of tarot spread used."),
  cards: z
    .array(
      z.object({
        name: z.string().describe("The name of the tarot card."),
        meaning: z.string().describe("The general meaning of the tarot card."),
      }),
    )
    .describe("The cards drawn for the tarot reading."),
});
export type PresentTarotReadingResultsInput = z.infer<
  typeof PresentTarotReadingResultsInputSchema
>;

const PresentTarotReadingResultsOutputSchema = z.object({
  interpretation: z
    .string()
    .describe("The AI interpretation of the tarot reading."),
});
export type PresentTarotReadingResultsOutput = z.infer<
  typeof PresentTarotReadingResultsOutputSchema
>;

export async function presentTarotReadingResults(
  input: PresentTarotReadingResultsInput,
): Promise<PresentTarotReadingResultsOutput> {
  return presentTarotReadingResultsFlow(input);
}

const prompt = ai.definePrompt({
  name: "presentTarotReadingResultsPrompt",
  input: { schema: PresentTarotReadingResultsInputSchema },
  output: { schema: PresentTarotReadingResultsOutputSchema },
  prompt: `You are a tarot card reading expert. A user has asked the following question: "{{question}}". You have drawn the following cards for a {{spreadType}} spread:

  {{#each cards}}
    - {{this.name}}: {{this.meaning}}
  {{/each}}

  Provide a comprehensive interpretation of the tarot reading, including explanations of each card's meaning and their combined significance in relation to the user's question. The output should be easy to understand and insightful. Consider different reference sources when providing the meaning.
  `,
});

const presentTarotReadingResultsFlow = ai.defineFlow(
  {
    name: "presentTarotReadingResultsFlow",
    inputSchema: PresentTarotReadingResultsInputSchema,
    outputSchema: PresentTarotReadingResultsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  },
);
