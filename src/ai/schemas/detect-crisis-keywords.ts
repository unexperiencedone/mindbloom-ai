/**
 * @fileOverview Schemas for crisis keyword detection.
 *
 * - DetectCrisisKeywordsInput - The input type for the detectCrisisKeywords function.
 * - DetectCrisisKeywordsOutput - The return type for the detectCrisisKeywords function.
 */

import {z} from 'genkit';

export const DetectCrisisKeywordsInputSchema = z.object({
  text: z.string().describe('The user input text to check for crisis keywords.'),
});
export type DetectCrisisKeywordsInput = z.infer<typeof DetectCrisisKeywordsInputSchema>;

export const DetectCrisisKeywordsOutputSchema = z.object({
  isCrisis: z.boolean().describe('Whether or not the input text contains crisis keywords.'),
});
export type DetectCrisisKeywordsOutput = z.infer<typeof DetectCrisisKeywordsOutputSchema>;
