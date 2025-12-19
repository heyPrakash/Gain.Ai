
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const googleApiKey = process.env.GOOGLE_API_KEY;

if (!googleApiKey || googleApiKey === "YOUR_API_KEY_HERE" || googleApiKey.trim() === "") {
  // This error will be thrown during server startup (e.g., when `next dev` or `next start` runs)
  // if the environment variable is missing. This provides a clear, immediate failure.
  throw new Error(
    "FATAL_ERROR: The GOOGLE_API_KEY environment variable is not set or is invalid. " +
    "This is required for all AI features to function. " +
    "Please add GOOGLE_API_KEY to your .env file for local development or to your Vercel/hosting provider's environment variable settings for production. " +
    "The application cannot start without it."
  );
}

// If the key exists, log a confirmation message in development to help with debugging.
if (process.env.NODE_ENV === 'development') {
    console.log("INFO: GOOGLE_API_KEY loaded for Genkit. AI features should be available.");
}


export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: googleApiKey, // The apiKey is guaranteed to be a valid string here.
    }),
  ],
  model: 'googleai/gemini-pro',
});
