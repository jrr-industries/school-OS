'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { Code2, Key, Upload, Send, CheckCircle2, Loader2, Bell, Database, MessageSquare, HardDrive } from 'lucide-react';

const enabledServices = [
  { name: 'Cloud Messaging', icon: Bell, description: 'Push notifications to mobile devices' },
  { name: 'Firestore Database', icon: Database, description: 'Real-time data synchronization' },
  { name: 'Cloud Functions', icon: Code2, description: 'Serverless backend functions' },
  { name: 'Cloud Storage', icon: HardDrive, description: 'File and media storage' },
  { name: 'Analytics', icon: MessageSquare, description: 'App usage analytics' },
];

export default function FirebasePage() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleTestPush = () => {
    setSending(true);
    setSent(false);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Firebase Integration</h1>
        <p className="text-sm text-muted-foreground mt-1">Firebase configuration for push notifications</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Code2 className="h-5 w-5 text-primary" />
              Project Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Project ID</label>
              <input
                type="text"
                defaultValue="schoolos-prod-12345"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm font-mono ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">API Key</label>
              <input
                type="password"
                defaultValue="AIzaSy***************************"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm font-mono ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Project Number</label>
              <input
                type="text"
                defaultValue="123456789012"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm font-mono ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Messaging Sender ID</label>
              <input
                type="text"
                defaultValue="987654321098"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm font-mono ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              Service Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-dashed p-6">
              <div className="flex flex-col items-center text-center">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm font-medium">Upload Service Account JSON</p>
                <p className="text-xs text-muted-foreground mt-1">Drop your Firebase service account key file here</p>
                <button className="mt-3 rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                  Choose File
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span className="text-muted-foreground">Current key: firebase-sa-prod.json (expires 2025-06-15)</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Code2 className="h-5 w-5 text-primary" />
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
                      <p className="text-xs text-muted-foreground">{service.description}</p>
                    </div>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Test Push Notification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Device Token</label>
              <input
                type="text"
                placeholder="fCM token from device..."
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <input
                type="text"
                placeholder="Test notification"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <button
              onClick={handleTestPush}
              disabled={sending}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : sent ? <CheckCircle2 className="h-4 w-4" /> : <Send className="h-4 w-4" />}
              {sending ? 'Sending...' : sent ? 'Sent!' : 'Send Test'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
