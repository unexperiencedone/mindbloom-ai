// src/app/api/user/chat-history/route.ts
import { NextResponse } from 'next/server';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { initFirebaseAdmin } from '@/lib/firebase-admin';

const USER_ID = 'test-user-id'; // Hardcoded for prototype purposes

export async function GET() {
  try {
    await initFirebaseAdmin();
    const db = getFirestore();
    const historyRef = db.collection('ChatHistory').doc(USER_ID);
    const doc = await historyRef.get();

    if (!doc.exists) {
      return NextResponse.json({ messages: [] });
    }
    
    const data = doc.data();
    // Convert Firestore Timestamps to strings if they exist
    if (data && data.messages) {
        data.messages = data.messages.map((msg: any) => ({
            ...msg,
            timestamp: msg.timestamp?.toDate ? msg.timestamp.toDate().toISOString() : null
        }));
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching chat history:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await initFirebaseAdmin();
    const db = getFirestore();
    const { messages } = await request.json();

    if (!Array.isArray(messages)) {
        return new NextResponse('Bad Request: messages must be an array', { status: 400 });
    }

    const historyRef = db.collection('ChatHistory').doc(USER_ID);
    
    // Add server timestamps to each new message if they don't have one
    const messagesWithTimestamps = messages.map(msg => ({
        ...msg,
        timestamp: msg.timestamp ? new Date(msg.timestamp) : FieldValue.serverTimestamp()
    }));

    await historyRef.set({
      userId: USER_ID,
      messages: messagesWithTimestamps,
    }, { merge: true });

    return NextResponse.json({ success: true, message: 'Chat history updated.' });
  } catch (error: any) {
    console.error('Error updating chat history:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
