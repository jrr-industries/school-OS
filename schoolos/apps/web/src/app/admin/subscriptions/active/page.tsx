'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  AlertCircle,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  TrendingUp,
  CalendarClock,
  ToggleLeft,
  FlaskConical,
  Trash2,
  Loader2,
  X,
} from 'lucide-react';

interface SubscriptionRow {
  id: string;
  schoolId: string;
  schoolName: string;
  schoolSlug: string;
  schoolStatus: string;
  planId: string;
  planName: string;
  planPrice: number;
  planCurrency: string;
  planInterval: string;
  planMaxStudents: number;
  planMaxTeachers: number;
  status: string;
  startsAt: string;
  endsAt: string | null;
  trialEndsAt: string | null;
  autoRenew: boolean;
  studentCount: number;
  teacherCount: number;
  createdAt: string;
}

interface Summary {
  totalActiveSubscriptions: number;
  monthlyRecurringRevenue: number;
  annualRecurringRevenue: number;
  expiringNext30Days: number;
  autoRenewEnabled: number;
  trialSchools: number;
  availablePlans: { id: string; name: string }[];
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
  active: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:text-emerald-400',
  past_due: 'bg-amber-500/10 text-amber-600 border-amber-500/30 dark:text-amber-400',
  cancelled: 'bg-red-500/10 text-red-600 border-red-500/30 dark:text-red-400',
  trial: 'bg-blue-500/10 text-blue-600 border-blue-500/30 dark:text-blue-400',
  expired: 'bg-slate-500/10 text-slate-600 border-slate-500/30 dark:text-slate-400',
  inactive: 'bg-slate-500/10 text-slate-600 border-slate-500/30 dark:text-slate-400',
};

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function ActiveSubscriptionsPage() {
  const [data, setData] = useState<SubscriptionRow[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [autoRenewFilter, setAutoRenewFilter] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<SubscriptionRow | null>(null);
  const [removing, setRemoving] = useState(false);
  const [removeError, setRemoveError] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      params.set('limit', '20');
      params.set('page', String(page));
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      if (planFilter) params.set('plan', planFilter);
      if (autoRenewFilter) params.set('autoRenew', autoRenewFilter);
      if (sort) params.set('sort', sort);

      const res = await fetch(`/api/admin/subscriptions?${params.toString()}`);
      const json = await res.json();
      if (!json.success) { setError(json.error || 'Failed to load'); return; }
      setData(json.data ?? []);
      setSummary(json.summary ?? null);
      setMeta(json.meta ?? null);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, planFilter, autoRenewFilter, sort]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleRemove = async () => {
    if (!removeTarget) return;
    setRemoving(true);
    setRemoveError('');
    try {
      const res = await fetch(`/api/admin/subscriptions/${removeTarget.id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!json.success) {
        setRemoveError(json.error || 'Failed to remove subscription');
        return;
      }
      setShowRemoveModal(false);
      setRemoveTarget(null);
      fetchData();
    } catch {
      setRemoveError('Network error');
    } finally {
      setRemoving(false);
    }
  };

  const canRemove = (status: string) =>
    status !== 'cancelled' && status !== 'expired' && status !== 'inactive';

  const summaryCards = summary ? [
    { label: 'Active Subscriptions', value: summary.totalActiveSubscriptions, icon: CreditCard, accent: 'text-emerald-500 dark:text-emerald-400' },
    { label: 'Monthly Revenue (MRR)', value: formatCurrency(summary.monthlyRecurringRevenue, 'USD'), icon: TrendingUp, accent: 'text-cyan-600 dark:text-cyan-400' },
    { label: 'Annual Revenue (ARR)', value: formatCurrency(summary.annualRecurringRevenue, 'USD'), icon: TrendingUp, accent: 'text-indigo-600 dark:text-indigo-400' },
    { label: 'Expiring in 30 Days', value: summary.expiringNext30Days, icon: CalendarClock, accent: 'text-amber-600 dark:text-amber-400' },
    { label: 'Auto-Renew On', value: summary.autoRenewEnabled, icon: ToggleLeft, accent: 'text-emerald-500 dark:text-emerald-400' },
    { label: 'Trial Schools', value: summary.trialSchools, icon: FlaskConical, accent: 'text-blue-600 dark:text-blue-400' },
  ] : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground">Active Subscriptions</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage all platform subscriptions</p>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span className="flex-1">{error}</span>
          <button onClick={fetchData} className="rounded-md border border-destructive/30 px-3 py-1 text-xs font-medium text-destructive hover:bg-destructive/10">
            Retry
          </button>
        </div>
      )}

      {summary && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {summaryCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="rounded-xl border bg-card p-4">
                <div className="flex items-center justify-between">
                  <Icon className={`h-4 w-4 ${card.accent}`} />
                </div>
                <p className="mt-2 font-mono text-xl font-bold text-foreground">{card.value}</p>
                <p className="text-xs text-muted-foreground">{card.label}</p>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by school name..."
            className="flex h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring/50 focus:outline-none focus:ring-1 focus:ring-ring/30"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-ring/50 focus:outline-none focus:ring-1 focus:ring-ring/30"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="trial">Trial</option>
          <option value="past_due">Past Due</option>
          <option value="cancelled">Cancelled</option>
          <option value="expired">Expired</option>
        </select>

        <select
          value={planFilter}
          onChange={(e) => { setPlanFilter(e.target.value); setPage(1); }}
          className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-ring/50 focus:outline-none focus:ring-1 focus:ring-ring/30"
        >
          <option value="">All Plans</option>
          {summary?.availablePlans.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <select
          value={autoRenewFilter}
          onChange={(e) => { setAutoRenewFilter(e.target.value); setPage(1); }}
          className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-ring/50 focus:outline-none focus:ring-1 focus:ring-ring/30"
        >
          <option value="">Auto Renew: All</option>
          <option value="true">Auto Renew: On</option>
          <option value="false">Auto Renew: Off</option>
        </select>

        <select
          value={sort}
          onChange={(e) => { setSort(e.target.value); setPage(1); }}
          className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-ring/50 focus:outline-none focus:ring-1 focus:ring-ring/30"
        >
          <option value="newest">Newest First</option>
          <option value="expiry">Expiry Date</option>
          <option value="name">School Name</option>
        </select>

        <button
          onClick={() => { setSearch(''); setStatusFilter(''); setPlanFilter(''); setAutoRenewFilter(''); setSort('newest'); setPage(1); }}
          className="flex h-10 items-center gap-1.5 rounded-lg border border-input bg-background px-3 text-sm text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="relative">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-primary" />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Loading subscriptions...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-card py-24">
          <CreditCard className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground">No active subscriptions found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {search || statusFilter || planFilter || autoRenewFilter
              ? 'Try adjusting your search or filters.'
              : 'Create a school with a plan to get started.'}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border bg-card shadow-sm">
          <div className="px-4 pb-3 pt-4">
            <p className="text-sm font-semibold text-foreground">
              {meta ? `${meta.total} subscription${meta.total !== 1 ? 's' : ''}` : 'Subscriptions'}
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-muted-foreground">School</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-muted-foreground">Code</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-muted-foreground">Plan</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-muted-foreground">Price</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-muted-foreground">Interval</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-muted-foreground">Start</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-muted-foreground">Expiry</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-muted-foreground">Auto</th>
                  <th className="whitespace-nowrap px-4 py-3 text-right text-xs font-medium text-muted-foreground">Students</th>
                  <th className="whitespace-nowrap px-4 py-3 text-right text-xs font-medium text-muted-foreground">Teachers</th>
                  <th className="whitespace-nowrap px-4 py-3 text-right text-xs font-medium text-muted-foreground">Created</th>
                  <th className="whitespace-nowrap px-4 py-3 text-right text-xs font-medium text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody>
                {data.map((sub) => (
                  <tr
                    key={sub.id}
                    className="border-b border-border/50 transition-colors last:border-0 hover:bg-muted/50"
                  >
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">
                      {sub.schoolName}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-muted-foreground">
                      {sub.schoolSlug}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-foreground">
                      {sub.planName}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyles[sub.status] || statusStyles.inactive}`}>
                        {sub.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-foreground">
                      {formatCurrency(sub.planPrice, sub.planCurrency)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 capitalize text-muted-foreground">
                      {sub.planInterval}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                      {formatDate(sub.startsAt)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                      {sub.endsAt ? formatDate(sub.endsAt) : '—'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className={sub.autoRenew ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}>
                        {sub.autoRenew ? 'On' : 'Off'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-mono text-muted-foreground">
                      {sub.studentCount}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-mono text-muted-foreground">
                      {sub.teacherCount}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-muted-foreground">
                      {formatDate(sub.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      {canRemove(sub.status) && (
                        <button
                          onClick={() => { setRemoveTarget(sub); setShowRemoveModal(true); }}
                          className="inline-flex items-center gap-1.5 rounded-md bg-red-500/10 px-2.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-500/20 dark:text-red-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border px-4 py-3">
              <p className="text-xs text-muted-foreground">
                Page {meta.page} of {meta.totalPages} ({meta.total} total)
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!meta.hasPreviousPage}
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-input text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!meta.hasNextPage}
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-input text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {showRemoveModal && removeTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => !removing && setShowRemoveModal(false)} />
          <div className="relative w-full max-w-md rounded-xl border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
                  <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Remove Subscription</h3>
                  <p className="text-sm text-muted-foreground">
                    This will permanently remove the plan from this school.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowRemoveModal(false)}
                disabled={removing}
                className="rounded-md p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 rounded-lg bg-muted/50 p-4">
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-muted-foreground">School:</span>{' '}
                  <span className="font-medium text-foreground">{removeTarget.schoolName}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Plan:</span>{' '}
                  <span className="font-medium text-foreground">{removeTarget.planName}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Price:</span>{' '}
                  <span className="font-medium text-foreground">{formatCurrency(removeTarget.planPrice, removeTarget.planCurrency)} / {removeTarget.planInterval}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Status:</span>{' '}
                  <span className="font-medium capitalize text-foreground">{removeTarget.status.replace('_', ' ')}</span>
                </p>
                {removeTarget.endsAt && (
                  <p>
                    <span className="text-muted-foreground">Expires:</span>{' '}
                    <span className="font-medium text-foreground">{formatDate(removeTarget.endsAt)}</span>
                  </p>
                )}
              </div>
            </div>

            {removeError && (
              <div className="mt-3 flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{removeError}</span>
              </div>
            )}

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setShowRemoveModal(false)}
                disabled={removing}
                className="rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Keep Active
              </button>
              <button
                onClick={handleRemove}
                disabled={removing}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {removing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Removing...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Confirm Remove
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
