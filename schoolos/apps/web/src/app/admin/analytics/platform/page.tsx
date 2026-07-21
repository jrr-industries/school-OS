'use client';

import { Users, School, Activity, Timer, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';

const stats = [
  { label: 'Total Users', value: '52,847', change: '+8.3%', trend: 'up', icon: Users, color: 'text-blue-600' },
  { label: 'Active Schools', value: '1,243', change: '+12.1%', trend: 'up', icon: School, color: 'text-emerald-600' },
  { label: 'API Calls (Today)', value: '2.4M', change: '+5.7%', trend: 'up', icon: Activity, color: 'text-violet-600' },
  { label: 'Avg Response Time', value: '94ms', change: '-12ms', trend: 'down', icon: Timer, color: 'text-amber-600' },
];

const chartData = [
  { label: 'API Calls', values: [180, 220, 310, 290, 340, 380, 410], color: 'bg-blue-500' },
  { label: 'Active Users', values: [120, 190, 240, 280, 310, 340, 370], color: 'bg-emerald-500' },
  { label: 'New Schools', values: [8, 12, 15, 10, 18, 14, 20], color: 'bg-violet-500' },
];

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function PlatformAnalyticsPage() {
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
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className={`rounded-lg bg-opacity-10 p-2 ${stat.color.replace('text-', 'bg-')}/10`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  {stat.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
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
            <CardTitle className="text-lg">Weekly Trends</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {chartData.map((series) => (
              <div key={series.label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{series.label}</span>
                  <span className="text-sm text-muted-foreground">{series.values[series.values.length - 1].toLocaleString()}</span>
                </div>
                <div className="flex items-end gap-1 h-16">
                  {series.values.map((v, i) => {
                    const max = Math.max(...series.values);
                    const height = (v / max) * 100;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className={`w-full rounded-t ${series.color}`}
                          style={{ height: `${height}%` }}
                        />
                        <span className="text-[10px] text-muted-foreground">{days[i]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Platform Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Schools Online</span>
              <span className="text-sm font-medium text-emerald-500">1,198 / 1,243</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Active Users Today</span>
              <span className="text-sm font-medium">18,432</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Total API Endpoints</span>
              <span className="text-sm font-medium">247</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Avg. Session Duration</span>
              <span className="text-sm font-medium">24m 18s</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Error Rate (24h)</span>
              <span className="text-sm font-medium text-amber-600">0.34%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Data Processed Today</span>
              <span className="text-sm font-medium">1.8 TB</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
