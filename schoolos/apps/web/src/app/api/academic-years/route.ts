import { NextRequest } from 'next/server';
import { apiHandler, ApiResponse } from '@schoolos/api';
import { AcademicYearRepository } from '@schoolos/database';
import { academicYearSchema } from '@schoolos/validation';

export const GET = apiHandler(async (request: NextRequest) => {
  const url = new URL(request.url);
  const schoolId = url.searchParams.get('schoolId');
  if (!schoolId) return ApiResponse.badRequest('School ID is required');

  const repo = new AcademicYearRepository();
  const result = await repo.findAll(schoolId, { sortBy: 'startDate', sortOrder: 'desc' });

  return ApiResponse.paginated(result.data, result.meta);
});

export const POST = apiHandler(async (request: NextRequest) => {
  const url = new URL(request.url);
  const schoolId = url.searchParams.get('schoolId');
  if (!schoolId) return ApiResponse.badRequest('School ID is required');

  const body = await request.json();
  const validation = academicYearSchema.safeParse(body);
  if (!validation.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of validation.error.issues) {
      const path = issue.path.join('.');
      if (!errors[path]) errors[path] = [];
      errors[path]!.push(issue.message);
    }
    return ApiResponse.badRequest('Validation failed', errors);
  }

  const repo = new AcademicYearRepository();
  const year = await repo.create({
    ...validation.data,
    schoolId,
    startDate: new Date(validation.data.startDate),
    endDate: new Date(validation.data.endDate),
  });

  return ApiResponse.created(year);
});
