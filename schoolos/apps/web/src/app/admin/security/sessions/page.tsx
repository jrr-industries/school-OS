'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { Monitor, Users, Loader2, AlertCircle } from 'lucide-react';

interface AuditLog {
  id: string;
  action: string;
  entity: string;
  description: string | null;
  userName: string;
  schoolName: string;
  ipAddress: string;
  createdAt: string;
}

export default function SessionsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/audit/logs?action=login&limit=50');
      const json = await res.json();
      if (json.success) setLogs(json.data || []);
      else setError(json.error || 'Failed to load data');
    } catch {
      setError('Failed to fetch sessions');
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Active Sessions</h1>
        <p className="text-sm text-muted-foreground mt-1">View and manage all active user sessions</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="p-4">
            <div className="rounded-lg bg-primary/10 p-2 w-fit">
              <Monitor className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-3 text-2xl font-bold">{logs.length.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Login Events</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="rounded-lg bg-primary/10 p-2 w-fit">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-3 text-2xl font-bold">{new Set(logs.map(l => l.userName)).size.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Unique Users</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Monitor className="h-5 w-5 text-primary" />
            Login History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-sm text-muted-foreground">No login events found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left font-medium text-muted-foreground pb-3 pr-4">User</th>
                    <th className="text-left font-medium text-muted-foreground pb-3 pr-4">School</th>
                    <th className="text-left font-medium text-muted-foreground pb-3 pr-4">IP Address</th>
                    <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Description</th>
                    <th className="text-right font-medium text-muted-foreground pb-3">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                      <td className="py-3 pr-4 font-medium">{log.userName}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{log.schoolName}</td>
                      <td className="py-3 pr-4 font-mono text-xs text-muted-foreground">{log.ipAddress || 'N/A'}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{log.description || '-'}</td>
                      <td className="py-3 text-right text-xs text-muted-foreground">{new Date(log.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
