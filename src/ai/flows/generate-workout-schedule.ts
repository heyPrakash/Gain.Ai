
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
  Create a weekly workout schedule for a gym user based on their fitness goal, strength level, workout frequency, workout location, and gender.

  User Details:
  - Fitness Goal: {{{fitnessGoal}}}
  - Strength Level: {{{strengthLevel}}}
  - Days Available for Workout: {{{daysAvailable}}} days per week
  - Workout Location: {{{workoutLocation}}}
  - Gender: {{{gender}}}

  Output Requirements:
  1.  **Schedule Title:** A catchy and descriptive title for the workout schedule.
  2.  **Weekly Schedule:**
      *   Provide a day-wise workout split (e.g., Monday: Chest + Triceps, Tuesday: Back + Biceps, etc.). The number of workout days MUST match the 'daysAvailable' input.
      *   For each workout day, list 3-5 exercises. For each exercise, provide its name and optionally, recommended sets and repetitions (e.g., "3 sets of 8-12 reps").
      *   Tailor exercises based on the 'Workout Location'. If 'home', prioritize bodyweight exercises or those using common household items if possible (e.g., sturdy chairs for dips, water bottles for weights if no equipment is available). Clearly state if specific equipment (like resistance bands or dumbbells) is assumed for home workouts. If 'gym', assume access to standard gym equipment.
  3.  **Recovery Tips:** Include tips on rest days, importance of warm-up, cool-down, proper form, and listening to the body.
  4.  **Disclaimer:** Include the provided safety disclaimer verbatim.

  Make sure the plan is well-balanced, aligns with the user's goal, strength level, gender, and location, and is clear and easy to follow.
  For 'beginner' strength level, focus on fundamental compound movements and proper form.
  For 'intermediate' strength level, incorporate a mix of compound and isolation exercises with progressive overload principles.
  For 'advanced' strength level, suggest more complex exercises, varied rep ranges, and potentially advanced training techniques if appropriate for the goal.
  Ensure the split considers adequate rest between working the same muscle groups.
  If daysAvailable is less than 5, ensure all major muscle groups are hit at least once, possibly through full-body or upper/lower splits.
  While gender can provide context, ensure the plan is primarily driven by fitness goals and strength level, avoiding overly stereotypical exercise choices unless specifically beneficial and justified.
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
        let errorMessage = 'AI model failed to generate a workout schedule or the response was invalid.';
        if (usage) {
          console.error('Workout Schedule Flow: LLM returned no output. Usage details:', JSON.stringify(usage, null, 2));
           if (usage.finishReason && !['stop', 'length', 'unknown', 'unspecified'].includes(usage.finishReason.toLowerCase())) {
            errorMessage = `Workout schedule generation failed. Reason: ${usage.finishReason}.`;
            if (usage.finishMessage) {
              errorMessage += ` Message: ${usage.finishMessage}.`;
            }
            if (usage.finishReason.toLowerCase() === 'safety') {
                 errorMessage += ' This may be due to safety filters. Please review your input or adjust safety settings if possible.';
            }
          } else if (usage.finishMessage) {
             errorMessage = `Workout schedule generation issue: ${usage.finishMessage}.`;
          }
        } else {
            console.error('Workout Schedule Flow: LLM returned no output, and no usage details were available.');
        }
        throw new Error(errorMessage);
      }

      if (output.weeklySchedule.length !== input.daysAvailable) {
        console.warn(`AI generated ${output.weeklySchedule.length} workout days, but user requested ${input.daysAvailable}. Attempting to use AI-generated day count.`);
        // Optionally, could throw an error here or try to adjust, but for now, we'll log and proceed with AI's output.
        // throw new Error(`AI generated ${output.weeklySchedule.length} workout days, but ${input.daysAvailable} were requested.`);
      }
      return output;
    } catch (flowError) {
        console.error("Critical error during generateWorkoutScheduleFlow execution:", flowError);
        if (flowError instanceof Error) {
            if (flowError.message.startsWith('Workout schedule generation') || flowError.message.startsWith('AI model') || flowError.message.includes('helper')) {
                throw flowError;
            }
            throw new Error(`Workout Schedule flow encountered an error: ${flowError.message}`);
        }
        throw new Error(`An unexpected error occurred in the workout schedule flow: ${String(flowError)}`);
    }
  }
);
