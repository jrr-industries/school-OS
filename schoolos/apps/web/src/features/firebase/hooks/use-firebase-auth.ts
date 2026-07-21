'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { SchoolAdminUser } from '../types';

interface AuthSession {
  user: SchoolAdminUser | null;
  loading: boolean;
  error: string | null;
}

export function useFirebaseAuth() {
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
      // silent
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
