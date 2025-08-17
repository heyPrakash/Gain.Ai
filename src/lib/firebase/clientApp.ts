
import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Validate that all required environment variables are present on the client side
if (typeof window !== 'undefined') {
    for (const [key, value] of Object.entries(firebaseConfig)) {
        if (!value) {
            // This error will be thrown in the browser if a key is missing.
            // Server-side checks are handled differently to avoid build errors.
            throw new Error(`Firebase configuration error: Missing required environment variable NEXT_PUBLIC_FIREBASE_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}. Please check your .env file or Vercel environment variables.`);
        }
    }
}

// Initialize Firebase only on the client-side
const app = typeof window !== 'undefined' && !getApps().length ? initializeApp(firebaseConfig) : (getApps().length > 0 ? getApp() : null);
const auth = app ? getAuth(app) : null;
const db = app ? getFirestore(app) : null;

export { app, auth, db };
