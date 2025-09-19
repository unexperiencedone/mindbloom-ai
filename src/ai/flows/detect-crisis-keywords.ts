'use server';

/**
 * @fileOverview Crisis keyword detection flow.
 *
 * - detectCrisisKeywords - A function that checks for crisis-related keywords in user input.
 */

import {ai} from '@/ai/genkit';
import type { DetectCrisisKeywordsInput, DetectCrisisKeywordsOutput } from '@/ai/schemas/detect-crisis-keywords';
import { DetectCrisisKeywordsInputSchema, DetectCrisisKeywordsOutputSchema } from '@/ai/schemas/detect-crisis-keywords';


const crisisKeywords = [
  'kill myself',
  'suicidal',
  'end my life',
  'want to die',
  'no reason to live',
  'hopeless and want to end it',
];

export async function detectCrisisKeywords(input: DetectCrisisKeywordsInput): Promise<DetectCrisisKeywordsOutput> {
  return detectCrisisKeywordsFlow(input);
}

const detectCrisisKeywordsFlow = ai.defineFlow(
  {
    name: 'detectCrisisKeywordsFlow',
    inputSchema: DetectCrisisKeywordsInputSchema,
    outputSchema: DetectCrisisKeywordsOutputSchema,
  },
  async input => {
    const lowerCaseText = input.text.toLowerCase();
    const isCrisis = crisisKeywords.some(keyword => lowerCaseText.includes(keyword));
    return {isCrisis};
  }
);
