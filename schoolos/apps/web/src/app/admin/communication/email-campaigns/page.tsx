'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { Mail, Plus, Send, Clock, CheckCircle2, AlertCircle, Eye, MousePointerClick } from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent';
  recipients: number;
  sent: number;
  opened: number;
  clicked: number;
  date: string;
}

const campaigns: Campaign[] = [
  { id: '1', name: 'Back to School Newsletter', status: 'sent', recipients: 15200, sent: 14890, opened: 8940, clicked: 3120, date: '2026-07-15' },
  { id: '2', name: 'New Feature Announcement', status: 'sending', recipients: 18400, sent: 7200, opened: 4100, clicked: 1800, date: '2026-07-18' },
  { id: '3', name: 'Professional Development Offer', status: 'draft', recipients: 5600, sent: 0, opened: 0, clicked: 0, date: '2026-07-20' },
  { id: '4', name: 'End of Year Reminders', status: 'scheduled', recipients: 22000, sent: 0, opened: 0, clicked: 0, date: '2026-07-28' },
  { id: '5', name: 'Parent-Teacher Conference Invite', status: 'sent', recipients: 9800, sent: 9650, opened: 7230, clicked: 4100, date: '2026-07-10' },
  { id: '6', name: 'Summer Camp Registration', status: 'sent', recipients: 12500, sent: 12100, opened: 8100, clicked: 5200, date: '2026-07-05' },
  { id: '7', name: 'Security Awareness Training', status: 'draft', recipients: 3500, sent: 0, opened: 0, clicked: 0, date: '2026-07-22' },
];

const statusBadge = (status: Campaign['status']) => {
  const styles: Record<string, string> = {
    draft: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200',
    scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    sending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    sent: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  };
  return styles[status];
};

const statusIcon = (status: Campaign['status']) => {
  switch (status) {
    case 'draft': return <AlertCircle className="h-3 w-3" />;
    case 'scheduled': return <Clock className="h-3 w-3" />;
    case 'sending': return <Send className="h-3 w-3" />;
    case 'sent': return <CheckCircle2 className="h-3 w-3" />;
  }
};

export default function EmailCampaignsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Email Campaigns</h1>
          <p className="text-sm text-muted-foreground mt-1">Create and manage email marketing campaigns</p>
        </div>
        <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors gap-2">
          <Plus className="h-4 w-4" />
          New Campaign
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Campaigns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Campaign</th>
                  <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Status</th>
                  <th className="text-right font-medium text-muted-foreground pb-3 pr-4">Recipients</th>
                  <th className="text-right font-medium text-muted-foreground pb-3 pr-4">Sent</th>
                  <th className="text-right font-medium text-muted-foreground pb-3 pr-4">Opened</th>
                  <th className="text-right font-medium text-muted-foreground pb-3 pr-4">Clicked</th>
                  <th className="text-left font-medium text-muted-foreground pb-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <tr key={c.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <td className="py-3 pr-4 font-medium">{c.name}</td>
                    <td className="py-3 pr-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge(c.status)}`}>
                        {statusIcon(c.status)}
                        {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-right">{c.recipients.toLocaleString()}</td>
                    <td className="py-3 pr-4 text-right text-muted-foreground">{c.sent.toLocaleString()}</td>
                    <td className="py-3 pr-4 text-right">
                      <span className="inline-flex items-center gap-1">
                        <Eye className="h-3 w-3 text-muted-foreground" />
                        {c.opened.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-right">
                      <span className="inline-flex items-center gap-1">
                        <MousePointerClick className="h-3 w-3 text-muted-foreground" />
                        {c.clicked.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 text-muted-foreground">{c.date}</td>
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
