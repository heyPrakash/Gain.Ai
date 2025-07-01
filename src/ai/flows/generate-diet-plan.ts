
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

  Based on the following information about the user, create a personalized diet plan to help them achieve their fitness goals. The plan should be structured from morning to night.

  Weight: {{{weightKg}}} kg
  Height: {{{heightFt}}} ft
  Age: {{{age}}} years
  Gender: {{{gender}}}
  Fitness Goals: {{{fitnessGoals}}}
  Dietary Preferences: {{{dietaryPreferences}}}
  Activity Level: {{{activityLevel}}}
  Requested Plan Detail: {{{planDetailLevel}}}

  The user has requested a "{{{planDetailLevel}}}" diet plan.

  Use the following headings for the meal sections: "Morning", "Mid-Morning", "Lunch", "Evening", and "Night Snack". Ensure each of these headings is on its own line and formatted as **Heading:**. For example: **Morning:**.

  If the user requested a "summary" plan:
  Provide a CONCISE SUMMARY diet plan. Focus on:
  - General meal structure under the requested headings.
  - Key food group recommendations for each meal type.
  - 1-2 brief example meal ideas per meal type, without extensive options or detailed calorie breakdowns for individual food items.
  - Overall daily calorie target, if applicable based on goals.
  - Critical general advice (e.g., hydration, portion control).
  Keep the entire plan brief and to the point. Do not include a shopping list for summary plans.

  If the user requested a "detailed" plan:
  Provide a DETAILED diet plan. The diet plan should include:
  - Meal suggestions under the requested headings.
  - Specific food items and portion sizes for each meal suggestion.
  - Approximate nutritional information (calories, protein, carbs, fats) for meal options or for the day.
  - Recommended serving sizes.
  - A sample shopping list under the heading **Shopping List:**.
  - Important considerations and advice regarding hydration, etc., under the heading **Important Considerations:**.

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
