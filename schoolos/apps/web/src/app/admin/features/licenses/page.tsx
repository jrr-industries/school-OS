'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { Key, Shield, CheckCircle2, Plus } from 'lucide-react';

const licenseInfo = {
  key: 'SCHOOLOS-XXXX-XXXX-XXXX-XXXXXXXX',
  type: 'Enterprise',
  status: 'active',
  issued: '2024-01-15',
  expires: '2025-01-15',
  seats: 1000,
  usedSeats: 847,
};

export default function LicensesPage() {
  const [activationKey, setActivationKey] = useState('');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">License Management</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage software licenses</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              Current License
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4">
              <p className="text-xs text-muted-foreground mb-1">License Key</p>
              <p className="font-mono text-sm font-bold tracking-wider">{licenseInfo.key}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Type</p>
                <p className="text-sm font-medium">{licenseInfo.type}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  <CheckCircle2 className="h-3 w-3" />
                  {licenseInfo.status}
                </span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Issued</p>
                <p className="text-sm font-medium">{licenseInfo.issued}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Expires</p>
                <p className="text-sm font-medium">{licenseInfo.expires}</p>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-muted-foreground">Seats Used</span>
                <span className="text-xs text-muted-foreground">{licenseInfo.usedSeats} / {licenseInfo.seats}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                <div className="h-full rounded-full bg-primary" style={{ width: `${(licenseInfo.usedSeats / licenseInfo.seats) * 100}%` }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Upgrade License
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-3 hover:border-primary cursor-pointer transition-colors">
                <div>
                  <p className="text-sm font-medium">Pro</p>
                  <p className="text-xs text-muted-foreground">Up to 500 seats</p>
                </div>
                <span className="text-sm font-bold">/mo</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-primary p-3 bg-primary/5 cursor-pointer transition-colors">
                <div>
                  <p className="text-sm font-medium text-primary">Enterprise</p>
                  <p className="text-xs text-muted-foreground">Unlimited seats + priority support</p>
                </div>
                <span className="text-sm font-bold text-primary">,299/mo</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3 hover:border-primary cursor-pointer transition-colors">
                <div>
                  <p className="text-sm font-medium">Ultimate</p>
                  <p className="text-xs text-muted-foreground">Everything + dedicated infrastructure</p>
                </div>
                <span className="text-sm font-bold">,499/mo</span>
              </div>
            </div>
            <button className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
              Upgrade Plan
            </button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Activate License
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Enter license key..."
                value={activationKey}
                onChange={(e) => setActivationKey(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
            <button className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
              Activate
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
