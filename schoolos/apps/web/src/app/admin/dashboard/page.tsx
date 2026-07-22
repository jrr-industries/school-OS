'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  School,
  Users,
  CreditCard,
  CheckCircle2,
  Activity,
  TrendingUp,
  Loader2,
  AlertCircle,
} from 'lucide-react';
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
  recentActivity: {
    id: string;
    action: string;
    entity: string;
    description: string | null;
    userName: string;
    schoolName: string;
    createdAt: string;
  }[];
}

function formatTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

function actionLabel(action: string, entity: string): string {
  const actionMap: Record<string, string> = {
    create: 'created',
    update: 'updated',
    delete: 'deleted',
    login: 'logged in',
    logout: 'logged out',
    export: 'exported',
    import: 'imported',
    approve: 'approved',
    reject: 'rejected',
    promote: 'promoted',
    transfer: 'transferred',
    archive: 'archived',
    restore: 'restored',
    view: 'viewed',
  };
  const entityMap: Record<string, string> = {
    user: 'user',
    school: 'school',
    subscription: 'subscription',
    student: 'student',
    class: 'class',
    section: 'section',
    subject: 'subject',
    fee: 'fee payment',
    attendance: 'attendance record',
    grade: 'grade',
    parent: 'parent',
  };
  const a = actionMap[action] || action;
  const e = entityMap[entity] || entity;
  return `${a} ${e}`;
}

const statCards = [
  { key: 'totalSchools', label: 'Total Schools', icon: School, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { key: 'totalUsers', label: 'Total Users', icon: Users, color: 'text-violet-500', bg: 'bg-violet-500/10' },
  { key: 'totalPlans', label: 'Total Plans', icon: CreditCard, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { key: 'activeSubscriptions', label: 'Active Subscriptions', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { key: 'schoolsActive', label: 'Active Schools', icon: Activity, color: 'text-sky-500', bg: 'bg-sky-500/10' },
  { key: 'schoolsTrial', label: 'Trial Schools', icon: TrendingUp, color: 'text-rose-500', bg: 'bg-rose-500/10' },
] as const;

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/dashboard');
      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error || 'Failed to load dashboard data');
      }
      setData(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <div className="rounded-full bg-destructive/10 p-3">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <h3 className="font-semibold">Failed to load dashboard</h3>
              <p className="mt-1 text-sm text-muted-foreground">{error}</p>
            </div>
            <button
              onClick={fetchDashboard}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Loader2 className="h-4 w-4" />
              Retry
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const values: Record<string, number> = {
    totalSchools: data?.totalSchools ?? 0,
    totalUsers: data?.totalUsers ?? 0,
    totalPlans: data?.totalPlans ?? 0,
    activeSubscriptions: data?.activeSubscriptions ?? 0,
    schoolsActive: data?.schoolsByStatus?.active ?? 0,
    schoolsTrial: data?.schoolsByStatus?.trial ?? 0,
  };

  const sb = data?.schoolsByStatus;
  const totalSchoolsCount = data?.totalSchools ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Platform overview and key metrics at a glance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          const value = values[card.key];
          return (
            <Card key={card.key}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className={`rounded-lg ${card.bg} p-2`}>
                    <Icon className={`h-4 w-4 ${card.color}`} />
                  </div>
                </div>
                <p className="mt-3 text-2xl font-bold">{value.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">{card.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.recentActivity && data.recentActivity.length > 0 ? (
              <div className="space-y-4">
                {data.recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0 dark:border-slate-800"
                  >
                    <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium capitalize">
                        {activity.description || actionLabel(activity.action, activity.entity)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {activity.schoolName}
                        <span className="mx-1.5 text-xs text-muted-foreground/50">&middot;</span>
                        {activity.userName}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {formatTime(activity.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-4 text-center text-sm text-muted-foreground">No recent activity.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Schools by Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sb && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Schools</span>
                  <span className="text-sm font-bold">{totalSchoolsCount}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{
                      width: `${totalSchoolsCount > 0 ? (sb.active / totalSchoolsCount) * 100 : 0}%`,
                    }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  {[
                    { label: 'Active', value: sb.active, color: 'text-emerald-500', bar: 'bg-emerald-500' },
                    { label: 'Trial', value: sb.trial, color: 'text-amber-500', bar: 'bg-amber-500' },
                    { label: 'Suspended', value: sb.suspended, color: 'text-red-500', bar: 'bg-red-500' },
                    { label: 'Inactive', value: sb.inactive, color: 'text-slate-500', bar: 'bg-slate-500' },
                    { label: 'Closed', value: sb.closed, color: 'text-gray-500', bar: 'bg-gray-500' },
                  ].map((item) => (
                    <div key={item.label} className="rounded-lg border p-3 dark:border-slate-800">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{item.label}</span>
                        <span className={`text-sm font-semibold ${item.color}`}>
                          {item.value}
                        </span>
                      </div>
                      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                        <div
                          className={`h-full rounded-full ${item.bar} transition-all`}
                          style={{
                            width: `${totalSchoolsCount > 0 ? (item.value / totalSchoolsCount) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
