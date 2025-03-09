'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  userEmail: string;
  setUserEmail: (email: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userEmail, setUserEmail] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedEmail = localStorage.getItem('userEmail') || '';
      // console.log('AuthProvider initialized with email:', savedEmail); // Debug log
      return savedEmail;
    }
    return '';
  });

  // console.log('AuthProvider rendering with email:', userEmail); // Debug log

  return (
    <AuthContext.Provider value={{ userEmail, setUserEmail }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  // console.log('useAuth hook called, returning email:', context.userEmail); // Debug log
  return context;
} 