'use client';
import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { 
  useAuthState, 
  useCreateUserWithEmailAndPassword, 
  useSignInWithEmailAndPassword,
} from 'react-firebase-hooks/auth';
import { signOut, type User, signInWithPopup, type Auth } from 'firebase/auth';
import { getFirebaseAuth, googleAuthProvider } from '@/lib/firebase/clientApp';
import type { LoginFormData, SignupFormData } from '@/components/auth/schemas';

interface AuthContextType {
  user: User | null | undefined;
  loading: boolean;
  error?: Error;
  login: (credentials: LoginFormData) => Promise<any>;
  signup: (credentials: SignupFormData) => Promise<any>;
  loginWithGoogle: () => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<Auth | null>(null);

  useEffect(() => {
    // getFirebaseAuth() returns the auth instance, which is a browser-only API.
    // This ensures it only runs on the client.
    setAuth(getFirebaseAuth());
  }, []);


  const [user, loading, error] = useAuthState(auth ?? undefined);
  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth ?? undefined);
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth ?? undefined);

  const login = async (credentials: LoginFormData) => {
    if (!auth) throw new Error("Auth not initialized");
    return signInWithEmailAndPassword(credentials.email, credentials.password);
  };

  const signup = async (credentials: SignupFormData) => {
    if (!auth) throw new Error("Auth not initialized");
    return createUserWithEmailAndPassword(credentials.email, credentials.password);
  };
  
  const loginWithGoogle = async () => {
    if (!auth) throw new Error("Auth not initialized");
    return signInWithPopup(auth, googleAuthProvider);
  }

  const logout = async () => {
    if (!auth) throw new Error("Auth not initialized");
    await signOut(auth);
  };

  const value: AuthContextType = {
    user,
    loading: loading || !auth, // Consider it loading until auth is initialized
    error,
    login,
    signup,
    loginWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
