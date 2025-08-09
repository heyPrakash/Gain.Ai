
// This file does NOT have 'use server'
import { z } from 'genkit';
// Import from the component's schema definition for input
import { workoutScheduleFormSchema, type WorkoutScheduleFormValues } from '@/components/workout-planner/schemas';

// Input Schema (imported and re-exported/aliased from component schemas)
export const GenerateWorkoutScheduleInputSchema = workoutScheduleFormSchema;
export type GenerateWorkoutScheduleInput = WorkoutScheduleFormValues;

// Schemas for the AI output structure
const WorkoutExerciseSchema = z.object({
  name: z.string().describe('Name of the exercise.'),
  sets: z.string().describe('Recommended number of sets (e.g., "3", "4").'),
  reps: z.string().describe('Recommended repetitions per set (e.g., "8-12", "15").'),
  rest: z.string().describe('Recommended rest time between sets (e.g., "60-90s", "2 minutes").'),
});

export const GenerateWorkoutScheduleOutputSchema = z.object({
  workoutTitle: z.string().describe('A catchy and descriptive title for the workout session.'),
  exercises: z.array(WorkoutExerciseSchema).min(3).max(7).describe('List of 3-7 exercises for the session.'),
  notes: z.string().optional().describe('Important notes on form, intensity, or how to perform the workout.'),
  disclaimer: z.string().default("Always consult with a healthcare professional or certified personal trainer before starting any new workout program. Proper form is crucial to prevent injuries. Listen to your body and adjust as needed.").describe("Important safety disclaimer to include verbatim.")
});
export type GenerateWorkoutScheduleOutput = z.infer<typeof GenerateWorkoutScheduleOutputSchema>;
