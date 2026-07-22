'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { Globe2, Save, Loader2, AlertCircle } from 'lucide-react';

interface Language { code: string; name: string; native: string; enabled: boolean; }

const defaultLanguages: Language[] = [
  { code: 'en', name: 'English', native: 'English', enabled: true },
  { code: 'es', name: 'Spanish', native: 'Español', enabled: true },
  { code: 'fr', name: 'French', native: 'Français', enabled: false },
  { code: 'de', name: 'German', native: 'Deutsch', enabled: true },
  { code: 'ja', name: 'Japanese', native: '日本語', enabled: false },
];

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button role="switch" aria-checked={checked} onClick={onChange}
      className={`peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${checked ? 'bg-primary' : 'bg-input'}`}>
      <span className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
}

export default function LocalizationPage() {
  const [languages, setLanguages] = useState(defaultLanguages);
  const [defaultLang, setDefaultLang] = useState('en');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/settings?group=localization');
      const json = await res.json();
      if (json.success) setLoading(false);
      else setError(json.error || 'Failed to load');
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
        { key: 'default_language', value: defaultLang },
        ...languages.map(l => ({ key: `lang_${l.code}`, value: String(l.enabled) })),
      ];
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ group: 'localization', settings: entries }),
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

  const toggleLanguage = (code: string) => {
    setLanguages(prev => prev.map(l => l.code === code ? { ...l, enabled: !l.enabled } : l));
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Localization</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage languages and regional settings</p>
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
            <Globe2 className="h-5 w-5 text-primary" />
            Languages
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Language</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Native Name</th>
                  <th className="text-center py-3 px-2 font-medium text-muted-foreground">Enabled</th>
                  <th className="text-center py-3 px-2 font-medium text-muted-foreground">Default</th>
                </tr>
              </thead>
              <tbody>
                {languages.map((lang) => (
                  <tr key={lang.code} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-3 px-2 font-medium">
                      <span className={`${!lang.enabled ? 'text-muted-foreground' : ''}`}>{lang.name}</span>
                    </td>
                    <td className="py-3 px-2 text-muted-foreground">{lang.native}</td>
                    <td className="py-3 px-2 text-center">
                      <div className="flex justify-center">
                        <ToggleSwitch checked={lang.enabled} onChange={() => toggleLanguage(lang.code)} />
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <input type="radio" name="default-language" checked={defaultLang === lang.code} onChange={() => setDefaultLang(lang.code)} disabled={!lang.enabled}
                        className="h-4 w-4 border-slate-300 text-primary focus:ring-primary cursor-pointer disabled:cursor-not-allowed disabled:opacity-50" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving} className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors gap-2 disabled:opacity-50">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
