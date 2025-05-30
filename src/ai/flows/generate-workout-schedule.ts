'use server';
/**
 * @fileOverview An AI agent for generating weekly workout schedules.
 *
 * - generateWorkoutSchedule - A function to generate a workout schedule.
 */

import {ai} from '@/ai/genkit';
import {
  GenerateWorkoutScheduleInputSchema,
  GenerateWorkoutScheduleOutputSchema,
  type GenerateWorkoutScheduleInput,
  type GenerateWorkoutScheduleOutput
} from './generate-workout-schedule-types';


export async function generateWorkoutSchedule(
  input: GenerateWorkoutScheduleInput
): Promise<GenerateWorkoutScheduleOutput> {
  return generateWorkoutScheduleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWorkoutSchedulePrompt',
  input: {schema: GenerateWorkoutScheduleInputSchema},
  output: {schema: GenerateWorkoutScheduleOutputSchema},
  prompt: `You are an expert fitness coach and personal trainer.
  Create a weekly workout schedule for a gym user based on their fitness goal, experience level, and workout frequency.

  User Details:
  - Fitness Goal: {{{fitnessGoal}}}
  - Experience Level: {{{experienceLevel}}}
  - Days Available for Workout: {{{daysAvailable}}} days per week

  Output Requirements:
  1.  **Schedule Title:** A catchy and descriptive title for the workout schedule.
  2.  **Weekly Schedule:**
      *   Provide a day-wise workout split (e.g., Monday: Chest + Triceps, Tuesday: Back + Biceps, etc.). The number of workout days MUST match the 'daysAvailable' input.
      *   For each workout day, list 3-5 exercises. For each exercise, provide its name and optionally, recommended sets and repetitions (e.g., "3 sets of 8-12 reps").
  3.  **Recovery Tips:** Include tips on rest days, importance of warm-up, cool-down, proper form, and listening to the body.
  4.  **Disclaimer:** Include the provided safety disclaimer verbatim.

  Make sure the plan is well-balanced, aligns with the user's goal and experience level, and is clear and easy to follow.
  For 'beginner' level, focus on fundamental compound movements and proper form.
  For 'intermediate' level, incorporate a mix of compound and isolation exercises with progressive overload principles.
  For 'advanced' level, suggest more complex exercises, varied rep ranges, and potentially advanced training techniques if appropriate for the goal.
  Ensure the split considers adequate rest between working the same muscle groups.
  If daysAvailable is less than 5, ensure all major muscle groups are hit at least once, possibly through full-body or upper/lower splits.
  `,
});

const generateWorkoutScheduleFlow = ai.defineFlow(
  {
    name: 'generateWorkoutScheduleFlow',
    inputSchema: GenerateWorkoutScheduleInputSchema,
    outputSchema: GenerateWorkoutScheduleOutputSchema,
  },
  async (input: GenerateWorkoutScheduleInput): Promise<GenerateWorkoutScheduleOutput> => {
    try {
      const {output} = await prompt(input);
      if (!output) {
        throw new Error('AI did not return a workout schedule.');
      }
      // Ensure the number of workout days in the schedule matches daysAvailable
      if (output.weeklySchedule.length !== input.daysAvailable) {
        // This is a fallback, ideally the prompt guides the AI correctly.
        // For simplicity in this example, we'll log a warning but still return the output.
        // In a production app, you might want to retry the prompt or refine it.
        console.warn(`AI generated ${output.weeklySchedule.length} workout days, but user requested ${input.daysAvailable}.`);
        // Potentially, try to trim or pad the schedule, or re-prompt. For now, we pass it through.
      }
      return output;
    } catch (error) {
        console.error("Error in generateWorkoutScheduleFlow:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to generate workout schedule: ${error.message}`);
        }
        throw new Error("An unknown error occurred while generating the workout schedule.");
    }
  }
);
