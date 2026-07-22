'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface SchoolAdminUser {
  uid: string;
  email: string;
  name: string;
  photo?: string;
  phone?: string;
  role: 'school_admin' | 'principal' | 'vice_principal' | 'teacher' | 'office_staff' | 'accountant' | 'receptionist' | 'librarian' | 'driver' | 'security' | 'student' | 'parent';
  status: 'active' | 'inactive' | 'suspended';
  schoolId: string;
  createdAt: string;
  lastLogin?: string;
  createdBy?: string;
  deviceInfo?: string;
  ipAddress?: string;
}

interface AuthContextValue {
  user: SchoolAdminUser | null;
  loading: boolean;
  error: string | null;
  logout: () => Promise<void>;
  refreshSession: () => void;
  isAuthenticated: boolean;
  isSchoolAdmin: boolean;
  schoolId: string | undefined;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function SchoolAdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SchoolAdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/session');
      const data = await res.json();
      if (data.success && data.data) {
        setUser(data.data as SchoolAdminUser);
        setError(null);
      } else {
        setUser(null);
        setError('No session');
      }
    } catch {
      setUser(null);
      setError('Failed to fetch session');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/dev-logout', { method: 'POST' });
    } catch {
    }
    setUser(null);
    setLoading(false);
    setError(null);
    router.push('/login');
  }, [router]);

  const refreshSession = useCallback(() => {
    setLoading(true);
    fetchSession();
  }, [fetchSession]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        logout,
        refreshSession,
        isAuthenticated: !!user,
        isSchoolAdmin: user?.role === 'school_admin',
        schoolId: user?.schoolId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useSchoolAdminAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useSchoolAdminAuth must be used within a SchoolAdminAuthProvider');
  }
  return context;
}
