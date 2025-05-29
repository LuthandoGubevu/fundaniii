
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
// Note: dotenv config is usually handled by Next.js for .env files
// or by src/ai/dev.ts for the genkit dev server.
// Avoid calling dotenv.config() directly here unless you have a specific reason.

const googleApiKey = process.env.GOOGLE_API_KEY;

if (!googleApiKey || googleApiKey.trim() === "" || googleApiKey === "YOUR_ACTUAL_GOOGLE_AI_API_KEY_HERE") {
  const errorMessage = `
CRITICAL_GENKIT_CONFIG_ERROR: The GOOGLE_API_KEY environment variable is missing, empty, or still a placeholder.
Genkit's googleAI plugin requires this to authenticate with Google AI services.
1. Ensure you have a valid API key from Google Cloud Console for Generative Language / Vertex AI services.
2. Add this key to your .env file (at the project root) as:
   GOOGLE_API_KEY="YOUR_KEY_HERE"
3. IMPORTANT: You MUST restart your Next.js development server after any .env file changes.
4. Ensure the Google Cloud project associated with the API key has billing enabled and the necessary AI APIs (e.g., Generative Language API or Vertex AI API) enabled.

Without this key, AI features will fail.
Current GOOGLE_API_KEY starts with: '${String(googleApiKey).substring(0, 5)}...'
`;
  console.error(errorMessage);
  // Optionally, to make it very clear on server start if developing locally:
  // if (process.env.NODE_ENV === 'development' && typeof window === 'undefined') {
  //   throw new Error("CRITICAL_GENKIT_CONFIG_ERROR: GOOGLE_API_KEY is not configured. See server console.");
  // }
} else {
  // This log is helpful for confirming the key is being picked up.
  // You might want to remove or conditionalize it for production.
  console.log("GOOGLE_API_KEY found, proceeding with Genkit googleAI() plugin initialization.");
}

export const ai = genkit({
  plugins: [
    // Explicitly passing the API key.
    // If googleApiKey is undefined here, the googleAI plugin itself will likely error.
    googleAI({ apiKey: googleApiKey }),
  ],
  // Default model for text generation if not specified in a particular flow
  model: 'googleai/gemini-2.0-flash',
});
