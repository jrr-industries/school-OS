'use client';

import { useState, useEffect, useCallback } from 'react';
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

interface AuthSession {
  user: SchoolAdminUser | null;
  loading: boolean;
  error: string | null;
}

export function useSchoolAdminAuth() {
  const [session, setSession] = useState<AuthSession>({
    user: null,
    loading: true,
    error: null,
  });
  const router = useRouter();

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/session');
      const data = await res.json();

      if (data.success && data.data) {
        setSession({
          user: data.data as SchoolAdminUser,
          loading: false,
          error: null,
        });
      } else {
        setSession({ user: null, loading: false, error: 'No session' });
      }
    } catch {
      setSession({ user: null, loading: false, error: 'Failed to fetch session' });
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setSession({ user: null, loading: false, error: null });
      router.push('/login');
    } catch {

    }
  }, [router]);

  const refreshSession = useCallback(() => {
    fetchSession();
  }, [fetchSession]);

  return {
    user: session.user,
    loading: session.loading,
    error: session.error,
    logout,
    refreshSession,
    isAuthenticated: !!session.user,
    isSchoolAdmin: session.user?.role === 'school_admin',
    schoolId: session.user?.schoolId,
  };
}
