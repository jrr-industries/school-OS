'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Search,
  AlertCircle,

  ChevronLeft,
  ChevronRight,
  CreditCard,
  RefreshCw,
} from 'lucide-react';

interface Payment {
  id: string;
  transactionId: string;
  schoolName: string;
  planName: string;
  amount: number;
  currency: string;
  method: string;
  reference: string | null;
  date: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  interval: string;
  autoRenew: boolean;
}

interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

const statusStyles: Record<string, string> = {
  completed: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:text-emerald-400',
  pending: 'bg-amber-500/10 text-amber-600 border-amber-500/30 dark:text-amber-400',
  failed: 'bg-red-500/10 text-red-600 border-red-500/30 dark:text-red-400',
  refunded: 'bg-blue-500/10 text-blue-600 border-blue-500/30 dark:text-blue-400',
};

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

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      params.set('limit', '20');
      params.set('page', String(page));
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);

      const res = await fetch(`/api/admin/payments?${params.toString()}`);
      const json = await res.json();
      if (!json.success) { setError(json.error || 'Failed to load'); return; }
      setPayments(json.data ?? []);
      setMeta(json.meta ?? null);
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const summary = payments.length > 0 ? {
    completed: payments.filter((p) => p.status === 'completed').length,
    pending: payments.filter((p) => p.status === 'pending').length,
    failed: payments.filter((p) => p.status === 'failed').length,
    refunded: payments.filter((p) => p.status === 'refunded').length,
    totalVolume: payments.reduce((sum, p) => p.status === 'completed' ? sum + p.amount : sum, 0),
  } : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Payments</h1>
        <p className="mt-1 text-sm text-muted-foreground">Payment transaction history</p>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span className="flex-1">{error}</span>
          <button onClick={fetchData} className="rounded-md border border-destructive/30 px-3 py-1 text-xs font-medium text-destructive hover:bg-destructive/10">Retry</button>
        </div>
      )}

      {summary && !loading && (
        <div className="flex flex-wrap gap-4">
          <div className="rounded-xl border bg-card px-5 py-3">
            <p className="text-xs font-medium text-muted-foreground">Total Transactions</p>
            <p className="mt-0.5 text-xl font-bold text-foreground">{meta?.total ?? 0}</p>
          </div>
          <div className="rounded-xl border bg-card px-5 py-3">
            <p className="text-xs font-medium text-muted-foreground">Completed</p>
            <p className="mt-0.5 text-xl font-bold text-emerald-600 dark:text-emerald-400">{summary.completed}</p>
          </div>
          <div className="rounded-xl border bg-card px-5 py-3">
            <p className="text-xs font-medium text-muted-foreground">Pending</p>
            <p className="mt-0.5 text-xl font-bold text-amber-600 dark:text-amber-400">{summary.pending}</p>
          </div>
          <div className="rounded-xl border bg-card px-5 py-3">
            <p className="text-xs font-medium text-muted-foreground">Failed</p>
            <p className="mt-0.5 text-xl font-bold text-red-600 dark:text-red-400">{summary.failed}</p>
          </div>
          <div className="rounded-xl border bg-card px-5 py-3">
            <p className="text-xs font-medium text-muted-foreground">Total Volume</p>
            <p className="mt-0.5 text-xl font-bold text-foreground">{formatCurrency(summary.totalVolume, 'USD')}</p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by school..."
            className="h-10 w-full rounded-xl border border-input bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring/50 focus:outline-none focus:ring-1 focus:ring-ring/30"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="h-10 rounded-xl border border-input bg-background px-3 text-sm text-foreground focus:border-ring/50 focus:outline-none focus:ring-1 focus:ring-ring/30"
        >
          <option value="">All Statuses</option>
          <option value="active">Completed</option>
          <option value="trial">Pending</option>
          <option value="past_due">Failed</option>
          <option value="cancelled">Refunded</option>
        </select>
        <button
          onClick={() => { setSearch(''); setStatusFilter(''); setPage(1); }}
          className="flex h-10 items-center gap-1.5 rounded-xl border border-input bg-background px-3 text-sm text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Reset
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="relative">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-primary" />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Loading payments...</p>
        </div>
      ) : payments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-card py-24">
          <CreditCard className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground">No payments found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {search || statusFilter ? 'Try adjusting your search or filters.' : 'Payment records will appear once transactions are processed.'}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-medium text-muted-foreground">Transaction</th>
                  <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-medium text-muted-foreground">School</th>
                  <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-medium text-muted-foreground">Plan</th>
                  <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-medium text-muted-foreground">Amount</th>
                  <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-medium text-muted-foreground">Method</th>
                  <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-medium text-muted-foreground">Date</th>
                  <th className="whitespace-nowrap px-6 py-3 text-right text-xs font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b border-border/50 transition-colors last:border-0 hover:bg-muted/50">
                    <td className="whitespace-nowrap px-6 py-3 font-mono text-xs text-muted-foreground">{payment.transactionId}</td>
                    <td className="whitespace-nowrap px-6 py-3 font-medium text-foreground">{payment.schoolName}</td>
                    <td className="whitespace-nowrap px-6 py-3 text-muted-foreground">{payment.planName}</td>
                    <td className="whitespace-nowrap px-6 py-3 font-mono text-foreground">
                      {formatCurrency(payment.amount, payment.currency)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-muted-foreground">{payment.method}</td>
                    <td className="whitespace-nowrap px-6 py-3 text-muted-foreground">{formatDate(payment.date)}</td>
                    <td className="whitespace-nowrap px-6 py-3 text-right">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyles[payment.status]}`}>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border px-6 py-3">
              <p className="text-xs text-muted-foreground">
                Page {meta.page} of {meta.totalPages} ({meta.total} total)
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!meta.hasPreviousPage}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-input text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!meta.hasNextPage}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-input text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
