'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { Layers, Search, Trash2, Zap, HardDrive, Key, RefreshCw } from 'lucide-react';

const namespaces = [
  { name: 'views', keys: 89234, memory: '486 MB', hitRate: '98.2%' },
  { name: 'data', keys: 45678, memory: '342 MB', hitRate: '92.5%' },
  { name: 'session', keys: 56789, memory: '234 MB', hitRate: '96.1%' },
  { name: 'api', keys: 23456, memory: '89 MB', hitRate: '91.8%' },
  { name: 'config', keys: 1234, memory: '12 MB', hitRate: '99.9%' },
];

const cacheStats = {
  totalKeys: 216391,
  totalMemory: '1.16 GB',
  avgHitRate: '95.7%',
  uptime: '14d 7h 32m',
};

export default function DeveloperCachePage() {
  const [cleared, setCleared] = useState<string[]>([]);
  const [searchPattern, setSearchPattern] = useState('');

  const clearNamespace = (name: string) => {
    setCleared((prev) => [...prev, name]);
    setTimeout(() => setCleared((prev) => prev.filter((n) => n !== name)), 2000);
  };

  const clearAll = () => {
    const all = namespaces.map((n) => n.name);
    setCleared((prev) => [...prev, ...all]);
    setTimeout(() => setCleared([]), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Cache Manager</h1>
        <p className="text-sm text-muted-foreground mt-1">Developer cache management tools</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-blue-100/10 p-2">
                <Key className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold">{cacheStats.totalKeys.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Total Keys</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-violet-100/10 p-2">
                <HardDrive className="h-4 w-4 text-violet-600" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold">{cacheStats.totalMemory}</p>
            <p className="text-sm text-muted-foreground">Memory Used</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-emerald-100/10 p-2">
                <Zap className="h-4 w-4 text-emerald-600" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold">{cacheStats.avgHitRate}</p>
            <p className="text-sm text-muted-foreground">Avg Hit Rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-amber-100/10 p-2">
                <RefreshCw className="h-4 w-4 text-amber-600" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold">{cacheStats.uptime}</p>
            <p className="text-sm text-muted-foreground">Uptime</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            Cache Namespaces
            <button
              onClick={clearAll}
              className="ml-auto inline-flex items-center gap-1.5 rounded-md bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-200 transition-colors dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
            >
              <Trash2 className="h-3 w-3" />
              Clear All
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {namespaces.map((ns) => (
              <div key={ns.name} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex-1">
                  <p className="font-medium">{ns.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {ns.keys.toLocaleString()} keys &middot; {ns.memory} &middot; {ns.hitRate} hit rate
                  </p>
                </div>
                <button
                  onClick={() => clearNamespace(ns.name)}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    cleared.includes(ns.name)
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50'
                  }`}
                >
                  <Trash2 className="h-3 w-3" />
                  {cleared.includes(ns.name) ? 'Cleared!' : 'Clear'}
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Key Pattern Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by key pattern (e.g. views:*, data:school:*)"
              value={searchPattern}
              onChange={(e) => setSearchPattern(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          {searchPattern && (
            <div className="rounded-lg border p-4 text-center text-sm text-muted-foreground">
              Found <strong>24</strong> keys matching &quot;{searchPattern}&quot;
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
