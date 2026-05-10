import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  isAdmin: boolean;
  authError: string | null;
  clearAuthError: () => void;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    let uid = localStorage.getItem('app_user_id');
    if (!uid) {
      uid = crypto.randomUUID();
      localStorage.setItem('app_user_id', uid);
    }
    setUser({ uid, displayName: '訪客' });
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading: !user, 
      isAdmin: true, // Everyone is admin now as requested
      authError: null, 
      clearAuthError: () => {}, 
      signIn: async () => {}, 
      signOut: async () => {} 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

export const useIsAdmin = () => true;

