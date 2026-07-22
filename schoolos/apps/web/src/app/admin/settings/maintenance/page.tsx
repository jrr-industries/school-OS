'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { Construction, Save, Loader2, AlertCircle } from 'lucide-react';

interface Setting {
  key: string;
  value: string;
}

export default function MaintenancePage() {
  const [enabled, setEnabled] = useState(false);
  const [message, setMessage] = useState('SchoolOS is currently undergoing scheduled maintenance. We will be back shortly.');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/settings?group=maintenance');
      const json = await res.json();
      if (json.success) {
        const data = (json.data.maintenance || []) as Setting[];
        data.forEach((s: Setting) => {
          if (s.key === 'maintenance_mode') setEnabled(s.value === 'true');
          if (s.key === 'maintenance_message') setMessage(s.value);
        });
      }
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
      const entries = [
        { key: 'maintenance_mode', value: String(enabled) },
        { key: 'maintenance_message', value: message },
      ];
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ group: 'maintenance', settings: entries }),
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

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Maintenance Mode</h1>
        <p className="text-sm text-muted-foreground mt-1">Control platform availability</p>
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
            <Construction className="h-5 w-5 text-primary" />
            Maintenance Mode Toggle
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="text-sm font-medium">Maintenance Mode</p>
              <p className="text-xs text-muted-foreground">
                {enabled ? 'Platform is currently in maintenance mode. Users cannot access the system.' : 'Platform is operational and accessible to all users.'}
              </p>
            </div>
            <button role="switch" aria-checked={enabled} onClick={() => setEnabled(!enabled)}
              className={`peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${enabled ? 'bg-red-500' : 'bg-input'}`}>
              <span className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Custom Message</label>
            <textarea rows={3} value={message} onChange={e => setMessage(e.target.value)}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
          </div>

          <div className="flex justify-end pt-2">
            <button onClick={handleSave} disabled={saving} className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors gap-2 disabled:opacity-50">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
