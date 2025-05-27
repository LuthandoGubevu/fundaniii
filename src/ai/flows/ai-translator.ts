'use server';

/**
 * @fileOverview AI-powered translation flow for translating stories into different African languages.
 *
 * - translateStory - A function that translates a story into a specified African language.
 * - TranslateStoryInput - The input type for the translateStory function.
 * - TranslateStoryOutput - The return type for the translateStory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateStoryInputSchema = z.object({
  story: z.string().describe('The story to be translated.'),
  targetLanguage: z.string().describe('The target African language for translation (e.g., isiXhosa, Zulu).'),
});
export type TranslateStoryInput = z.infer<typeof TranslateStoryInputSchema>;

const TranslateStoryOutputSchema = z.object({
  translatedStory: z.string().describe('The translated story in the target African language.'),
});
export type TranslateStoryOutput = z.infer<typeof TranslateStoryOutputSchema>;

export async function translateStory(input: TranslateStoryInput): Promise<TranslateStoryOutput> {
  return translateStoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateStoryPrompt',
  input: {schema: TranslateStoryInputSchema},
  output: {schema: TranslateStoryOutputSchema},
  prompt: `You are a translation expert specializing in African languages. Translate the given story into the specified African language.

Story: {{{story}}}

Target Language: {{{targetLanguage}}}

Translation:`,
});

const translateStoryFlow = ai.defineFlow(
  {
    name: 'translateStoryFlow',
    inputSchema: TranslateStoryInputSchema,
    outputSchema: TranslateStoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
