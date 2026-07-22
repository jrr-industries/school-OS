'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { Layers, Zap, HardDrive, Key, Trash2, Search, RefreshCw, Loader2, AlertCircle } from 'lucide-react';

const stats = [
  { label: 'Hit Rate', value: '94.7%', icon: Zap, color: 'text-emerald-500' },
  { label: 'Memory Usage', value: '1.2 GB / 4 GB', icon: HardDrive, color: 'text-blue-500' },
  { label: 'Keys Count', value: '234,567', icon: Key, color: 'text-violet-500' },
  { label: 'Expired Keys (24h)', value: '12,340', icon: RefreshCw, color: 'text-amber-500' },
];

const namespaces = [
  { name: 'views', keys: 89234, memory: '486 MB', hits: '98.2%' },
  { name: 'data', keys: 45678, memory: '342 MB', hits: '92.5%' },
  { name: 'session', keys: 56789, memory: '234 MB', hits: '96.1%' },
  { name: 'api', keys: 23456, memory: '89 MB', hits: '91.8%' },
  { name: 'config', keys: 1234, memory: '12 MB', hits: '99.9%' },
  { name: 'rate_limits', keys: 3456, memory: '18 MB', hits: '87.3%' },
];

const mockKeys = [
  { key: 'views:dashboard:42', ttl: '1,234s', size: '2.4 KB', namespace: 'views' },
  { key: 'data:school:123', ttl: '3,567s', size: '12.8 KB', namespace: 'data' },
  { key: 'session:abc123', ttl: '1,800s', size: '0.8 KB', namespace: 'session' },
  { key: 'api:users:latest', ttl: '300s', size: '4.2 KB', namespace: 'api' },
  { key: 'config:theme', ttl: '86,400s', size: '1.1 KB', namespace: 'config' },
];

export default function CachePage() {
  const [cleared, setCleared] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(r => setTimeout(r, 500));
      setLoading(false);
    } catch {
      setError('Failed to load');
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const clearNamespace = (name: string) => {
    setCleared((prev) => [...prev, name]);
    setTimeout(() => setCleared((prev) => prev.filter((n) => n !== name)), 2000);
  };

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
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Cache Management</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage and monitor cache performance</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className={`rounded-lg ${stat.color.replace('text-', 'bg-')}/10 p-2 w-fit`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <p className="mt-3 text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            Cache Namespaces
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {namespaces.map((ns) => (
            <div key={ns.name} className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex-1">
                <p className="font-medium">{ns.name}</p>
                <p className="text-xs text-muted-foreground">{ns.keys.toLocaleString()} keys · {ns.memory} · {ns.hits} hit rate</p>
              </div>
              <button
                onClick={() => clearNamespace(ns.name)}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  cleared.includes(ns.name) ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50'
                }`}
              >
                <Trash2 className="h-3 w-3" />
                {cleared.includes(ns.name) ? 'Cleared!' : 'Clear'}
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Cache Keys Browser
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input type="text" placeholder="Search cache keys..." className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium text-muted-foreground">Key</th>
                  <th className="pb-3 font-medium text-muted-foreground">TTL</th>
                  <th className="pb-3 font-medium text-muted-foreground">Size</th>
                  <th className="pb-3 font-medium text-muted-foreground">Namespace</th>
                </tr>
              </thead>
              <tbody>
                {mockKeys.map((item) => (
                  <tr key={item.key} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="py-3 font-mono text-xs">{item.key}</td>
                    <td className="py-3 text-muted-foreground">{item.ttl}</td>
                    <td className="py-3">{item.size}</td>
                    <td className="py-3">
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium dark:bg-slate-800">{item.namespace}</span>
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
