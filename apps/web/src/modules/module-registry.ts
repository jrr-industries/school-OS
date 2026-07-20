'use client';

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

/** A map of module paths to their lazy-loaded components */
export const moduleRegistry: Record<string, ReturnType<typeof dynamic>> = {
  '/dashboard': dynamic(() => import('./dashboard-module').then((m) => ({ default: m.DashboardModule })), {
    ssr: false,
  }),
  '/students': dynamic(() => import('./students-module').then((m) => ({ default: m.StudentsModule })), {
    ssr: false,
  }),
  '/teachers': dynamic(() => import('./teachers-module').then((m) => ({ default: m.TeachersModule })), {
    ssr: false,
  }),
  '/schools': dynamic(() => import('./schools-module').then((m) => ({ default: m.SchoolsModule })), {
    ssr: false,
  }),
  '/attendance': dynamic(() => import('./attendance-module').then((m) => ({ default: m.AttendanceModule })), {
    ssr: false,
  }),
  '/parents': dynamic(() => import('./parents-module').then((m) => ({ default: m.ParentsModule })), {
    ssr: false,
  }),
};

/** Modules that should be prefetched after initial dashboard load */
export const prefetchModules: string[] = [
  '/students',
  '/attendance',
  '/teachers',
  '/schools',
];

/** Get the module component for a given path, or null if not registered */
export function getModuleForPath(path: string): ReturnType<typeof dynamic> | null {
  if (moduleRegistry[path]) return moduleRegistry[path];

  // Try parent path match (e.g., /examinations/schedule -> /examinations)
  const parentPath = '/' + path.split('/').filter(Boolean).slice(0, 1).join('/');
  if (parentPath !== '/' && moduleRegistry[parentPath]) return moduleRegistry[parentPath];

  return null;
}
