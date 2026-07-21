'use client';

import { DollarSign, FileText, AlertTriangle, TrendingUp, ArrowUpRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';

interface StatCard {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: typeof DollarSign;
}

const stats: StatCard[] = [
  { label: 'Monthly Revenue', value: '$128,450', change: '+12.5% vs last month', trend: 'up', icon: DollarSign },
  { label: 'Pending Invoices', value: '24', change: '3 new today', trend: 'up', icon: FileText },
  { label: 'Overdue Payments', value: '8', change: '$12,300 total overdue', trend: 'down', icon: AlertTriangle },
  { label: 'Payment Success Rate', value: '97.8%', change: '+0.5% this month', trend: 'up', icon: TrendingUp },
];

interface Transaction {
  id: string;
  school: string;
  amount: string;
  method: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

const recentTransactions: Transaction[] = [
  { id: 'TXN-001', school: 'Lincoln High School', amount: '$299.00', method: 'Credit Card', date: '2024-05-18', status: 'completed' },
  { id: 'TXN-002', school: 'Springfield Elementary', amount: '$99.00', method: 'ACH Transfer', date: '2024-05-17', status: 'completed' },
  { id: 'TXN-003', school: 'Riverside Academy', amount: '$99.00', method: 'PayPal', date: '2024-05-16', status: 'completed' },
  { id: 'TXN-004', school: 'Westside Academy', amount: '$29.00', method: 'Credit Card', date: '2024-05-15', status: 'pending' },
  { id: 'TXN-005', school: 'Bright Future School', amount: '$297.00', method: 'ACH Transfer', date: '2024-05-14', status: 'failed' },
];

const statusStyles: Record<string, string> = {
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export default function BillingOverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Billing Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">Platform billing summary</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <ArrowUpRight className={`h-4 w-4 ${stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`} />
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

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="text-left font-medium py-3 px-4">Transaction ID</th>
                  <th className="text-left font-medium py-3 px-4">School</th>
                  <th className="text-left font-medium py-3 px-4">Amount</th>
                  <th className="text-left font-medium py-3 px-4">Method</th>
                  <th className="text-left font-medium py-3 px-4">Date</th>
                  <th className="text-right font-medium py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((txn) => (
                  <tr key={txn.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <td className="py-3 px-4 font-mono text-xs">{txn.id}</td>
                    <td className="py-3 px-4">
                      <strong>{txn.school}</strong>
                    </td>
                    <td className="py-3 px-4 font-medium">{txn.amount}</td>
                    <td className="py-3 px-4 text-muted-foreground">{txn.method}</td>
                    <td className="py-3 px-4 text-muted-foreground">{txn.date}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[txn.status]}`}>
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
