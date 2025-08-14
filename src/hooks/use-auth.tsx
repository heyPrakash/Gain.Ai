
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


// This new component will contain all the hooks that depend on the `auth` object.
function AuthHooks({ children, auth }: { children: ReactNode, auth: Auth }) {
  const [user, loading, error] = useAuthState(auth);
  const [createUserWithEmailAndPassword, , , signupError] = useCreateUserWithEmailAndPassword(auth);
  const [signInWithEmailAndPassword, , , loginError] = useSignInWithEmailAndPassword(auth);

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

  const value: AuthContextType = {
    user,
    loading,
    error: error || signupError || loginError,
    login,
    signup,
    loginWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<Auth | null>(null);

  useEffect(() => {
    // getFirebaseAuth() returns the auth instance, which is a browser-only API.
    // This ensures it only runs on the client.
    setAuth(getFirebaseAuth());
  }, []);

  // While the auth object is being initialized, we can show a loading state
  // or return null. This prevents the hooks from running with an undefined auth object.
  if (!auth) {
    // You can return a global loading spinner here if you want
    return null;
  }

  // Once `auth` is initialized, we render the component that uses the hooks.
  return <AuthHooks auth={auth}>{children}</AuthHooks>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // This can happen if the component is used outside of the AuthProvider,
    // or if the AuthProvider hasn't mounted yet (e.g. on the server).
    // We return a "loading" state to handle this gracefully.
    return {
      user: undefined,
      loading: true,
      error: undefined,
      login: async () => {},
      signup: async () => {},
      loginWithGoogle: async () => {},
      logout: async () => {},
    };
  }
  return context;
};
