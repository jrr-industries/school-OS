'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { Bell, Send, Smartphone, Loader2, AlertCircle } from 'lucide-react';

interface PushItem {
  id: string;
  title: string;
  message: string | null;
  createdAt: string;
}

export default function PushNotificationsPage() {
  const [data, setData] = useState<PushItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formBody, setFormBody] = useState('');
  const [target, setTarget] = useState('All Users');
  const [schedule, setSchedule] = useState('now');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/notifications?type=success&category=communication&limit=50');
      const json = await res.json();
      if (json.success) setData(json.data);
      else setError(json.error || 'Failed to load');
    } catch {
      setError('Failed to fetch push notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSend = async () => {
    if (!formTitle.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: formTitle,
            message: formBody,
            type: 'success',
            category: 'communication',
            metadata: { channel: 'push', target, schedule },
          }),
      });
      const json = await res.json();
      if (json.success) {
        setFormTitle('');
        setFormBody('');
        fetchData();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Push Notifications</h1>
        <p className="text-sm text-muted-foreground mt-1">Send push notifications to mobile app users</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Compose Push Notification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} type="text" placeholder="Notification title" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Body</label>
              <textarea value={formBody} onChange={(e) => setFormBody(e.target.value)} rows={3} placeholder="Notification message body" className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Target</label>
              <select value={target} onChange={(e) => setTarget(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <option>All Users</option>
                <option>All Schools</option>
                <option>Teachers</option>
                <option>Parents</option>
                <option>Students</option>
                <option>Specific School...</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Schedule</label>
              <div className="flex gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <input type="radio" name="pus-schedule" checked={schedule === 'now'} onChange={() => setSchedule('now')} className="accent-primary" />
                  Send Now
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="radio" name="pus-schedule" checked={schedule === 'later'} onChange={() => setSchedule('later')} className="accent-primary" />
                  Schedule Later
                </label>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button onClick={handleSend} disabled={submitting || !formTitle.trim()} className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors gap-2 disabled:opacity-50">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Send Notification
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              Push Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between"><span className="text-sm">Total Sent (30d)</span><span className="text-sm font-bold">184,500</span></div>
            <div className="flex items-center justify-between"><span className="text-sm">Delivery Rate</span><span className="text-sm font-bold text-emerald-600">97.2%</span></div>
            <div className="flex items-center justify-between"><span className="text-sm">Open Rate</span><span className="text-sm font-bold">42.8%</span></div>
            <div className="flex items-center justify-between"><span className="text-sm">Active Devices</span><span className="text-sm font-bold">41,200</span></div>
            <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
              <div className="flex items-center justify-between"><span className="text-sm font-medium">Daily Limit</span><span className="text-sm font-bold">12,400 / 50,000</span></div>
              <div className="mt-2 h-2 rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-2 rounded-full bg-primary" style={{ width: '25%' }} /></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Sent Notifications Log
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
              <Bell className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No push notifications sent yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Title</th>
                    <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Body</th>
                    <th className="text-left font-medium text-muted-foreground pb-3">Sent At</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((p) => (
                    <tr key={p.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                      <td className="py-3 pr-4 font-medium">{p.title}</td>
                      <td className="py-3 pr-4 text-muted-foreground max-w-xs truncate">{p.message || '-'}</td>
                      <td className="py-3 text-muted-foreground text-xs">{new Date(p.createdAt).toLocaleString()}</td>
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
