'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { Palette, Upload, Save, Eye, Loader2, AlertCircle } from 'lucide-react';

interface Setting {
  key: string;
  value: string;
}

export default function BrandingPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/settings?group=branding');
      const json = await res.json();
      if (json.success) {
        const map: Record<string, string> = {};
        (json.data.branding || []).forEach((s: Setting) => { map[s.key] = s.value; });
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
        body: JSON.stringify({ group: 'branding', settings: entries }),
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

  const primaryColor = settings.primaryColor || settings.primary_color || '#2563eb';
  const accentColor = settings.accentColor || settings.accent_color || '#8b5cf6';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Branding</h1>
        <p className="text-sm text-muted-foreground mt-1">Customize the platform visual identity</p>
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

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                Logo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-900">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Upload Logo</p>
                  <p className="text-xs text-muted-foreground">PNG, SVG, or JPG. 256x256px</p>
                  <button className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90">Choose File</button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Colors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Primary Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={primaryColor} onChange={e => update('primary_color', e.target.value)} className="h-10 w-14 rounded-md border border-input bg-background p-1 cursor-pointer" />
                    <input type="text" value={primaryColor} onChange={e => update('primary_color', e.target.value)} className="flex h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Accent Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={accentColor} onChange={e => update('accent_color', e.target.value)} className="h-10 w-14 rounded-md border border-input bg-background p-1 cursor-pointer" />
                    <input type="text" value={accentColor} onChange={e => update('accent_color', e.target.value)} className="flex h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border bg-white p-6 dark:bg-slate-950">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded text-white text-sm font-bold" style={{ backgroundColor: primaryColor }}>S</div>
                <div>
                  <p className="font-semibold" style={{ color: primaryColor }}>SchoolOS</p>
                  <p className="text-xs text-muted-foreground">Education Platform</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
                <div className="mt-4 flex gap-2">
                  <span className="rounded px-3 py-1 text-xs text-white" style={{ backgroundColor: primaryColor }}>Button</span>
                  <span className="rounded px-3 py-1 text-xs text-white" style={{ backgroundColor: accentColor }}>Accent</span>
                  <span className="rounded border border-slate-300 px-3 py-1 text-xs dark:border-slate-600">Outline</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Preview updates as you change values above.</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving} className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors gap-2 disabled:opacity-50">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
