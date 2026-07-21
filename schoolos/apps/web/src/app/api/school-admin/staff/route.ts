import { apiHandler, ApiResponse } from '@schoolos/api';

export const GET = apiHandler(async () => {
  try {
    return ApiResponse.success({
      data: [],
      meta: { page: 1, limit: 10, total: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false },
    });
  } catch {
    return ApiResponse.error(500, 'INTERNAL_ERROR', 'Failed to fetch staff');
  }
});

export const POST = apiHandler(async (request) => {
  try {
    const body = await request.json();
    return ApiResponse.created({ id: 'new-id', ...body });
  } catch {
    return ApiResponse.error(500, 'INTERNAL_ERROR', 'Failed to create staff');
  }
});
