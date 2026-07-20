import { NextRequest } from 'next/server';
import { apiHandler, ApiResponse } from '@schoolos/api';
import { StudentService } from '@/features/students/services/student.service';
import { updateStudentSchema } from '@schoolos/validation';

export const GET = apiHandler(async (request: NextRequest, { params }) => {
  const url = new URL(request.url);
  const schoolId = url.searchParams.get('schoolId');
  if (!schoolId) return ApiResponse.badRequest('School ID is required');

  const service = new StudentService();
  const student = await service.findById(params.id, schoolId);

  return ApiResponse.success(student);
});

export const PATCH = apiHandler(async (request: NextRequest, { params }) => {
  const url = new URL(request.url);
  const schoolId = url.searchParams.get('schoolId');
  if (!schoolId) return ApiResponse.badRequest('School ID is required');

  const body = await request.json();
  const validation = updateStudentSchema.safeParse(body);
  if (!validation.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of validation.error.issues) {
      const path = issue.path.join('.');
      if (!errors[path]) errors[path] = [];
      errors[path]!.push(issue.message);
    }
    return ApiResponse.badRequest('Validation failed', errors);
  }

  const service = new StudentService();
  const student = await service.update(params.id, validation.data, schoolId, 'system');

  return ApiResponse.success(student);
});

export const DELETE = apiHandler(async (request: NextRequest, { params }) => {
  const url = new URL(request.url);
  const schoolId = url.searchParams.get('schoolId');
  if (!schoolId) return ApiResponse.badRequest('School ID is required');

  const service = new StudentService();
  await service.softDelete(params.id, schoolId, 'system');

  return ApiResponse.noContent();
});
