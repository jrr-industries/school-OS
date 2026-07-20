import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma/client';
import type { UserRole } from '@/generated/prisma';

export interface CurrentUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  schoolId: string | null;
}

/**
 * Get the currently authenticated user.
 * For Phase 1, returns a default Super Admin since auth is not yet implemented.
 * This will be replaced with proper session/JWT validation.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    // Phase 1: Return default super admin for development
    // TODO: Replace with proper auth from JWT/session
    const defaultAdmin = await prisma.user.findFirst({
      where: { role: 'SUPER_ADMIN', isActive: true },
    });

    if (defaultAdmin) {
      return {
        id: defaultAdmin.id,
        email: defaultAdmin.email,
        name: defaultAdmin.name || 'Super Admin',
        role: defaultAdmin.role,
        schoolId: defaultAdmin.schoolId,
      };
    }

    // If no admin exists yet, return a fallback for seeding
    return null;
  } catch {
    return null;
  }
}

export async function requireAuth(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}
