import { NextRequest } from 'next/server';
import { apiHandler, ApiResponse } from '@schoolos/api';
import { AcademicYearRepository } from '@schoolos/database';

export const GET = apiHandler(async (request: NextRequest) => {
  const url = new URL(request.url);
  const schoolId = url.searchParams.get('schoolId');
  if (!schoolId) return ApiResponse.badRequest('School ID is required');

  const repo = new AcademicYearRepository();
  const current = await repo.findCurrent(schoolId);

  if (!current) return ApiResponse.notFound('No current academic year set');

  return ApiResponse.success(current);
});
