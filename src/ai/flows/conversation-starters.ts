'use server';

/**
 * @fileOverview A conversation starter AI agent.
 *
 * - generateConversationStarters - A function that generates conversation starters.
 */

import {ai} from '@/ai/genkit';
import { GenerateConversationStartersInputSchema, GenerateConversationStartersOutputSchema, type GenerateConversationStartersInput, type GenerateConversationStartersOutput } from '@/ai/schemas/conversation-starters';


export async function generateConversationStarters(
  input: GenerateConversationStartersInput
): Promise<GenerateConversationStartersOutput> {
  return generateConversationStartersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateConversationStartersPrompt',
  input: {schema: GenerateConversationStartersInputSchema},
  output: {schema: GenerateConversationStartersOutputSchema},
  prompt: `You are Bloom, a supportive and empathetic AI companion from MindBloom AI.
  Your purpose is to provide a safe space for users to express their feelings.
  You are not a therapist, but a friendly and caring listener. Keep your responses gentle, encouraging, and relatively short. Use emojis where appropriate to convey warmth. 🌸 Never give medical advice.

  Generate 3 conversation starters that the user can use to express their feelings.

  Topic: {{topic}}

  Conversation Starters:
  `,
});

const generateConversationStartersFlow = ai.defineFlow(
  {
    name: 'generateConversationStartersFlow',
    inputSchema: GenerateConversationStartersInputSchema,
    outputSchema: GenerateConversationStartersOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
