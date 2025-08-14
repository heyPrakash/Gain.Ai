// src/lib/firebase/clientApp.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyByoKS5XKJceRGlvOCJrrDmZ1KlC2zsHbo",
  authDomain: "cortex-fit.firebaseapp.com",
  projectId: "cortex-fit",
  storageBucket: "cortex-fit.appspot.com",
  messagingSenderId: "189108185606",
  appId: "1:189108185606:web:3f5477021ae7767790f187"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
