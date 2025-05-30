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
  prompt: `You are a helpful AI assistant guiding young learners (aged 7-15) in writing stories. You will provide suggestions and guidance to help them create a structured and engaging narrative.

Current Story Text: {{{storyText}}}
{{#if theme}}
Theme: {{{theme}}}
{{/if}}

Provide suggestions for the next part of the story. Also, provide guidance on structuring the story, such as focusing on the conflict or introducing a new character. 
Format your response as a JSON object that strictly adheres to the following Zod schema:
\`\`\`json
{
  "suggestions": "array of strings for beginning, middle, and end suggestions",
  "structureGuidance": "string for overall story structure advice"
}
\`\`\`
Output ONLY the JSON object, with no other surrounding text or explanations. Ensure the language used is simple, encouraging, and age-appropriate.`,
});

const storyAssistanceFlow = ai.defineFlow(
  {
    name: 'storyAssistanceFlow',
    inputSchema: StoryAssistanceInputSchema,
    outputSchema: StoryAssistanceOutputSchema,
  },
  async input => {
    try {
      const {output} = await storyAssistancePrompt(input);
      if (!output) {
        console.error("StoryAssistanceFlow: AI model returned no output (null or undefined) for input:", input);
        throw new Error("The AI model did not return a valid response for story assistance. Output was empty.");
      }
      // The Zod schema validation on the prompt's output will handle structural mismatches.
      return output;
    } catch (flowError) {
      // Log the detailed error on the server side for better debugging
      console.error(`Error in storyAssistanceFlow when processing input: ${JSON.stringify(input)}`, flowError);
      // Re-throw the error. The client-side catch block will handle displaying a user-friendly message.
      // If flowError is already an Error instance with a good message, that message will be used by the client.
      // If it's a generic error, the client will show its standard fallback.
      throw flowError; 
    }
  }
);
