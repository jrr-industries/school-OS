import { NextRequest } from 'next/server';
import { apiHandler } from '@schoolos/api';
import { AuthService } from '@schoolos/auth';
import { ApiResponse } from '@schoolos/api';

export const POST = apiHandler(async (request: NextRequest) => {
  const { refreshToken } = await request.json();

  if (!refreshToken) {
    return ApiResponse.badRequest('Refresh token is required');
  }

  try {
    const authService = new AuthService();
    const result = await authService.refreshSession(refreshToken);
    return ApiResponse.success(result);
  } catch {
    return ApiResponse.unauthorized('Invalid or expired refresh token');
  }
});
