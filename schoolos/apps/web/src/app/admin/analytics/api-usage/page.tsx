'use client';

import { useState, useEffect, useCallback } from 'react';
import { Activity, AlertCircle, TrendingUp, Server, ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';

const mockStats = [
  { label: 'Total Requests (Today)', value: '2.4M', change: '+5.7%', trend: 'up', icon: Activity, color: 'text-blue-500' },
  { label: 'Avg Response Time', value: '94ms', change: '-12ms', trend: 'down', icon: Server, color: 'text-emerald-500' },
  { label: 'Error Rate', value: '0.34%', change: '-0.08%', trend: 'down', icon: AlertCircle, color: 'text-rose-500' },
  { label: 'Active Endpoints', value: '247', change: '+3', trend: 'up', icon: TrendingUp, color: 'text-violet-500' },
];

const popularEndpoints = [
  { path: '/api/v1/students', requests: 342000, pct: 14.3, latency: '87ms', errorRate: '0.12%' },
  { path: '/api/v1/attendance', requests: 289000, pct: 12.0, latency: '102ms', errorRate: '0.21%' },
  { path: '/api/v1/grades', requests: 256000, pct: 10.7, latency: '95ms', errorRate: '0.08%' },
  { path: '/api/v1/timetable', requests: 198000, pct: 8.3, latency: '78ms', errorRate: '0.15%' },
  { path: '/api/v1/users', requests: 175000, pct: 7.3, latency: '112ms', errorRate: '0.31%' },
  { path: '/api/v1/fees', requests: 143000, pct: 6.0, latency: '134ms', errorRate: '0.45%' },
];

const topConsumers = [
  { name: 'Springfield Elementary', requests: 185000, quota: '500K', usagePct: 37 },
  { name: 'Lincoln High School', requests: 162000, quota: '500K', usagePct: 32.4 },
  { name: 'Riverside Academy', requests: 134000, quota: '250K', usagePct: 53.6 },
  { name: 'Oakwood Preparatory', requests: 98000, quota: '250K', usagePct: 39.2 },
  { name: 'Mountain View Middle', requests: 72000, quota: '100K', usagePct: 72 },
];

export default function ApiUsagePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(r => setTimeout(r, 600));
      setLoading(false);
    } catch {
      setError('Failed to load');
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
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">API Usage</h1>
        <p className="text-sm text-muted-foreground mt-1">API consumption across the platform</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {mockStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className={`rounded-lg ${stat.color.replace('text-', 'bg-')}/10 p-2`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  {stat.trend === 'up' ? <ArrowUpRight className="h-4 w-4 text-emerald-500" /> : <ArrowDownRight className="h-4 w-4 text-green-500" />}
                </div>
                <p className="mt-3 text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className={`text-xs mt-1 ${stat.trend === 'up' ? 'text-emerald-500' : 'text-green-500'}`}>{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Popular Endpoints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-medium text-muted-foreground">Endpoint</th>
                    <th className="pb-3 font-medium text-muted-foreground text-right">Requests</th>
                    <th className="pb-3 font-medium text-muted-foreground text-right">% of Total</th>
                    <th className="pb-3 font-medium text-muted-foreground text-right">Avg Latency</th>
                    <th className="pb-3 font-medium text-muted-foreground text-right">Error Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {popularEndpoints.map((ep) => (
                    <tr key={ep.path} className="border-b last:border-0">
                      <td className="py-3 font-medium font-mono text-xs">{ep.path}</td>
                      <td className="py-3 text-right">{ep.requests.toLocaleString()}</td>
                      <td className="py-3 text-right">{ep.pct}%</td>
                      <td className="py-3 text-right">{ep.latency}</td>
                      <td className="py-3 text-right">
                        <span className={`${parseFloat(ep.errorRate) > 0.3 ? 'text-red-600' : parseFloat(ep.errorRate) > 0.15 ? 'text-amber-600' : 'text-emerald-600'}`}>{ep.errorRate}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top API Consumers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topConsumers.map((c) => (
              <div key={c.name} className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.requests.toLocaleString()} / {c.quota} requests</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-16 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className={`h-full rounded-full ${c.usagePct > 60 ? 'bg-amber-500' : c.usagePct > 40 ? 'bg-blue-500' : 'bg-emerald-500'}`} style={{ width: `${c.usagePct}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground w-8 text-right">{c.usagePct}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
