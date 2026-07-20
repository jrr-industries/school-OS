/**
 * Data Service Layer
 *
 * Provides a unified interface for data access.
 * Currently uses mock data, but designed to easily switch to API calls.
 *
 * To switch to API: change `useMockData` to `false` and the service
 * will use the ApiClient to fetch from the backend.
 *
 * Phase 1 API endpoints (when useMockData = false):
 *   GET  /api/{module}          — List (paginated, filtered, sorted)
 *   POST /api/{module}          — Create
 *   GET  /api/{module}/:id      — Get by ID
 *   PUT  /api/{module}/:id      — Update
 *   DELETE /api/{module}/:id    — Soft delete
 *   GET  /api/dashboard         — Dashboard analytics
 */

import { apiClient } from './api-client';
import {
  students,
  teachers,
  schools,
  parents,
  attendanceRecords,
  dashboardStats,
  schoolGrowthData,
  revenueData,
  studentGrowthData,
  attendanceRateData,
  subscriptionOverview,
  recentPayments,
  notifications,
} from '@/mock-data';
import type { Student } from '@/mock-data/students';
import type { Teacher } from '@/mock-data/teachers';
import type { School } from '@/mock-data/schools';
import type { Parent } from '@/mock-data/parents';
import type { AttendanceRecord } from '@/mock-data/attendance';

/** Toggle between mock data and API calls */
const useMockData = true;

// Re-export types for convenience
export type { Student, Teacher, School, Parent, AttendanceRecord };

/** Generic paginated response from the API */
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta?: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

/** Generic single item response from the API */
export interface ItemResponse<T> {
  success: boolean;
  data: T;
}

/** Query parameters for list endpoints */
export interface ListQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: string;
  schoolId?: string;
  branchId?: string;
  [key: string]: string | number | undefined;
}

/**
 * Build a query string from a params object.
 * Filters out undefined and empty values.
 */
function buildQuery(params: ListQuery): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') {
      searchParams.set(key, String(value));
    }
  }
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

export const dataService = {
  // ── Dashboard ──────────────────────────────────────────
  async getDashboardStats() {
    if (useMockData) return dashboardStats;
    return apiClient.fetch('/dashboard');
  },

  async getSchoolGrowthData() {
    if (useMockData) return schoolGrowthData;
    const res = await apiClient.fetch<PaginatedResponse<unknown>>('/dashboard');
    return (res as any)?.monthlySchoolGrowth || schoolGrowthData;
  },

  async getRevenueData() {
    if (useMockData) return revenueData;
    return apiClient.fetch('/dashboard/revenue');
  },

  async getStudentGrowthData() {
    if (useMockData) return studentGrowthData;
    return apiClient.fetch('/dashboard/student-growth');
  },

  async getAttendanceRateData() {
    if (useMockData) return attendanceRateData;
    return apiClient.fetch('/dashboard/attendance-rate');
  },

  async getSubscriptionOverview() {
    if (useMockData) return subscriptionOverview;
    const res = await apiClient.fetch<PaginatedResponse<unknown>>('/dashboard');
    return (res as any)?.subscriptionOverview || subscriptionOverview;
  },

  async getRecentPayments() {
    if (useMockData) return recentPayments;
    return apiClient.fetch('/payments/recent');
  },

  async getNotifications() {
    if (useMockData) return notifications;
    return apiClient.fetch('/notifications');
  },

  // ── Students ───────────────────────────────────────────
  async getStudents(params: ListQuery = {}): Promise<Student[]> {
    if (useMockData) return students;
    const res = await apiClient.fetch<PaginatedResponse<Student>>(`/students${buildQuery(params)}`);
    return res.data;
  },

  // ── Teachers ───────────────────────────────────────────
  async getTeachers(params: ListQuery = {}): Promise<Teacher[]> {
    if (useMockData) return teachers;
    const res = await apiClient.fetch<PaginatedResponse<Teacher>>(`/teachers${buildQuery(params)}`);
    return res.data;
  },

  // ── Schools ────────────────────────────────────────────
  async getSchools(params: ListQuery = {}): Promise<School[]> {
    if (useMockData) return schools;
    const res = await apiClient.fetch<PaginatedResponse<School>>(`/schools${buildQuery(params)}`);
    return res.data;
  },

  async getSchoolById(id: string) {
    if (useMockData) return schools.find((s) => s.id === id) || null;
    return apiClient.fetch<ItemResponse<School>>(`/schools/${id}`);
  },

  // ── Parents ────────────────────────────────────────────
  async getParents(params: ListQuery = {}): Promise<Parent[]> {
    if (useMockData) return parents;
    const res = await apiClient.fetch<PaginatedResponse<Parent>>(`/parents${buildQuery(params)}`);
    return res.data;
  },

  // ── Attendance ─────────────────────────────────────────
  async getAttendanceRecords(params: ListQuery = {}): Promise<AttendanceRecord[]> {
    if (useMockData) return attendanceRecords;
    const res = await apiClient.fetch<PaginatedResponse<AttendanceRecord>>(`/attendance${buildQuery(params)}`);
    return res.data;
  },

  // ── Branches ───────────────────────────────────────────
  async getBranches(params: ListQuery = {}) {
    if (useMockData) return []; // Not available in mock data
    const res = await apiClient.fetch<PaginatedResponse<unknown>>(`/branches${buildQuery(params)}`);
    return res.data;
  },

  // ── Academic Years ─────────────────────────────────────
  async getAcademicYears(params: ListQuery = {}) {
    if (useMockData) return [];
    const res = await apiClient.fetch<PaginatedResponse<unknown>>(`/academic-years${buildQuery(params)}`);
    return res.data;
  },

  // ── Classes ────────────────────────────────────────────
  async getClasses(params: ListQuery = {}) {
    if (useMockData) return [];
    const res = await apiClient.fetch<PaginatedResponse<unknown>>(`/classes${buildQuery(params)}`);
    return res.data;
  },

  // ── Sections ───────────────────────────────────────────
  async getSections(params: ListQuery = {}) {
    if (useMockData) return [];
    const res = await apiClient.fetch<PaginatedResponse<unknown>>(`/sections${buildQuery(params)}`);
    return res.data;
  },

  // ── Subjects ───────────────────────────────────────────
  async getSubjects(params: ListQuery = {}) {
    if (useMockData) return [];
    const res = await apiClient.fetch<PaginatedResponse<unknown>>(`/subjects${buildQuery(params)}`);
    return res.data;
  },

  // ── Calendar Events ────────────────────────────────────
  async getCalendarEvents(params: ListQuery = {}) {
    if (useMockData) return [];
    const res = await apiClient.fetch<PaginatedResponse<unknown>>(`/calendar-events${buildQuery(params)}`);
    return res.data;
  },

  // ── Announcements ──────────────────────────────────────
  async getAnnouncements(params: ListQuery = {}) {
    if (useMockData) return [];
    const res = await apiClient.fetch<PaginatedResponse<unknown>>(`/announcements${buildQuery(params)}`);
    return res.data;
  },

  // ── Tasks ──────────────────────────────────────────────
  async getTasks(params: ListQuery = {}) {
    if (useMockData) return [];
    const res = await apiClient.fetch<PaginatedResponse<unknown>>(`/tasks${buildQuery(params)}`);
    return res.data;
  },

  // ── Utility ────────────────────────────────────────────

  /** Prefetch commonly used data for faster navigation */
  prefetchCommonData(): void {
    if (useMockData) return;
    apiClient.prefetch('/api/dashboard');
    apiClient.prefetch('/api/schools?pageSize=5');
    apiClient.prefetch('/api/calendar-events?pageSize=5&sortBy=eventDate&sortOrder=asc');
    apiClient.prefetch('/api/announcements?pageSize=5&status=PUBLISHED');
    apiClient.prefetch('/api/tasks?pageSize=5');
  },

  /** Invalidate cache for a specific module */
  invalidateCache(module: string): void {
    apiClient.invalidate(`/api/${module}`);
  },
};
