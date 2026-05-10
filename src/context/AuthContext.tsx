import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signInAnonymously, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  authError: string | null;
  isAdmin: boolean;
  clearAuthError: () => void;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        try {
          const adminDoc = await getDoc(doc(db, 'admins', u.uid));
          setIsAdmin(adminDoc.exists());
        } catch (e) {
          setIsAdmin(false);
        }
        setLoading(false);
      } else {
        // Automatically sign in anonymously when no user is logged in
        try {
          await signInAnonymously(auth);
        } catch (error: any) {
          console.error("Anonymous sign-in failed:", error);
          if (error.code === 'auth/operation-not-allowed') {
            setAuthError('無法自動登入。請前往 Firebase 控制台 > Authentication > Sign-in method 啟用「匿名 (Anonymous)」驗證。');
          } else {
            setAuthError('自動登入失敗：' + error.message);
          }
          setLoading(false);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const clearAuthError = () => setAuthError(null);

  const signIn = async () => {
    // For anonymous sign in, we don't need a manual button, but we keep the signature
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, authError, clearAuthError, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

export const useIsAdmin = () => {
  const { isAdmin } = useAuth();
  return isAdmin;
};
