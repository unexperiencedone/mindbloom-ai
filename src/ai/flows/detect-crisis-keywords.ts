'use server';

/**
 * @fileOverview Crisis keyword detection flow.
 *
 * - detectCrisisKeywords - A function that checks for crisis-related keywords in user input.
 */

import {ai} from '@/ai/genkit';
import { DetectCrisisKeywordsInputSchema, DetectCrisisKeywordsOutputSchema, type DetectCrisisKeywordsInput, type DetectCrisisKeywordsOutput } from '@/ai/schemas/detect-crisis-keywords';


export async function detectCrisisKeywords(input: DetectCrisisKeywordsInput): Promise<DetectCrisisKeywordsOutput> {
  return detectCrisisKeywordsFlow(input);
}

const crisisDetectionPrompt = ai.definePrompt({
  name: 'crisisDetectionPrompt',
  input: { schema: DetectCrisisKeywordsInputSchema },
  output: { schema: DetectCrisisKeywordsOutputSchema },
  prompt: `You are a crisis detection AI. Your task is to analyze the user's text and determine if it contains language indicating a self-harm or suicidal crisis.

  The user is interacting with a mental wellness chatbot. It is crucial to identify direct and indirect mentions of suicide, self-harm, or a desire to end one's life.

  Analyze the following text:
  "{{{text}}}"

  Based on your analysis, is the user in a state of crisis where they might be a danger to themselves? Set the "isCrisis" boolean to true or false. Only set it to true for immediate self-harm risk.
  `,
});


const detectCrisisKeywordsFlow = ai.defineFlow(
  {
    name: 'detectCrisisKeywordsFlow',
    inputSchema: DetectCrisisKeywordsInputSchema,
    outputSchema: DetectCrisisKeywordsOutputSchema,
  },
  async input => {
    const { output } = await crisisDetectionPrompt(input);
    return output!;
  }
);
