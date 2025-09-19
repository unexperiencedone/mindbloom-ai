import { config } from 'dotenv';
config();

import '@/ai/flows/conversation-starters.ts';
import '@/ai/flows/detect-crisis-keywords.ts';
import '@/ai/flows/summarize-conversation.ts';
import '@/ai/flows/chat.ts';
