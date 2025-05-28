
'use server';

/**
 * @fileOverview An AI learning companion flow that answers questions about school topics with kid-friendly explanations and examples.
 *
 * - aiLearningCompanion - A function that handles the question answering process.
 * - AiLearningCompanionInput - The input type for the aiLearningCompanion function.
 * - AiLearningCompanionOutput - The return type for the aiLearningCompanion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiLearningCompanionInputSchema = z.object({
  question: z.string().describe('The question asked by the student.'),
  subject: z.string().optional().describe('The subject the question relates to.'),
});
export type AiLearningCompanionInput = z.infer<typeof AiLearningCompanionInputSchema>;

const AiLearningCompanionOutputSchema = z.object({
  answer: z.string().describe('The kid-friendly explanation and examples for the question.'),
});
export type AiLearningCompanionOutput = z.infer<typeof AiLearningCompanionOutputSchema>;

export async function aiLearningCompanion(input: AiLearningCompanionInput): Promise<AiLearningCompanionOutput> {
  return aiLearningCompanionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiLearningCompanionPrompt',
  input: {schema: AiLearningCompanionInputSchema},
  output: {schema: AiLearningCompanionOutputSchema},
  prompt: `You are a friendly and encouraging AI learning companion for students aged 7-15.
{{#if subject}}
The student is asking a question related to the subject: {{{subject}}}.
{{/if}}
Provide clear, kid-friendly explanations and examples for the following question. Use simple language and analogies where possible. If appropriate, you can include an emoji to make it more engaging.
Question: {{{question}}}

Answer:`,
});

const aiLearningCompanionFlow = ai.defineFlow(
  {
    name: 'aiLearningCompanionFlow',
    inputSchema: AiLearningCompanionInputSchema,
    outputSchema: AiLearningCompanionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
