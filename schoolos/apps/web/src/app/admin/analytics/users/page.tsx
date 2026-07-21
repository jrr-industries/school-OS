'use client';

import { Users, UserCheck, UserX, TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';

const stats = [
  { label: 'Total Users', value: '52,847', change: '+8.3%', trend: 'up', icon: Users, color: 'text-blue-600' },
  { label: 'Active Users', value: '41,230', change: '+9.1%', trend: 'up', icon: UserCheck, color: 'text-emerald-600' },
  { label: 'Inactive Users', value: '11,617', change: '-2.4%', trend: 'down', icon: UserX, color: 'text-red-600' },
  { label: 'Avg. Engagement', value: '78%', change: '+4.2%', trend: 'up', icon: TrendingUp, color: 'text-violet-600' },
];

const usersByRole = [
  { role: 'Students', count: 38420, pct: 72.7, color: 'bg-blue-500' },
  { role: 'Teachers', count: 8940, pct: 16.9, color: 'bg-emerald-500' },
  { role: 'Administrators', count: 3840, pct: 7.3, color: 'bg-amber-500' },
  { role: 'Parents', count: 1647, pct: 3.1, color: 'bg-violet-500' },
];

const newRegistrations = [
  { month: 'Feb', count: 1230 },
  { month: 'Mar', count: 1450 },
  { month: 'Apr', count: 1380 },
  { month: 'May', count: 1620 },
  { month: 'Jun', count: 1580 },
  { month: 'Jul', count: 1840 },
];

const growthData = [
  { month: 'Feb', total: 46210 },
  { month: 'Mar', total: 47660 },
  { month: 'Apr', total: 49040 },
  { month: 'May', total: 50660 },
  { month: 'Jun', total: 52240 },
  { month: 'Jul', total: 52847 },
];

export default function UserAnalyticsPage() {
  const maxNew = Math.max(...newRegistrations.map(m => m.count));
  const maxGrowth = Math.max(...growthData.map(m => m.total));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">User Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">User demographics and engagement</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className={`rounded-lg bg-opacity-10 p-2 ${stat.color.replace('text-', 'bg-')}/10`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  {stat.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
                  )}
                </div>
                <p className="mt-3 text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className={`text-xs mt-1 ${stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Users by Role</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {usersByRole.map((r) => (
              <div key={r.role}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{r.role}</span>
                  <span className="text-sm text-muted-foreground">{r.count.toLocaleString()} ({r.pct}%)</span>
                </div>
                <div className="h-4 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className={`h-full rounded-full ${r.color}`} style={{ width: `${r.pct}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Active vs Inactive</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Active Users</span>
              <span className="text-sm font-medium text-emerald-600">41,230 (78%)</span>
            </div>
            <div className="h-4 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className="h-full rounded-full bg-emerald-500" style={{ width: '78%' }} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Inactive Users</span>
              <span className="text-sm font-medium text-red-600">11,617 (22%)</span>
            </div>
            <div className="h-4 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className="h-full rounded-full bg-red-500" style={{ width: '22%' }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">New Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-40">
              {newRegistrations.map((m) => {
                const height = (m.count / maxNew) * 100;
                return (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-xs font-medium">{m.count}</span>
                    <div className="w-full rounded-t bg-amber-500 transition-all" style={{ height: `${height}%` }} />
                    <span className="text-xs text-muted-foreground">{m.month}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">User Growth Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-40">
              {growthData.map((m) => {
                const height = (m.total / maxGrowth) * 100;
                return (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-xs font-medium">{m.total.toLocaleString()}</span>
                    <div className="w-full rounded-t bg-blue-500 transition-all" style={{ height: `${height}%` }} />
                    <span className="text-xs text-muted-foreground">{m.month}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
