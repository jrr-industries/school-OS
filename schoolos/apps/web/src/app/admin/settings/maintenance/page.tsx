'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { Construction, Save } from 'lucide-react';

export default function MaintenancePage() {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Maintenance Mode</h1>
        <p className="text-sm text-muted-foreground mt-1">Control platform availability</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Construction className="h-5 w-5 text-primary" />
            Maintenance Mode Toggle
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="text-sm font-medium">Maintenance Mode</p>
              <p className="text-xs text-muted-foreground">
                {enabled
                  ? 'Platform is currently in maintenance mode. Users cannot access the system.'
                  : 'Platform is operational and accessible to all users.'}
              </p>
            </div>
            <button
              role="switch"
              aria-checked={enabled}
              onClick={() => setEnabled(!enabled)}
              className={`peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                enabled ? 'bg-red-500' : 'bg-input'
              }`}
            >
              <span
                className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${
                  enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {enabled && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Custom Message</label>
                <textarea
                  rows={3}
                  defaultValue="SchoolOS is currently undergoing scheduled maintenance. We will be back shortly. Thank you for your patience."
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Estimated Duration (hours)</label>
                  <input
                    type="number"
                    defaultValue={2}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status Page URL</label>
                  <input
                    type="text"
                    defaultValue="https://status.schoolos.dev"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Whitelist IP Addresses</label>
                <p className="text-xs text-muted-foreground">One IP address per line. These IPs will bypass maintenance mode.</p>
                <textarea
                  rows={4}
                  defaultValue="203.0.113.1&#10;198.51.100.2&#10;192.0.2.3"
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background font-mono placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </>
          )}

          {enabled && (
            <div className="flex justify-end pt-2">
              <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors gap-2">
                <Save className="h-4 w-4" />
                Save & Enable
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
