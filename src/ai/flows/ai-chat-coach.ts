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

const aiChatCoachPromptDefinition = ai.definePrompt({
  name: 'aiChatCoachPrompt',
  input: {schema: AiChatCoachInputSchema},
  output: {schema: AiChatCoachOutputSchema},
  prompt: `You are a 24/7 AI fitness coach providing guidance and support to users.
  Respond to the user's message based on the chat history, providing helpful and motivational advice.

  Chat History:
  {{#each chatHistory}}
  {{#if (eq role "user")}}User: {{content}}{{else}}AI Coach: {{content}}{{/if}}
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
  async (input: AiChatCoachInput): Promise<AiChatCoachOutput> => {
    try {
      const response = await aiChatCoachPromptDefinition(input);
      const output = response.output;
      const usage = response.usage;

      if (!output) {
        let errorMessage = 'AI coach did not provide a valid response. The output was unexpectedly empty.';
        if (usage) {
          console.error('AI Chat Coach Flow: LLM returned no output. Usage details:', JSON.stringify(usage, null, 2));
          // Check for specific finish reasons that indicate a problem
          if (usage.finishReason && !['stop', 'length', 'unknown', 'unspecified'].includes(usage.finishReason.toLowerCase())) {
            errorMessage = `AI coach response generation failed. Reason: ${usage.finishReason}.`;
            if (usage.finishMessage) {
              errorMessage += ` Message: ${usage.finishMessage}.`;
            }
            if (usage.finishReason.toLowerCase() === 'safety') {
              errorMessage += ' This may be due to safety filters. Please review your input or adjust safety settings if possible.';
            }
          } else if (usage.finishMessage) {
            // Generic message if finishReason is normal but there's a finishMessage
            errorMessage = `AI coach response generation issue: ${usage.finishMessage}.`;
          }
        } else {
            console.error('AI Chat Coach Flow: LLM returned no output, and no usage details were available.');
        }
        throw new Error(errorMessage);
      }
      return output;
    } catch (flowExecutionError) {
      console.error('Critical error during aiChatCoachFlow execution:', flowExecutionError);
      if (flowExecutionError instanceof Error) {
        // Avoid double-prepending "AI Chat Coach flow failed: " if it's already specific.
        if (flowExecutionError.message.startsWith('AI coach') || flowExecutionError.message.startsWith('LLM')) {
             throw flowExecutionError;
        }
        throw new Error(`AI Chat Coach flow encountered an error: ${flowExecutionError.message}`);
      }
      throw new Error(`An unexpected error occurred in the AI coach flow: ${String(flowExecutionError)}`);
    }
  }
);
