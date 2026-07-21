import { NextRequest } from 'next/server';
import { apiHandler } from '@schoolos/api';
import { AuthService } from '@schoolos/auth';
import { loginSchema } from '@schoolos/validation';
import { ApiResponse } from '@schoolos/api';
import { Logger } from '@schoolos/utils/server';

export const POST = apiHandler(async (request: NextRequest) => {
  const body = await request.json();
  const ipAddress = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? undefined;
  const userAgent = request.headers.get('user-agent') ?? undefined;

  const validation = loginSchema.safeParse(body);
  if (!validation.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of validation.error.issues) {
      const path = issue.path.join('.');
      if (!errors[path]) errors[path] = [];
      errors[path]!.push(issue.message);
    }
    return ApiResponse.badRequest('Validation failed', errors);
  }

  try {
    const authService = new AuthService();
    const result = await authService.login({
      ...validation.data,
      ipAddress,
      userAgent,
    });

    Logger.info('auth-api', `User ${result.user.email} logged in`);

    return ApiResponse.success(result);
  } catch (error) {
    Logger.error('auth-api', 'Login failed', error as Error);
    return ApiResponse.unauthorized(
      error instanceof Error ? error.message : 'Invalid credentials',
    );
  }
});
