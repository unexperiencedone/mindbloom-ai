// src/app/api/user/summarize-history/route.ts
import { NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { initFirebaseAdmin } from '@/lib/firebase-admin';
import { summarizeConversation } from '@/ai/flows/summarize-conversation';

const USER_ID = 'test-user-id'; // Hardcoded for prototype purposes

export async function GET() {
  try {
    await initFirebaseAdmin();
    const db = getFirestore();
    const historyRef = db.collection('ChatHistory').doc(USER_ID);
    const doc = await historyRef.get();

    if (!doc.exists) {
      return NextResponse.json({ summary: "You don't have any chat history yet. Start a conversation with Bloom to build your history!" });
    }
    
    const data = doc.data();
    if (!data || !data.messages || data.messages.length === 0) {
      return NextResponse.json({ summary: "You don't have any chat history yet. Start a conversation with Bloom to build your history!" });
    }

    // Format the conversation for the summarizer
    const conversationText = data.messages
        .map((msg: { role: string; content: string; }) => `${msg.role === 'user' ? 'User' : 'Bloom'}: ${msg.content}`)
        .join('\n');

    const { summary } = await summarizeConversation({ conversation: conversationText });

    return NextResponse.json({ summary });

  } catch (error: any) {
    console.error('Error generating summary:', error);
    return NextResponse.json(
        { error: 'Internal Server Error', details: error.message },
        { status: 500 }
    );
  }
}
