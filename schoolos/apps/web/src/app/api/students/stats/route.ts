import { NextRequest } from 'next/server';
import { apiHandler, ApiResponse } from '@schoolos/api';
import { StudentService } from '@/features/students/services/student.service';

export const GET = apiHandler(async (request: NextRequest) => {
  const url = new URL(request.url);
  const schoolId = url.searchParams.get('schoolId');
  if (!schoolId) return ApiResponse.badRequest('School ID is required');

  const service = new StudentService();
  const stats = await service.getStats(schoolId);

  return ApiResponse.success(stats);
});
