'use client';

import { useState, useEffect, useCallback } from 'react';
import { getDashboardData } from '@/lib/api-client';
import type { DashboardData } from '@/lib/api-client';

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
      const data = await getDashboardData();
      setMetrics({
        totalSchools: data.totalSchools,
        activeSchools: data.activeSchools,
        trialSchools: data.trialSchools,
        totalStudents: data.totalStudents,
        totalTeachers: data.totalTeachers,
        totalParents: data.totalParents,
        totalStaff: data.totalStaff,
        totalUsers: data.totalUsers,
        activeSubscriptions: data.activeSubscriptions,
        revenue: data.revenue,
      });
    } catch (err) {
      console.error('Dashboard metrics fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 30000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  return { ...metrics, loading };
}

export function useRecentSchools(): { schools: RecentSchool[]; loading: boolean } {
  const [schools, setSchools] = useState<RecentSchool[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      const data = await getDashboardData();
      setSchools(data.recentSchools);
    } catch (err) {
      console.error('Recent schools fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
    const interval = setInterval(fetch, 30000);
    return () => clearInterval(interval);
  }, [fetch]);

  return { schools, loading };
}

export function useSchoolStatusDistribution(): { data: Record<string, number>; loading: boolean } {
  const [data, setData] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      const dashboard = await getDashboardData();
      const statusMap: Record<string, number> = {};
      for (const item of dashboard.schoolsByStatus) {
        statusMap[item.status] = item.count;
      }
      setData(statusMap);
    } catch (err) {
      console.error('Status distribution fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
    const interval = setInterval(fetch, 30000);
    return () => clearInterval(interval);
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
      const data = await getDashboardData();
      setPlanDistribution(data.planDistribution);
      setExpiringSoon(data.expiringSoon);
    } catch (err) {
      console.error('Subscription metrics fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
    const interval = setInterval(fetch, 30000);
    return () => clearInterval(interval);
  }, [fetch]);

  return { planDistribution, expiringSoon, loading };
}
