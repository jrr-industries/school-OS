'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { HardDrive, FileImage, FileText, FileVideo, FileArchive, AlertTriangle, Cloud, Loader2, AlertCircle } from 'lucide-react';

const totalSpace = 1024;
const usedSpace = 782;
const usagePercent = Math.round((usedSpace / totalSpace) * 100);

const services = [
  { name: 'Student Documents', usage: 280, color: 'bg-blue-500' },
  { name: 'School Assets', usage: 195, color: 'bg-emerald-500' },
  { name: 'Backups', usage: 120, color: 'bg-violet-500' },
  { name: 'Logs', usage: 85, color: 'bg-amber-500' },
  { name: 'Uploads', usage: 62, color: 'bg-rose-500' },
  { name: 'Temporary', usage: 40, color: 'bg-slate-500' },
];

const fileTypes = [
  { label: 'Images', value: 245, icon: FileImage, color: 'text-pink-500', percent: 31 },
  { label: 'Documents', value: 198, icon: FileText, color: 'text-blue-500', percent: 25 },
  { label: 'Videos', value: 156, icon: FileVideo, color: 'text-violet-500', percent: 20 },
  { label: 'Archives', value: 98, icon: FileArchive, color: 'text-amber-500', percent: 13 },
  { label: 'Code', value: 85, icon: FileCode, color: 'text-emerald-500', percent: 11 },
];

import { FileCode } from 'lucide-react';

const cleanupSuggestions = [
  { item: 'Old backups (>30 days)', size: '45 GB', impact: 'high' },
  { item: 'Temporary uploads', size: '28 GB', impact: 'medium' },
  { item: 'Debug logs', size: '12 GB', impact: 'low' },
  { item: 'Trashed items', size: '8 GB', impact: 'low' },
];

const providers = [
  { name: 'Local Storage', status: 'active', type: 'Local' },
  { name: 'Amazon S3 (Backup)', status: 'active', type: 'S3 Compatible' },
  { name: 'Google Cloud Storage (Archive)', status: 'inactive', type: 'GCS' },
];

export default function StoragePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(r => setTimeout(r, 500));
      setLoading(false);
    } catch {
      setError('Failed to load');
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
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">System Storage</h1>
        <p className="text-sm text-muted-foreground mt-1">Storage system administration</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <HardDrive className="h-5 w-5 text-primary" />
            Overall Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="relative h-32 w-32 shrink-0">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" strokeWidth="3" className="text-slate-200 dark:text-slate-700" />
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray={`${usagePercent} ${100 - usagePercent}`} className="text-primary" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">{usagePercent}%</span>
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold">{usedSpace} GB</p>
              <p className="text-sm text-muted-foreground">of {totalSpace} GB used</p>
              <p className="text-xs text-muted-foreground mt-1">Free: {totalSpace - usedSpace} GB</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Per-Service Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {services.map((svc) => (
              <div key={svc.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium">{svc.name}</span>
                  <span className="text-sm text-muted-foreground">{svc.usage} GB</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                  <div className={`h-full rounded-full ${svc.color}`} style={{ width: `${(svc.usage / usedSpace) * 100}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">File Type Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {fileTypes.map((ft) => {
              const Icon = ft.icon;
              return (
                <div key={ft.label} className="flex items-center gap-3">
                  <div className="rounded-lg p-2 bg-slate-100 dark:bg-slate-800">
                    <Icon className={`h-4 w-4 ${ft.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{ft.label}</span>
                      <span className="text-sm text-muted-foreground">{ft.value} GB</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                      <div className={`h-full rounded-full ${ft.color.replace('text-', 'bg-')}`} style={{ width: `${ft.percent}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Cleanup Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {cleanupSuggestions.map((suggestion) => (
            <div key={suggestion.item} className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">{suggestion.item}</span>
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                  suggestion.impact === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                  suggestion.impact === 'medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                  'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                }`}>{suggestion.impact} impact</span>
              </div>
              <span className="text-sm font-medium text-muted-foreground">{suggestion.size}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Cloud className="h-5 w-5 text-primary" />
            Storage Providers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {providers.map((provider) => (
            <div key={provider.name} className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">{provider.name}</p>
                <p className="text-xs text-muted-foreground">{provider.type}</p>
              </div>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                provider.status === 'active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400'
              }`}>{provider.status}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
