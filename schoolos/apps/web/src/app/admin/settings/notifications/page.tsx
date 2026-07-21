'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { Bell, Save } from 'lucide-react';

interface ChannelState {
  email: boolean;
  sms: boolean;
  push: boolean;
  inApp: boolean;
}

interface CategoryState {
  billing: ChannelState;
  security: ChannelState;
  updates: ChannelState;
  marketing: ChannelState;
}

const defaultChannels: ChannelState = { email: true, sms: false, push: true, inApp: true };

const channelLabels: Record<keyof ChannelState, string> = {
  email: 'Email',
  sms: 'SMS',
  push: 'Push',
  inApp: 'In-app',
};

const categoryLabels: Record<keyof CategoryState, string> = {
  billing: 'Billing',
  security: 'Security',
  updates: 'Updates',
  marketing: 'Marketing',
};

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
        checked ? 'bg-primary' : 'bg-input'
      }`}
    >
      <span
        className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

export default function NotificationSettingsPage() {
  const [settings, setSettings] = useState<CategoryState>({
    billing: { ...defaultChannels },
    security: { ...defaultChannels, sms: true },
    updates: { ...defaultChannels, email: true, push: false },
    marketing: { email: false, sms: false, push: false, inApp: true },
  });

  const toggle = (category: keyof CategoryState, channel: keyof ChannelState) => {
    setSettings((prev) => ({
      ...prev,
      [category]: { ...prev[category], [channel]: !prev[category][channel] },
    }));
  };

  const channels = Object.keys(defaultChannels) as (keyof ChannelState)[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Notification Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure platform notification channels</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Channel Toggles
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="text-sm font-medium">Email notifications</p>
              <p className="text-xs text-muted-foreground">Receive email notifications for platform events</p>
            </div>
            <ToggleSwitch
              checked={Object.values(settings).some((c) => c.email)}
              onChange={() => {}}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="text-sm font-medium">SMS notifications</p>
              <p className="text-xs text-muted-foreground">Receive SMS notifications for critical alerts</p>
            </div>
            <ToggleSwitch
              checked={Object.values(settings).some((c) => c.sms)}
              onChange={() => {}}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="text-sm font-medium">Push notifications</p>
              <p className="text-xs text-muted-foreground">Receive push notifications in the browser</p>
            </div>
            <ToggleSwitch
              checked={Object.values(settings).some((c) => c.push)}
              onChange={() => {}}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="text-sm font-medium">In-app notifications</p>
              <p className="text-xs text-muted-foreground">Receive notifications within the platform</p>
            </div>
            <ToggleSwitch
              checked={Object.values(settings).some((c) => c.inApp)}
              onChange={() => {}}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Per-Category Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 pr-4 font-medium text-muted-foreground">Category</th>
                  {channels.map((ch) => (
                    <th key={ch} className="text-center py-3 px-2 font-medium text-muted-foreground">
                      {channelLabels[ch]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(Object.keys(settings) as (keyof CategoryState)[]).map((cat) => (
                  <tr key={cat} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-3 pr-4 font-medium">{categoryLabels[cat]}</td>
                    {channels.map((ch) => (
                      <td key={ch} className="py-3 px-2 text-center">
                        <div className="flex justify-center">
                          <ToggleSwitch
                            checked={settings[cat][ch]}
                            onChange={() => toggle(cat, ch)}
                          />
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </button>
      </div>
    </div>
  );
}
