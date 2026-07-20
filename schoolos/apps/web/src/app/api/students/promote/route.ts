import { NextRequest } from 'next/server';
import { apiHandler, ApiResponse } from '@schoolos/api';
import { StudentService } from '@/features/students/services/student.service';
import { promoteStudentSchema } from '@schoolos/validation';

export const POST = apiHandler(async (request: NextRequest) => {
  const url = new URL(request.url);
  const schoolId = url.searchParams.get('schoolId');
  if (!schoolId) return ApiResponse.badRequest('School ID is required');

  const body = await request.json();
  const validation = promoteStudentSchema.safeParse(body);
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
  const result = await service.promote(validation.data, schoolId, 'system');

  return ApiResponse.success(result);
});
