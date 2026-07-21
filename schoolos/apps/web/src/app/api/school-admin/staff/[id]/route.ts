import { apiHandler, ApiResponse } from '@schoolos/api';

export const GET = apiHandler(async (_request, context) => {
  try {
    const { id } = context.params;
    return ApiResponse.success({ id });
  } catch {
    return ApiResponse.error(404, 'NOT_FOUND', 'Staff not found');
  }
});

export const PUT = apiHandler(async (request, context) => {
  try {
    const { id } = context.params;
    const body = await request.json();
    return ApiResponse.success({ id, ...body });
  } catch {
    return ApiResponse.error(500, 'INTERNAL_ERROR', 'Failed to update staff');
  }
});

export const DELETE = apiHandler(async (_request, context) => {
  const { id } = context.params;
  return ApiResponse.success({ message: `Staff ${id} deleted successfully` });
});
