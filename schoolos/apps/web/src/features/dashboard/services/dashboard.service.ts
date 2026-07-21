import type { DashboardStats, ChartDataPoint, RecentActivity, Notification, CalendarEvent, TaskCenterItem, SearchResult } from '../types';

const BASE_URL = '/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export const dashboardService = {
  async getStats(schoolId: string): Promise<DashboardStats> {
    return fetchJson<DashboardStats>(`${BASE_URL}/dashboard/stats?schoolId=${schoolId}`);
  },

  async getStudentGrowth(schoolId: string): Promise<ChartDataPoint[]> {
    return fetchJson<ChartDataPoint[]>(`${BASE_URL}/dashboard/charts/student-growth?schoolId=${schoolId}`);
  },

  async getAdmissionTrend(schoolId: string): Promise<ChartDataPoint[]> {
    return fetchJson<ChartDataPoint[]>(`${BASE_URL}/dashboard/charts/admission-trend?schoolId=${schoolId}`);
  },

  async getAttendanceTrend(schoolId: string): Promise<ChartDataPoint[]> {
    return fetchJson<ChartDataPoint[]>(`${BASE_URL}/dashboard/charts/attendance-trend?schoolId=${schoolId}`);
  },

  async getFeeCollection(schoolId: string): Promise<ChartDataPoint[]> {
    return fetchJson<ChartDataPoint[]>(`${BASE_URL}/dashboard/charts/fee-collection?schoolId=${schoolId}`);
  },

  async getMonthlyRevenue(schoolId: string): Promise<ChartDataPoint[]> {
    return fetchJson<ChartDataPoint[]>(`${BASE_URL}/dashboard/charts/monthly-revenue?schoolId=${schoolId}`);
  },

  async getRecentActivity(schoolId: string): Promise<RecentActivity[]> {
    return fetchJson<RecentActivity[]>(`${BASE_URL}/dashboard/activity?schoolId=${schoolId}`);
  },

  async getNotifications(userId: string): Promise<Notification[]> {
    return fetchJson<Notification[]>(`${BASE_URL}/dashboard/notifications?userId=${userId}`);
  },

  async getCalendarEvents(schoolId: string): Promise<CalendarEvent[]> {
    return fetchJson<CalendarEvent[]>(`${BASE_URL}/dashboard/calendar?schoolId=${schoolId}`);
  },

  async getTaskCenter(schoolId: string): Promise<TaskCenterItem[]> {
    return fetchJson<TaskCenterItem[]>(`${BASE_URL}/dashboard/tasks?schoolId=${schoolId}`);
  },

  async searchGlobal(query: string): Promise<SearchResult[]> {
    return fetchJson<SearchResult[]>(`${BASE_URL}/dashboard/search?q=${encodeURIComponent(query)}`);
  },
};
