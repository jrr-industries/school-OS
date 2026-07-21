'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { Chrome, Key, Shield, Globe, Calendar, HardDrive, Mail, BookOpen } from 'lucide-react';

const enabledServices = [
  { name: 'Google Calendar', icon: Calendar, status: 'active', scopes: 'calendar.read, calendar.events' },
  { name: 'Google Drive', icon: HardDrive, status: 'active', scopes: 'drive.read, drive.files' },
  { name: 'Gmail', icon: Mail, status: 'active', scopes: 'gmail.send, gmail.read' },
  { name: 'Google Classroom', icon: BookOpen, status: 'inactive', scopes: '' },
];

export default function GooglePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Google Workspace</h1>
        <p className="text-sm text-muted-foreground mt-1">Google Workspace integration settings</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Chrome className="h-5 w-5 text-primary" />
              OAuth Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Client ID</label>
              <input
                type="text"
                defaultValue="123456789012-abc123def456.apps.googleusercontent.com"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm font-mono ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Client Secret</label>
              <input
                type="password"
                defaultValue="GOCSPX-******************"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm font-mono ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Redirect URI</label>
              <input
                type="text"
                defaultValue="https://api.schoolos.dev/auth/google/callback"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm bg-slate-50 font-mono text-muted-foreground ring-offset-background dark:bg-slate-800"
                readOnly
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Domain-wide Delegation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Service Account Email</label>
              <input
                type="text"
                defaultValue="schoolos-sa@project-123456.iam.gserviceaccount.com"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm font-mono ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Impersonation Email</label>
              <input
                type="email"
                defaultValue="admin@schoolos.dev"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="rounded-lg border p-3">
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Private Key</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Private key uploaded and configured (key ID: a1b2c3d4)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Enabled Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {enabledServices.map((service) => {
              const Icon = service.icon;
              return (
                <div key={service.name} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-slate-100 p-2 dark:bg-slate-800">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{service.name}</p>
                      {service.scopes && <p className="text-xs text-muted-foreground">{service.scopes}</p>}
                    </div>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    service.status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {service.status}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
