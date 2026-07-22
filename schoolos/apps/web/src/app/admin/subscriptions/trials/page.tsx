'use client';

import { useState, useEffect, useCallback } from 'react';
import { Clock, Loader2, AlertCircle } from 'lucide-react';

interface Subscription {
  id: string;
  schoolName: string;
  planName: string;
  status: string;
  startsAt: string;
  endsAt: string | null;
  trialEndsAt: string | null;
}

export default function TrialSchoolsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/subscriptions?limit=50');
      const data = await res.json();
      if (!data.success) { setError(data.error); return; }
      setSubscriptions((data.data ?? []).filter((s: Subscription) => s.status === 'trial'));
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  function daysRemaining(dateStr: string | null): number | null {
    if (!dateStr) return null;
    const diff = new Date(dateStr).getTime() - Date.now();
    return Math.ceil(diff / 86400000);
  }

  function statusFromDays(days: number | null): { label: string; color: string } {
    if (days === null) return { label: 'Unknown', color: 'bg-muted text-muted-foreground' };
    if (days < 0) return { label: 'Expired', color: 'bg-red-500/10 text-red-600 dark:text-red-400' };
    if (days <= 7) return { label: 'Expiring', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' };
    return { label: 'Active', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' };
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground">Trial Schools</h1>
        <p className="text-sm text-muted-foreground mt-1">Schools currently on a free trial</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">Loading trials...</span>
        </div>
      ) : (
        <div className="rounded-xl border bg-card">
          <div className="px-6 pb-3 pt-5">
            <p className="text-sm font-semibold text-foreground">Trial Schools ({subscriptions.length})</p>
          </div>
          <div>
            {subscriptions.length === 0 ? (
              <p className="px-6 pb-5 text-sm text-muted-foreground">No trial subscriptions found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left font-medium py-3 px-4 text-muted-foreground text-xs">School</th>
                      <th className="text-left font-medium py-3 px-4 text-muted-foreground text-xs">Plan</th>
                      <th className="text-left font-medium py-3 px-4 text-muted-foreground text-xs">Started</th>
                      <th className="text-left font-medium py-3 px-4 text-muted-foreground text-xs">Trial Ends</th>
                      <th className="text-left font-medium py-3 px-4 text-muted-foreground text-xs">Days Left</th>
                      <th className="text-right font-medium py-3 px-4 text-muted-foreground text-xs">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptions.map((sub) => {
                      const days = daysRemaining(sub.trialEndsAt || sub.endsAt);
                      const statusInfo = statusFromDays(days);
                      return (
                        <tr key={sub.id} className="border-b border-border/50 last:border-0 hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium text-foreground">{sub.schoolName}</td>
                          <td className="py-3 px-4 text-muted-foreground">{sub.planName}</td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {new Date(sub.startsAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {sub.trialEndsAt ? new Date(sub.trialEndsAt).toLocaleDateString() : sub.endsAt ? new Date(sub.endsAt).toLocaleDateString() : '—'}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Clock className={`h-4 w-4 ${days !== null && days < 0 ? 'text-red-500' : days !== null && days <= 7 ? 'text-amber-500' : 'text-muted-foreground'}`} />
                              <span className={`font-medium ${days !== null && days < 0 ? 'text-red-600 dark:text-red-400' : 'text-foreground'}`}>
                                {days !== null ? (days < 0 ? 'Expired' : `${days} days`) : '—'}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusInfo.color}`}>
                              {statusInfo.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
