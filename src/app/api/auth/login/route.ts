// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { initFirebaseAdmin } from '@/lib/firebase-admin';
import { verifyPassword } from '@/lib/password-utils';

export async function POST(request: Request) {
  try {
    await initFirebaseAdmin();
    const db = getFirestore();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const usersRef = db.collection('Users');
    const querySnapshot = await usersRef.where('email', '==', email.toLowerCase()).limit(1).get();

    if (querySnapshot.isEmpty) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    const isPasswordValid = verifyPassword(password, userData.salt, userData.hash);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // In a real app, you would generate a JWT or session token here.
    // For now, we'll just confirm success.
    return NextResponse.json({ success: true, message: 'Login successful' });

  } catch (error: any) {
    console.error('Error during login:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
