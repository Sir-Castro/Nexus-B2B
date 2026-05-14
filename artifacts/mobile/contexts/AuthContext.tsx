import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  company: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('wh_user').then(stored => {
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {}
      }
      setLoading(false);
    });
  }, []);

  const login = async (email: string, _password: string): Promise<boolean> => {
    const nameFromEmail = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const u: User = {
      id: '1',
      name: nameFromEmail,
      email,
      company: 'RetailCo International',
      role: 'retailer',
      verified: true,
      creditLimit: 50000,
      creditUsed: 12500,
    };
    await AsyncStorage.setItem('wh_user', JSON.stringify(u));
    setUser(u);
    return true;
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    const u: User = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 7),
      name: data.name,
      email: data.email,
      company: data.company,
      role: data.role,
      verified: false,
      creditLimit: 10000,
      creditUsed: 0,
    };
    await AsyncStorage.setItem('wh_user', JSON.stringify(u));
    setUser(u);
    return true;
  };

  const logout = async () => {
    await AsyncStorage.removeItem('wh_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
