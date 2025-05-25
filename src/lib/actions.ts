'use server';
import type { GenerateDietPlanInput, GenerateDietPlanOutput } from '@/ai/flows/generate-diet-plan';
import { generateDietPlan } from '@/ai/flows/generate-diet-plan';
import type { AiChatCoachInput, AiChatCoachOutput } from '@/ai/flows/ai-chat-coach';
import { aiChatCoach } from '@/ai/flows/ai-chat-coach';

export async function handleGenerateDietPlanAction(input: GenerateDietPlanInput): Promise<GenerateDietPlanOutput> {
  try {
    console.log("Generating diet plan with input:", input);
    const result = await generateDietPlan(input);
    console.log("Diet plan generated:", result);
    return result;
  } catch (error) {
    console.error("Error in handleGenerateDietPlanAction:", error);
    // It's better to throw a more specific error or a generic one that client can handle
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
