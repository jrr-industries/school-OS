import { NextRequest } from 'next/server';
import { apiHandler, ApiResponse } from '@schoolos/api';
import { SectionRepository } from '@schoolos/database';
import { sectionSchema } from '@schoolos/validation';

export const GET = apiHandler(async (request: NextRequest) => {
  const url = new URL(request.url);
  const classId = url.searchParams.get('classId');
  if (!classId) return ApiResponse.badRequest('Class ID is required');

  const repo = new SectionRepository();
  const sections = await repo.findByClass(classId);

  return ApiResponse.success(sections);
});

export const POST = apiHandler(async (request: NextRequest) => {
  const url = new URL(request.url);
  const schoolId = url.searchParams.get('schoolId');
  if (!schoolId) return ApiResponse.badRequest('School ID is required');

  const body = await request.json();
  const validation = sectionSchema.safeParse(body);
  if (!validation.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of validation.error.issues) {
      const path = issue.path.join('.');
      if (!errors[path]) errors[path] = [];
      errors[path]!.push(issue.message);
    }
    return ApiResponse.badRequest('Validation failed', errors);
  }

  const repo = new SectionRepository();
  const section = await repo.create({ ...validation.data, schoolId });

  return ApiResponse.created(section);
});
