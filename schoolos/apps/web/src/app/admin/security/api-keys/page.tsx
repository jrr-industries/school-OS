'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { Key, Plus, Eye, XCircle, Copy, Loader2, AlertCircle } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

const mockKeys = [
  { id: '1', name: 'Production Backend', key: 'sk_live_••••••••••••••••••••••', createdBy: 'Super Admin', createdDate: '2026-01-15', lastUsed: '2 min ago', status: 'active' },
  { id: '2', name: 'Staging Environment', key: 'sk_test_••••••••••••••••••••••', createdBy: 'John Smith', createdDate: '2026-03-20', lastUsed: '1 hour ago', status: 'active' },
  { id: '3', name: 'Mobile App API', key: 'sk_live_••••••••••••••••••••••', createdBy: 'Sarah Johnson', createdDate: '2026-02-10', lastUsed: '5 min ago', status: 'active' },
  { id: '4', name: 'Analytics Integration', key: 'sk_live_••••••••••••••••••••••', createdBy: 'Michael Chen', createdDate: '2026-04-05', lastUsed: '1 day ago', status: 'active' },
  { id: '5', name: 'Legacy Integration', key: 'sk_live_••••••••••••••••••••••', createdBy: 'Robert Wilson', createdDate: '2025-06-01', lastUsed: '3 months ago', status: 'revoked' },
  { id: '6', name: 'Testing Key', key: 'sk_test_••••••••••••••••••••••', createdBy: 'Emily Davis', createdDate: '2025-11-15', lastUsed: '6 months ago', status: 'expired' },
];

const statusBadge = (status: string) => {
  switch (status) {
    case 'active': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
    case 'revoked': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case 'expired': return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200';
    default: return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200';
  }
};

export default function ApiKeysPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/users?limit=100');
      const json = await res.json();
      if (json.success) setUsers(json.data || []);
      else setError(json.error || 'Failed to load data');
    } catch {
      setError('Failed to fetch users');
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
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">API Keys</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage platform API keys — {users.length} platform users</p>
        </div>
        <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors gap-2">
          <Plus className="h-4 w-4" />
          Create API Key
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            API Keys
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Name</th>
                  <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Key</th>
                  <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Created By</th>
                  <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Created Date</th>
                  <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Last Used</th>
                  <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Status</th>
                  <th className="text-right font-medium text-muted-foreground pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockKeys.map((k) => (
                  <tr key={k.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <td className="py-3 pr-4 font-medium">{k.name}</td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-muted-foreground">{k.key}</span>
                        <button className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Copy key">
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">{k.createdBy}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{k.createdDate}</td>
                    <td className="py-3 pr-4 text-xs">{k.lastUsed}</td>
                    <td className="py-3 pr-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge(k.status)}`}>
                        {k.status.charAt(0).toUpperCase() + k.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-muted-foreground hover:text-foreground transition-colors" aria-label="Toggle visibility">
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-muted-foreground hover:text-red-500 transition-colors" aria-label="Revoke key">
                          <XCircle className="h-3.5 w-3.5" />
                        </button>
                      </div>
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
