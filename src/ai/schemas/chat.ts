import { z } from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

export const ChatInputSchema = z.object({
  history: z.array(MessageSchema),
  prompt: z.string(),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

export const ChatOutputSchema = z.object({
  response: z.string(),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;
