'use server';
/**
 * @fileOverview A diet plan generation AI agent.
 *
 * - generateDietPlan - A function that handles the diet plan generation process.
 * - GenerateDietPlanInput - The input type for the generateDietPlan function.
 * - GenerateDietPlanOutput - The return type for the generateDietPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDietPlanInputSchema = z.object({
  weightKg: z.number().describe('Your weight in kilograms.'),
  heightCm: z.number().describe('Your height in centimeters.'),
  age: z.number().describe('Your age in years.'),
  gender: z.enum(['male', 'female']).describe('Your gender.'),
  fitnessGoals: z
    .string()
    .describe(
      'Your fitness goals, e.g., lose weight, gain muscle, improve endurance.'
    ),
  dietaryPreferences: z
    .string()
    .describe(
      'Your dietary preferences and restrictions, e.g., vegetarian, vegan, gluten-free.'
    ),
  activityLevel: z
    .string()
    .describe(
      'Your typical daily activity level, e.g., sedentary, lightly active, moderately active, very active, extra active.'
    ),
});
export type GenerateDietPlanInput = z.infer<typeof GenerateDietPlanInputSchema>;

const GenerateDietPlanOutputSchema = z.object({
  dietPlan: z
    .string()
    .describe(
      'A personalized diet plan tailored to the user based on their input.'
    ),
});
export type GenerateDietPlanOutput = z.infer<typeof GenerateDietPlanOutputSchema>;

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
