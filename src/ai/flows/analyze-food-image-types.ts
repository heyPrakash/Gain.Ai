
// This file does NOT have 'use server'
import { z } from 'genkit';

export const AnalyzeFoodImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a meal, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeFoodImageInput = z.infer<typeof AnalyzeFoodImageInputSchema>;


const FoodItemSchema = z.object({
    name: z.string().describe("The name of the identified food item."),
    portionSize: z.string().describe("The estimated portion size (e.g., 1 cup, 100g)."),
    calories: z.number().describe("Estimated calories for this item."),
    protein: z.number().describe("Estimated protein in grams for this item."),
    fats: z.number().describe("Estimated fats in grams for this item."),
    carbohydrates: z.number().describe("Estimated carbohydrates in grams for this item."),
});

export const AnalyzeFoodImageOutputSchema = z.object({
  foodItems: z.array(FoodItemSchema).describe("An array of food items identified in the image."),
  totalCalories: z.number().describe("The total estimated calories for the entire meal."),
  totalProtein: z.number().describe("The total estimated protein in grams for the entire meal."),
  totalFats: z.number().describe("The total estimated fats in grams for the entire meal."),
  totalCarbohydrates: z.number().describe("The total estimated carbohydrates in grams for the entire meal."),
  fitnessSummary: z.string().describe("A brief, encouraging summary of how this meal fits into a fitness-oriented diet."),
});
export type AnalyzeFoodImageOutput = z.infer<typeof AnalyzeFoodImageOutputSchema>;
