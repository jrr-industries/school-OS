'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { Gauge, Shield, AlertTriangle, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

interface RateLimit {
  id: string;
  endpoint: string;
  requestsPerMin: number;
  burst: number;
  appliedTo: string;
  status: 'active' | 'exceeded' | 'disabled';
  currentUsage: number;
}

const mockRateLimits: RateLimit[] = [
  { id: '1', endpoint: '/api/v1/auth/login', requestsPerMin: 30, burst: 50, appliedTo: 'All Users', status: 'active', currentUsage: 12 },
  { id: '2', endpoint: '/api/v1/students', requestsPerMin: 100, burst: 200, appliedTo: 'API Keys', status: 'active', currentUsage: 45 },
  { id: '3', endpoint: '/api/v1/schools', requestsPerMin: 60, burst: 100, appliedTo: 'API Keys', status: 'active', currentUsage: 22 },
  { id: '4', endpoint: '/api/v1/grades', requestsPerMin: 200, burst: 300, appliedTo: 'API Keys', status: 'exceeded', currentUsage: 210 },
  { id: '5', endpoint: '/api/v1/analytics/reports', requestsPerMin: 20, burst: 30, appliedTo: 'Admin Users', status: 'active', currentUsage: 5 },
  { id: '6', endpoint: '/api/v1/payments', requestsPerMin: 50, burst: 75, appliedTo: 'API Keys', status: 'disabled', currentUsage: 0 },
  { id: '7', endpoint: '/api/v1/attendance', requestsPerMin: 150, burst: 250, appliedTo: 'API Keys', status: 'active', currentUsage: 89 },
  { id: '8', endpoint: '/api/v1/users/import', requestsPerMin: 5, burst: 10, appliedTo: 'Admin Users', status: 'active', currentUsage: 1 },
];

export default function RateLimitsPage() {
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

  const totalUsage = mockRateLimits.reduce((a, r) => a + r.currentUsage, 0);
  const totalLimit = mockRateLimits.reduce((a, r) => a + r.requestsPerMin, 0);
  const exceededCount = mockRateLimits.filter(r => r.status === 'exceeded').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Rate Limits</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure API rate limiting rules</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="p-4">
            <div className="rounded-lg bg-primary/10 p-2 w-fit">
              <Gauge className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-3 text-2xl font-bold">{totalUsage.toLocaleString()} / {totalLimit.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Current Total Requests/min</p>
            <div className="mt-2 h-2 rounded-full bg-slate-100 dark:bg-slate-800">
              <div className="h-2 rounded-full bg-primary" style={{ width: `${(totalUsage / totalLimit) * 100}%` }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="rounded-lg bg-primary/10 p-2 w-fit">
              <AlertTriangle className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-3 text-2xl font-bold">{exceededCount}</p>
            <p className="text-sm text-muted-foreground">Endpoints Exceeding Limits</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Rate Limiting Rules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Endpoint</th>
                  <th className="text-right font-medium text-muted-foreground pb-3 pr-4">Requests/min</th>
                  <th className="text-right font-medium text-muted-foreground pb-3 pr-4">Burst</th>
                  <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Applied To</th>
                  <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Status</th>
                  <th className="text-left font-medium text-muted-foreground pb-3">Usage</th>
                </tr>
              </thead>
              <tbody>
                {mockRateLimits.map((r) => (
                  <tr key={r.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <td className="py-3 pr-4 font-mono text-xs font-medium">{r.endpoint}</td>
                    <td className="py-3 pr-4 text-right">{r.requestsPerMin}</td>
                    <td className="py-3 pr-4 text-right">{r.burst}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{r.appliedTo}</td>
                    <td className="py-3 pr-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                        r.status === 'active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' :
                        r.status === 'exceeded' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200'
                      }`}>
                        {r.status === 'active' ? <CheckCircle2 className="h-3 w-3" /> :
                         r.status === 'exceeded' ? <AlertTriangle className="h-3 w-3" /> : null}
                        {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-16 rounded-full bg-slate-100 dark:bg-slate-800">
                          <div className={`h-2 rounded-full ${r.currentUsage > r.requestsPerMin ? 'bg-red-500' : 'bg-primary'}`} style={{ width: `${Math.min((r.currentUsage / r.requestsPerMin) * 100, 100)}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground">{r.currentUsage}/{r.requestsPerMin}</span>
                      </div>
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
