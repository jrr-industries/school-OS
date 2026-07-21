'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { Mail, CheckCircle2, XCircle, Globe } from 'lucide-react';

interface EmailProvider {
  name: string;
  status: 'connected' | 'disconnected' | 'test';
  apiKey: string;
  fromEmail: string;
}

const initialProviders: Record<string, EmailProvider> = {
  sendgrid: { name: 'SendGrid', status: 'connected', apiKey: 'SG.******************', fromEmail: 'noreply@schoolos.dev' },
  mailgun: { name: 'Mailgun', status: 'test', apiKey: 'key-******************', fromEmail: 'noreply@schoolos.dev' },
  ses: { name: 'Amazon SES', status: 'disconnected', apiKey: 'AKIA******************', fromEmail: '' },
  smtp: { name: 'SMTP', status: 'disconnected', apiKey: '', fromEmail: '' },
};

export default function EmailPage() {
  const [defaultProvider, setDefaultProvider] = useState('sendgrid');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Email Providers</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure email service providers</p>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Default Provider:</span>
        <select
          value={defaultProvider}
          onChange={(e) => setDefaultProvider(e.target.value)}
          className="flex h-9 rounded-md border border-input bg-background px-3 py-1.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="sendgrid">SendGrid</option>
          <option value="mailgun">Mailgun</option>
          <option value="ses">Amazon SES</option>
          <option value="smtp">SMTP</option>
        </select>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {Object.entries(initialProviders).map(([key, provider]) => (
          <Card key={key}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                {provider.name}
                <span className={`ml-auto inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                  provider.status === 'connected' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                  provider.status === 'test' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                  'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400'
                }`}>
                  {provider.status}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">API Key / Secret</label>
                <input
                  type="password"
                  defaultValue={provider.apiKey}
                  placeholder="Enter API key"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">From Email</label>
                <input
                  type="email"
                  defaultValue={provider.fromEmail}
                  placeholder="noreply@yourdomain.com"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div className="flex items-center gap-2 pt-2">
                {provider.status === 'connected' ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : provider.status === 'test' ? (
                  <Globe className="h-4 w-4 text-amber-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-slate-400" />
                )}
                <span className="text-sm text-muted-foreground">
                  {provider.status === 'connected' ? 'Verified & active' : provider.status === 'test' ? 'Test mode (sandbox)' : 'Not configured'}
                </span>
              </div>
              <button className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                Save Configuration
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
