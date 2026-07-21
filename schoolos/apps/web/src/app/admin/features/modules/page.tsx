'use client';

import { Card, CardContent } from '@schoolos/ui';
import { CheckCircle2, XCircle, School, CalendarDays, GraduationCap, BookOpen, Clock, Library, Bus, Utensils, Hospital } from 'lucide-react';

interface Module {
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'beta';
  version: string;
  icon: React.ComponentType<{ className?: string }>;
}

const modules: Module[] = [
  { name: 'School Management', description: 'Core school profile, branding, and settings', status: 'active', version: '2.1.0', icon: School },
  { name: 'Attendance', description: 'Student attendance tracking and reports', status: 'active', version: '1.8.3', icon: CalendarDays },
  { name: 'Grades & Assessments', description: 'Grade book, assignments, and report cards', status: 'active', version: '2.0.1', icon: GraduationCap },
  { name: 'Timetable', description: 'Class scheduling and timetable management', status: 'active', version: '1.9.0', icon: Clock },
  { name: 'Library Management', description: 'Library catalog, check-in/out system', status: 'active', version: '1.5.2', icon: Library },
  { name: 'Transportation', description: 'Bus route planning and tracking', status: 'beta', version: '0.9.0', icon: Bus },
  { name: 'Cafeteria', description: 'Meal planning and cafeteria management', status: 'inactive', version: '0.8.1', icon: Utensils },
  { name: 'Health Records', description: 'Student health records and immunization tracking', status: 'inactive', version: '0.7.0', icon: Hospital },
  { name: 'Parent Portal', description: 'Parent communication and progress tracking', status: 'active', version: '1.6.4', icon: BookOpen },
];

const statusStyles: Record<string, string> = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  inactive: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400',
  beta: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
};

export default function ModulesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Modules</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage platform modules</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((mod) => {
          const Icon = mod.icon;
          return (
            <Card key={mod.name}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className={'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ' + statusStyles[mod.status]}>
                    {mod.status === 'active' ? <CheckCircle2 className="h-3 w-3 mr-1" /> : mod.status === 'beta' ? <Clock className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                    {mod.status}
                  </span>
                </div>
                <h3 className="mt-3 font-semibold">{mod.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{mod.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">v{mod.version}</span>
                  <button className="text-xs font-medium text-primary hover:underline">Configure</button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
