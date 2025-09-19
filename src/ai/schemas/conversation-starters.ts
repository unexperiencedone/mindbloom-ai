/**
 * @fileOverview Schemas for the conversation starter AI agent.
 *
 * - GenerateConversationStartersInput - The input type for the generateConversationStarters function.
 * - GenerateConversationStartersOutput - The return type for the generateConversationStarters function.
 */

import {z} from 'genkit';

export const GenerateConversationStartersInputSchema = z.object({
  topic: z
    .string()
    .optional()
    .describe('The topic to generate conversation starters for.'),
});
export type GenerateConversationStartersInput = z.infer<typeof GenerateConversationStartersInputSchema>;

export const GenerateConversationStartersOutputSchema = z.object({
  starters: z
    .array(z.string())
    .describe('An array of conversation starters.'),
});
export type GenerateConversationStartersOutput = z.infer<typeof GenerateConversationStartersOutputSchema>;
