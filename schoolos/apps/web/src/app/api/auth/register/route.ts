import { NextRequest } from 'next/server';
import { apiHandler } from '@schoolos/api';
import { AuthService } from '@schoolos/auth';
import { registerSchema } from '@schoolos/validation';
import { ApiResponse } from '@schoolos/api';
import { Logger } from '@schoolos/utils';

export const POST = apiHandler(async (request: NextRequest) => {
  const body = await request.json();
  const ipAddress = request.headers.get('x-forwarded-for') ?? undefined;
  const userAgent = request.headers.get('user-agent') ?? undefined;

  const validation = registerSchema.safeParse(body);
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
    const result = await authService.register({
      ...validation.data,
      schoolId: body.schoolId,
      ipAddress,
      userAgent,
    });

    Logger.info('auth-api', `User ${result.user.email} registered`);
    return ApiResponse.created(result);
  } catch (error) {
    Logger.error('auth-api', 'Registration failed', error as Error);
    return ApiResponse.conflict(
      error instanceof Error ? error.message : 'Registration failed',
    );
  }
});
