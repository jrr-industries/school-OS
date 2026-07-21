'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { Wrench, Database, Layers, RotateCcw } from 'lucide-react';

interface EnvVar {
  key: string;
  value: string;
  sensitive?: boolean;
}

interface EnvSection {
  title: string;
  icon: typeof Wrench;
  vars: EnvVar[];
}

const sections: EnvSection[] = [
  {
    title: 'Application',
    icon: Wrench,
    vars: [
      { key: 'APP_ENV', value: 'production' },
      { key: 'APP_URL', value: 'https://app.schoolos.dev' },
      { key: 'APP_NAME', value: 'SchoolOS' },
      { key: 'APP_DEBUG', value: 'false' },
    ],
  },
  {
    title: 'Database',
    icon: Database,
    vars: [
      { key: 'DB_CONNECTION', value: 'postgresql' },
      { key: 'DB_HOST', value: 'db.schoolos.internal' },
      { key: 'DB_PORT', value: '5432' },
      { key: 'DB_DATABASE', value: 'schoolos_prod' },
      { key: 'DB_USERNAME', value: 'schoolos_admin' },
      { key: 'DB_PASSWORD', value: '••••••••••••••••', sensitive: true },
    ],
  },
  {
    title: 'Cache',
    icon: Layers,
    vars: [
      { key: 'CACHE_DRIVER', value: 'redis' },
      { key: 'REDIS_HOST', value: 'redis.schoolos.internal' },
      { key: 'REDIS_PORT', value: '6379' },
      { key: 'REDIS_PASSWORD', value: '••••••••••••••••', sensitive: true },
    ],
  },
  {
    title: 'Queue',
    icon: RotateCcw,
    vars: [
      { key: 'QUEUE_CONNECTION', value: 'redis' },
      { key: 'QUEUE_DEFAULT', value: 'default' },
      { key: 'QUEUE_RETRY_AFTER', value: '90' },
      { key: 'QUEUE_WORKER_TIMEOUT', value: '60' },
    ],
  },
];

export default function EnvironmentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Environment Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">View and manage environment configuration</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.title}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Icon className="h-5 w-5 text-primary" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-0 divide-y divide-slate-100 dark:divide-slate-800">
                  {section.vars.map((env) => (
                    <div key={env.key} className="flex items-center justify-between py-2.5 text-sm">
                      <span className="font-mono text-xs font-medium text-muted-foreground">{env.key}</span>
                      <span className={`font-mono text-xs ${env.sensitive ? 'tracking-wider' : ''}`}>
                        {env.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Environment Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              These values are read-only and are set via the server environment variables.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              To update these values, modify the .env file on the server and restart the application.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              Sensitive values are masked for security purposes.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
