import { z } from 'zod';

// Define base Zod schemas here, these are the source of truth for input validation
export const FitnessGoalSchema = z.enum(['muscle gain', 'fat loss', 'strength', 'general fitness']);
export const ExperienceLevelSchema = z.enum(['beginner', 'intermediate', 'advanced']);
export const DaysAvailableSchema = z.coerce.number().min(3).max(6);

// Export arrays for dropdown options if needed by the UI
export const fitnessGoals = FitnessGoalSchema.options;
export const experienceLevels = ExperienceLevelSchema.options;
export const daysAvailableOptions = [3, 4, 5, 6] as const;


export const workoutScheduleFormSchema = z.object({
  fitnessGoal: FitnessGoalSchema.describe('The primary fitness goal (e.g., muscle gain, fat loss, strength, general fitness).'),
  experienceLevel: ExperienceLevelSchema.describe('The user\'s experience level in the gym (beginner, intermediate, advanced).'),
  daysAvailable: DaysAvailableSchema.describe('Number of days per week the user can work out (e.g., 3, 4, 5, or 6).'),
});

export type WorkoutScheduleFormValues = z.infer<typeof workoutScheduleFormSchema>;
