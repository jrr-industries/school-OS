import { NextRequest } from 'next/server';
import { apiHandler, ApiResponse } from '@schoolos/api';
import { ParentRepository } from '@schoolos/database';
import { createParentSchema } from '@schoolos/validation';

export const GET = apiHandler(async (request: NextRequest) => {
  const url = new URL(request.url);
  const schoolId = url.searchParams.get('schoolId');
  const studentId = url.searchParams.get('studentId');
  if (!schoolId) return ApiResponse.badRequest('School ID is required');

  const repo = new ParentRepository();

  if (studentId) {
    const parents = await repo.findByStudent(studentId);
    return ApiResponse.success(parents);
  }

  const result = await repo.findAll(schoolId);
  return ApiResponse.paginated(result.data, result.meta);
});

export const POST = apiHandler(async (request: NextRequest) => {
  const url = new URL(request.url);
  const schoolId = url.searchParams.get('schoolId');
  if (!schoolId) return ApiResponse.badRequest('School ID is required');

  const body = await request.json();
  const validation = createParentSchema.safeParse(body);
  if (!validation.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of validation.error.issues) {
      const path = issue.path.join('.');
      if (!errors[path]) errors[path] = [];
      errors[path]!.push(issue.message);
    }
    return ApiResponse.badRequest('Validation failed', errors);
  }

  const repo = new ParentRepository();
  const parent = await repo.create({ ...validation.data, schoolId });

  return ApiResponse.created(parent);
});
