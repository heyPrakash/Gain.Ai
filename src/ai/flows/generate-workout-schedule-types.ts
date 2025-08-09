
// This file does NOT have 'use server'
import { z } from 'genkit';
// Import from the component's schema definition for input
import { workoutScheduleFormSchema, type WorkoutScheduleFormValues } from '@/components/workout-planner/schemas';

// Re-export/alias the input schema and type for the AI flow
export const GenerateWorkoutScheduleInputSchema = workoutScheduleFormSchema;
export type GenerateWorkoutScheduleInput = WorkoutScheduleFormValues;


// Schemas for the AI output structure
const WorkoutExerciseSchema = z.object({
  name: z.string().describe('Name of the exercise (e.g., "Barbell Bench Press").'),
  sets: z.string().describe('Recommended number of sets (e.g., "3", "4").'),
  reps: z.string().describe('Recommended repetitions per set (e.g., "8-12", "15").'),
});

const DailyWorkoutSchema = z.object({
  day: z.string().describe('The day of the week for this workout (e.g., "Monday", "Tuesday").'),
  focus: z.string().describe('The main focus of the day\'s workout (e.g., "Chest & Triceps", "Leg Day", "Rest").'),
  exercises: z.array(WorkoutExerciseSchema).describe('A list of exercises for the day. This should be empty if it is a rest day.'),
});

export const GenerateWorkoutScheduleOutputSchema = z.object({
  scheduleTitle: z.string().describe('A catchy and descriptive title for the entire weekly schedule.'),
  weeklySchedule: z.array(DailyWorkoutSchema).length(7).describe('A schedule for all 7 days of the week (Monday to Sunday).'),
  notes: z.string().optional().describe('Important notes on form, intensity, or how to perform the workout.'),
  disclaimer: z.string().default("Always consult with a healthcare professional before starting any new fitness program. Proper form is crucial to prevent injuries. Listen to your body and adjust as needed.").describe("Important safety disclaimer to include verbatim.")
});
export type GenerateWorkoutScheduleOutput = z.infer<typeof GenerateWorkoutScheduleOutputSchema>;
