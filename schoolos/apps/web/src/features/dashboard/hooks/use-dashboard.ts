import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@schoolos/hooks';
import { dashboardService } from '../services/dashboard.service';
import type { DashboardStats, ChartDataPoint, RecentActivity, CalendarEvent } from '../types';

export function useDashboardStats() {
  const schoolId = useAuthStore((state) => state.user?.schoolId);

  return useQuery<DashboardStats>({
    queryKey: ['dashboard', 'stats', schoolId],
    queryFn: () => dashboardService.getStats(schoolId!),
    enabled: !!schoolId,
  });
}

export function useStudentGrowth() {
  const schoolId = useAuthStore((state) => state.user?.schoolId);

  return useQuery<ChartDataPoint[]>({
    queryKey: ['dashboard', 'student-growth', schoolId],
    queryFn: () => dashboardService.getStudentGrowth(schoolId!),
    enabled: !!schoolId,
  });
}

export function useAdmissionTrend() {
  const schoolId = useAuthStore((state) => state.user?.schoolId);

  return useQuery<ChartDataPoint[]>({
    queryKey: ['dashboard', 'admission-trend', schoolId],
    queryFn: () => dashboardService.getAdmissionTrend(schoolId!),
    enabled: !!schoolId,
  });
}

export function useAttendanceTrend() {
  const schoolId = useAuthStore((state) => state.user?.schoolId);

  return useQuery<ChartDataPoint[]>({
    queryKey: ['dashboard', 'attendance-trend', schoolId],
    queryFn: () => dashboardService.getAttendanceTrend(schoolId!),
    enabled: !!schoolId,
  });
}

export function useFeeCollection() {
  const schoolId = useAuthStore((state) => state.user?.schoolId);

  return useQuery<ChartDataPoint[]>({
    queryKey: ['dashboard', 'fee-collection', schoolId],
    queryFn: () => dashboardService.getFeeCollection(schoolId!),
    enabled: !!schoolId,
  });
}

export function useMonthlyRevenue() {
  const schoolId = useAuthStore((state) => state.user?.schoolId);

  return useQuery<ChartDataPoint[]>({
    queryKey: ['dashboard', 'monthly-revenue', schoolId],
    queryFn: () => dashboardService.getMonthlyRevenue(schoolId!),
    enabled: !!schoolId,
  });
}

export function useRecentActivity() {
  const schoolId = useAuthStore((state) => state.user?.schoolId);

  return useQuery<RecentActivity[]>({
    queryKey: ['dashboard', 'recent-activity', schoolId],
    queryFn: () => dashboardService.getRecentActivity(schoolId!),
    enabled: !!schoolId,
  });
}

export function useCalendarEvents() {
  const schoolId = useAuthStore((state) => state.user?.schoolId);

  return useQuery<CalendarEvent[]>({
    queryKey: ['dashboard', 'calendar', schoolId],
    queryFn: () => dashboardService.getCalendarEvents(schoolId!),
    enabled: !!schoolId,
  });
}
