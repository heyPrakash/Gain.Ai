'use server';

/**
 * @fileOverview An AI chat coach for fitness guidance and support.
 *
 * - aiChatCoach - A function that provides a 24/7 AI chat interface for fitness-related questions and guidance.
 * - AiChatCoachInput - The input type for the aiChatCoach function.
 * - AiChatCoachOutput - The return type for the aiChatCoach function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiChatCoachInputSchema = z.object({
  message: z.string().describe('The user message to the AI coach.'),
  chatHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional().describe('The chat history between the user and the AI coach.'),
});
export type AiChatCoachInput = z.infer<typeof AiChatCoachInputSchema>;

const AiChatCoachOutputSchema = z.object({
  response: z.string().describe('The AI coach response to the user message.'),
});
export type AiChatCoachOutput = z.infer<typeof AiChatCoachOutputSchema>;

export async function aiChatCoach(input: AiChatCoachInput): Promise<AiChatCoachOutput> {
  return aiChatCoachFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiChatCoachPrompt',
  input: {schema: AiChatCoachInputSchema},
  output: {schema: AiChatCoachOutputSchema},
  prompt: `You are a 24/7 AI fitness coach providing guidance and support to users.
  Respond to the user's message based on the chat history, providing helpful and motivational advice.

  Chat History:
  {{#each chatHistory}}
  {{#if (eq role \"user\")}}User: {{content}}{{#else}}AI Coach: {{content}}{{/if}}
  {{/each}}

  User Message: {{{message}}}
  AI Coach: `,
});

const aiChatCoachFlow = ai.defineFlow(
  {
    name: 'aiChatCoachFlow',
    inputSchema: AiChatCoachInputSchema,
    outputSchema: AiChatCoachOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
