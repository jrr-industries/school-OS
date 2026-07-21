'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { Shield, ShieldCheck, ShieldOff, Users, Smartphone, CheckCircle2, XCircle, Clock } from 'lucide-react';

interface MfaEvent {
  id: string;
  user: string;
  email: string;
  action: 'enabled' | 'disabled' | 'verified' | 'failed';
  method: string;
  timestamp: string;
}

interface RoleRequirement {
  role: string;
  required: boolean;
  users: number;
  enrolled: number;
}

const roleRequirements: RoleRequirement[] = [
  { role: 'Super Admin', required: true, users: 5, enrolled: 5 },
  { role: 'School Admin', required: true, users: 312, enrolled: 298 },
  { role: 'Teacher', required: false, users: 3840, enrolled: 1840 },
  { role: 'Parent', required: false, users: 28000, enrolled: 5200 },
  { role: 'Student', required: false, users: 48230, enrolled: 3200 },
];

const recentEvents: MfaEvent[] = [
  { id: '1', user: 'John Smith', email: 'john.smith@schoolos.dev', action: 'enabled', method: 'Authenticator App', timestamp: '10 min ago' },
  { id: '2', user: 'Sarah Johnson', email: 'sarah.j@schoolos.dev', action: 'verified', method: 'SMS Code', timestamp: '25 min ago' },
  { id: '3', user: 'Michael Chen', email: 'm.chen@schoolos.dev', action: 'failed', method: 'Email Code', timestamp: '1 hour ago' },
  { id: '4', user: 'Emily Davis', email: 'emily.d@schoolos.dev', action: 'disabled', method: 'Authenticator App', timestamp: '2 hours ago' },
  { id: '5', user: 'Robert Wilson', email: 'r.wilson@schoolos.dev', action: 'enabled', method: 'SMS Code', timestamp: '3 hours ago' },
];

const actionBadge = (action: MfaEvent['action']) => {
  switch (action) {
    case 'enabled': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
    case 'disabled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case 'verified': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'failed': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
  }
};

export default function MFAPage() {
  const [enforcement, setEnforcement] = useState(true);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Multi-Factor Authentication</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage MFA settings across the platform</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-primary/10 p-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold">10,543</p>
            <p className="text-sm text-muted-foreground">Users with MFA Enabled</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-primary/10 p-2">
                <Users className="h-4 w-4 text-primary" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold">32.4%</p>
            <p className="text-sm text-muted-foreground">MFA Adoption Rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-primary/10 p-2">
                <Smartphone className="h-4 w-4 text-primary" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold">3</p>
            <p className="text-sm text-muted-foreground">Available Methods</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              MFA Enforcement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Enforce MFA for All Admins</p>
                <p className="text-xs text-muted-foreground mt-0.5">Require MFA for all administrator accounts</p>
              </div>
              <button
                onClick={() => setEnforcement(!enforcement)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enforcement ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
              >
                <span className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${enforcement ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
            <div className="space-y-3">
              <p className="text-sm font-medium">Role Requirements</p>
              {roleRequirements.map((r) => (
                <div key={r.role} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    {r.required ? <ShieldCheck className="h-4 w-4 text-emerald-500" /> : <ShieldOff className="h-4 w-4 text-muted-foreground" />}
                    <span className="text-sm">{r.role}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground">{r.enrolled} / {r.users} enrolled</span>
                    <div className="h-2 w-20 rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: `${(r.enrolled / r.users) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent MFA Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentEvents.map((e) => (
                <div key={e.id} className="flex items-start gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0 dark:border-slate-800">
                  <div className="rounded-lg bg-primary/10 p-1.5 mt-0.5">
                    {e.action === 'enabled' ? <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> :
                     e.action === 'disabled' ? <ShieldOff className="h-3.5 w-3.5 text-red-500" /> :
                     e.action === 'verified' ? <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" /> :
                     <XCircle className="h-3.5 w-3.5 text-yellow-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{e.user}</p>
                    <p className="text-xs text-muted-foreground">{e.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${actionBadge(e.action)}`}>
                        {e.action.charAt(0).toUpperCase() + e.action.slice(1)}
                      </span>
                      <span className="text-xs text-muted-foreground">{e.method}</span>
                      <span className="text-xs text-muted-foreground">• {e.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
