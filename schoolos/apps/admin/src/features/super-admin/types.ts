import type { LucideIcon } from 'lucide-react';

export type SuperAdminPageKind =
  | 'dashboard'
  | 'collection'
  | 'create'
  | 'approval'
  | 'report'
  | 'operations'
  | 'settings'
  | 'security'
  | 'developer'
  | 'logout';

export interface SuperAdminNavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  permission?: string;
  kind: SuperAdminPageKind;
  searchable?: boolean;
  filters?: string[];
  primaryAction?: string;
}

export interface SuperAdminNavSection {
  label: string;
  icon: LucideIcon;
  basePath?: string;
  permission?: string;
  items: SuperAdminNavItem[];
}

export interface SuperAdminPageConfig extends SuperAdminNavItem {
  sectionLabel: string;
  sectionPath?: string;
  description: string;
  breadcrumbs: Array<{ label: string; href?: string }>;
}
