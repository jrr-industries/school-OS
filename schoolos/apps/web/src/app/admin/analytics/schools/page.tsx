'use client';

import { useState, useEffect, useCallback } from 'react';
import { School, Building2, Globe, TrendingUp, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';

interface DashboardData {
  totalSchools: number;
  totalUsers: number;
  schoolsByStatus: {
    active: number;
    inactive: number;
    suspended: number;
    closed: number;
    trial: number;
  };
}

export default function SchoolAnalyticsPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/dashboard');
      const json = await res.json();
      if (json.success) setData(json.data);
      else setError(json.error || 'Failed to load data');
    } catch {
      setError('Failed to fetch school data');
    } finally {
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

  if (!data) return null;

  const schoolStatusData = [
    { label: 'Active', value: data.schoolsByStatus.active, color: 'bg-emerald-500' },
    { label: 'Trial', value: data.schoolsByStatus.trial, color: 'bg-sky-500' },
    { label: 'Inactive', value: data.schoolsByStatus.inactive, color: 'bg-amber-500' },
    { label: 'Suspended', value: data.schoolsByStatus.suspended, color: 'bg-red-500' },
    { label: 'Closed', value: data.schoolsByStatus.closed, color: 'bg-slate-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">School Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">School growth and distribution metrics</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="rounded-lg bg-blue-500/10 p-2 w-fit">
              <School className="h-4 w-4 text-blue-500" />
            </div>
            <p className="mt-3 text-2xl font-bold">{data.totalSchools.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Total Schools</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="rounded-lg bg-emerald-500/10 p-2 w-fit">
              <Building2 className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="mt-3 text-2xl font-bold">{data.schoolsByStatus.active.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Active Schools</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="rounded-lg bg-sky-500/10 p-2 w-fit">
              <TrendingUp className="h-4 w-4 text-sky-500" />
            </div>
            <p className="mt-3 text-2xl font-bold">{data.schoolsByStatus.trial.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Trial Schools</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="rounded-lg bg-violet-500/10 p-2 w-fit">
              <Globe className="h-4 w-4 text-violet-500" />
            </div>
            <p className="mt-3 text-2xl font-bold">{data.totalUsers.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Total Enrollment</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribution by Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {schoolStatusData.filter(s => s.value > 0).map((d) => (
              <div key={d.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{d.label}</span>
                  <span className="text-sm text-muted-foreground">{d.value.toLocaleString()} ({Math.round((d.value / data.totalSchools) * 100)}%)</span>
                </div>
                <div className="h-4 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className={`h-full rounded-full ${d.color}`} style={{ width: `${(d.value / data.totalSchools) * 100}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Status Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {schoolStatusData.filter(s => s.value > 0).map((d) => {
              const pct = Math.round((d.value / data.totalSchools) * 100);
              return (
                <div key={d.label} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${d.color}`} />
                    <span className="text-sm font-medium">{d.label}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{d.value.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{pct}% of total</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
