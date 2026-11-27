'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
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
  login: (token?: string, user?: User) => void;
  logout: () => Promise<void>;
  updateUser: (updatedUser: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, isPending, refetch } = authClient.useSession();
  const [token, setToken] = useState<string | null>(null);
  const [userOverride, setUserOverride] = useState<Partial<User> | null>(null);
  const router = useRouter();

  // Map session user to existing User interface shape
  const baseUser: User | null = useMemo(() => {
    if (!session?.user) return null;
    const u = session.user as any;
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      image: u.image || undefined,
      role: (u.role as UserRole) || 'customer',
      businessName: u.businessName || undefined,
      subscriptionPlan: (u.subscriptionPlan as 'free' | 'premium') || 'free',
      subscriptionExpiresAt: u.subscriptionExpiresAt
        ? new Date(u.subscriptionExpiresAt).toISOString()
        : undefined,
      favorites: u.favorites || [],
    };
  }, [session]);

  const user: User | null = useMemo(() => {
    if (!baseUser) return null;
    if (!userOverride) return baseUser;
    return { ...baseUser, ...userOverride };
  }, [baseUser, userOverride]);

  // Obtain and cache JWT token when session is present
  useEffect(() => {
    let isMounted = true;
    if (session?.user) {
      authClient
        .token()
        .then((res: any) => {
          if (isMounted && res?.data?.token) {
            setToken(res.data.token);
          }
        })
        .catch(() => {});
    } else {
      setToken(null);
      setUserOverride(null);
    }
    return () => {
      isMounted = false;
    };
  }, [session]);

  const login = (_newToken?: string, newUser?: User) => {
    const target = newUser || user;
    if (target?.role === 'admin') {
      router.push('/dashboard/admin');
    } else if (target?.role === 'vendor') {
      router.push('/dashboard/vendor');
    } else {
      router.push('/dashboard/customer');
    }
  };

  const logout = async () => {
    try {
      await authClient.signOut();
    } catch (err) {
      console.error('[AuthContext] Error signing out', err);
    } finally {
      setToken(null);
      setUserOverride(null);
      router.push('/');
    }
  };

  const updateUser = (updatedFields: Partial<User>) => {
    setUserOverride((prev) => ({ ...(prev || {}), ...updatedFields }));
  };

  const refreshUser = useCallback(async () => {
    try {
      await refetch();
      const res = await api.get('/auth/me');
      if (res.data?.success && res.data?.user) {
        setUserOverride(res.data.user);
      }
    } catch (err) {
      console.warn('[AuthContext] refreshUser sync warning:', err);
    }
  }, [refetch]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading: isPending,
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
