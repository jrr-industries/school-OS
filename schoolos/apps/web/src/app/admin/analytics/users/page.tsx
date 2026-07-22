'use client';

import { useState, useEffect, useCallback } from 'react';
import { Users, UserCheck, UserX, TrendingUp, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  schoolName?: string;
  createdAt: string;
}

export default function UserAnalyticsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/users?limit=1000');
      const json = await res.json();
      if (json.success) setUsers(json.data || []);
      else setError(json.error || 'Failed to load data');
    } catch {
      setError('Failed to fetch user data');
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

  const totalUsers = users.length;
  const roleCounts = users.reduce<Record<string, number>>((acc, u) => {
    const role = u.role || 'unknown';
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {});
  const statusCounts = users.reduce<Record<string, number>>((acc, u) => {
    const status = u.status || 'unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const activeUsers = statusCounts['active'] || statusCounts['Active'] || 0;
  const inactiveUsers = totalUsers - activeUsers;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">User Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">User demographics and engagement</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="rounded-lg bg-blue-500/10 p-2 w-fit">
              <Users className="h-4 w-4 text-blue-500" />
            </div>
            <p className="mt-3 text-2xl font-bold">{totalUsers.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Total Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="rounded-lg bg-emerald-500/10 p-2 w-fit">
              <UserCheck className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="mt-3 text-2xl font-bold">{activeUsers.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Active Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="rounded-lg bg-red-500/10 p-2 w-fit">
              <UserX className="h-4 w-4 text-red-500" />
            </div>
            <p className="mt-3 text-2xl font-bold">{inactiveUsers.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Inactive Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="rounded-lg bg-violet-500/10 p-2 w-fit">
              <TrendingUp className="h-4 w-4 text-violet-500" />
            </div>
            <p className="mt-3 text-2xl font-bold">{totalUsers > 0 ? `${Math.round((activeUsers / totalUsers) * 100)}%` : '0%'}</p>
            <p className="text-sm text-muted-foreground">Active Rate</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Users by Role</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(roleCounts).map(([role, count]) => {
              const pct = Math.round((count / totalUsers) * 100);
              return (
                <div key={role}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium capitalize">{role}</span>
                    <span className="text-sm text-muted-foreground">{count.toLocaleString()} ({pct}%)</span>
                  </div>
                  <div className="h-4 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            {Object.keys(roleCounts).length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No users found</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Active vs Inactive</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Active Users</span>
                <span className="text-sm font-medium text-emerald-600">{activeUsers.toLocaleString()} ({totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0}%)</span>
              </div>
              <div className="h-4 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: `${totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Inactive Users</span>
                <span className="text-sm font-medium text-red-600">{inactiveUsers.toLocaleString()} ({totalUsers > 0 ? Math.round((inactiveUsers / totalUsers) * 100) : 0}%)</span>
              </div>
              <div className="h-4 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full rounded-full bg-red-500" style={{ width: `${totalUsers > 0 ? (inactiveUsers / totalUsers) * 100 : 0}%` }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
