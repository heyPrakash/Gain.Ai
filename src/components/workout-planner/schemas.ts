
import { z } from 'zod';

// Define base Zod schemas here, these are the source of truth for input validation
export const FitnessGoalSchema = z.enum(['muscle gain', 'fat loss', 'strength', 'general fitness']);
export const ExperienceLevelSchema = z.enum(['beginner', 'intermediate', 'advanced']);
export const DaysAvailableSchema = z.coerce.number().min(3).max(6);
export const WorkoutLocationSchema = z.enum(['gym', 'home'], { required_error: "Workout location is required." });
export const GenderSchema = z.enum(['male', 'female'], { required_error: "Gender is required." });

// Export arrays for dropdown options if needed by the UI
export const fitnessGoals = FitnessGoalSchema.options;
export const experienceLevels = ExperienceLevelSchema.options;
export const daysAvailableOptions = [3, 4, 5, 6] as const;
export const workoutLocations = WorkoutLocationSchema.options;
export const genders = GenderSchema.options;


export const workoutScheduleFormSchema = z.object({
  fitnessGoal: FitnessGoalSchema.describe('The primary fitness goal (e.g., muscle gain, fat loss, strength, general fitness).'),
  experienceLevel: ExperienceLevelSchema.describe('The user\'s experience level in the gym (beginner, intermediate, advanced).'),
  daysAvailable: DaysAvailableSchema.describe('Number of days per week the user can work out (e.g., 3, 4, 5, or 6).'),
  workoutLocation: WorkoutLocationSchema.describe('The preferred location for workouts (gym or home).'),
  gender: GenderSchema.describe('The gender of the user.'),
});

export type WorkoutScheduleFormValues = z.infer<typeof workoutScheduleFormSchema>;
