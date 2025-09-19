// src/app/api/user/profile/route.ts
import { NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { initFirebaseAdmin } from '@/lib/firebase-admin';

const USER_ID = 'test-user-id'; // Hardcoded for prototype purposes

export async function GET() {
  try {
    await initFirebaseAdmin();
    const db = getFirestore();
    const userProfileRef = db.collection('UserProfile').doc(USER_ID);
    const doc = await userProfileRef.get();

    if (!doc.exists) {
      return NextResponse.json({
         isSafetyNetEnabled: false,
         inactivityThresholdHours: 48,
         trustedContacts: [],
      });
    }

    return NextResponse.json(doc.data());
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    return new NextResponse('Internal Server Error', { status: 500, statusText: error.message });
  }
}

export async function POST(request: Request) {
  try {
    await initFirebaseAdmin();
    const db = getFirestore();
    const body = await request.json();

    const userProfileRef = db.collection('UserProfile').doc(USER_ID);
    
    // Basic validation could be done here with Zod if desired
    
    await userProfileRef.set({
      userId: USER_ID,
      ...body,
    }, { merge: true });

    return NextResponse.json({ success: true, message: 'Profile updated.' });
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    return new NextResponse('Internal Server Error', { status: 500, statusText: error.message });
  }
}
