'use server';

/**
 * @fileOverview A tarot card interpretation AI agent.
 *
 * - interpretTarotCards - A function that handles the tarot card interpretation process.
 * - InterpretTarotCardsInput - The input type for the interpretTarotCards function.
 * - InterpretTarotCardsOutput - The return type for the interpretTarotCards function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InterpretTarotCardsInputSchema = z.object({
  question: z.string().describe('The user\u2019s question or area of concern.'),
  spread: z.enum(['3-card', '5-card']).describe('The selected tarot spread.'),
  cards: z.array(
    z.string().describe('The names of the drawn tarot cards from the Rider-Waite deck.')
  ).describe('The array of drawn tarot cards.'),
});
export type InterpretTarotCardsInput = z.infer<typeof InterpretTarotCardsInputSchema>;

const InterpretTarotCardsOutputSchema = z.object({
  interpretation: z.string().describe('The AI\u2019s interpretation of the tarot reading.'),
});
export type InterpretTarotCardsOutput = z.infer<typeof InterpretTarotCardsOutputSchema>;

export async function interpretTarotCards(input: InterpretTarotCardsInput): Promise<InterpretTarotCardsOutput> {
  return interpretTarotCardsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interpretTarotCardsPrompt',
  input: {schema: InterpretTarotCardsInputSchema},
  output: {schema: InterpretTarotCardsOutputSchema},
  prompt: `You are an expert tarot card reader specializing in the Rider-Waite tarot deck.

You will interpret the drawn cards based on the selected spread and the user's question to provide a comprehensive reading.

When you state the name of the card, you must provide the correct Chinese and English name. Follow these translation rules strictly:
- Pentacles = 錢幣
- Swords = 寶劍
- Cups = 聖杯
- Wands = 權杖

For example: "錢幣七 (Seven of Pentacles)".

User Question: {{{question}}}
Selected Spread: {{{spread}}}
Drawn Cards: {{#each cards}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Provide a detailed interpretation of each card and their combined significance in relation to the user's question. The AI tool will reason whether it needs to explain meanings from multiple reference sources in its output.
`,
});

const interpretTarotCardsFlow = ai.defineFlow(
  {
    name: 'interpretTarotCardsFlow',
    inputSchema: InterpretTarotCardsInputSchema,
    outputSchema: InterpretTarotCardsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
