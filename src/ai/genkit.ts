import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

import { getConfiguredAiModel, getServerGoogleApiKey, hasValidServerGoogleApiKey } from '@/lib/ai-config';

const googleApiKey = getServerGoogleApiKey();
const hasValidGoogleApiKey = hasValidServerGoogleApiKey();

if (!hasValidGoogleApiKey && process.env.NODE_ENV !== 'production') {
  console.warn(
    'WARN: GOOGLE_API_KEY/GEMINI_API_KEY is missing or invalid. AI features will be unavailable until the key is configured.'
  );
}

if (hasValidGoogleApiKey && process.env.NODE_ENV === 'development') {
  console.log('INFO: Server AI API key loaded for Genkit. AI features should be available.');
}

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: googleApiKey,
    }),
  ],
  model: getConfiguredAiModel(),
});
