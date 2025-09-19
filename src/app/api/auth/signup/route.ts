// src/app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { initFirebaseAdmin } from '@/lib/firebase-admin';
import { hashPassword } from '@/lib/password-utils';

export async function POST(request: Request) {
  try {
    await initFirebaseAdmin();
    const db = getFirestore();
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    // Check if user already exists
    const usersRef = db.collection('Users');
    const existingUser = await usersRef.where('email', '==', email.toLowerCase()).get();

    if (!existingUser.isEmpty) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
    }

    // Hash the password
    const { salt, hash } = hashPassword(password);

    // Save the new user
    const newUserRef = usersRef.doc();
    await newUserRef.set({
      id: newUserRef.id,
      name,
      email: email.toLowerCase(),
      salt,
      hash,
      createdAt: FieldValue.serverTimestamp(),
    });

    // In a real app, you'd likely create a session/token here
    // For this prototype, we'll just confirm creation
    return NextResponse.json({ success: true, userId: newUserRef.id }, { status: 201 });

  } catch (error: any) {
    console.error('Error during signup:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
