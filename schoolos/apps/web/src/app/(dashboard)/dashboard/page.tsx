'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@schoolos/ui';
import { Users, GraduationCap, BookOpen, CreditCard, TrendingUp, UserPlus } from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  total: number;
  active: number;
  byGender: Array<{ gender: string; _count: number }>;
  byStatus: Array<{ status: string; _count: number }>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/students/stats?schoolId=current-school-id');
        const data = await response.json();
        if (data.success) setStats(data.data);
      } catch {
        // silently fail
      }
    };
    fetchStats();
  }, []);

  const maleCount = stats?.byGender.find((g) => g.gender === 'male')?._count ?? 0;
  const femaleCount = stats?.byGender.find((g) => g.gender === 'female')?._count ?? 0;

  const summaryCards = [
    {
      title: 'Total Students',
      value: stats?.total ?? 0,
      icon: Users,
      href: '/students',
    },
    {
      title: 'Active Students',
      value: stats?.active ?? 0,
      icon: GraduationCap,
      trend: `${stats ? ((stats.active / stats.total) * 100).toFixed(0) : 0}%`,
      href: '/students?status=active',
    },
    {
      title: 'Male',
      value: maleCount,
      icon: TrendingUp,
      href: '/students?gender=male',
    },
    {
      title: 'Female',
      value: femaleCount,
      icon: UserPlus,
      href: '/students?gender=female',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back to SchoolOS
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="transition-colors hover:bg-accent/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
                {stat.trend && (
                  <p className="text-xs text-muted-foreground">{stat.trend} of total</p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Student Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.byStatus.map((s) => (
                <div key={s.status} className="flex items-center justify-between">
                  <span className="text-sm capitalize">{s.status}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-32 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{
                          width: `${stats.total > 0 ? (s._count / stats.total) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <span className="w-10 text-right text-sm text-muted-foreground">
                      {s._count}
                    </span>
                  </div>
                </div>
              ))}
              {!stats && (
                <p className="text-sm text-muted-foreground">Loading...</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link
              href="/students/new"
              className="flex items-center gap-2 rounded-md border p-3 text-sm transition-colors hover:bg-accent"
            >
              <UserPlus className="h-4 w-4 text-primary" />
              Add New Student
            </Link>
            <Link
              href="/students"
              className="flex items-center gap-2 rounded-md border p-3 text-sm transition-colors hover:bg-accent"
            >
              <GraduationCap className="h-4 w-4 text-primary" />
              Manage Students
            </Link>
            <Link
              href="/classes"
              className="flex items-center gap-2 rounded-md border p-3 text-sm transition-colors hover:bg-accent"
            >
              <BookOpen className="h-4 w-4 text-primary" />
              Manage Classes
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
