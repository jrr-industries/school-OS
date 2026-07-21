'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { Smartphone, Send, CheckCircle2, Loader2 } from 'lucide-react';

interface SMSProvider {
  name: string;
  status: 'connected' | 'disconnected' | 'test';
  accountSid: string;
  authToken: string;
  fromNumber: string;
}

const initialProviders: Record<string, SMSProvider> = {
  twilio: { name: 'Twilio', status: 'connected', accountSid: 'AC***************************', authToken: '**************************', fromNumber: '+1 555-123-4567' },
  vonage: { name: 'Vonage (Nexmo)', status: 'test', accountSid: 'API_KEY_******************', authToken: 'API_SECRET_**************', fromNumber: '+1 555-234-5678' },
  plivo: { name: 'Plivo', status: 'disconnected', accountSid: '', authToken: '', fromNumber: '' },
};

export default function SMSPage() {
  const [defaultProvider, setDefaultProvider] = useState('twilio');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleTest = () => {
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
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">SMS Providers</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure SMS gateway providers</p>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <span className="text-sm text-muted-foreground">Default Provider:</span>
        <select
          value={defaultProvider}
          onChange={(e) => setDefaultProvider(e.target.value)}
          className="flex h-9 rounded-md border border-input bg-background px-3 py-1.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="twilio">Twilio</option>
          <option value="vonage">Vonage</option>
          <option value="plivo">Plivo</option>
        </select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(initialProviders).map(([key, provider]) => (
          <Card key={key}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-primary" />
                {provider.name}
                <span className={'ml-auto inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ' + (
                  provider.status === 'connected' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                  provider.status === 'test' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                  'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400'
                )}>
                  {provider.status}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Account SID / API Key</label>
                <input type="password" defaultValue={provider.accountSid} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm font-mono ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Auth Token / API Secret</label>
                <input type="password" defaultValue={provider.authToken} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm font-mono ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">From Number</label>
                <input type="text" defaultValue={provider.fromNumber} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              </div>
              <button className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                Save Configuration
              </button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Send className="h-5 w-5 text-primary" />
            Test SMS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <input type="tel" placeholder="+1 (555) 987-6543" className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Message</label>
              <input type="text" defaultValue="This is a test message from SchoolOS" className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>
            <button onClick={handleTest} disabled={sending} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : sent ? <CheckCircle2 className="h-4 w-4" /> : <Send className="h-4 w-4" />}
              {sending ? 'Sending...' : sent ? 'Sent!' : 'Send Test'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
