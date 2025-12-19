
// This file does NOT have 'use server'
import { z } from 'genkit';
// Import from the component's schema definition
import { userProfileSchema, type UserProfileFormValues } from '@/components/diet-planner/schemas';

// Re-export/alias the input schema and type for the AI flow
export const GenerateDietPlanInputSchema = userProfileSchema;
export type GenerateDietPlanInput = UserProfileFormValues;

// Define and export the output schema and type for the AI flow
export const GenerateDietPlanOutputSchema = z.object({
  dietPlan: z
    .string()
    .describe(
      'A personalized diet plan tailored to the user based on their input.'
    ),
});
export type GenerateDietPlanOutput = z.infer<typeof GenerateDietPlanOutputSchema>;
