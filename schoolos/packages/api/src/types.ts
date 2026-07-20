import type { NextRequest } from 'next/server';
import type { z } from 'zod';

export interface AuthenticatedRequest extends NextRequest {
  userId: string;
  schoolId: string;
  userEmail: string;
  userName: string;
  userRoles: string[];
  userPermissions: string[];
  sessionId: string;
}

export type AuthenticatedHandler<T = unknown> = (
  request: AuthenticatedRequest,
  context: { params: Record<string, string> },
) => Promise<Response>;

export interface ApiHandlerOptions {
  requireAuth?: boolean;
  requireSchool?: boolean;
  permissions?: string[];
  roles?: string[];
  rateLimit?: {
    limit: number;
    windowMs: number;
  };
  validate?: {
    body?: z.ZodSchema;
    query?: z.ZodSchema;
    params?: z.ZodSchema;
  };
}
