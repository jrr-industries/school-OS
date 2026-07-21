'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { Flag, ToggleLeft, ToggleRight, Search } from 'lucide-react';

interface FeatureFlag {
  name: string;
  description: string;
  enabled: boolean;
  environment: string;
  category: string;
}

const initialFlags: FeatureFlag[] = [
  { name: 'new-onboarding', description: 'New school onboarding flow', enabled: true, environment: 'production', category: 'General' },
  { name: 'dark-mode', description: 'Dark mode for all users', enabled: true, environment: 'production', category: 'General' },
  { name: 'multi-language', description: 'Multi-language support', enabled: false, environment: 'staging', category: 'General' },
  { name: 'auto-invoicing', description: 'Automated invoice generation', enabled: true, environment: 'production', category: 'Billing' },
  { name: 'usage-billing', description: 'Usage-based billing tiers', enabled: false, environment: 'development', category: 'Billing' },
  { name: 'in-app-chat', description: 'In-app messaging between users', enabled: true, environment: 'production', category: 'Communication' },
  { name: 'email-digest', description: 'Weekly email digest', enabled: false, environment: 'staging', category: 'Communication' },
  { name: 'advanced-analytics', description: 'Advanced analytics dashboard', enabled: true, environment: 'production', category: 'Analytics' },
  { name: 'export-reports', description: 'Export reports as CSV/PDF', enabled: true, environment: 'production', category: 'Analytics' },
  { name: 'sso-login', description: 'Single sign-on integration', enabled: false, environment: 'development', category: 'Integrations' },
  { name: 'webhook-retries', description: 'Automatic webhook retry on failure', enabled: true, environment: 'production', category: 'Integrations' },
  { name: 'api-v2', description: 'API v2 endpoints', enabled: false, environment: 'staging', category: 'Integrations' },
];

const categories = ['General', 'Billing', 'Communication', 'Analytics', 'Integrations'] as const;

export default function FlagsPage() {
  const [flags, setFlags] = useState<FeatureFlag[]>(initialFlags);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const toggleFlag = (name: string) => {
    setFlags((prev) => prev.map((f) => f.name === name ? { ...f, enabled: !f.enabled } : f));
  };

  const filtered = flags.filter((f) => {
    if (filter !== 'all' && f.category.toLowerCase() !== filter) return false;
    if (search && !f.name.toLowerCase().includes(search.toLowerCase()) && !f.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Feature Flags</h1>
        <p className="text-sm text-muted-foreground mt-1">Toggle platform features on/off</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input type="text" placeholder="Search flags..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
        </div>
        <div className="flex gap-1">
          {['all', ...categories].map((cat) => (
            <button key={cat} onClick={() => setFilter(cat.toLowerCase())} className={'rounded-md px-3 py-2 text-xs font-medium transition-colors ' + (filter === cat.toLowerCase() ? 'bg-primary text-primary-foreground' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700')}>
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Flag className="h-5 w-5 text-primary" />
            Feature Flags
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium text-muted-foreground">Feature Name</th>
                  <th className="pb-3 font-medium text-muted-foreground">Description</th>
                  <th className="pb-3 font-medium text-muted-foreground">Status</th>
                  <th className="pb-3 font-medium text-muted-foreground">Environment</th>
                  <th className="pb-3 font-medium text-muted-foreground">Toggle</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((flag) => (
                  <tr key={flag.name} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="py-3 font-medium">{flag.name}</td>
                    <td className="py-3 text-muted-foreground">{flag.description}</td>
                    <td className="py-3">
                      <span className={'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ' + (flag.enabled ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400')}>
                        {flag.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400'}>
                        {flag.environment}
                      </span>
                    </td>
                    <td className="py-3">
                      <button onClick={() => toggleFlag(flag.name)} className="rounded p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                        {flag.enabled ? <ToggleRight className="h-5 w-5 text-emerald-500" /> : <ToggleLeft className="h-5 w-5 text-muted-foreground" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
