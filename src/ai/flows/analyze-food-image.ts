
'use server';
/**
 * @fileOverview An AI agent for analyzing food images for nutritional content.
 *
 * - analyzeFoodImage - A function that handles the food image analysis process.
 */

import {ai} from '@/ai/genkit';
import {
  AnalyzeFoodImageInputSchema,
  AnalyzeFoodImageOutputSchema,
  type AnalyzeFoodImageInput,
  type AnalyzeFoodImageOutput
} from './analyze-food-image-types';

export async function analyzeFoodImage(
  input: AnalyzeFoodImageInput
): Promise<AnalyzeFoodImageOutput> {
  return analyzeFoodImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeFoodImagePrompt',
  input: {schema: AnalyzeFoodImageInputSchema},
  output: {schema: AnalyzeFoodImageOutputSchema},
  prompt: `You are a specialized nutrition analysis AI for fitness enthusiasts.
Your task is to analyze the provided image of a meal and return detailed nutritional information.
Focus on accuracy for meals commonly consumed by gym-goers (e.g., chicken, rice, salmon, protein shakes, oats, eggs, etc.).

Analyze this image: {{media url=photoDataUri}}

Instructions:
1.  **Identify Food Items**: Detect each individual food item in the image.
2.  **Estimate Portion Size**: For each item, estimate the portion size (e.g., "1 cup", "150g", "1 chicken breast").
3.  **Calculate Nutritional Data**: For each item, provide the estimated calories, protein, fats, and carbohydrates.
4.  **Calculate Totals**: Sum the nutritional data for all items to provide a total for the entire meal.
5.  **Provide a Fitness Summary**: Write a brief, encouraging summary (1-2 sentences) about how this meal could fit into a fitness diet (e.g., "This looks like a great post-workout meal, high in protein to help with muscle recovery.").
6.  **Accuracy is Key**: Be as accurate as possible. If an item is unclear or cannot be identified confidently, it's better to omit it than to provide incorrect information. If no food is detected, return empty arrays and zeros for totals.
`,
});

const analyzeFoodImageFlow = ai.defineFlow(
  {
    name: 'analyzeFoodImageFlow',
    inputSchema: AnalyzeFoodImageInputSchema,
    outputSchema: AnalyzeFoodImageOutputSchema,
  },
  async input => {
    try {
      const response = await prompt(input);
      const output = response.output;
      const usage = response.usage;

      if (!output) {
        let errorMessage = 'AI model failed to analyze the food image or the response was invalid.';
        if (usage) {
          console.error('Food Analysis Flow: LLM returned no output. Usage details:', JSON.stringify(usage, null, 2));
          if (usage.finishReason && !['stop', 'length', 'unknown', 'unspecified'].includes(usage.finishReason.toLowerCase())) {
            errorMessage = `Food analysis failed. Reason: ${usage.finishReason}.`;
            if (usage.finishMessage) {
              errorMessage += ` Message: ${usage.finishMessage}.`;
            }
             if (usage.finishReason.toLowerCase() === 'safety') {
                 errorMessage += ' This may be due to safety filters. Please review your input or adjust safety settings if possible.';
            }
          } else if (usage.finishMessage) {
             errorMessage = `Food analysis issue: ${usage.finishMessage}.`;
          }
        } else {
            console.error('Food Analysis Flow: LLM returned no output, and no usage details were available.');
        }
        throw new Error(errorMessage);
      }
      return output;
    } catch (flowError) {
        console.error('Critical error during analyzeFoodImageFlow execution:', flowError);
        if (flowError instanceof Error) {
            if (flowError.message.startsWith('Food analysis') || flowError.message.startsWith('AI model') || flowError.message.includes('helper')) {
                throw flowError;
            }
            throw new Error(`Food analysis flow encountered an error: ${flowError.message}`);
        }
        throw new Error(`An unexpected error occurred in the food analysis flow: ${String(flowError)}`);
    }
  }
);
