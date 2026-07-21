'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { CreditCard, CheckCircle2, ToggleLeft, ToggleRight } from 'lucide-react';

interface GatewayConfig {
  name: string;
  status: 'connected' | 'disconnected' | 'test';
  liveKey: string;
  testKey: string;
}

const initialGateways: Record<string, GatewayConfig> = {
  stripe: { name: 'Stripe', status: 'connected', liveKey: 'LIVE_SECRET_KEY_PLACEHOLDER', testKey: 'TEST_SECRET_KEY_PLACEHOLDER' },
  paypal: { name: 'PayPal', status: 'test', liveKey: 'LIVE_SECRET_KEY_PLACEHOLDER', testKey: 'TEST_SECRET_KEY_PLACEHOLDER' },
  razorpay: { name: 'Razorpay', status: 'disconnected', liveKey: 'LIVE_SECRET_KEY_PLACEHOLDER', testKey: 'TEST_SECRET_KEY_PLACEHOLDER' },
};

export default function PaymentsPage() {
  const [defaultGateway, setDefaultGateway] = useState('stripe');
  const [testMode, setTestMode] = useState(true);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Payment Gateways</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure payment gateway integrations</p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Default Gateway:</span>
          <select
            value={defaultGateway}
            onChange={(e) => setDefaultGateway(e.target.value)}
            className="flex h-9 rounded-md border border-input bg-background px-3 py-1.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="stripe">Stripe</option>
            <option value="paypal">PayPal</option>
            <option value="razorpay">Razorpay</option>
          </select>
        </div>
        <button
          onClick={() => setTestMode(!testMode)}
          className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-muted transition-colors"
        >
          {testMode ? <ToggleRight className="h-4 w-4 text-emerald-500" /> : <ToggleLeft className="h-4 w-4" />}
          {testMode ? 'Test Mode: ON' : 'Test Mode: OFF'}
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(initialGateways).map(([key, gateway]) => (
          <Card key={key}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                {gateway.name}
                <span className={`ml-auto inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                  gateway.status === 'connected' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                  gateway.status === 'test' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                  'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400'
                }`}>
                  {gateway.status}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Live Secret Key</label>
                <input
                  type="password"
                  defaultValue={gateway.liveKey}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm font-mono ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Test Secret Key</label>
                <input
                  type="password"
                  defaultValue={gateway.testKey}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm font-mono ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span className="text-sm text-muted-foreground">
                  {gateway.status === 'connected' ? 'All webhooks configured' : gateway.status === 'test' ? 'Test mode active' : 'Not configured'}
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
