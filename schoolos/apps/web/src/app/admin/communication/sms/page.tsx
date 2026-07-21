'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { MessageSquare, Send, Users, Building2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface SentMessage {
  id: string;
  message: string;
  target: string;
  recipients: number;
  delivered: number;
  failed: number;
  sentAt: string;
  status: 'delivered' | 'partial' | 'failed';
}

const sentMessages: SentMessage[] = [
  { id: '1', message: 'Emergency closure tomorrow due to weather. All schools remain closed.', target: 'All Schools', recipients: 156, delivered: 152, failed: 4, sentAt: '2026-07-18 08:30', status: 'partial' },
  { id: '2', message: 'Parent-teacher meetings scheduled for next week. Please confirm availability.', target: 'Teachers', recipients: 3840, delivered: 3840, failed: 0, sentAt: '2026-07-17 14:00', status: 'delivered' },
  { id: '3', message: 'Term 3 report cards are due by Friday. Upload to the portal.', target: 'School Admins', recipients: 312, delivered: 310, failed: 2, sentAt: '2026-07-16 10:15', status: 'partial' },
  { id: '4', message: 'Test broadcast - please ignore.', target: 'All Users', recipients: 52300, delivered: 52100, failed: 200, sentAt: '2026-07-14 09:00', status: 'failed' },
  { id: '5', message: 'Bus schedule changes effective Monday. Check the portal for details.', target: 'Parents', recipients: 28000, delivered: 27980, failed: 20, sentAt: '2026-07-12 16:45', status: 'partial' },
];

export default function SMSBroadcastPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">SMS Broadcast</h1>
        <p className="text-sm text-muted-foreground mt-1">Send SMS messages to schools and users</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Compose Message
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Audience</label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <option>All Users</option>
                <option>All Schools</option>
                <option>Teachers</option>
                <option>Parents</option>
                <option>School Admins</option>
                <option>Specific School...</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <textarea
                rows={5}
                placeholder="Type your SMS message here... (160 characters recommended)"
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              <p className="text-xs text-muted-foreground text-right">0 / 160 characters</p>
            </div>
            <div className="flex justify-end pt-2">
              <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors gap-2">
                <Send className="h-4 w-4" />
                Send Broadcast
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Audience Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Total Users</span>
              <span className="text-sm font-bold">52,300</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Schools</span>
              <span className="text-sm font-bold">156</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Teachers</span>
              <span className="text-sm font-bold">3,840</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Parents</span>
              <span className="text-sm font-bold">28,000</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">School Admins</span>
              <span className="text-sm font-bold">312</span>
            </div>
            <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Monthly SMS Used</span>
                <span className="text-sm font-bold">12,450 / 50,000</span>
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
            <Send className="h-5 w-5 text-primary" />
            Sent Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Message</th>
                  <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Target</th>
                  <th className="text-right font-medium text-muted-foreground pb-3 pr-4">Recipients</th>
                  <th className="text-right font-medium text-muted-foreground pb-3 pr-4">Delivered</th>
                  <th className="text-right font-medium text-muted-foreground pb-3 pr-4">Failed</th>
                  <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Status</th>
                  <th className="text-left font-medium text-muted-foreground pb-3">Sent At</th>
                </tr>
              </thead>
              <tbody>
                {sentMessages.map((m) => (
                  <tr key={m.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <td className="py-3 pr-4 max-w-xs truncate font-medium">{m.message}</td>
                    <td className="py-3 pr-4 text-muted-foreground">
                      <span className="inline-flex items-center gap-1 text-xs">
                        <Building2 className="h-3 w-3" />
                        {m.target}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-right">{m.recipients.toLocaleString()}</td>
                    <td className="py-3 pr-4 text-right text-emerald-600">{m.delivered.toLocaleString()}</td>
                    <td className="py-3 pr-4 text-right text-red-500">{m.failed.toLocaleString()}</td>
                    <td className="py-3 pr-4">
                      {m.status === 'delivered' ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600"><CheckCircle2 className="h-3 w-3" /> Delivered</span>
                      ) : m.status === 'failed' ? (
                        <span className="inline-flex items-center gap-1 text-xs text-red-500"><XCircle className="h-3 w-3" /> Failed</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-yellow-600"><AlertCircle className="h-3 w-3" /> Partial</span>
                      )}
                    </td>
                    <td className="py-3 text-muted-foreground text-xs">{m.sentAt}</td>
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
