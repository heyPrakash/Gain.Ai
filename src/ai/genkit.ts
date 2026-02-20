import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const googleApiKey = process.env.GOOGLE_API_KEY?.trim() ?? '';
const hasValidGoogleApiKey = googleApiKey.length > 0 && googleApiKey !== 'YOUR_API_KEY_HERE';

if (!hasValidGoogleApiKey && process.env.NODE_ENV !== 'production') {
  console.warn(
    'WARN: GOOGLE_API_KEY is missing or invalid. AI features will be unavailable until the key is configured.'
  );
}

if (hasValidGoogleApiKey && process.env.NODE_ENV === 'development') {
  console.log('INFO: GOOGLE_API_KEY loaded for Genkit. AI features should be available.');
}

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: googleApiKey,
    }),
  ],
  model: 'googleai/gemini-pro',
});
