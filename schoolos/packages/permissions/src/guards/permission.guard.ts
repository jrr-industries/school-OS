import { PermissionService } from '../services/permission.service';
import type { PermissionCheck, PermissionOptions } from '../types';

export class PermissionGuard {
  private readonly permissionService: PermissionService;

  constructor() {
    this.permissionService = new PermissionService();
  }

  authorize(
    userPermissions: string[],
    userRoles: string[],
    check: PermissionCheck,
    options: PermissionOptions = {},
  ): boolean {
    return this.permissionService.checkAccess(
      userPermissions,
      userRoles,
      check,
      options,
    );
  }

  authorizeAll(
    userPermissions: string[],
    userRoles: string[],
    checks: PermissionCheck[],
    options: PermissionOptions = {},
  ): boolean {
    return checks.every((check) =>
      this.authorize(userPermissions, userRoles, check, options),
    );
  }

  authorizeAny(
    userPermissions: string[],
    userRoles: string[],
    checks: PermissionCheck[],
    options: PermissionOptions = {},
  ): boolean {
    return checks.some((check) =>
      this.authorize(userPermissions, userRoles, check, options),
    );
  }

  authorizeRole(
    userRoles: string[],
    allowedRoles: string[],
  ): boolean {
    return userRoles.some((role) => allowedRoles.includes(role));
  }
}
