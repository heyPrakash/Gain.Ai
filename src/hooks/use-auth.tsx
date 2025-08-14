
"use client";

import { useState, useEffect, createContext, useContext, type ReactNode } from 'react';
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth';
import { app } from '@/lib/firebase/clientApp';
import { useRouter } from 'next/navigation';


const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithEmail: (email: string, pass: string) => Promise<boolean>;
  signUpWithEmail: (email: string, pass: string) => Promise<boolean>;
  signInWithGoogle: () => Promise<boolean>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  signInWithEmail: async () => false,
  signUpWithEmail: async () => false,
  signInWithGoogle: async () => false,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      router.push('/');
      return true;
    } catch (e: any) {
      setError(e.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, pass);
       router.push('/');
      return true;
    } catch (e: any)      {
      setError(e.message);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      router.push('/');
      return true;
    } catch (e: any) {
       setError(e.message);
      return false;
    } finally {
      setLoading(false);
    }
  };


  const signOut = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      // The onAuthStateChanged listener will handle user state, and layout effect will redirect
    } catch (e: any) {
       setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
