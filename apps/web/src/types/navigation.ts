import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  label?: string | number;
  badge?: string | number;
  disabled?: boolean;
  external?: boolean;
  subItems?: NavItem[];
}

export interface NavGroup {
  title: string;
  icon?: LucideIcon;
  items: NavItem[];
}

export interface RouteConfig {
  title: string;
  description: string;
  icon?: LucideIcon;
  breadcrumbs: { label: string; href?: string }[];
}
