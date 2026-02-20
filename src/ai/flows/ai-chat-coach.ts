
'use server';

/**
 * @fileOverview An AI chat coach for fitness guidance and support.
 *
 * - aiChatCoach - A function that provides a 24/7 AI chat interface for fitness-related questions and guidance.
 */

import {ai} from '@/ai/genkit';
import {
  AiChatCoachInputSchema,
  AiChatCoachOutputSchema,
  type AiChatCoachInput,
  type AiChatCoachOutput
} from './ai-chat-coach-types';


export async function aiChatCoach(input: AiChatCoachInput): Promise<AiChatCoachOutput> {
  return aiChatCoachFlow(input);
}

const aiChatCoachPromptDefinition = ai.definePrompt({
  name: 'aiChatCoachPrompt',
  input: {schema: AiChatCoachInputSchema},
  output: {schema: AiChatCoachOutputSchema},
  prompt: `You are a 24/7 AI fitness coach providing guidance and support to users.
  Respond to the user's message based on the chat history, providing helpful and motivational advice.
  The chat history is a list of turns, where each turn is formatted as 'user: [message]' or 'assistant: [message]'.

  Chat History:
  {{#each chatHistory}}
  {{this.role}}: {{this.content}}
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
      const finishReason = response.finishReason;
      const finishMessage = response.finishMessage;

      if (!output) {
        let errorMessage = 'AI coach did not provide a valid response. The output was unexpectedly empty.';
        if (usage) {
          console.error('AI Chat Coach Flow: LLM returned no output. Usage details:', JSON.stringify(usage, null, 2));
          // Check for specific finish reasons that indicate a problem
          if (finishReason && !['stop', 'length', 'unknown', 'unspecified'].includes(finishReason.toLowerCase())) {
            errorMessage = `AI coach response generation failed. Reason: ${finishReason}.`;
            if (finishMessage) {
              errorMessage += ` Message: ${finishMessage}.`;
            }
            if (finishReason.toLowerCase() === 'safety') {
              errorMessage += ' This may be due to safety filters. Please review your input or adjust safety settings if possible.';
            }
          } else if (finishMessage) {
            // Generic message if finishReason is normal but there's a finishMessage
            errorMessage = `AI coach response generation issue: ${finishMessage}.`;
          }
        } else {
            console.error('AI Chat Coach Flow: LLM returned no output, and no usage details were available.');
        }
        throw new Error(errorMessage);
      }
      return output;
    } catch (flowExecutionError) {
      // Log the original error object for detailed server-side debugging
      console.error('[aiChatCoachFlow] Critical error during execution:', flowExecutionError);
      
      if (flowExecutionError instanceof Error) {
        // Avoid double-prepending "AI Chat Coach flow failed: " if it's already specific enough
        if (flowExecutionError.message.startsWith('AI coach') || 
            flowExecutionError.message.startsWith('LLM') || 
            flowExecutionError.message.includes('helper') ||
            flowExecutionError.message.includes('API key')) { // Check for API key messages
             throw flowExecutionError; // Re-throw the original error if it's specific enough
        }
        // Wrap with a more generic flow error message
        throw new Error(`AI Chat Coach flow encountered an error: ${flowExecutionError.message}`);
      }
      // Handle cases where the thrown object might not be an Error instance
      const errorString = String(flowExecutionError);
      console.error(`[aiChatCoachFlow] Caught a non-Error throwable: type=${typeof flowExecutionError}, value=${errorString}`);
      throw new Error(`An unexpected error (type: ${typeof flowExecutionError}) occurred in the AI coach flow: ${errorString}`);
    }
  }
);
