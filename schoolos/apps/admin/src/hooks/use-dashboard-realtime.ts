'use client';

import { useState, useEffect, useCallback } from 'react';
import { SupabaseRealtime } from '@/lib/supabase-realtime';

interface DashboardMetrics {
  totalSchools: number;
  activeSchools: number;
  trialSchools: number;
  totalStudents: number;
  totalTeachers: number;
  totalParents: number;
  totalStaff: number;
  totalUsers: number;
  activeSubscriptions: number;
  revenue: number;
}

interface RecentSchool {
  id: string;
  name: string;
  type: string;
  status: string;
  createdAt: string;
  studentCount?: number;
  teacherCount?: number;
}

export function useDashboardMetrics(): DashboardMetrics & { loading: boolean } {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalSchools: 0, activeSchools: 0, trialSchools: 0,
    totalStudents: 0, totalTeachers: 0, totalParents: 0, totalStaff: 0,
    totalUsers: 0, activeSubscriptions: 0, revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    try {
      const [
        totalSchools, activeSchools, trialSchools,
        totalStudents, totalTeachers, totalParents, totalStaff,
        totalUsers, activeSubscriptions, revenue,
      ] = await Promise.all([
        SupabaseRealtime.getAggregateCount('School'),
        SupabaseRealtime.getAggregateCount('School', { status: 'active' }),
        SupabaseRealtime.getAggregateCount('School', { status: 'trial' }),
        SupabaseRealtime.getAggregateCount('Student'),
        SupabaseRealtime.getAggregateCount('Employee', { isTeaching: true }),
        SupabaseRealtime.getAggregateCount('Parent'),
        SupabaseRealtime.getAggregateCount('Employee', { isTeaching: false }),
        SupabaseRealtime.getAggregateCount('User'),
        SupabaseRealtime.getAggregateCount('Subscription', { status: 'active' }),
        SupabaseRealtime.getAggregateSum('Subscription', 'amount'),
      ]);

      setMetrics({
        totalSchools, activeSchools, trialSchools,
        totalStudents, totalTeachers, totalParents, totalStaff,
        totalUsers, activeSubscriptions, revenue,
      });
    } catch (err) {
      console.error('Dashboard metrics fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();

    const unsubSchool = SupabaseRealtime.subscribe({ table: 'School', event: '*' }, fetchAll);
    const unsubStudent = SupabaseRealtime.subscribe({ table: 'Student', event: '*' }, fetchAll);
    const unsubEmployee = SupabaseRealtime.subscribe({ table: 'Employee', event: '*' }, fetchAll);
    const unsubUser = SupabaseRealtime.subscribe({ table: 'User', event: '*' }, fetchAll);
    const unsubSubscription = SupabaseRealtime.subscribe({ table: 'Subscription', event: '*' }, fetchAll);

    return () => {
      unsubSchool(); unsubStudent(); unsubEmployee();
      unsubUser(); unsubSubscription();
    };
  }, [fetchAll]);

  return { ...metrics, loading };
}

export function useRecentSchools(): { schools: RecentSchool[]; loading: boolean } {
  const [schools, setSchools] = useState<RecentSchool[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      const data = await SupabaseRealtime.getRecentRows<RecentSchool>('School', 5, 'createdAt');
      setSchools(data);
    } catch (err) {
      console.error('Recent schools fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
    const unsub = SupabaseRealtime.subscribe({ table: 'School', event: 'INSERT' }, fetch);
    return () => unsub();
  }, [fetch]);

  return { schools, loading };
}

export function useSchoolStatusDistribution(): { data: Record<string, number>; loading: boolean } {
  const [data, setData] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      const counts = await SupabaseRealtime.getCountByGroup('School', 'status');
      setData(counts);
    } catch (err) {
      console.error('Status distribution fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
    const unsub = SupabaseRealtime.subscribe({ table: 'School', event: '*' }, fetch);
    return () => unsub();
  }, [fetch]);

  return { data, loading };
}

export function useSubscriptionMetrics(): {
  planDistribution: Record<string, number>;
  expiringSoon: number;
  loading: boolean;
} {
  const [planDistribution, setPlanDistribution] = useState<Record<string, number>>({});
  const [expiringSoon, setExpiringSoon] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      const [plans, expired] = await Promise.all([
        SupabaseRealtime.getCountByGroup('Subscription', 'planId'),
        SupabaseRealtime.getAggregateCount('Subscription', {
          status: 'active',
        }),
      ]);
      setPlanDistribution(plans);

      const supabase = (await import('@schoolos/auth/client')).createClientSupabaseClient();
      const thirtyDays = new Date();
      thirtyDays.setDate(thirtyDays.getDate() + 30);
      const { count } = await supabase
        .from('Subscription')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')
        .lte('endDate', thirtyDays.toISOString());
      setExpiringSoon(count ?? 0);
    } catch (err) {
      console.error('Subscription metrics fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
    const unsub = SupabaseRealtime.subscribe({ table: 'Subscription', event: '*' }, fetch);
    return () => unsub();
  }, [fetch]);

  return { planDistribution, expiringSoon, loading };
}
