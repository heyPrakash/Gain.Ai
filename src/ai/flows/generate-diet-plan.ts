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

  Based on the following information about the user, create a personalized diet plan to help them achieve their fitness goals.

  Weight: {{{weightKg}}} kg
  Height: {{{heightCm}}} cm
  Age: {{{age}}} years
  Gender: {{{gender}}}
  Fitness Goals: {{{fitnessGoals}}}
  Dietary Preferences: {{{dietaryPreferences}}}
  Activity Level: {{{activityLevel}}}

  The diet plan should include meal suggestions, nutritional information, and recommended serving sizes.
  `,
});

const generateDietPlanFlow = ai.defineFlow(
  {
    name: 'generateDietPlanFlow',
    inputSchema: GenerateDietPlanInputSchema,
    outputSchema: GenerateDietPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
