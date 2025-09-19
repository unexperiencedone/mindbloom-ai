'use server';

/**
 * @fileOverview Summarizes a conversation with Bloom.
 *
 * - summarizeConversation - A function that summarizes the conversation.
 */

import {ai} from '@/ai/genkit';
import { SummarizeConversationInputSchema, SummarizeConversationOutputSchema, type SummarizeConversationInput, type SummarizeConversationOutput } from '@/ai/schemas/summarize-conversation';


export async function summarizeConversation(
  input: SummarizeConversationInput
): Promise<SummarizeConversationOutput> {
  return summarizeConversationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeConversationPrompt',
  input: {schema: SummarizeConversationInputSchema},
  output: {schema: SummarizeConversationOutputSchema},
  prompt: `You are an expert summarizer. Please provide a concise summary of the following conversation:

Conversation: {{{conversation}}}

Summary: `,
});

const summarizeConversationFlow = ai.defineFlow(
  {
    name: 'summarizeConversationFlow',
    inputSchema: SummarizeConversationInputSchema,
    outputSchema: SummarizeConversationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
