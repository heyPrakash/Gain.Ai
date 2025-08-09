
'use server';
/**
 * @fileOverview An AI agent for generating single workout sessions.
 *
 * - generateWorkoutSchedule - A function to generate a workout session.
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
  Create a single, targeted workout session for a user based on the body part they want to train, the time they have available, their fitness level, and where they are working out.

  User Details:
  - Body Part to Train: {{{bodyPart}}}
  - Time Available: {{{timeAvailable}}} minutes
  - Fitness Level: {{{fitnessLevel}}}
  - Workout Location: {{{workoutLocation}}}

  Output Requirements:
  1.  **Workout Title:** A catchy and descriptive title for the workout session (e.g., "30-Minute Power Chest Workout").
  2.  **Exercises:**
      *   Provide a list of 3-7 exercises suitable for the user's inputs.
      *   For each exercise, you MUST provide the exercise name, the number of sets, the number of reps per set, and the rest time between sets.
      *   Prioritize high-intensity or compound exercises if the time is short to maximize effectiveness.
      *   Tailor exercises based on the 'Workout Location'. For 'home', prioritize bodyweight exercises or suggest common household items as alternatives if no equipment is mentioned. For 'gym', assume access to standard gym equipment.
  3.  **Notes:** Provide brief but important notes on form, intensity, or a suggested warm-up/cool-down if relevant.
  4.  **Disclaimer:** Include the provided safety disclaimer verbatim.

  Make sure the plan is well-balanced, safe, and effective for the user's fitness level and available time.
  - For 'beginner', focus on fundamental movements.
  - For 'intermediate', use a mix of compound and isolation exercises.
  - For 'advanced', suggest more complex movements and techniques.
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
