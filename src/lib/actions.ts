
'use server';
import type { UserProfileFormValues } from '@/components/diet-planner/schemas';
import type { GenerateDietPlanOutput } from '@/ai/flows/generate-diet-plan-types';
import { generateDietPlan } from '@/ai/flows/generate-diet-plan';

import type { AiChatCoachInput, AiChatCoachOutput } from '@/ai/flows/ai-chat-coach-types';
import { aiChatCoach } from '@/ai/flows/ai-chat-coach';

import type { WorkoutScheduleFormValues } from '@/components/workout-planner/schemas';
import type { GenerateWorkoutScheduleOutput } from '@/ai/flows/generate-workout-schedule-types';
import { generateWorkoutSchedule } from '@/ai/flows/generate-workout-schedule';

import type { AnalyzeFoodImageInput, AnalyzeFoodImageOutput } from '@/ai/flows/analyze-food-image-types';
import { analyzeFoodImage } from '@/ai/flows/analyze-food-image';

import type { AnalyzeBodyScanInput, AnalyzeBodyScanOutput } from '@/ai/flows/analyze-body-scan-types';
import { analyzeBodyScan } from '@/ai/flows/analyze-body-scan';

function assertAiFeaturesConfigured(): void {
  const googleApiKey = process.env.GOOGLE_API_KEY?.trim();
  if (!googleApiKey || googleApiKey === 'YOUR_API_KEY_HERE') {
    throw new Error(
      'AI features are not configured. Please set a valid GOOGLE_API_KEY environment variable and try again.'
    );
  }
}

export async function handleGenerateDietPlanAction(input: UserProfileFormValues): Promise<GenerateDietPlanOutput> {
  try {
    assertAiFeaturesConfigured();
    console.log("Generating diet plan with input:", input);
    const result = await generateDietPlan(input);
    console.log("Diet plan generated:", result);
    return result;
  } catch (error) {
    console.error("Error in handleGenerateDietPlanAction:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate diet plan: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the diet plan.");
  }
}

export async function handleAiChatCoachAction(input: AiChatCoachInput): Promise<AiChatCoachOutput> {
  try {
    assertAiFeaturesConfigured();
    const result = await aiChatCoach(input);
    return result;
  } catch (error) {
    console.error("Error in handleAiChatCoachAction:", error);
    if (error instanceof Error) {
      throw new Error(`AI coach error: ${error.message}`);
    }
    throw new Error("An unknown error occurred with the AI coach.");
  }
}

export async function handleGenerateWorkoutScheduleAction(input: WorkoutScheduleFormValues): Promise<GenerateWorkoutScheduleOutput> {
  try {
    assertAiFeaturesConfigured();
    console.log("Generating workout schedule with input:", input);
    const result = await generateWorkoutSchedule(input);
    console.log("Workout schedule generated:", result);
    return result;
  } catch (error) {
    console.error("Error in handleGenerateWorkoutScheduleAction:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate workout schedule: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the workout schedule.");
  }
}

export async function handleAnalyzeFoodImageAction(input: AnalyzeFoodImageInput): Promise<AnalyzeFoodImageOutput> {
    try {
        assertAiFeaturesConfigured();
        console.log("Analyzing food image...");
        const result = await analyzeFoodImage(input);
        console.log("Food image analysis complete:", result);
        return result;
    } catch (error) {
        console.error("Error in handleAnalyzeFoodImageAction:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to analyze food image: ${error.message}`);
        }
        throw new Error("An unknown error occurred while analyzing the food image.");
    }
}

export async function handleAnalyzeBodyScanAction(input: AnalyzeBodyScanInput): Promise<AnalyzeBodyScanOutput> {
    try {
        assertAiFeaturesConfigured();
        console.log("Analyzing body scan...");
        const result = await analyzeBodyScan(input);
        console.log("Body scan analysis complete:", result);
        return result;
    } catch (error) {
        console.error("Error in handleAnalyzeBodyScanAction:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to analyze body photo: ${error.message}`);
        }
        throw new Error("An unknown error occurred while analyzing the body photo.");
    }
}
