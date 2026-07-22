'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { MessageSquare, Send, Users, Loader2, AlertCircle } from 'lucide-react';

interface SmsItem {
  id: string;
  title: string;
  message: string | null;
  createdAt: string;
}

export default function SMSBroadcastPage() {
  const [data, setData] = useState<SmsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [target, setTarget] = useState('All Users');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/notifications?type=warning&category=communication&limit=50');
      const json = await res.json();
      if (json.success) setData(json.data);
      else setError(json.error || 'Failed to load');
    } catch {
      setError('Failed to fetch sent messages');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSend = async () => {
    if (!message.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: `SMS: ${target}`,
            message: message,
            type: 'warning',
            category: 'communication',
            metadata: { channel: 'sms', target },
          }),
      });
      const json = await res.json();
      if (json.success) {
        setMessage('');
        fetchData();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">SMS Broadcast</h1>
        <p className="text-sm text-muted-foreground mt-1">Send SMS messages to schools and users</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Compose Message
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Audience</label>
              <select value={target} onChange={(e) => setTarget(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <option>All Users</option>
                <option>All Schools</option>
                <option>Teachers</option>
                <option>Parents</option>
                <option>School Admins</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} placeholder="Type your SMS message here... (160 characters recommended)" className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
              <p className="text-xs text-muted-foreground text-right">{message.length} / 160 characters</p>
            </div>
            <div className="flex justify-end pt-2">
              <button onClick={handleSend} disabled={submitting || !message.trim()} className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors gap-2 disabled:opacity-50">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Send Broadcast
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Audience Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between"><span className="text-sm">Total Users</span><span className="text-sm font-bold">52,300</span></div>
            <div className="flex items-center justify-between"><span className="text-sm">Schools</span><span className="text-sm font-bold">156</span></div>
            <div className="flex items-center justify-between"><span className="text-sm">Teachers</span><span className="text-sm font-bold">3,840</span></div>
            <div className="flex items-center justify-between"><span className="text-sm">Parents</span><span className="text-sm font-bold">28,000</span></div>
            <div className="flex items-center justify-between"><span className="text-sm">School Admins</span><span className="text-sm font-bold">312</span></div>
            <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
              <div className="flex items-center justify-between"><span className="text-sm font-medium">Monthly SMS Used</span><span className="text-sm font-bold">12,450 / 50,000</span></div>
              <div className="mt-2 h-2 rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-2 rounded-full bg-primary" style={{ width: '25%' }} /></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Send className="h-5 w-5 text-primary" />
            Sent Messages
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
              <MessageSquare className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No SMS messages sent yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Message</th>
                    <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Title</th>
                    <th className="text-left font-medium text-muted-foreground pb-3">Sent At</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((m) => (
                    <tr key={m.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                      <td className="py-3 pr-4 max-w-sm truncate font-medium">{m.message || m.title}</td>
                      <td className="py-3 pr-4 text-muted-foreground text-xs">{m.title}</td>
                      <td className="py-3 text-muted-foreground text-xs">{new Date(m.createdAt).toLocaleString()}</td>
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
