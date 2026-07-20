import { NextRequest } from 'next/server';
import { apiHandler, ApiResponse } from '@schoolos/api';
import { AcademicYearRepository } from '@schoolos/database';
import { academicYearSchema } from '@schoolos/validation';

export const PATCH = apiHandler(async (request: NextRequest, { params }) => {
  const url = new URL(request.url);
  const schoolId = url.searchParams.get('schoolId');
  if (!schoolId) return ApiResponse.badRequest('School ID is required');

  const body = await request.json();
  const validation = academicYearSchema.partial().safeParse(body);
  if (!validation.success) {
    return ApiResponse.badRequest('Validation failed');
  }

  const repo = new AcademicYearRepository();
  const updateData: Record<string, unknown> = { ...validation.data };
  if (validation.data.startDate) updateData.startDate = new Date(validation.data.startDate);
  if (validation.data.endDate) updateData.endDate = new Date(validation.data.endDate);

  const year = await repo.update(params.id, schoolId, updateData);
  return ApiResponse.success(year);
});

export const DELETE = apiHandler(async (request: NextRequest, { params }) => {
  const url = new URL(request.url);
  const schoolId = url.searchParams.get('schoolId');
  if (!schoolId) return ApiResponse.badRequest('School ID is required');

  const repo = new AcademicYearRepository();
  await repo.softDelete(params.id, schoolId);
  return ApiResponse.noContent();
});
