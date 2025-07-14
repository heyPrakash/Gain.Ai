
'use server';
/**
 * @fileOverview A diet plan generation AI agent.
 *
 * - generateDietPlan - A function that handles the diet plan generation process.
 */

import {ai} from '@/ai/genkit';
import { 
  GenerateDietPlanInputSchema, 
  GenerateDietPlanOutputSchema,
  type GenerateDietPlanInput,
  type GenerateDietPlanOutput
} from './generate-diet-plan-types';


export async function generateDietPlan(
  input: GenerateDietPlanInput
): Promise<GenerateDietPlanOutput> {
  return generateDietPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDietPlanPrompt',
  input: {schema: GenerateDietPlanInputSchema},
  output: {schema: GenerateDietPlanOutputSchema},
  prompt: `You are a personal nutrition and fitness coach.

  Based on the following user information, create a personalized diet plan to help them achieve their fitness goals.
  - Weight: {{{weightKg}}} kg
  - Height: {{{heightFt}}} ft
  - Age: {{{age}}} years
  - Gender: {{{gender}}}
  - Fitness Goal: {{{fitnessGoals}}}
  - Dietary Preferences: {{{dietaryPreferences}}}
  - Activity Level: {{{activityLevel}}}
  - Plan Detail Requested: {{{planDetailLevel}}}

  Structure the diet plan with these exact headings on their own lines, followed by a colon: **Morning (Breakfast):**, **Lunch:**, **Dinner:**, and **Snacks:**.

  If the user requested a "summary" plan, provide a CONCISE overview with general meal structures and 1-2 examples per meal. Do not include a shopping list.

  If the user requested a "detailed" plan, provide specific meal suggestions with portion sizes and approximate nutritional info (calories, protein, etc.). Also include a **Shopping List:** and **Important Considerations:** section at the end.

  Ensure the plan is tailored to the user's inputs.
  `,
});

const generateDietPlanFlow = ai.defineFlow(
  {
    name: 'generateDietPlanFlow',
    inputSchema: GenerateDietPlanInputSchema,
    outputSchema: GenerateDietPlanOutputSchema,
  },
  async input => {
    try {
      const response = await prompt(input);
      const output = response.output;
      const usage = response.usage;

      if (!output) {
        let errorMessage = 'AI model failed to generate a diet plan or the response was invalid.';
        if (usage) {
          console.error('Diet Plan Flow: LLM returned no output. Usage details:', JSON.stringify(usage, null, 2));
          if (usage.finishReason && !['stop', 'length', 'unknown', 'unspecified'].includes(usage.finishReason.toLowerCase())) {
            errorMessage = `Diet plan generation failed. Reason: ${usage.finishReason}.`;
            if (usage.finishMessage) {
              errorMessage += ` Message: ${usage.finishMessage}.`;
            }
            if (usage.finishReason.toLowerCase() === 'safety') {
                 errorMessage += ' This may be due to safety filters. Please review your input or adjust safety settings if possible.';
            }
          } else if (usage.finishMessage) {
             errorMessage = `Diet plan generation issue: ${usage.finishMessage}.`;
          }
        } else {
            console.error('Diet Plan Flow: LLM returned no output, and no usage details were available.');
        }
        throw new Error(errorMessage);
      }
      return output;
    } catch (flowError) {
        console.error('Critical error during generateDietPlanFlow execution:', flowError);
        if (flowError instanceof Error) {
            if (flowError.message.startsWith('Diet plan generation') || flowError.message.startsWith('AI model') || flowError.message.includes('helper')) {
                throw flowError;
            }
            throw new Error(`Diet Plan flow encountered an error: ${flowError.message}`);
        }
        throw new Error(`An unexpected error occurred in the diet plan flow: ${String(flowError)}`);
    }
  }
);
