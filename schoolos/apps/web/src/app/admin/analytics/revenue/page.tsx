'use client';

import { useState, useEffect, useCallback } from 'react';
import { DollarSign, TrendingUp, School, Percent, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';

interface Subscription {
  id: string;
  planName: string;
  price: number;
  status: string;
  schoolName: string;
  createdAt: string;
}

export default function RevenueAnalyticsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/subscriptions?status=active&limit=1000');
      const json = await res.json();
      if (json.success) setSubscriptions(json.data || []);
      else setError(json.error || 'Failed to load data');
    } catch {
      setError('Failed to fetch revenue data');
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

  const totalRevenue = subscriptions.reduce((sum, s) => sum + s.price, 0);
  const planBreakdown = subscriptions.reduce<Record<string, { count: number; revenue: number }>>((acc, s) => {
    if (!acc[s.planName]) acc[s.planName] = { count: 0, revenue: 0 };
    acc[s.planName].count += 1;
    acc[s.planName].revenue += s.price;
    return acc;
  }, {});

  const monthlyMap = subscriptions.reduce<Record<string, number>>((acc, s) => {
    const month = s.createdAt ? s.createdAt.substring(0, 7) : 'Unknown';
    acc[month] = (acc[month] || 0) + s.price;
    return acc;
  }, {});

  const monthlyRevenue = Object.entries(monthlyMap).sort(([a], [b]) => a.localeCompare(b)).slice(-6);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Revenue Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Platform revenue breakdown</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="rounded-lg bg-emerald-500/10 p-2 w-fit">
              <DollarSign className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="mt-3 text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Total MRR</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="rounded-lg bg-blue-500/10 p-2 w-fit">
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </div>
            <p className="mt-3 text-2xl font-bold">${(totalRevenue * 12).toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Projected ARR</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="rounded-lg bg-violet-500/10 p-2 w-fit">
              <School className="h-4 w-4 text-violet-500" />
            </div>
            <p className="mt-3 text-2xl font-bold">{subscriptions.length.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Active Subscriptions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="rounded-lg bg-rose-500/10 p-2 w-fit">
              <Percent className="h-4 w-4 text-rose-500" />
            </div>
            <p className="mt-3 text-2xl font-bold">${subscriptions.length > 0 ? Math.round(totalRevenue / subscriptions.length).toLocaleString() : '0'}</p>
            <p className="text-sm text-muted-foreground">Avg Revenue Per School</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monthly Revenue (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {monthlyRevenue.length > 0 ? monthlyRevenue.map(([month, amount]) => {
                const maxAmount = Math.max(...monthlyRevenue.map(([, a]) => a));
                return (
                  <div key={month} className="flex items-center gap-4">
                    <span className="text-sm font-medium w-16 shrink-0">{month}</span>
                    <div className="flex-1">
                      <div className="h-6 w-full rounded overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <div className="h-full bg-blue-500 transition-all" style={{ width: `${(amount / maxAmount) * 100}%` }} />
                      </div>
                    </div>
                    <span className="text-sm font-bold w-28 text-right">${amount.toLocaleString()}</span>
                  </div>
                );
              }) : <p className="text-sm text-muted-foreground text-center py-4">No revenue data available</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Plan Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(planBreakdown).map(([plan, info]) => (
              <div key={plan}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{plan}</span>
                  <span className="text-sm text-muted-foreground">{info.count} schools - ${info.revenue.toLocaleString()}</span>
                </div>
                <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${(info.revenue / totalRevenue) * 100}%` }} />
                </div>
              </div>
            ))}
            {Object.keys(planBreakdown).length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No plans found</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
