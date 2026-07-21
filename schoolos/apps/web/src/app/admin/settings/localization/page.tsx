'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { Globe2, Save } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  native: string;
  enabled: boolean;
}

const defaultLanguages: Language[] = [
  { code: 'en', name: 'English', native: 'English', enabled: true },
  { code: 'es', name: 'Spanish', native: 'Español', enabled: true },
  { code: 'fr', name: 'French', native: 'Français', enabled: false },
  { code: 'de', name: 'German', native: 'Deutsch', enabled: true },
  { code: 'ja', name: 'Japanese', native: '日本語', enabled: false },
];

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
        checked ? 'bg-primary' : 'bg-input'
      }`}
    >
      <span
        className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

export default function LocalizationPage() {
  const [languages, setLanguages] = useState(defaultLanguages);
  const [defaultLang, setDefaultLang] = useState('en');

  const toggleLanguage = (code: string) => {
    setLanguages((prev) =>
      prev.map((lang) =>
        lang.code === code ? { ...lang, enabled: !lang.enabled } : lang
      )
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Localization</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage languages and regional settings</p>
      </div>

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
                      <input
                        type="radio"
                        name="default-language"
                        checked={defaultLang === lang.code}
                        onChange={() => setDefaultLang(lang.code)}
                        disabled={!lang.enabled}
                        className="h-4 w-4 border-slate-300 text-primary focus:ring-primary cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe2 className="h-5 w-5 text-primary" />
            Regional Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Format</label>
              <select
                defaultValue="MM/DD/YYYY"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option>MM/DD/YYYY</option>
                <option>DD/MM/YYYY</option>
                <option>YYYY-MM-DD</option>
                <option>DD.MM.YYYY</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Format</label>
              <select
                defaultValue="12h"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="12h">12-hour (AM/PM)</option>
                <option value="24h">24-hour</option>
              </select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Number Format</label>
              <select
                defaultValue="1,234.56"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option>1,234.56</option>
                <option>1 234.56</option>
                <option>1.234,56</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Currency</label>
              <select
                defaultValue="USD"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>GBP (£)</option>
                <option>JPY (¥)</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
