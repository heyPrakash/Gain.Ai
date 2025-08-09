
import { z } from 'zod';

// Define base Zod schemas here, these are the source of truth for input validation
export const BodyPartSchema = z.enum(['chest', 'legs', 'arms', 'abs', 'back', 'shoulders'], { required_error: "Please select a body part to train."});
export const TimeAvailableSchema = z.coerce.number().min(10, "Workout must be at least 10 minutes.").max(120, "Workout cannot exceed 120 minutes.");
export const FitnessLevelSchema = z.enum(['beginner', 'intermediate', 'advanced'], { required_error: "Please select your fitness level."});
export const WorkoutLocationSchema = z.enum(['gym', 'home'], { required_error: "Workout location is required." });


// Export arrays for dropdown options if needed by the UI
export const bodyParts = BodyPartSchema.options;
export const fitnessLevels = FitnessLevelSchema.options;
export const workoutLocations = WorkoutLocationSchema.options;


export const workoutScheduleFormSchema = z.object({
  bodyPart: BodyPartSchema.describe('The body part the user wants to train.'),
  timeAvailable: TimeAvailableSchema.describe('The time the user has available for the workout in minutes.'),
  fitnessLevel: FitnessLevelSchema.describe("The user's current fitness level (beginner, intermediate, advanced)."),
  workoutLocation: WorkoutLocationSchema.describe('The preferred location for workouts (gym or home).'),
});

export type WorkoutScheduleFormValues = z.infer<typeof workoutScheduleFormSchema>;
