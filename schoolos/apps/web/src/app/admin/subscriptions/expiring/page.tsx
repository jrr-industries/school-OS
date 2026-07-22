'use client';

import { useState, useEffect, useCallback } from 'react';
import { Clock, RefreshCw, Loader2, AlertCircle } from 'lucide-react';

interface Subscription {
  id: string;
  schoolName: string;
  planName: string;
  status: string;
  endsAt: string | null;
  autoRenew: boolean;
}

export default function ExpiringSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/subscriptions?limit=100');
      const data = await res.json();
      if (!data.success) { setError(data.error); return; }
      const now = new Date();
      const thirtyDaysFromNow = new Date(now.getTime() + 30 * 86400000);
      const expiring = (data.data ?? []).filter((s: Subscription) => {
        if (!s.endsAt) return false;
        const end = new Date(s.endsAt);
        return end >= now && end <= thirtyDaysFromNow;
      });
      setSubscriptions(expiring);
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  function daysLeft(dateStr: string): number {
    return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground">Expiring Soon</h1>
        <p className="text-sm text-muted-foreground mt-1">Subscriptions that will expire within 30 days</p>
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
          <span className="ml-2 text-sm text-muted-foreground">Loading subscriptions...</span>
        </div>
      ) : (
        <div className="rounded-xl border bg-card">
          <div className="px-6 pb-3 pt-5">
            <p className="text-sm font-semibold text-foreground">Expiring Subscriptions ({subscriptions.length})</p>
          </div>
          <div>
            {subscriptions.length === 0 ? (
              <p className="px-6 pb-5 text-sm text-muted-foreground">No subscriptions expiring in the next 30 days.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left font-medium py-3 px-4 text-muted-foreground text-xs">School</th>
                      <th className="text-left font-medium py-3 px-4 text-muted-foreground text-xs">Plan</th>
                      <th className="text-left font-medium py-3 px-4 text-muted-foreground text-xs">Expiry Date</th>
                      <th className="text-left font-medium py-3 px-4 text-muted-foreground text-xs">Days Left</th>
                      <th className="text-left font-medium py-3 px-4 text-muted-foreground text-xs">Auto-renew</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptions.map((sub) => {
                      const days = daysLeft(sub.endsAt!);
                      return (
                        <tr key={sub.id} className="border-b border-border/50 last:border-0 hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium text-foreground">{sub.schoolName}</td>
                          <td className="py-3 px-4 text-muted-foreground">{sub.planName}</td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {new Date(sub.endsAt!).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Clock className={`h-4 w-4 ${days <= 7 ? 'text-red-500' : 'text-amber-500'}`} />
                              <span className={`font-medium ${days <= 7 ? 'text-red-600 dark:text-red-400' : 'text-foreground'}`}>
                                {days} days
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5">
                              <RefreshCw className={`h-3.5 w-3.5 ${sub.autoRenew ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`} />
                              <span className="text-muted-foreground">{sub.autoRenew ? 'On' : 'Off'}</span>
                            </div>
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
