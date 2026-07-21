'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

const routeLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  students: 'Students',
  'students/new': 'Add Student',
  parents: 'Parents',
  teachers: 'Teachers',
  classes: 'Classes',
  subjects: 'Subjects',
  attendance: 'Attendance',
  timetable: 'Timetable',
  homework: 'Homework',
  assignments: 'Assignments',
  examinations: 'Examinations',
  results: 'Results',
  fees: 'Fees',
  accounting: 'Accounting',
  transport: 'Transport',
  library: 'Library',
  hostel: 'Hostel',
  inventory: 'Inventory',
  communication: 'Communication',
  calendar: 'Calendar',
  events: 'Events',
  reports: 'Reports',
  analytics: 'Analytics',
  settings: 'Settings',
  support: 'Support',
  admissions: 'Admissions',
  employees: 'Employees',
  academics: 'Academics',
};

export function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <li>
          <Link
            href="/dashboard"
            className="flex items-center gap-1 rounded-md p-1 transition-colors hover:text-foreground"
          >
            <Home className="h-3.5 w-3.5" />
          </Link>
        </li>
        {segments.map((segment, index) => {
          const href = '/' + segments.slice(0, index + 1).join('/');
          const label = routeLabels[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1);
          const isLast = index === segments.length - 1;

          return (
            <li key={segment} className="flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5" />
              {isLast ? (
                <span className="font-medium text-foreground">{label}</span>
              ) : (
                <Link
                  href={href}
                  className="rounded-md p-1 transition-colors hover:text-foreground"
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
