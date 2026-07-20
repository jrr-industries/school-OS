import { useAuthStore } from './stores/auth.store';

export function usePermission(requiredPermission: string): boolean {
  return useAuthStore((state) => state.hasPermission(requiredPermission));
}

export function useRole(requiredRole: string): boolean {
  return useAuthStore((state) => state.hasRole(requiredRole));
}

export function usePermissions(requiredPermissions: string[]): {
  all: boolean;
  some: boolean;
} {
  const hasPermission = useAuthStore((state) => state.hasPermission);

  return {
    all: requiredPermissions.every((p) => hasPermission(p)),
    some: requiredPermissions.some((p) => hasPermission(p)),
  };
}
