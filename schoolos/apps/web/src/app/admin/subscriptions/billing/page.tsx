'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  DollarSign,
  FileText,
  AlertTriangle,
  TrendingUp,
  CreditCard,
  Building2,
  AlertCircle,

} from 'lucide-react';

interface BillingSummary {
  monthlyRevenue: number;
  pendingInvoices: number;
  overduePayments: number;
  overdueAmount: number;
  paymentSuccessRate: number;
  activeSubscriptions: number;
  totalSchools: number;
  trialSubscriptions: number;
  newThisMonth: number;
}

interface Transaction {
  id: string;
  school: string;
  amount: number;
  currency: string;
  method: string;
  interval: string;
  date: string;
  status: string;
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

const statusColors: Record<string, string> = {
  active: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  past_due: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  cancelled: 'bg-red-500/10 text-red-600 dark:text-red-400',
  trial: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  inactive: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
};

export default function BillingPage() {
  const [summary, setSummary] = useState<BillingSummary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/billing');
      const json = await res.json();
      if (!json.success) { setError(json.error || 'Failed to load'); return; }
      setSummary(json.data?.summary ?? null);
      setTransactions(json.data?.transactions ?? []);
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const summaryCards = summary ? [
    { label: 'Monthly Revenue', value: formatCurrency(summary.monthlyRevenue, 'USD'), icon: DollarSign, accent: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Active Subscriptions', value: summary.activeSubscriptions, icon: CreditCard, accent: 'text-blue-600 dark:text-blue-400' },
    { label: 'Pending Invoices', value: summary.pendingInvoices, icon: FileText, accent: 'text-amber-600 dark:text-amber-400' },
    { label: 'Overdue Payments', value: `${summary.overduePayments} (${formatCurrency(summary.overdueAmount, 'USD')})`, icon: AlertTriangle, accent: 'text-red-600 dark:text-red-400' },
    { label: 'Payment Success Rate', value: `${summary.paymentSuccessRate}%`, icon: TrendingUp, accent: 'text-cyan-600 dark:text-cyan-400' },
    { label: 'Total Schools', value: `${summary.totalSchools} (${summary.trialSubscriptions} trial)`, icon: Building2, accent: 'text-indigo-600 dark:text-indigo-400' },
  ] : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Billing Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">Platform billing summary & recent transactions</p>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span className="flex-1">{error}</span>
          <button onClick={fetchData} className="rounded-md border border-destructive/30 px-3 py-1 text-xs font-medium text-destructive hover:bg-destructive/10">Retry</button>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="relative">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-primary" />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Loading billing data...</p>
        </div>
      ) : summary ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {summaryCards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.label} className="rounded-xl border bg-card p-4">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${card.accent}`} />
                    <span className="text-xs text-muted-foreground">{card.label}</span>
                  </div>
                  <p className="mt-2 font-mono text-lg font-bold text-foreground">{card.value}</p>
                </div>
              );
            })}
          </div>

          <div className="rounded-xl border bg-card shadow-sm">
            <div className="px-6 pb-3 pt-5">
              <h2 className="text-sm font-semibold text-foreground">Recent Transactions</h2>
            </div>
            {transactions.length === 0 ? (
              <div className="px-6 pb-5 text-sm text-muted-foreground">No transactions yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-medium text-muted-foreground">School</th>
                      <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-medium text-muted-foreground">Amount</th>
                      <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-medium text-muted-foreground">Method</th>
                      <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-medium text-muted-foreground">Date</th>
                      <th className="whitespace-nowrap px-6 py-3 text-right text-xs font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="border-b border-border/50 transition-colors last:border-0 hover:bg-muted/50">
                        <td className="whitespace-nowrap px-6 py-3 font-medium text-foreground">{tx.school}</td>
                        <td className="whitespace-nowrap px-6 py-3 font-mono text-foreground">
                          {formatCurrency(tx.amount, tx.currency)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-3 text-muted-foreground">{tx.method}</td>
                        <td className="whitespace-nowrap px-6 py-3 text-muted-foreground">{formatDate(tx.date)}</td>
                        <td className="whitespace-nowrap px-6 py-3 text-right">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusColors[tx.status] || statusColors.inactive}`}>
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
