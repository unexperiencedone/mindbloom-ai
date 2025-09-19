// src/app/api/feedback/confirm-checkin/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { initFirebaseAdmin } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return new NextResponse('Bad Request: Missing token', { status: 400 });
  }

  try {
    await initFirebaseAdmin();
    const db = getFirestore();

    // In a real app, you'd decode a JWT or look up a one-time token
    // For this prototype, we'll assume the token is the userId
    const userId = token; 
    
    const userProfileRef = db.collection('UserProfile').doc(userId);

    await userProfileRef.update({
      lastActive: FieldValue.serverTimestamp(),
      // Optional: reset notification timestamp to allow new notifications later
      notificationSentTimestamp: null, 
    });

    // Redirect to a simple thank you page
    const url = request.nextUrl.clone()
    url.pathname = '/thank-you'
    url.search = '' // clear query params
    return NextResponse.redirect(url);

  } catch (error: any) {
    console.error('Error confirming check-in:', error);
    return new NextResponse('Internal Server Error', { status: 500, statusText: error.message });
  }
}
