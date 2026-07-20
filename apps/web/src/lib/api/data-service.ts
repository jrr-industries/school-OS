/**
 * Data Service Layer
 * 
 * Provides a unified interface for data access.
 * Currently uses mock data, but designed to easily switch to API calls.
 * 
 * To switch to API: change `useMockData` to `false` and the service
 * will use the ApiClient to fetch from the backend.
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

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const dataService = {
  // Dashboard
  async getDashboardStats() {
    if (useMockData) return dashboardStats;
    return apiClient.fetch('/dashboard/stats');
  },

  async getSchoolGrowthData() {
    if (useMockData) return schoolGrowthData;
    return apiClient.fetch('/dashboard/school-growth');
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
    return apiClient.fetch('/dashboard/subscriptions');
  },

  async getRecentPayments() {
    if (useMockData) return recentPayments;
    return apiClient.fetch('/payments/recent');
  },

  async getNotifications() {
    if (useMockData) return notifications;
    return apiClient.fetch('/notifications');
  },

  // Students
  async getStudents(): Promise<Student[]> {
    if (useMockData) return students;
    return apiClient.fetch('/students', { ttl: 2 * 60 * 1000 });
  },

  // Teachers
  async getTeachers(): Promise<Teacher[]> {
    if (useMockData) return teachers;
    return apiClient.fetch('/teachers', { ttl: 2 * 60 * 1000 });
  },

  // Schools
  async getSchools(): Promise<School[]> {
    if (useMockData) return schools;
    return apiClient.fetch('/schools', { ttl: 2 * 60 * 1000 });
  },

  // Parents
  async getParents(): Promise<Parent[]> {
    if (useMockData) return parents;
    return apiClient.fetch('/parents', { ttl: 2 * 60 * 1000 });
  },

  // Attendance
  async getAttendanceRecords(): Promise<AttendanceRecord[]> {
    if (useMockData) return attendanceRecords;
    return apiClient.fetch('/attendance', { ttl: 60 * 1000 });
  },

  /** Prefetch commonly used data */
  prefetchCommonData(): void {
    if (useMockData) return;
    apiClient.prefetch('/students');
    apiClient.prefetch('/attendance');
    apiClient.prefetch('/teachers');
  },
};
