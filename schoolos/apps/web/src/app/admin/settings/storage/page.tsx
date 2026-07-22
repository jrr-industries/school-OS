'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { HardDrive, Save, Cloud, FolderOpen, Database, Loader2, AlertCircle } from 'lucide-react';

interface Setting {
  key: string;
  value: string;
}

const providers = [
  { value: 's3', label: 'Amazon S3', icon: Cloud },
  { value: 'gcs', label: 'Google Cloud Storage', icon: Database },
  { value: 'local', label: 'Local Storage', icon: FolderOpen },
];

export default function StorageSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/settings?group=storage');
      const json = await res.json();
      if (json.success) {
        const map: Record<string, string> = {};
        (json.data.storage || []).forEach((s: Setting) => { map[s.key] = s.value; });
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
        body: JSON.stringify({ group: 'storage', settings: entries }),
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

  const selectedProvider = settings.provider || 's3';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Storage Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage storage providers and limits</p>
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
            <HardDrive className="h-5 w-5 text-primary" />
            Storage Provider
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            {providers.map((p) => {
              const Icon = p.icon;
              return (
                <button key={p.value} onClick={() => update('provider', p.value)}
                  className={`flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors ${selectedProvider === p.value ? 'border-primary bg-primary/10 text-primary' : 'border-input bg-background hover:bg-slate-50 dark:hover:bg-slate-900'}`}>
                  <Icon className="h-4 w-4" />
                  {p.label}
                </button>
              );
            })}
          </div>
          {selectedProvider === 's3' && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">AWS Access Key ID</label>
                  <input type="text" value={settings.awsAccessKeyId || settings.aws_access_key_id || ''} onChange={e => update('aws_access_key_id', e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">AWS Secret Access Key</label>
                  <input type="password" value={settings.awsSecretAccessKey || settings.aws_secret_access_key || ''} onChange={e => update('aws_secret_access_key', e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Region</label>
                  <select value={settings.s3Region || settings.s3_region || 'us-east-1'} onChange={e => update('s3_region', e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <option value="us-east-1">us-east-1</option>
                    <option value="us-west-2">us-west-2</option>
                    <option value="eu-west-1">eu-west-1</option>
                    <option value="ap-southeast-1">ap-southeast-1</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bucket Name</label>
                  <input type="text" value={settings.s3Bucket || settings.s3_bucket || ''} onChange={e => update('s3_bucket', e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                </div>
              </div>
            </>
          )}
          {selectedProvider === 'gcs' && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Project ID</label>
                <input type="text" value={settings.gcsProjectId || settings.gcs_project_id || ''} onChange={e => update('gcs_project_id', e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Bucket Name</label>
                <input type="text" value={settings.gcsBucket || settings.gcs_bucket || ''} onChange={e => update('gcs_bucket', e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              </div>
            </>
          )}
          {selectedProvider === 'local' && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Storage Path</label>
                <input type="text" value={settings.localPath || settings.local_path || ''} onChange={e => update('local_path', e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Max Local Storage (GB)</label>
                <input type="number" value={settings.maxLocalStorage || settings.max_local_storage || '500'} onChange={e => update('max_local_storage', e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              </div>
            </>
          )}
          <div className="flex justify-end pt-2">
            <button onClick={handleSave} disabled={saving} className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors gap-2 disabled:opacity-50">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? 'Saving...' : 'Save Provider'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
