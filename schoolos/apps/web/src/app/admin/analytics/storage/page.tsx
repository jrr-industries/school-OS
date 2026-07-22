'use client';

import { useState, useEffect, useCallback } from 'react';
import { HardDrive, TrendingUp, FileText, Image, Video, FileArchive, School, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';

const mockStats = [
  { label: 'Total Storage Used', value: '342 GB', change: '+18.2%', trend: 'up', icon: HardDrive, color: 'text-blue-500' },
  { label: 'Total Storage Allocated', value: '1 TB', change: '34.2% used', trend: 'up', icon: TrendingUp, color: 'text-emerald-500' },
  { label: 'Avg Per School', value: '281 MB', change: '+7.3%', trend: 'up', icon: School, color: 'text-violet-500' },
  { label: 'Files Total', value: '2.1M', change: '+22.4%', trend: 'up', icon: FileText, color: 'text-amber-500' },
];

const fileTypeBreakdown = [
  { type: 'Documents', count: 840000, size: '98 GB', pct: 28.7, icon: FileText, color: 'bg-blue-500' },
  { type: 'Images', count: 672000, size: '112 GB', pct: 32.7, icon: Image, color: 'bg-emerald-500' },
  { type: 'Videos', count: 168000, size: '84 GB', pct: 24.6, icon: Video, color: 'bg-violet-500' },
  { type: 'Archives', count: 420000, size: '48 GB', pct: 14.0, icon: FileArchive, color: 'bg-amber-500' },
];

const growthTrend = [
  { month: 'Feb', size: 270 }, { month: 'Mar', size: 285 }, { month: 'Apr', size: 298 },
  { month: 'May', size: 310 }, { month: 'Jun', size: 325 }, { month: 'Jul', size: 342 },
];

const topConsumers = [
  { school: 'Lincoln High School', used: '28.4 GB', quota: '50 GB', files: 185000, usagePct: 56.8 },
  { school: 'Springfield Elementary', used: '18.2 GB', quota: '50 GB', files: 124000, usagePct: 36.4 },
  { school: 'Riverside Academy', used: '15.7 GB', quota: '25 GB', files: 98000, usagePct: 62.8 },
  { school: 'Oakwood Preparatory', used: '12.1 GB', quota: '25 GB', files: 72000, usagePct: 48.4 },
  { school: 'Mountain View Middle', used: '8.9 GB', quota: '10 GB', files: 54000, usagePct: 89 },
];

export default function StorageAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(r => setTimeout(r, 600));
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

  const maxGrowth = Math.max(...growthTrend.map(m => m.size));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Storage Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Storage usage across all schools</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {mockStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className={`rounded-lg ${stat.color.replace('text-', 'bg-')}/10 p-2 w-fit`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <p className="mt-3 text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-xs mt-1 text-emerald-500">{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">File Type Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {fileTypeBreakdown.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.type}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{f.type}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{f.size} ({f.pct}%)</span>
                  </div>
                  <div className="h-4 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className={`h-full rounded-full ${f.color}`} style={{ width: `${f.pct}%` }} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Growth Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-40">
              {growthTrend.map((m) => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs font-medium">{m.size} GB</span>
                  <div className="w-full rounded-t bg-blue-500 transition-all" style={{ height: `${(m.size / maxGrowth) * 100}%` }} />
                  <span className="text-xs text-muted-foreground">{m.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top Storage Consumers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium text-muted-foreground">School</th>
                  <th className="pb-3 font-medium text-muted-foreground text-right">Used</th>
                  <th className="pb-3 font-medium text-muted-foreground text-right">Quota</th>
                  <th className="pb-3 font-medium text-muted-foreground text-right">Files</th>
                  <th className="pb-3 font-medium text-muted-foreground text-right">Usage</th>
                </tr>
              </thead>
              <tbody>
                {topConsumers.map((c) => (
                  <tr key={c.school} className="border-b last:border-0">
                    <td className="py-3 font-medium">{c.school}</td>
                    <td className="py-3 text-right">{c.used}</td>
                    <td className="py-3 text-right">{c.quota}</td>
                    <td className="py-3 text-right">{c.files.toLocaleString()}</td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="h-2 w-20 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div className={`h-full rounded-full ${c.usagePct > 80 ? 'bg-red-500' : c.usagePct > 60 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${c.usagePct}%` }} />
                        </div>
                        <span className="text-xs">{c.usagePct}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
