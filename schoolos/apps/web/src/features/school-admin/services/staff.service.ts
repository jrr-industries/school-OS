'use client';

import { ApiService } from '@/features/shared/services/api.service';
import type { Employee, CreateEmployeePayload } from '../types';
import type { PaginatedResult } from '@schoolos/types';

export class StaffService {
  static async getEmployees(params?: {
    search?: string;
    status?: string;
    departmentId?: string;
    designationId?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResult<Employee>> {
    return ApiService.getPaginated('school-admin/staff', (params ?? {}) as Record<string, string | number | boolean | undefined>);
  }

  static async getEmployee(id: string): Promise<Employee> {
    return ApiService.get(`school-admin/staff/${id}`);
  }

  static async createEmployee(payload: CreateEmployeePayload): Promise<Employee> {
    return ApiService.post('school-admin/staff', payload);
  }

  static async updateEmployee(id: string, payload: Partial<CreateEmployeePayload>): Promise<Employee> {
    return ApiService.put(`school-admin/staff/${id}`, payload);
  }

  static async deleteEmployee(id: string): Promise<void> {
    return ApiService.delete(`school-admin/staff/${id}`);
  }

  static async deactivateEmployee(id: string): Promise<Employee> {
    return ApiService.patch(`school-admin/staff/${id}/deactivate`, {});
  }

  static async transferEmployee(id: string, departmentId: string): Promise<Employee> {
    return ApiService.patch(`school-admin/staff/${id}/transfer`, { departmentId });
  }
}
