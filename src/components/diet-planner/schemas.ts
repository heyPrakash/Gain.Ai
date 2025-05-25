import { z } from 'zod';

export const activityLevels = [
  "sedentary", // little or no exercise
  "lightly active", // light exercise/sports 1-3 days/week
  "moderately active", // moderate exercise/sports 3-5 days/week
  "very active", // hard exercise/sports 6-7 days a week
  "extra active", // very hard exercise/sports & physical job
] as const;

export const userProfileSchema = z.object({
  weightKg: z.coerce.number({invalid_type_error: "Weight must be a number."}).min(20, "Weight must be at least 20kg.").max(300, "Weight must be at most 300kg."),
  heightCm: z.coerce.number({invalid_type_error: "Height must be a number."}).min(100, "Height must be at least 100cm.").max(250, "Height must be at most 250cm."),
  age: z.coerce.number({invalid_type_error: "Age must be a number."}).min(16, "Age must be at least 16 years.").max(100, "Age must be at most 100 years."),
  gender: z.enum(['male', 'female'], { required_error: "Gender is required." }),
  fitnessGoals: z.string().min(10, "Please describe your fitness goals (min 10 characters).").max(500, "Fitness goals too long (max 500 characters)."),
  dietaryPreferences: z.string().min(10, "Please describe dietary preferences (min 10 characters).").max(500, "Dietary preferences too long (max 500 characters)."),
  activityLevel: z.enum(activityLevels, { required_error: "Activity level is required." }),
});

export type UserProfileFormValues = z.infer<typeof userProfileSchema>;
