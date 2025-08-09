
'use server';
/**
 * @fileOverview An AI agent for generating weekly workout schedules.
 *
 * - generateWorkoutSchedule - A function to generate a full weekly workout plan.
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
  Create a comprehensive 7-day workout schedule for a user based on their fitness goals, experience level, workout location, gender, and the number of days they can train per week.

  User Details:
  - Primary Goal: {{{goal}}}
  - Strength Level: {{{strengthLevel}}}
  - Days Available per Week: {{{daysAvailable}}}
  - Workout Location: {{{location}}}
  - Gender: {{{gender}}}

  Output Requirements:
  1.  **Schedule Title:** A catchy and descriptive title for the weekly plan (e.g., "4-Day Muscle Building Split").
  2.  **Weekly Schedule:**
      *   Provide a plan for all 7 days of the week, from Monday to Sunday.
      *   Training days should be distributed logically throughout the week. Days the user cannot train must be 'Rest' days.
      *   For each day, specify the 'focus' (e.g., "Chest & Triceps," "Leg Day," "Full Body," "Cardio & Abs," or "Rest").
      *   For each training day, list 4-6 exercises. For each exercise, provide the exercise name, sets, and reps. Do not provide rest times.
      *   For 'Rest' days, the 'exercises' array should be empty.
      *   Tailor exercises based on the 'Workout Location'. For 'home', prioritize bodyweight or minimal equipment exercises. For 'gym', assume access to standard gym equipment.
  3.  **Notes:** Provide brief but important notes on progressive overload, warm-ups, or cool-downs.
  4.  **Disclaimer:** Include the provided safety disclaimer verbatim.

  Adapt the workout split based on the 'Days Available':
  - 3 days: Suggest a full-body routine.
  - 4 days: Suggest an upper/lower body split.
  - 5 days: Suggest a 'bro split' (each day focuses on a different muscle group).
  - 6 days: Suggest a push/pull/legs split.
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
      const response = await prompt(input);
      const output = response.output;
      const usage = response.usage;

      if (!output) {
        let errorMessage = 'AI model failed to generate a workout or the response was invalid.';
        if (usage) {
          console.error('Workout Schedule Flow: LLM returned no output. Usage details:', JSON.stringify(usage, null, 2));
           if (usage.finishReason && !['stop', 'length', 'unknown', 'unspecified'].includes(usage.finishReason.toLowerCase())) {
            errorMessage = `Workout generation failed. Reason: ${usage.finishReason}.`;
            if (usage.finishMessage) {
              errorMessage += ` Message: ${usage.finishMessage}.`;
            }
            if (usage.finishReason.toLowerCase() === 'safety') {
                 errorMessage += ' This may be due to safety filters. Please review your input or adjust safety settings if possible.';
            }
          } else if (usage.finishMessage) {
             errorMessage = `Workout generation issue: ${usage.finishMessage}.`;
          }
        } else {
            console.error('Workout Schedule Flow: LLM returned no output, and no usage details were available.');
        }
        throw new Error(errorMessage);
      }
      return output;
    } catch (flowError) {
        console.error("Critical error during generateWorkoutScheduleFlow execution:", flowError);
        if (flowError instanceof Error) {
            if (flowError.message.startsWith('Workout generation') || flowError.message.startsWith('AI model') || flowError.message.includes('helper')) {
                throw flowError;
            }
            throw new Error(`Workout flow encountered an error: ${flowError.message}`);
        }
        throw new Error(`An unexpected error occurred in the workout flow: ${String(flowError)}`);
    }
  }
);
