'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Download,
  Search,
  AlertCircle,

  ChevronLeft,
  ChevronRight,
  FileText,
  RefreshCw,
} from 'lucide-react';

interface Invoice {
  id: string;
  invoiceId: string;
  schoolName: string;
  planName: string;
  amount: number;
  currency: string;
  interval: string;
  date: string;
  dueDate: string | null;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
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
  paid: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:text-emerald-400',
  pending: 'bg-amber-500/10 text-amber-600 border-amber-500/30 dark:text-amber-400',
  overdue: 'bg-red-500/10 text-red-600 border-red-500/30 dark:text-red-400',
  cancelled: 'bg-slate-500/10 text-slate-600 border-slate-500/30 dark:text-slate-400',
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

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
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

      const res = await fetch(`/api/admin/invoices?${params.toString()}`);
      const json = await res.json();
      if (!json.success) { setError(json.error || 'Failed to load'); return; }
      setInvoices(json.data ?? []);
      setMeta(json.meta ?? null);
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const summary = invoices.length > 0 ? {
    total: invoices.length,
    paid: invoices.filter((i) => i.status === 'paid').length,
    pending: invoices.filter((i) => i.status === 'pending').length,
    overdue: invoices.filter((i) => i.status === 'overdue').length,
    totalRevenue: invoices.reduce((sum, i) => i.status === 'paid' ? sum + i.amount : sum, 0),
  } : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Invoices</h1>
        <p className="mt-1 text-sm text-muted-foreground">All platform invoices</p>
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
            <p className="text-xs font-medium text-muted-foreground">Total Invoices</p>
            <p className="mt-0.5 text-xl font-bold text-foreground">{meta?.total ?? invoices.length}</p>
          </div>
          <div className="rounded-xl border bg-card px-5 py-3">
            <p className="text-xs font-medium text-muted-foreground">Paid</p>
            <p className="mt-0.5 text-xl font-bold text-emerald-600 dark:text-emerald-400">{summary.paid}</p>
          </div>
          <div className="rounded-xl border bg-card px-5 py-3">
            <p className="text-xs font-medium text-muted-foreground">Pending</p>
            <p className="mt-0.5 text-xl font-bold text-amber-600 dark:text-amber-400">{summary.pending}</p>
          </div>
          <div className="rounded-xl border bg-card px-5 py-3">
            <p className="text-xs font-medium text-muted-foreground">Overdue</p>
            <p className="mt-0.5 text-xl font-bold text-red-600 dark:text-red-400">{summary.overdue}</p>
          </div>
          <div className="rounded-xl border bg-card px-5 py-3">
            <p className="text-xs font-medium text-muted-foreground">Collected Revenue</p>
            <p className="mt-0.5 text-xl font-bold text-foreground">{formatCurrency(summary.totalRevenue, 'USD')}</p>
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
          <option value="active">Paid</option>
          <option value="trial">Pending</option>
          <option value="past_due">Overdue</option>
          <option value="cancelled">Cancelled</option>
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
          <p className="mt-4 text-sm text-muted-foreground">Loading invoices...</p>
        </div>
      ) : invoices.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-card py-24">
          <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground">No invoices found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {search || statusFilter ? 'Try adjusting your search or filters.' : 'Invoices will appear once subscriptions are created.'}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-medium text-muted-foreground">Invoice</th>
                  <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-medium text-muted-foreground">School</th>
                  <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-medium text-muted-foreground">Plan</th>
                  <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-medium text-muted-foreground">Amount</th>
                  <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-medium text-muted-foreground">Date</th>
                  <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-medium text-muted-foreground">Due</th>
                  <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                  <th className="whitespace-nowrap px-6 py-3 text-right text-xs font-medium text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-border/50 transition-colors last:border-0 hover:bg-muted/50">
                    <td className="whitespace-nowrap px-6 py-3 font-mono text-xs text-muted-foreground">{inv.invoiceId}</td>
                    <td className="whitespace-nowrap px-6 py-3 font-medium text-foreground">{inv.schoolName}</td>
                    <td className="whitespace-nowrap px-6 py-3 text-muted-foreground">{inv.planName}</td>
                    <td className="whitespace-nowrap px-6 py-3 font-mono text-foreground">
                      {formatCurrency(inv.amount, inv.currency)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-muted-foreground">{formatDate(inv.date)}</td>
                    <td className="whitespace-nowrap px-6 py-3 text-muted-foreground">
                      {inv.dueDate ? formatDate(inv.dueDate) : '—'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyles[inv.status]}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-right">
                      <button
                        onClick={() => window.open(`/api/admin/invoices/${inv.id}`, '_blank')}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-input bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted"
                      >
                        <Download className="h-3.5 w-3.5" />
                        PDF
                      </button>
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
