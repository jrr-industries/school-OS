export interface BaseEntity {
  id: string;
  schoolId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  version: number;
}

export interface SoftDeletable {
  deletedAt: string | null;
}

export interface Versionable {
  version: number;
}

export interface Auditable {
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TenantScoped {
  schoolId: string;
}
