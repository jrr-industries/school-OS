'use client';

import { useState, useEffect, useCallback } from 'react';
import { Users, School, CreditCard, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';

interface DashboardData {
  totalSchools: number;
  totalUsers: number;
  totalPlans: number;
  activeSubscriptions: number;
  schoolsByStatus: {
    active: number;
    inactive: number;
    suspended: number;
    closed: number;
    trial: number;
  };
}

const statCards = [
  { key: 'totalSchools', label: 'Total Schools', icon: School, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { key: 'totalUsers', label: 'Total Users', icon: Users, color: 'text-violet-500', bg: 'bg-violet-500/10' },
  { key: 'totalPlans', label: 'Total Plans', icon: CreditCard, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { key: 'activeSubscriptions', label: 'Active Subscriptions', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
] as const;

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function PlatformAnalyticsPage() {
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
      setError('Failed to fetch dashboard data');
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

  const stats = [
    { ...statCards[0], value: data.totalSchools.toLocaleString() },
    { ...statCards[1], value: data.totalUsers.toLocaleString() },
    { ...statCards[2], value: data.totalPlans.toLocaleString() },
    { ...statCards[3], value: data.activeSubscriptions.toLocaleString() },
  ];

  const schoolStatuses = [
    { label: 'Active', value: data.schoolsByStatus.active, color: 'bg-emerald-500' },
    { label: 'Trial', value: data.schoolsByStatus.trial, color: 'bg-sky-500' },
    { label: 'Inactive', value: data.schoolsByStatus.inactive, color: 'bg-amber-500' },
    { label: 'Suspended', value: data.schoolsByStatus.suspended, color: 'bg-red-500' },
    { label: 'Closed', value: data.schoolsByStatus.closed, color: 'bg-slate-500' },
  ];

  const chartValues = [180, 220, 310, 290, 340, 380, 410];
  const maxChart = Math.max(...chartValues);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Platform Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Overall platform metrics and trends</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.key}>
              <CardContent className="p-4">
                <div className={`rounded-lg ${stat.bg} p-2 w-fit`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <p className="mt-3 text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Weekly API Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-40">
              {chartValues.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs font-medium">{v.toLocaleString()}</span>
                  <div className="w-full rounded-t bg-blue-500 transition-all" style={{ height: `${(v / maxChart) * 100}%` }} />
                  <span className="text-xs text-muted-foreground">{weekDays[i]}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Schools by Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {schoolStatuses.map((s) => (
              <div key={s.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{s.label}</span>
                  <span className="text-sm text-muted-foreground">{s.value.toLocaleString()}</span>
                </div>
                <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className={`h-full rounded-full ${s.color}`} style={{ width: `${(s.value / data.totalSchools) * 100}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Schools Online</p>
            <p className="text-2xl font-bold text-emerald-500">{data.schoolsByStatus.active.toLocaleString()} / {data.totalSchools.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Avg Users Per School</p>
            <p className="text-2xl font-bold">{data.totalSchools > 0 ? Math.round(data.totalUsers / data.totalSchools).toLocaleString() : '0'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Subscription Rate</p>
            <p className="text-2xl font-bold">{data.totalSchools > 0 ? `${Math.round((data.activeSubscriptions / data.totalSchools) * 100)}%` : '0%'}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
