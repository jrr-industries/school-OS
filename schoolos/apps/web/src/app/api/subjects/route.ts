import { NextRequest } from 'next/server';
import { apiHandler, ApiResponse } from '@schoolos/api';
import { SubjectRepository } from '@schoolos/database';
import { subjectSchema } from '@schoolos/validation';

export const GET = apiHandler(async (request: NextRequest) => {
  const url = new URL(request.url);
  const schoolId = url.searchParams.get('schoolId');
  if (!schoolId) return ApiResponse.badRequest('School ID is required');

  const repo = new SubjectRepository();
  const result = await repo.findAll(schoolId, { sortBy: 'sortOrder', sortOrder: 'asc' });

  return ApiResponse.paginated(result.data, result.meta);
});

export const POST = apiHandler(async (request: NextRequest) => {
  const url = new URL(request.url);
  const schoolId = url.searchParams.get('schoolId');
  if (!schoolId) return ApiResponse.badRequest('School ID is required');

  const body = await request.json();
  const validation = subjectSchema.safeParse(body);
  if (!validation.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of validation.error.issues) {
      const path = issue.path.join('.');
      if (!errors[path]) errors[path] = [];
      errors[path]!.push(issue.message);
    }
    return ApiResponse.badRequest('Validation failed', errors);
  }

  const repo = new SubjectRepository();
  const subject = await repo.create({ ...validation.data, schoolId });

  return ApiResponse.created(subject);
});
