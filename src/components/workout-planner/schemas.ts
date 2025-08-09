
import { z } from 'zod';

// Define base Zod schemas here, these are the source of truth for input validation
export const FitnessGoalSchema = z.enum(['muscle gain', 'fat loss', 'strength', 'general fitness'], { required_error: "A fitness goal is required."});
export const StrengthLevelSchema = z.enum(['beginner', 'intermediate', 'advanced'], { required_error: "Please select your strength level."});
export const WorkoutLocationSchema = z.enum(['gym', 'home'], { required_error: "Please select a workout location." });
export const GenderSchema = z.enum(['male', 'female'], { required_error: "Gender is required." });
export const DaysAvailableSchema = z.enum(['3', '4', '5', '6'], { required_error: "Please select the number of days you can work out." });


// Export arrays for dropdown options if needed by the UI
export const fitnessGoals = FitnessGoalSchema.options;
export const strengthLevels = StrengthLevelSchema.options;
export const workoutLocations = WorkoutLocationSchema.options;
export const daysAvailable = DaysAvailableSchema.options;


export const workoutScheduleFormSchema = z.object({
  goal: FitnessGoalSchema.describe('The primary fitness goal of the user.'),
  strengthLevel: StrengthLevelSchema.describe("The user's current strength experience (beginner, intermediate, advanced)."),
  location: WorkoutLocationSchema.describe('The preferred location for workouts (gym or home).'),
  gender: GenderSchema.describe('The gender of the user for exercise selection considerations.'),
  daysAvailable: DaysAvailableSchema.describe('The number of days per week the user can commit to working out.'),
});

export type WorkoutScheduleFormValues = z.infer<typeof workoutScheduleFormSchema>;
