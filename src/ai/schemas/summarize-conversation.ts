/**
 * @fileOverview Schemas for summarizing a conversation with Bloom.
 *
 * - SummarizeConversationInput - The input type for the summarizeConversation function.
 * - SummarizeConversationOutput - The return type for the summarizeConversation function.
 */

import {z} from 'genkit';

export const SummarizeConversationInputSchema = z.object({
  conversation: z.string().describe('The complete conversation text to summarize.'),
});

export type SummarizeConversationInput = z.infer<
  typeof SummarizeConversationInputSchema
>;

export const SummarizeConversationOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the conversation.'),
});

export type SummarizeConversationOutput = z.infer<
  typeof SummarizeConversationOutputSchema
>;
