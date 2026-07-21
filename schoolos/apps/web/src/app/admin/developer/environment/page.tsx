'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { Database, Layers, Mail, RotateCcw, Globe, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

const sections = [
  {
    title: 'General',
    icon: Globe,
    vars: [
      { key: 'APP_NAME', value: 'SchoolOS' },
      { key: 'APP_ENV', value: 'production' },
      { key: 'APP_DEBUG', value: 'false' },
      { key: 'APP_URL', value: 'https://schoolos.dev' },
    ],
  },
  {
    title: 'Database',
    icon: Database,
    vars: [
      { key: 'DB_CONNECTION', value: 'pgsql' },
      { key: 'DB_HOST', value: 'db.internal.schoolos.dev' },
      { key: 'DB_PORT', value: '5432' },
      { key: 'DB_DATABASE', value: 'schoolos_prod' },
      { key: 'DB_USERNAME', value: 'schoolos_app' },
    ],
  },
  {
    title: 'Cache',
    icon: Layers,
    vars: [
      { key: 'REDIS_HOST', value: 'redis.internal.schoolos.dev' },
      { key: 'REDIS_PORT', value: '6379' },
      { key: 'REDIS_PASSWORD', value: '••••••••••••' },
      { key: 'CACHE_DRIVER', value: 'redis' },
      { key: 'CACHE_PREFIX', value: 'schoolos_' },
    ],
  },
  {
    title: 'Mail',
    icon: Mail,
    vars: [
      { key: 'MAIL_DRIVER', value: 'smtp' },
      { key: 'MAIL_HOST', value: 'smtp.sendgrid.net' },
      { key: 'MAIL_PORT', value: '587' },
      { key: 'MAIL_FROM_ADDRESS', value: 'noreply@schoolos.dev' },
      { key: 'MAIL_FROM_NAME', value: 'SchoolOS' },
    ],
  },
  {
    title: 'Queue',
    icon: RotateCcw,
    vars: [
      { key: 'QUEUE_CONNECTION', value: 'redis' },
      { key: 'QUEUE_DEFAULT', value: 'default' },
      { key: 'QUEUE_RETRY_AFTER', value: '90' },
      { key: 'QUEUE_BLOCK_FOR', value: '5' },
      { key: 'HORIZON_PREFIX', value: 'schoolos_horizon' },
    ],
  },
];

export default function EnvironmentPage() {
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  const toggleReveal = (key: string) => {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Developer Environment</h1>
        <p className="text-sm text-muted-foreground mt-1">Environment configuration for developers</p>
      </div>

      {sections.map((section) => {
        const SectionIcon = section.icon;
        return (
          <Card key={section.title}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <SectionIcon className="h-5 w-5 text-primary" />
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {section.vars.map((env) => (
                  <div key={env.key} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex-1">
                      <p className="text-sm font-mono font-medium">{env.key}</p>
                      <p className="text-sm font-mono text-muted-foreground">
                        {env.key.includes('PASSWORD') && !revealed.has(env.key)
                          ? '••••••••••••'
                          : env.value}
                      </p>
                    </div>
                    {env.key.includes('PASSWORD') && (
                      <button onClick={() => toggleReveal(env.key)} className="text-muted-foreground hover:text-foreground p-1">
                        {revealed.has(env.key) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
