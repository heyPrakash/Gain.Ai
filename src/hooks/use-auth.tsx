
'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import {
  type User,
  onAuthStateChanged,
  createUserWithEmailAndPassword as createUser,
  signInWithEmailAndPassword as signIn,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/clientApp';
import type { FirebaseError } from 'firebase/app';


interface AuthContextType {
  user: User | null;
  loading: {
    auth: boolean;
    email: boolean;
    google: boolean;
  };
  signInWithEmail: (email: string, pass: string) => Promise<any>;
  createUserWithEmail: (email: string, pass: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to create user document in Firestore
const createUserDocument = async (user: User) => {
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
        const { displayName, email, photoURL } = user;
        const createdAt = serverTimestamp();

        try {
            await setDoc(userDocRef, {
                uid: user.uid,
                displayName,
                email,
                photoURL,
                createdAt,
                lastLogin: createdAt,
            });
        } catch (error) {
            console.error("Error creating user document:", error);
            // Optionally re-throw or handle the error as needed
            throw new Error("Failed to create user profile in database.");
        }
    } else {
        // If user document exists, just update the last login time
         try {
            await setDoc(userDocRef, { lastLogin: serverTimestamp() }, { merge: true });
        } catch (error) {
            console.error("Error updating last login:", error);
            // This is non-critical, so we don't need to throw
        }
    }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [emailLoading, setEmailLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, pass: string) => {
    setEmailLoading(true);
    try {
      const userCredential = await signIn(auth, email, pass);
      await createUserDocument(userCredential.user);
      return userCredential;
    } catch (error) {
      console.error('Email sign-in error:', error);
      const firebaseError = error as FirebaseError;
      if (firebaseError.code === 'auth/user-not-found' || firebaseError.code === 'auth/wrong-password' || firebaseError.code === 'auth/invalid-credential') {
        throw new Error('Invalid email or password.');
      }
      throw new Error('An unexpected error occurred. Please try again.');
    } finally {
      setEmailLoading(false);
    }
  };

  const createUserWithEmail = async (email: string, pass: string) => {
     setEmailLoading(true);
    try {
      const userCredential = await createUser(auth, email, pass);
      const username = email.split('@')[0]; // Simple username from email
      await updateProfile(userCredential.user, {
          displayName: username,
      });
      // create user document in firestore
      await createUserDocument(userCredential.user);
      return userCredential;
    } catch (error) {
      console.error('Email sign-up error:', error);
      const firebaseError = error as FirebaseError;
      if (firebaseError.code === 'auth/email-already-in-use') {
        throw new Error('This email address is already in use.');
      }
      throw new Error('An unexpected error occurred. Please try again.');
    } finally {
      setEmailLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        await createUserDocument(result.user);
        return result;
    } catch (error) {
        console.error("Google sign-in error:", error);
        const firebaseError = error as FirebaseError;
        if (firebaseError.code === 'auth/popup-closed-by-user') {
            throw new Error('Sign-in process was cancelled.');
        }
        throw new Error('Failed to sign in with Google. Please try again.');
    } finally {
        setGoogleLoading(false);
    }
  };


  const logOut = async () => {
    await signOut(auth);
    setUser(null);
  };

  const value = {
    user,
    loading: { auth: authLoading, email: emailLoading, google: googleLoading },
    signInWithEmail,
    createUserWithEmail,
    signInWithGoogle,
    logOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
