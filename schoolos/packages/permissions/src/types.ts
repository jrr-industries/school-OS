export interface PermissionCheck {
  action: string;
  resource: string;
  field?: string;
}

export interface PermissionOptions {
  requireAll?: boolean;
  allowSuperAdmin?: boolean;
  allowOwner?: boolean;
}
