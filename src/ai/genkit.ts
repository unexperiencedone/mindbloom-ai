import {genkit, getModel} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {isProduction} from 'genkit/env';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
  enableTracing: !isProduction(),
});
