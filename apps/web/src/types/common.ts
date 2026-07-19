import type { ReactNode } from 'react';

export interface BaseProps {
  className?: string;
  children?: ReactNode;
}

export interface PageProps {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export type Theme = 'light' | 'dark' | 'system';

export type Size = 'sm' | 'md' | 'lg';
export type Variant = 'default' | 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost';
