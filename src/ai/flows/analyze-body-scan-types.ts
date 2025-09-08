
// This file does NOT have 'use server'
import { z } from 'genkit';

export const AnalyzeBodyScanInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A full-body, front-facing photo of a user, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  heightFt: z.coerce.number().describe("The user's height in feet."),
  weightKg: z.coerce.number().optional().describe('The user\'s weight in kilograms. Used to improve BMI estimation.'),
});
export type AnalyzeBodyScanInput = z.infer<typeof AnalyzeBodyScanInputSchema>;


export const AnalyzeBodyScanOutputSchema = z.object({
  bodyShape: z.string().describe("The user's detected body shape (e.g., Ectomorph, Mesomorph, Endomorph, or common shapes like Rectangle, Triangle, Hourglass)."),
  estimatedBmi: z.number().describe("The estimated Body Mass Index (BMI). Calculated based on visual cues and user-provided height/weight if available."),
  estimatedBodyFatPercentage: z.number().describe("The estimated body fat percentage (%)."),
  muscleDefinition: z.enum(['low', 'medium', 'high']).describe("The assessed level of muscle definition."),
  fitnessCategory: z.string().describe("The overall fitness category (e.g., Underweight, Normal, Overweight, Athletic, Obese)."),
  physiqueAnalysis: z.string().describe("A short (2-3 sentences), positive, and encouraging analysis of the user's current physique."),
  improvementPlan: z.array(z.string()).describe("A bulleted list of personalized diet and workout suggestions for fitness improvement.")
});
export type AnalyzeBodyScanOutput = z.infer<typeof AnalyzeBodyScanOutputSchema>;
