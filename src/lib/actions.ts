'use server';
import type { UserProfileFormValues } from '@/components/diet-planner/schemas';
import type { GenerateDietPlanOutput } from '@/ai/flows/generate-diet-plan-types';
import { generateDietPlan } from '@/ai/flows/generate-diet-plan';

import type { AiChatCoachInput, AiChatCoachOutput } from '@/ai/flows/ai-chat-coach-types';
import { aiChatCoach } from '@/ai/flows/ai-chat-coach';

import type { WorkoutScheduleFormValues } from '@/components/workout-planner/schemas';
import type { GenerateWorkoutScheduleOutput } from '@/ai/flows/generate-workout-schedule-types';
import { generateWorkoutSchedule } from '@/ai/flows/generate-workout-schedule';

export async function handleGenerateDietPlanAction(input: UserProfileFormValues): Promise<GenerateDietPlanOutput> {
  try {
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
