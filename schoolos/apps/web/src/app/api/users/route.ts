import { NextRequest } from 'next/server';
import { apiHandler } from '@schoolos/api';
import { ApiResponse } from '@schoolos/api';
import { UserRepository } from '@schoolos/database';

export const GET = apiHandler(async (request: NextRequest) => {
  const url = new URL(request.url);
  const schoolId = url.searchParams.get('schoolId');

  if (!schoolId) {
    return ApiResponse.badRequest('School ID is required');
  }

  const userRepository = new UserRepository();

  const page = parseInt(url.searchParams.get('page') ?? '1');
  const limit = parseInt(url.searchParams.get('limit') ?? '10');

  const result = await userRepository.findAll(schoolId, {
    page,
    limit,
    sortBy: url.searchParams.get('sortBy') ?? 'createdAt',
    sortOrder: (url.searchParams.get('sortOrder') as 'asc' | 'desc') ?? 'desc',
    search: url.searchParams.get('search') ?? undefined,
  });

  return ApiResponse.paginated(result.data, result.meta);
});
