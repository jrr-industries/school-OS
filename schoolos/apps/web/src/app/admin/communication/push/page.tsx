'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { Bell, Send, Smartphone, Globe, Building2, CheckCircle2, XCircle, Clock } from 'lucide-react';

interface PushLog {
  id: string;
  title: string;
  body: string;
  target: string;
  status: 'sent' | 'failed' | 'scheduled';
  sentAt: string;
  recipients: number;
}

const pushLog: PushLog[] = [
  { id: '1', title: 'Grade Update Available', body: 'Your child\'s grades have been updated for Q3.', target: 'Parents', status: 'sent', sentAt: '2026-07-18 10:30', recipients: 28000 },
  { id: '2', title: 'Assignment Due Reminder', body: 'Math homework is due tomorrow at 9 AM.', target: 'Students - Lincoln High', status: 'sent', sentAt: '2026-07-18 08:00', recipients: 1200 },
  { id: '3', title: 'School Event Tomorrow', body: 'Annual sports day begins at 10 AM. Don\'t forget your permission slips.', target: 'All Schools', status: 'scheduled', sentAt: '2026-07-20 06:00', recipients: 52300 },
  { id: '4', title: 'App Update Required', body: 'Please update your app to the latest version for new features.', target: 'All Users', status: 'failed', sentAt: '2026-07-16 14:00', recipients: 0 },
  { id: '5', title: 'Teacher Meeting Reminder', body: 'Staff meeting at 3 PM in the auditorium.', target: 'Teachers - Springfield', status: 'sent', sentAt: '2026-07-15 12:00', recipients: 32 },
];

export default function PushNotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Push Notifications</h1>
        <p className="text-sm text-muted-foreground mt-1">Send push notifications to mobile app users</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Compose Push Notification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <input
                type="text"
                placeholder="Notification title"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Body</label>
              <textarea
                rows={3}
                placeholder="Notification message body"
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Target</label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <option>All Users</option>
                <option>All Schools</option>
                <option>Teachers</option>
                <option>Parents</option>
                <option>Students</option>
                <option>Specific School...</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Schedule</label>
              <div className="flex gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <input type="radio" name="schedule" defaultChecked className="accent-primary" />
                  Send Now
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="radio" name="schedule" className="accent-primary" />
                  Schedule Later
                </label>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors gap-2">
                <Send className="h-4 w-4" />
                Send Notification
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              Push Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Total Sent (30d)</span>
              <span className="text-sm font-bold">184,500</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Delivery Rate</span>
              <span className="text-sm font-bold text-emerald-600">97.2%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Open Rate</span>
              <span className="text-sm font-bold">42.8%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Active Devices</span>
              <span className="text-sm font-bold">41,200</span>
            </div>
            <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Daily Limit</span>
                <span className="text-sm font-bold">12,400 / 50,000</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-2 rounded-full bg-primary" style={{ width: '25%' }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Sent Notifications Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Title</th>
                  <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Body</th>
                  <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Target</th>
                  <th className="text-right font-medium text-muted-foreground pb-3 pr-4">Recipients</th>
                  <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Status</th>
                  <th className="text-left font-medium text-muted-foreground pb-3">Sent At</th>
                </tr>
              </thead>
              <tbody>
                {pushLog.map((p) => (
                  <tr key={p.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <td className="py-3 pr-4 font-medium">{p.title}</td>
                    <td className="py-3 pr-4 text-muted-foreground max-w-xs truncate">{p.body}</td>
                    <td className="py-3 pr-4">
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        {p.target === 'All Users' ? <Globe className="h-3 w-3" /> : <Building2 className="h-3 w-3" />}
                        {p.target}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-right">{p.recipients.toLocaleString()}</td>
                    <td className="py-3 pr-4">
                      {p.status === 'sent' ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600"><CheckCircle2 className="h-3 w-3" /> Sent</span>
                      ) : p.status === 'failed' ? (
                        <span className="inline-flex items-center gap-1 text-xs text-red-500"><XCircle className="h-3 w-3" /> Failed</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-blue-500"><Clock className="h-3 w-3" /> Scheduled</span>
                      )}
                    </td>
                    <td className="py-3 text-muted-foreground text-xs">{p.sentAt}</td>
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
