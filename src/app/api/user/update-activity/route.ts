// src/app/api/user/update-activity/route.ts
import { NextResponse } from 'next/server';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { initFirebaseAdmin } from '@/lib/firebase-admin';

const USER_ID = 'test-user-id'; // Hardcoded for prototype purposes

export async function POST() {
  try {
    await initFirebaseAdmin();
    const db = getFirestore();
    const userProfileRef = db.collection('UserProfile').doc(USER_ID);

    await userProfileRef.set({
      lastActive: FieldValue.serverTimestamp(),
    }, { merge: true });

    return NextResponse.json({ success: true, message: 'Activity updated.' });
  } catch (error: any) {
    console.error('Error updating user activity:', error);
    return new NextResponse('Internal Server Error', { status: 500, statusText: error.message });
  }
}
