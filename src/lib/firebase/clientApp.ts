
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyByoKS5XKJceRGlvOCJrrDmZ1KlC2zsHbo",
  authDomain: "cortex-fit.firebaseapp.com",
  projectId: "cortex-fit",
  storageBucket: "cortex-fit.firebasestorage.app",
  messagingSenderId: "189108185606",
  appId: "1:189108185606:web:3f5477021ae7767790f187"
};

// Initialize Firebase
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Create a function to get the auth instance, ensuring it's only called on the client
const getFirebaseAuth = (): Auth => getAuth(app);

const googleAuthProvider = new GoogleAuthProvider();

export { app, getFirebaseAuth, googleAuthProvider };

