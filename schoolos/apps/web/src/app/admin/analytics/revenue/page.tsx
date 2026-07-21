'use client';

import { DollarSign, TrendingUp, TrendingDown, School, Percent } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';

const stats = [
  { label: 'MRR', value: '$189,420', change: '+7.2%', trend: 'up', icon: DollarSign, color: 'text-emerald-600' },
  { label: 'ARR', value: '$2,273,040', change: '+7.2%', trend: 'up', icon: TrendingUp, color: 'text-blue-600' },
  { label: 'Avg Revenue Per School', value: '$152.40', change: '+4.1%', trend: 'up', icon: School, color: 'text-violet-600' },
  { label: 'Churn Rate', value: '2.1%', change: '-0.3%', trend: 'down', icon: Percent, color: 'text-rose-600' },
];

const monthlyRevenue = [
  { month: 'Feb', subscription: 125000, oneTime: 34200 },
  { month: 'Mar', subscription: 131000, oneTime: 28900 },
  { month: 'Apr', subscription: 138000, oneTime: 31200 },
  { month: 'May', subscription: 144000, oneTime: 27800 },
  { month: 'Jun', subscription: 152000, oneTime: 35400 },
  { month: 'Jul', subscription: 158000, oneTime: 31420 },
];

export default function RevenueAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Revenue Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Platform revenue breakdown</p>
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
            <CardTitle className="text-lg">Monthly Revenue (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {monthlyRevenue.map((m) => {
                const total = m.subscription + m.oneTime;
                const subPercent = (m.subscription / total) * 100;
                return (
                  <div key={m.month} className="flex items-center gap-4">
                    <span className="text-sm font-medium w-10 shrink-0">{m.month}</span>
                    <div className="flex-1 flex flex-col gap-1">
                      <div className="flex h-6 w-full rounded overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <div className="bg-blue-500 transition-all" style={{ width: `${subPercent}%` }} />
                        <div className="bg-amber-500 transition-all" style={{ width: `${100 - subPercent}%` }} />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Subscription: ${m.subscription.toLocaleString()}</span>
                        <span>One-time: ${m.oneTime.toLocaleString()}</span>
                      </div>
                    </div>
                    <span className="text-sm font-bold w-24 text-right">${total.toLocaleString()}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Revenue Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Subscription Revenue</span>
              <span className="text-sm font-medium">$158,000 (83.4%)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">One-time Payments</span>
              <span className="text-sm font-medium">$31,420 (16.6%)</span>
            </div>
            <div className="border-t pt-4 mt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold">Total Monthly Revenue</span>
                <span className="text-sm font-bold">$189,420</span>
              </div>
            </div>
            <div className="pt-4 space-y-3">
              <h4 className="text-sm font-medium">Plan Distribution</h4>
              <div className="flex items-center justify-between">
                <span className="text-sm">Enterprise</span>
                <span className="text-sm font-medium">87 schools - $87,000</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Pro</span>
                <span className="text-sm font-medium">312 schools - $62,400</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Basic</span>
                <span className="text-sm font-medium">198 schools - $19,800</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Trial</span>
                <span className="text-sm font-medium">46 schools - $0</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
