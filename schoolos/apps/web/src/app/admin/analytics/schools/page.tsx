'use client';

import { School, TrendingUp, Building2, Globe, Users } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';

const stats = [
  { label: 'Total Schools', value: '1,243', change: '+12%', trend: 'up', icon: School, color: 'text-blue-600' },
  { label: 'Public Schools', value: '892', change: '+8%', trend: 'up', icon: Building2, color: 'text-emerald-600' },
  { label: 'Private Schools', value: '351', change: '+15%', trend: 'up', icon: Globe, color: 'text-violet-600' },
  { label: 'Total Enrollment', value: '486,320', change: '+9%', trend: 'up', icon: Users, color: 'text-amber-600' },
];

const newSchoolsPerMonth = [
  { month: 'Feb', count: 14 },
  { month: 'Mar', count: 18 },
  { month: 'Apr', count: 22 },
  { month: 'May', count: 16 },
  { month: 'Jun', count: 25 },
  { month: 'Jul', count: 20 },
];

const distributionByType = [
  { type: 'Public', count: 892, pct: 71.8, color: 'bg-blue-500' },
  { type: 'Private', count: 351, pct: 28.2, color: 'bg-violet-500' },
];

const distributionByRegion = [
  { region: 'North America', count: 412, pct: 33.1, color: 'bg-emerald-500' },
  { region: 'Europe', count: 298, pct: 24.0, color: 'bg-blue-500' },
  { region: 'Asia Pacific', count: 264, pct: 21.2, color: 'bg-amber-500' },
  { region: 'Latin America', count: 153, pct: 12.3, color: 'bg-rose-500' },
  { region: 'Middle East & Africa', count: 116, pct: 9.3, color: 'bg-violet-500' },
];

export default function SchoolAnalyticsPage() {
  const maxNew = Math.max(...newSchoolsPerMonth.map(m => m.count));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">School Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">School growth and distribution metrics</p>
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
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                </div>
                <p className="mt-3 text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-xs mt-1 text-emerald-500">{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">New Schools Per Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-40">
              {newSchoolsPerMonth.map((m) => {
                const height = (m.count / maxNew) * 100;
                return (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-xs font-medium">{m.count}</span>
                    <div
                      className="w-full rounded-t bg-blue-500 transition-all"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-xs text-muted-foreground">{m.month}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribution by Type</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {distributionByType.map((d) => (
              <div key={d.type}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{d.type}</span>
                  <span className="text-sm text-muted-foreground">{d.count} ({d.pct}%)</span>
                </div>
                <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className={`h-full rounded-full ${d.color}`} style={{ width: `${d.pct}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Distribution by Region</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {distributionByRegion.map((r) => (
              <div key={r.region}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{r.region}</span>
                  <span className="text-sm text-muted-foreground">{r.count} schools ({r.pct}%)</span>
                </div>
                <div className="h-4 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className={`h-full rounded-full ${r.color}`} style={{ width: `${r.pct}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
