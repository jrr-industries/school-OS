'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { MessageSquare, Send, FileText, Save } from 'lucide-react';

const smsTemplates = [
  { id: 1, name: 'Verification Code', content: 'Your SchoolOS verification code is: {code}', status: 'Active' },
  { id: 2, name: 'Login Alert', content: 'New login detected on your account from {location}', status: 'Active' },
  { id: 3, name: 'Payment Confirmation', content: 'Payment of {amount} confirmed for {school}', status: 'Active' },
  { id: 4, name: 'School Approval', content: 'Your school {school_name} has been approved!', status: 'Inactive' },
];

export default function SmsSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">SMS Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure SMS provider and templates</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Twilio Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Account SID</label>
              <input
                type="text"
                defaultValue="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Auth Token</label>
              <input
                type="password"
                defaultValue="••••••••••••••••••••••••"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Twilio Phone Number</label>
              <input
                type="text"
                defaultValue="+15551234567"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Messaging Service SID</label>
              <input
                type="text"
                defaultValue="MGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          </div>
          <div className="flex items-center gap-4 pt-2">
            <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors gap-2">
              <Save className="h-4 w-4" />
              Save Settings
            </button>
            <button className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors gap-2">
              <Send className="h-4 w-4" />
              Test SMS
            </button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            SMS Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Template</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Content</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Status</th>
                  <th className="text-right py-3 px-2 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {smsTemplates.map((tpl) => (
                  <tr key={tpl.id} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-3 px-2 font-medium">{tpl.name}</td>
                    <td className="py-3 px-2 text-muted-foreground max-w-xs truncate">{tpl.content}</td>
                    <td className="py-3 px-2">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        tpl.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
                      }`}>
                        {tpl.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <button className="text-xs text-primary hover:underline">Edit</button>
                    </td>
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
