'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export type UserRole = 'customer' | 'vendor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  businessName?: string;
  subscriptionPlan: 'free' | 'premium';
  subscriptionExpiresAt?: string;
  favorites?: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // Load user on startup from stored token
  const loadUser = async () => {
    try {
      const storedToken = localStorage.getItem('pizzahub_token');
      const storedUser = localStorage.getItem('pizzahub_user');

      if (storedToken) {
        setToken(storedToken);
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {
            console.error('Failed to parse cached user', e);
          }
        }

        // Validate token with server
        const res = await api.get('/auth/me');
        if (res.data.success && res.data.user) {
          setUser(res.data.user);
          localStorage.setItem('pizzahub_user', JSON.stringify(res.data.user));
        }
      }
    } catch (error) {
      console.warn('[AuthContext] Session expired or invalid token');
      localStorage.removeItem('pizzahub_token');
      localStorage.removeItem('pizzahub_user');
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('pizzahub_token', newToken);
    localStorage.setItem('pizzahub_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);

    // Redirect according to role
    if (newUser.role === 'admin') {
      router.push('/dashboard/admin');
    } else if (newUser.role === 'vendor') {
      router.push('/dashboard/vendor');
    } else {
      router.push('/dashboard/customer');
    }
  };

  const logout = () => {
    localStorage.removeItem('pizzahub_token');
    localStorage.removeItem('pizzahub_user');
    setToken(null);
    setUser(null);
    router.push('/');
  };

  const updateUser = (updatedFields: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...updatedFields };
      setUser(updated);
      localStorage.setItem('pizzahub_user', JSON.stringify(updated));
    }
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data.success && res.data.user) {
        setUser(res.data.user);
        localStorage.setItem('pizzahub_user', JSON.stringify(res.data.user));
      }
    } catch (err) {
      console.error('[AuthContext] Failed to refresh user profile', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
