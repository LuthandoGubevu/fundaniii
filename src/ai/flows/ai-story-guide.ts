// StoryAssistanceFlow.ts
'use server';

/**
 * @fileOverview AI-powered story assistance for young learners.
 *
 * - storyAssistance - A function that provides guidance and suggestions for writing stories.
 * - StoryAssistanceInput - The input type for the storyAssistance function.
 * - StoryAssistanceOutput - The return type for the storyAssistance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StoryAssistanceInputSchema = z.object({
  storyText: z.string().describe('The current text of the story.'),
  theme: z.string().optional().describe('Optional theme for the story (e.g., Science, Life Skills, Hero’s Journey).'),
});
export type StoryAssistanceInput = z.infer<typeof StoryAssistanceInputSchema>;

const StoryAssistanceOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('AI suggestions for the next part of the story (beginning, middle, end).'),
  structureGuidance: z.string().describe('Guidance on structuring the story (e.g., focus on the conflict, introduce a new character).'),
});
export type StoryAssistanceOutput = z.infer<typeof StoryAssistanceOutputSchema>;

export async function storyAssistance(input: StoryAssistanceInput): Promise<StoryAssistanceOutput> {
  return storyAssistanceFlow(input);
}

const storyAssistancePrompt = ai.definePrompt({
  name: 'storyAssistancePrompt',
  input: {schema: StoryAssistanceInputSchema},
  output: {schema: StoryAssistanceOutputSchema},
  prompt: `You are a helpful AI assistant guiding young learners in writing stories. You will provide suggestions and guidance to help them create a structured and engaging narrative.

Current Story Text: {{{storyText}}}
Theme: {{theme}}

Provide suggestions for the next part of the story. Also, provide guidance on structuring the story, such as focusing on the conflict or introducing a new character. Format your response as a JSON object.`, // Ensure the prompt requests a JSON output
});

const storyAssistanceFlow = ai.defineFlow(
  {
    name: 'storyAssistanceFlow',
    inputSchema: StoryAssistanceInputSchema,
    outputSchema: StoryAssistanceOutputSchema,
  },
  async input => {
    const {output} = await storyAssistancePrompt(input);
    return output!;
  }
);
