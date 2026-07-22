'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { Mail, Send, Save, Loader2, AlertCircle } from 'lucide-react';

interface Setting {
  key: string;
  value: string;
}

export default function EmailSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/settings?group=email');
      const json = await res.json();
      if (json.success) {
        const map: Record<string, string> = {};
        (json.data.email || []).forEach((s: Setting) => { map[s.key] = s.value; });
        setSettings(map);
      } else setError(json.error || 'Failed to load');
    } catch {
      setError('Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    setError(null);
    try {
      const entries = Object.entries(settings).map(([key, value]) => ({ key, value }));
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ group: 'email', settings: entries }),
      });
      const json = await res.json();
      if (json.success) setSuccess(true);
      else setError(json.error || 'Failed to save');
    } catch {
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const update = (key: string, value: string) => setSettings(prev => ({ ...prev, [key]: value }));

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );

  const provider = settings.provider || 'sendgrid';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Email Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure email delivery and templates</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
          <button onClick={fetchSettings} className="ml-auto text-xs underline">Retry</button>
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-400">Settings saved successfully</div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            SMTP Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Provider</label>
            <div className="flex gap-2">
              {[{ value: 'sendgrid', label: 'SendGrid' }, { value: 'mailgun', label: 'Mailgun' }, { value: 'smtp', label: 'SMTP' }].map(p => (
                <button key={p.value} onClick={() => update('provider', p.value)}
                  className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${provider === p.value ? 'border-primary bg-primary/10 text-primary' : 'border-input bg-background hover:bg-slate-50 dark:hover:bg-slate-900'}`}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          {provider === 'smtp' ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">SMTP Host</label>
                  <input type="text" value={settings.smtpHost || settings.smtp_host || ''} onChange={e => update('smtp_host', e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">SMTP Port</label>
                  <input type="number" value={settings.smtpPort || settings.smtp_port || '587'} onChange={e => update('smtp_port', e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Username</label>
                  <input type="text" value={settings.smtpUsername || settings.smtp_username || ''} onChange={e => update('smtp_username', e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Password</label>
                  <input type="password" value={settings.smtpPassword || settings.smtp_password || ''} onChange={e => update('smtp_password', e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Encryption</label>
                <select value={settings.smtpEncryption || settings.smtp_encryption || 'tls'} onChange={e => update('smtp_encryption', e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <option value="tls">TLS</option>
                  <option value="ssl">SSL</option>
                  <option value="none">None</option>
                </select>
              </div>
            </>
          ) : provider === 'sendgrid' ? (
            <div className="space-y-2">
              <label className="text-sm font-medium">SendGrid API Key</label>
              <input type="password" value={settings.sendgridApiKey || settings.sendgrid_api_key || ''} onChange={e => update('sendgrid_api_key', e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-sm font-medium">Mailgun API Key</label>
              <input type="password" value={settings.mailgunApiKey || settings.mailgun_api_key || ''} onChange={e => update('mailgun_api_key', e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>
          )}
          <div className="flex items-center gap-4 pt-2">
            <button onClick={handleSave} disabled={saving} className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors gap-2 disabled:opacity-50">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
            <button className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors gap-2">
              <Send className="h-4 w-4" />
              Test Email
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
