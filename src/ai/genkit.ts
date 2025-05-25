
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const googleApiKey = process.env.GOOGLE_API_KEY;

if (!googleApiKey || googleApiKey === "YOUR_API_KEY_HERE" || googleApiKey.trim() === "") {
  console.error(
    "\n*********************************************************************************\n" +
    "ERROR: GOOGLE_API_KEY is not properly configured.\n" +
    "Please ensure GOOGLE_API_KEY is set in your .env file with a valid API key.\n" +
    " - It should not be empty or still be 'YOUR_API_KEY_HERE'.\n" +
    " - Make sure there are no extra spaces around the key.\n" +
    "If you've recently updated the .env file, please restart your Next.js development server (e.g., 'npm run dev').\n" +
    "The application's AI features will not work until this is resolved.\n" +
    "*********************************************************************************\n"
  );
} else {
  if (process.env.NODE_ENV === 'development') {
    console.log("INFO: GOOGLE_API_KEY seems to be loaded for Genkit. AI features should attempt to use it.");
  }
}

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: googleApiKey, // Pass the key; the googleAI plugin will handle if it's invalid/missing.
    }),
  ],
  model: 'googleai/gemini-2.0-flash',
});
