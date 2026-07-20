import { ROLE_HIERARCHY } from '@schoolos/constants';
import type { RoleSlug } from '@schoolos/constants';
import type { PermissionCheck, PermissionOptions } from '../types';

export class PermissionService {
  hasPermission(
    userPermissions: string[],
    requiredPermission: string,
  ): boolean {
    return userPermissions.includes(requiredPermission);
  }

  hasAllPermissions(
    userPermissions: string[],
    requiredPermissions: string[],
  ): boolean {
    return requiredPermissions.every((p) => userPermissions.includes(p));
  }

  hasAnyPermission(
    userPermissions: string[],
    requiredPermissions: string[],
  ): boolean {
    return requiredPermissions.some((p) => userPermissions.includes(p));
  }

  checkAccess(
    userPermissions: string[],
    userRoles: string[],
    check: PermissionCheck,
    options: PermissionOptions = {},
  ): boolean {
    const { requireAll = false, allowSuperAdmin = true, allowOwner = false } = options;

    if (allowSuperAdmin && userRoles.includes('super_admin')) {
      return true;
    }

    if (allowOwner && userRoles.includes('school_owner')) {
      return true;
    }

    const permissionString = `${check.resource}:${check.action}`;

    if (requireAll) {
      return this.hasAllPermissions(userPermissions, [permissionString]);
    }

    return this.hasPermission(userPermissions, permissionString);
  }

  hasRole(userRoles: string[], requiredRole: RoleSlug): boolean {
    return userRoles.includes(requiredRole);
  }

  hasMinimumRole(userRoles: string[], minimumRole: RoleSlug): boolean {
    const userMaxLevel = Math.max(
      ...userRoles.map((r) => ROLE_HIERARCHY[r as RoleSlug] ?? 0),
    );
    const requiredLevel = ROLE_HIERARCHY[minimumRole] ?? 0;
    return userMaxLevel >= requiredLevel;
  }

  filterByPermission<T extends Record<string, unknown>>(
    items: T[],
    userPermissions: string[],
    permissionMap: (item: T) => string,
  ): T[] {
    return items.filter((item) =>
      this.hasPermission(userPermissions, permissionMap(item)),
    );
  }

  canManageRole(
    userRoles: string[],
    targetRoleSlug: RoleSlug,
  ): boolean {
    const userMaxLevel = Math.max(
      ...userRoles.map((r) => ROLE_HIERARCHY[r as RoleSlug] ?? 0),
    );
    const targetLevel = ROLE_HIERARCHY[targetRoleSlug] ?? 0;
    return userMaxLevel > targetLevel;
  }
}
