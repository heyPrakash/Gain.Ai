
'use server';
/**
 * @fileOverview An AI agent for analyzing a user's physique from a full-body photo.
 *
 * - analyzeBodyScan - A function that handles the body scan analysis process.
 */

import {ai} from '@/ai/genkit';
import {
  AnalyzeBodyScanInputSchema,
  AnalyzeBodyScanOutputSchema,
  type AnalyzeBodyScanInput,
  type AnalyzeBodyScanOutput
} from './analyze-body-scan-types';

export async function analyzeBodyScan(
  input: AnalyzeBodyScanInput
): Promise<AnalyzeBodyScanOutput> {
  return analyzeBodyScanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeBodyScanPrompt',
  input: {schema: AnalyzeBodyScanInputSchema},
  output: {schema: AnalyzeBodyScanOutputSchema},
  prompt: `You are an expert AI fitness and physique analyst. Your tone must be positive, motivational, and encouraging.
  Your task is to analyze the provided full-body photo and return a physique analysis.

  Analyze this image: {{media url=photoDataUri}}

  User-provided data (use if available):
  - Height: {{heightFt}} ft
  - Weight: {{#if weightKg}}{{weightKg}} kg{{else}}Not Provided{{/if}}

  Instructions:
  1.  **Detect Body Shape**: Identify the user's body shape (e.g., Ectomorph, Mesomorph, Endomorph, or common shapes like Rectangle, Triangle, Hourglass).
  2.  **Estimate Metrics**:
      -   **Body Mass Index (BMI)**: Estimate BMI. Use the provided height and weight for a more accurate estimation.
      -   **Body Fat Percentage**: Provide a visual estimation of the body fat percentage.
      -   **Muscle Definition**: Assess muscle definition as 'low', 'medium', or 'high'.
      -   **Fitness Category**: Classify the user's physique into a fitness category (e.g., Underweight, Normal, Overweight, Athletic, Obese).
  3.  **Provide Physique Analysis**: Write a short (2-3 sentences), positive, and encouraging analysis of their current physique. Focus on strengths and potential.
  4.  **Suggest Improvement Plan**: Create a personalized fitness improvement plan. Provide 3-5 actionable bullet points combining diet and workout advice. For example: "Incorporate lean proteins like chicken and fish to support muscle growth." or "Add 2-3 sessions of resistance training per week, focusing on compound movements like squats and deadlifts."
  5.  **Safety First**: Do not provide medical advice. If the user appears to be significantly underweight or obese, gently suggest consulting a healthcare professional. Be empathetic and supportive. If the image is not a full-body photo or is unsuitable for analysis, explain this kindly in the 'physiqueAnalysis' field and return default/zero values for the other fields.`,
});

const analyzeBodyScanFlow = ai.defineFlow(
  {
    name: 'analyzeBodyScanFlow',
    inputSchema: AnalyzeBodyScanInputSchema,
    outputSchema: AnalyzeBodyScanOutputSchema,
  },
  async input => {
    try {
      const response = await prompt(input);
      const output = response.output;
      const usage = response.usage;

      if (!output) {
        let errorMessage = 'AI model failed to analyze the body scan or the response was invalid.';
        if (usage) {
          console.error('Body Scan Flow: LLM returned no output. Usage details:', JSON.stringify(usage, null, 2));
          if (usage.finishReason && !['stop', 'length', 'unknown', 'unspecified'].includes(usage.finishReason.toLowerCase())) {
            errorMessage = `Body scan analysis failed. Reason: ${usage.finishReason}.`;
            if (usage.finishMessage) {
              errorMessage += ` Message: ${usage.finishMessage}.`;
            }
             if (usage.finishReason.toLowerCase() === 'safety') {
                 errorMessage += ' This may be due to safety filters. Please review your input or adjust safety settings if possible.';
            }
          } else if (usage.finishMessage) {
             errorMessage = `Body scan analysis issue: ${usage.finishMessage}.`;
          }
        } else {
            console.error('Body Scan Flow: LLM returned no output, and no usage details were available.');
        }
        throw new Error(errorMessage);
      }
      return output;
    } catch (flowError) {
        console.error('Critical error during analyzeBodyScanFlow execution:', flowError);
        if (flowError instanceof Error) {
            if (flowError.message.startsWith('Body scan') || flowError.message.startsWith('AI model') || flowError.message.includes('helper')) {
                throw flowError;
            }
            throw new Error(`Body scan flow encountered an error: ${flowError.message}`);
        }
        throw new Error(`An unexpected error occurred in the body scan flow: ${String(flowError)}`);
    }
  }
);
