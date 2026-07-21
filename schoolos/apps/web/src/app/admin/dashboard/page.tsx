// ============================================================
// Temporary Development Authentication - Admin Dashboard
// This will be replaced with production dashboard
// ============================================================

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  GraduationCap,
  School,
  DollarSign,
  TrendingUp,
  TrendingDown,
  HelpCircle,
  Activity,
  Loader2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';

interface StatData {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: typeof Users;
}

const stats: StatData[] = [
  { label: 'Total Schools', value: '156', change: '+12%', trend: 'up', icon: School },
  { label: 'Total Students', value: '48,230', change: '+8%', trend: 'up', icon: Users },
  { label: 'Total Teachers', value: '3,840', change: '+5%', trend: 'up', icon: GraduationCap },
  { label: 'Monthly Revenue', value: '$1.2M', change: '+15%', trend: 'up', icon: DollarSign },
  { label: 'Support Tickets', value: '23', change: '-18%', trend: 'down', icon: HelpCircle },
  { label: 'System Health', value: '99.9%', change: 'Optimal', trend: 'up', icon: Activity },
];

const recentActivity = [
  { action: 'New school registered', detail: 'Springfield Elementary', time: '2 min ago' },
  { action: 'Student enrolled', detail: 'Sarah Johnson - Grade 5', time: '15 min ago' },
  { action: 'Teacher hired', detail: 'Mr. David Wilson - Mathematics', time: '1 hour ago' },
  { action: 'Payment received', detail: '$15,000 - Lincoln High', time: '2 hours ago' },
  { action: 'Support ticket closed', detail: 'Password reset request', time: '3 hours ago' },
  { action: 'System backup completed', detail: 'Daily backup - 2.4 GB', time: '4 hours ago' },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    async function checkSession() {
      try {
        await fetch('/api/auth/dev-login', { method: 'HEAD' });
      } catch {
        // Session check is best-effort; middleware handles real protection
      }
      setIsChecking(false);
    }
    checkSession();
  }, [router]);

  if (isChecking) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Welcome, Super Admin</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Here is an overview of your platform. All data shown is sample data for development.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  {stat.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <p className="mt-3 text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className={`text-xs mt-1 ${stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                  {stat.change}
                </p>
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
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0 dark:border-slate-800">
                  <div className="h-2 w-2 mt-2 rounded-full bg-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground truncate">{activity.detail}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">System Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Server Status</span>
                <span className="text-sm font-medium text-emerald-500">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Database</span>
                <span className="text-sm font-medium text-emerald-500">Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">API Response Time</span>
                <span className="text-sm font-medium">124ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Active Users</span>
                <span className="text-sm font-medium">1,847</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Storage Used</span>
                <span className="text-sm font-medium">342 GB / 1 TB</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Uptime</span>
                <span className="text-sm font-medium text-emerald-500">99.97%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
