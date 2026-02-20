const PLACEHOLDER_API_KEY = 'YOUR_API_KEY_HERE';

function clean(value: string | undefined): string {
  return value?.trim() ?? '';
}

export function getServerGoogleApiKey(): string {
  return clean(process.env.GOOGLE_API_KEY) || clean(process.env.GEMINI_API_KEY);
}

export function hasValidServerGoogleApiKey(): boolean {
  const key = getServerGoogleApiKey();
  return key.length > 0 && key !== PLACEHOLDER_API_KEY;
}

export function getConfiguredAiModel(): string {
  const configuredModel = clean(process.env.GOOGLE_GENAI_MODEL) || clean(process.env.AI_MODEL);
  return configuredModel || 'googleai/gemini-1.5-flash';
}
