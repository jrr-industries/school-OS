'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { Wrench, Database, Layers, RotateCcw, Loader2, AlertCircle } from 'lucide-react';

interface EnvVar { key: string; value: string; sensitive?: boolean; }
interface EnvSection { title: string; icon: typeof Wrench; vars: EnvVar[]; }

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/settings?group=environment');
      const json = await res.json();
      if (!json.success) setError(json.error || 'Failed to load');
      setLoading(false);
    } catch {
      setError('Failed to fetch');
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <AlertCircle className="h-8 w-8 text-red-500" />
      <p className="text-sm text-muted-foreground">{error}</p>
      <button onClick={fetchData} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Retry</button>
    </div>
  );

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
                      <span className={`font-mono text-xs ${env.sensitive ? 'tracking-wider' : ''}`}>{env.value}</span>
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
