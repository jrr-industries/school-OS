'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { Mail, Send, FileText, Save } from 'lucide-react';

const providers = [
  { value: 'sendgrid', label: 'SendGrid' },
  { value: 'mailgun', label: 'Mailgun' },
  { value: 'smtp', label: 'SMTP' },
];

const emailTemplates = [
  { id: 1, name: 'Welcome Email', subject: 'Welcome to SchoolOS', status: 'Active' },
  { id: 2, name: 'Password Reset', subject: 'Reset your password', status: 'Active' },
  { id: 3, name: 'Invoice Receipt', subject: 'Your invoice from SchoolOS', status: 'Active' },
  { id: 4, name: 'School Verification', subject: 'Verify your school account', status: 'Inactive' },
  { id: 5, name: 'Weekly Digest', subject: 'Your weekly platform summary', status: 'Draft' },
];

export default function EmailSettingsPage() {
  const [provider, setProvider] = useState('sendgrid');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Email Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure email delivery and templates</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            SMTP Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Provider</label>
            <div className="flex gap-2">
              {providers.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setProvider(p.value)}
                  className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                    provider === p.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-input bg-background hover:bg-slate-50 dark:hover:bg-slate-900'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          {provider === 'smtp' ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">SMTP Host</label>
                  <input
                    type="text"
                    defaultValue="smtp.example.com"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">SMTP Port</label>
                  <input
                    type="number"
                    defaultValue={587}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Username</label>
                  <input
                    type="text"
                    defaultValue="admin@schoolos.dev"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Password</label>
                  <input
                    type="password"
                    defaultValue="••••••••"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Encryption</label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <option>TLS</option>
                  <option>SSL</option>
                  <option>None</option>
                </select>
              </div>
            </>
          ) : provider === 'sendgrid' ? (
            <div className="space-y-2">
              <label className="text-sm font-medium">SendGrid API Key</label>
              <input
                type="password"
                defaultValue="SG.xxxxxxxxxxxxxxxx"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-sm font-medium">Mailgun API Key</label>
              <input
                type="password"
                defaultValue="key-xxxxxxxxxxxxxxxx"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          )}
          <div className="flex items-center gap-4 pt-2">
            <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors gap-2">
              <Save className="h-4 w-4" />
              Save Settings
            </button>
            <button className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors gap-2">
              <Send className="h-4 w-4" />
              Test Email
            </button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Email Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Template</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Subject</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Status</th>
                  <th className="text-right py-3 px-2 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {emailTemplates.map((tpl) => (
                  <tr key={tpl.id} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-3 px-2 font-medium">{tpl.name}</td>
                    <td className="py-3 px-2 text-muted-foreground">{tpl.subject}</td>
                    <td className="py-3 px-2">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        tpl.status === 'Active' ? 'bg-green-100 text-green-800' :
                        tpl.status === 'Inactive' ? 'bg-slate-100 text-slate-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {tpl.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <button className="text-xs text-primary hover:underline">Edit</button>
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
