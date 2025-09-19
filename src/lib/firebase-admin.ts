// src/lib/firebase-admin.ts
import * as admin from 'firebase-admin';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

let isInitialized = admin.apps.length > 0;

export async function initFirebaseAdmin() {
  if (isInitialized) {
    return;
  }
  
  if (!serviceAccount) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.');
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(serviceAccount)),
    });
    console.log('Firebase Admin SDK initialized.');
    isInitialized = true;
  } catch (error: any) {
    console.error('Firebase Admin SDK initialization error:', error.stack);
    throw error;
  }
}
