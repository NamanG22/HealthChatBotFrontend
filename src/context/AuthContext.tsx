'use client';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextType {
  userEmail: string;
  setUserEmail: (email: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userEmail, setUserEmail] = useState(() => {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userEmail') || '';
    }
    return '';
  });

  // Update localStorage when email changes
  const updateEmail = (email: string) => {
    setUserEmail(email);
    localStorage.setItem('userEmail', email);
  };

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ userEmail, setUserEmail: updateEmail }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 