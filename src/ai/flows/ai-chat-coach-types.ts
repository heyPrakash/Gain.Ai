// This file does NOT have 'use server'
import { z } from 'genkit';

export const AiChatCoachInputSchema = z.object({
  message: z.string().describe('The user message to the AI coach.'),
  chatHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional().describe('The chat history between the user and the AI coach.'),
});
export type AiChatCoachInput = z.infer<typeof AiChatCoachInputSchema>;

export const AiChatCoachOutputSchema = z.object({
  response: z.string().describe('The AI coach response to the user message.'),
});
export type AiChatCoachOutput = z.infer<typeof AiChatCoachOutputSchema>;
