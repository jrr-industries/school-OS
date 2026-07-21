'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { Bell, Plus, Users, Building2, Globe, CheckCircle2, XCircle, Clock } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  target: string;
  status: 'sent' | 'failed' | 'scheduled';
  sentDate: string;
}

const notifications: Notification[] = [
  { id: '1', title: 'Grade Submission Deadline', message: 'Reminder: Grade submission deadline for Q3 is July 30th.', target: 'All Teachers', status: 'sent', sentDate: '2026-07-18' },
  { id: '2', title: 'School Registration Open', message: 'Registration for the 2026-2027 academic year is now open.', target: 'All Schools', status: 'sent', sentDate: '2026-07-17' },
  { id: '3', title: 'System Update Available', message: 'Version 3.2.0 is available. New features include improved analytics.', target: 'Administrators', status: 'sent', sentDate: '2026-07-15' },
  { id: '4', title: 'Payment Reminder', message: 'Monthly subscription payments are due in 5 days.', target: 'School Billing Contacts', status: 'scheduled', sentDate: '2026-07-25' },
  { id: '5', title: 'Emergency Alert Test', message: 'This is a test of the emergency notification system.', target: 'All Users', status: 'failed', sentDate: '2026-07-12' },
  { id: '6', title: 'Professional Development Day', message: 'Schools are reminded of the PD day on August 5th. No classes.', target: 'All Schools', status: 'sent', sentDate: '2026-07-10' },
];

const statusIcon = (status: Notification['status']) => {
  switch (status) {
    case 'sent': return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
    case 'scheduled': return <Clock className="h-4 w-4 text-blue-500" />;
  }
};

const targetIcon = (target: string) => {
  if (target.includes('All Users')) return <Globe className="h-3 w-3" />;
  if (target.includes('Schools')) return <Building2 className="h-3 w-3" />;
  return <Users className="h-3 w-3" />;
};

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Notifications</h1>
          <p className="text-sm text-muted-foreground mt-1">Send and manage push notifications</p>
        </div>
        <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors gap-2">
          <Plus className="h-4 w-4" />
          Send Notification
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notification History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Title</th>
                  <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Message</th>
                  <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Target</th>
                  <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Status</th>
                  <th className="text-left font-medium text-muted-foreground pb-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {notifications.map((n) => (
                  <tr key={n.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <td className="py-3 pr-4 font-medium">{n.title}</td>
                    <td className="py-3 pr-4 text-muted-foreground max-w-xs truncate">{n.message}</td>
                    <td className="py-3 pr-4">
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        {targetIcon(n.target)}
                        {n.target}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="inline-flex items-center gap-1 text-xs">
                        {statusIcon(n.status)}
                        {n.status.charAt(0).toUpperCase() + n.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 text-muted-foreground">{n.sentDate}</td>
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
