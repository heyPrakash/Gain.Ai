
import { z } from 'zod';

export const activityLevels = [
  "sedentary", // little or no exercise
  "lightly active", // light exercise/sports 1-3 days/week
  "moderately active", // moderate exercise/sports 3-5 days/week
  "very active", // hard exercise/sports 6-7 days a week
  "extra active", // very hard exercise/sports & physical job
] as const;

export const planDetailLevels = ["summary", "detailed"] as const;

export const fitnessGoals = [
  "weight loss",
  "muscle gain",
  "weight maintenance",
  "general health"
] as const;
export const fitnessGoalEnum = z.enum(fitnessGoals, { required_error: "A fitness goal is required." });

export const userProfileSchema = z.object({
  weightKg: z.coerce.number({invalid_type_error: "Weight must be a number."}).min(20, "Weight must be at least 20kg.").max(300, "Weight must be at most 300kg."),
  heightFt: z.coerce.number({invalid_type_error: "Height must be a number."}).min(3, "Height must be at least 3ft.").max(8, "Height must be at most 8ft."),
  age: z.coerce.number({invalid_type_error: "Age must be a number."}).min(16, "Age must be at least 16 years.").max(100, "Age must be at most 100 years."),
  gender: z.enum(['male', 'female'], { required_error: "Gender is required." }),
  fitnessGoals: fitnessGoalEnum,
  dietaryPreferences: z.string().max(500, "Dietary preferences are too long (max 500 characters).").optional(),
  activityLevel: z.enum(activityLevels, { required_error: "Activity level is required." }),
  planDetailLevel: z.enum(planDetailLevels, { required_error: "Please select the desired plan detail level." }).default("detailed"),
});

export type UserProfileFormValues = z.infer<typeof userProfileSchema>;
