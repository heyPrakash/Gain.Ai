
'use client';
import { createContext, useContext, ReactNode } from 'react';
import { 
  useAuthState, 
  useCreateUserWithEmailAndPassword, 
  useSignInWithEmailAndPassword,
} from 'react-firebase-hooks/auth';
import { signOut, type User, signInWithPopup } from 'firebase/auth';
import { auth, googleAuthProvider } from '@/lib/firebase/clientApp';
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
  const [user, loading, error] = useAuthState(auth);
  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);

  const login = async (credentials: LoginFormData) => {
    return signInWithEmailAndPassword(credentials.email, credentials.password);
  };

  const signup = async (credentials: SignupFormData) => {
    return createUserWithEmailAndPassword(credentials.email, credentials.password);
  };
  
  const loginWithGoogle = async () => {
    return signInWithPopup(auth, googleAuthProvider);
  }

  const logout = async () => {
    await signOut(auth);
  };

  const value = {
    user,
    loading,
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
