
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
  setsAndReps: z.string().optional().describe('Recommended sets and repetitions (e.g., 3 sets of 8-12 reps).'),
});

const DailyWorkoutSchema = z.object({
  dayName: z.string().describe('Day of the week or workout day number (e.g., Monday, Day 1).'),
  focus: z.string().describe('Main muscle groups or focus for the day (e.g., Chest + Triceps, Full Body, Upper Body).'),
  exercises: z.array(WorkoutExerciseSchema).min(3).max(5).describe('List of 3-5 exercises for the day.'),
});

export const GenerateWorkoutScheduleOutputSchema = z.object({
  scheduleTitle: z.string().describe('A catchy and descriptive title for the workout schedule.'),
  weeklySchedule: z.array(DailyWorkoutSchema).describe('The day-by-day workout split for the week. Ensure the number of workout days matches the "daysAvailable" input.'),
  recoveryTips: z.string().describe('General recovery tips, including rest day advice and importance of proper form, warm-up, and cool-down.'),
  disclaimer: z.string().default("Always consult with a healthcare professional or certified personal trainer before starting any new workout program, especially if you have pre-existing health conditions. Proper form is crucial to prevent injuries. Listen to your body and adjust as needed.").describe("Important safety disclaimer to include verbatim.")
});
export type GenerateWorkoutScheduleOutput = z.infer<typeof GenerateWorkoutScheduleOutputSchema>;

