import {genkit, getModel} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
  enableTracing: process.env.NODE_ENV !== 'production',
});
