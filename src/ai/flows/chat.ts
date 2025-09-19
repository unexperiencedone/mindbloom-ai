'use server';

import { ai } from '@/ai/genkit';
import { ChatInputSchema, ChatOutputSchema, type ChatInput, type ChatOutput } from '@/ai/schemas/chat';

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async ({ history, prompt }) => {
    const model = ai.getModel();

    const result = await model.generate({
      system: `You are Bloom, a supportive and empathetic AI companion from MindBloom AI.
Your purpose is to provide a safe and non-judgmental space for users to express their feelings.
You are not a therapist, but a friendly and caring listener.
Keep your responses gentle, encouraging, and relatively short. Use emojis where appropriate to convey warmth. 🌸
Never give medical advice.`,
      history: history.map(msg => ({
        role: msg.role,
        content: [{ text: msg.content }],
      })),
      prompt: prompt,
    });

    return { response: result.text };
  }
);
