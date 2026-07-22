'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { Mail, Plus, Loader2, AlertCircle } from 'lucide-react';

interface CampaignItem {
  id: string;
  title: string;
  message: string | null;
  createdAt: string;
  metadata: Record<string, unknown> | null;
}

export default function EmailCampaignsPage() {
  const [data, setData] = useState<CampaignItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/notifications?type=info&category=communication&limit=50');
      const json = await res.json();
      if (json.success) setData(json.data);
      else setError(json.error || 'Failed to load');
    } catch {
      setError('Failed to fetch campaigns');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCreate = async () => {
    if (!formTitle.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formTitle,
          message: formMessage,
          type: 'info',
          category: 'communication',
          metadata: { channel: 'email' },
        }),
      });
      const json = await res.json();
      if (json.success) {
        setShowModal(false);
        setFormTitle('');
        setFormMessage('');
        fetchData();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Email Campaigns</h1>
          <p className="text-sm text-muted-foreground mt-1">Create and manage email marketing campaigns</p>
        </div>
        <button onClick={() => setShowModal(true)} className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors gap-2">
          <Plus className="h-4 w-4" />
          New Campaign
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowModal(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl w-full max-w-lg p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold">New Campaign</h2>
            <div className="space-y-2">
              <label className="text-sm font-medium">Campaign Name</label>
              <input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="Campaign name" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Content</label>
              <textarea value={formMessage} onChange={(e) => setFormMessage(e.target.value)} rows={4} placeholder="Email content..." className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setShowModal(false)} className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent transition-colors">Cancel</button>
              <button onClick={handleCreate} disabled={submitting || !formTitle.trim()} className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors gap-2 disabled:opacity-50">
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Campaigns
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <p className="text-sm text-muted-foreground">{error}</p>
              <button onClick={fetchData} className="text-sm text-primary hover:underline">Retry</button>
            </div>
          ) : data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Mail className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No email campaigns yet.</p>
              <button onClick={() => setShowModal(true)} className="mt-3 text-sm text-primary hover:underline">Create one</button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Campaign</th>
                    <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Content</th>
                    <th className="text-left font-medium text-muted-foreground pb-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((c) => (
                    <tr key={c.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                      <td className="py-3 pr-4 font-medium">{c.title}</td>
                      <td className="py-3 pr-4 text-muted-foreground max-w-xs truncate">{c.message || '-'}</td>
                      <td className="py-3 text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</td>
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
