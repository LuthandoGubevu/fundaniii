'use server';
/**
 * @fileOverview A Genkit flow for generating images for story pages.
 *
 * - generateStoryImage - A function that handles the image generation process.
 * - GenerateStoryImageInput - The input type for the generateStoryImage function.
 * - GenerateStoryImageOutput - The return type for the generateStoryImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStoryImageInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate an image from.'),
});
export type GenerateStoryImageInput = z.infer<typeof GenerateStoryImageInputSchema>;

const GenerateStoryImageOutputSchema = z.object({
  imageDataUri: z.string().describe('The generated image as a data URI.'),
});
export type GenerateStoryImageOutput = z.infer<typeof GenerateStoryImageOutputSchema>;

export async function generateStoryImage(input: GenerateStoryImageInput): Promise<GenerateStoryImageOutput> {
  return generateStoryImageFlow(input);
}

const generateStoryImageFlow = ai.defineFlow(
  {
    name: 'generateStoryImageFlow',
    inputSchema: GenerateStoryImageInputSchema,
    outputSchema: GenerateStoryImageOutputSchema,
  },
  async (input) => {
    try {
      const {media} = await ai.generate({
        model: 'googleai/gemini-2.0-flash-exp', // Specific model for image generation
        prompt: input.prompt,
        config: {
          responseModalities: ['TEXT', 'IMAGE'], // Must include both for image generation
          // Optional: Adjust safety settings if needed, e.g., for children's content
          // safetySettings: [
          //   { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_LOW_AND_ABOVE' },
          //   { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          //   { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          //   { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          // ],
        },
      });

      if (!media?.url) {
        console.error('Image generation response did not include media URL:', media);
        throw new Error('Image generation failed to return an image. The model might have refused the prompt.');
      }
      return {imageDataUri: media.url};
    } catch (error) {
      console.error("Error in generateStoryImageFlow:", error);
      // It's often better to let the calling function handle UI-specific error messages (like toasts)
      // But re-throwing ensures the error propagates.
      if (error instanceof Error && error.message.includes('response was blocked')) {
         throw new Error('The image generation request was blocked by safety filters. Please try a different prompt.');
      }
      throw new Error(`Failed to generate image: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
);
