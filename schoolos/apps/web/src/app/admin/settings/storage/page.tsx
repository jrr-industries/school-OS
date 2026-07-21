'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { HardDrive, Save, Database, Cloud, FolderOpen } from 'lucide-react';

const providers = [
  { value: 's3', label: 'Amazon S3', icon: Cloud },
  { value: 'gcs', label: 'Google Cloud Storage', icon: Database },
  { value: 'local', label: 'Local Storage', icon: FolderOpen },
];

const usageStats = [
  { label: 'Total Storage Used', value: '342 GB', percentage: 33 },
  { label: 'Total Storage Allocated', value: '1 TB', percentage: 100 },
  { label: 'Average Per School', value: '2.2 GB', percentage: null },
  { label: 'Backup Storage', value: '85 GB', percentage: 8 },
];

const schoolQuotas = [
  { school: 'Springfield Elementary', used: '4.2 GB', quota: '10 GB', percentage: 42 },
  { school: 'Lincoln High School', used: '12.8 GB', quota: '20 GB', percentage: 64 },
  { school: 'Riverside Academy', used: '2.1 GB', quota: '10 GB', percentage: 21 },
  { school: 'Oakwood Preparatory', used: '0.8 GB', quota: '5 GB', percentage: 16 },
];

export default function StorageSettingsPage() {
  const [selectedProvider, setSelectedProvider] = useState('s3');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Storage Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage storage providers and limits</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {usageStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
              {stat.percentage !== null && (
                <div className="mt-2 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${stat.percentage}%` }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

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
                <button
                  key={p.value}
                  onClick={() => setSelectedProvider(p.value)}
                  className={`flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                    selectedProvider === p.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-input bg-background hover:bg-slate-50 dark:hover:bg-slate-900'
                  }`}
                >
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
                  <input type="text" defaultValue="AKIAxxxxxxxxxxxx" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">AWS Secret Access Key</label>
                  <input type="password" defaultValue="••••••••••••••" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Region</label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <option>us-east-1</option>
                    <option>us-west-2</option>
                    <option>eu-west-1</option>
                    <option>ap-southeast-1</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bucket Name</label>
                  <input type="text" defaultValue="schoolos-storage" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                </div>
              </div>
            </>
          )}
          {selectedProvider === 'gcs' && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Project ID</label>
                <input type="text" defaultValue="schoolos-project" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Service Account JSON</label>
                <textarea rows={3} defaultValue='{"type": "service_account", "project_id": "schoolos"}' className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Bucket Name</label>
                <input type="text" defaultValue="schoolos-gcs-bucket" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
              </div>
            </>
          )}
          {selectedProvider === 'local' && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Storage Path</label>
                <input type="text" defaultValue="/var/data/schoolos/storage" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Max Local Storage (GB)</label>
                <input type="number" defaultValue={500} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
              </div>
            </>
          )}
          <div className="flex justify-end pt-2">
            <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors gap-2">
              <Save className="h-4 w-4" />
              Save Provider
            </button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">School Storage Quotas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">School</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Used</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Quota</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Usage</th>
                </tr>
              </thead>
              <tbody>
                {schoolQuotas.map((sq) => (
                  <tr key={sq.school} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-3 px-2 font-medium">{sq.school}</td>
                    <td className="py-3 px-2">{sq.used}</td>
                    <td className="py-3 px-2">{sq.quota}</td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 rounded-full bg-slate-200 dark:bg-slate-700">
                          <div className="h-2 rounded-full bg-primary" style={{ width: `${sq.percentage}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground">{sq.percentage}%</span>
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
