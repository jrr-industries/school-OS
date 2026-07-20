import { NextRequest } from 'next/server';
import { apiHandler } from '@schoolos/api';
import { AuthService } from '@schoolos/auth';
import { ApiResponse } from '@schoolos/api';

export const POST = apiHandler(async (request: NextRequest) => {
  const body = await request.json().catch(() => ({}));
  const { userId, sessionId } = body;

  if (!userId) {
    return ApiResponse.badRequest('User ID is required');
  }

  try {
    const authService = new AuthService();
    await authService.logout(userId, sessionId);
    return ApiResponse.success({ message: 'Logged out successfully' });
  } catch {
    return ApiResponse.internal('Failed to logout');
  }
});
