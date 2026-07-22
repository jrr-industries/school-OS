'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Mail, Phone, Calendar, Shield, ShieldOff, RotateCcw,
  Clock, LogIn, Activity, AlertCircle, ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Button, Badge, Card, CardContent, CardHeader, CardTitle, Modal
} from '@schoolos/ui';
import { PageHeader } from '@/features/school-admin/components/page-header';

const statusConfig: Record<string, { variant: 'success' | 'info' | 'destructive' | 'warning'; label: string }> = {
  active: { variant: 'success', label: 'Active' },
  invited: { variant: 'info', label: 'Invited' },
  suspended: { variant: 'destructive', label: 'Suspended' },
  inactive: { variant: 'warning', label: 'Inactive' },
};

export default function PrincipalDetailPage() {
  const params = useParams();
  const [principal, setPrincipal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loginHistory, setLoginHistory] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [confirmAction, setConfirmAction] = useState<{ type: 'suspend' | 'activate' | 'reset' } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const principalId = params.id as string;

  useEffect(() => {
    if (!principalId) return;
    setLoading(true);

    fetch('/api/school-admin/users')
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          const found = json.data.find((u: any) => u.id === principalId);
          if (found) {
            setPrincipal(found);
            const logins = found.lastLoginAt ? [{ id: '1', action: 'login', performedBy: found.name, timestamp: found.lastLoginAt }] : [];
            setLoginHistory(logins);
            setRecentActivity([]);
          } else {
            setError('Principal not found');
          }
        }
      })
      .catch(() => setError('Failed to load principal'))
      .finally(() => setLoading(false));
  }, [principalId]);

  async function handleConfirmAction() {
    if (!confirmAction || !principal) return;
    setActionLoading(true);
    try {
      const status = confirmAction.type === 'suspend' ? 'suspended'
        : confirmAction.type === 'activate' ? 'active' : 'invited';
      const res = await fetch('/api/school-admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: principal.id, status }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Principal ${confirmAction.type === 'suspend' ? 'suspended' : confirmAction.type === 'activate' ? 'activated' : 'reset'}`);
        setPrincipal((prev: any) => ({ ...prev, status }));
      } else {
        toast.error(json.error || 'Action failed');
      }
    } catch {
      toast.error('Action failed');
    } finally {
      setActionLoading(false);
      setConfirmAction(null);
    }
  }

  const cfg = principal ? statusConfig[principal.status] || statusConfig.inactive : null;

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Principal Profile"
          description="Loading..."
          breadcrumbs={[
            { label: 'Dashboard', href: '/school-admin/dashboard' },
            { label: 'Principals', href: '/school-admin/principals' },
            { label: 'Loading...' },
          ]}
        />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-4">
            <div className="h-64 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
            <div className="h-32 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
          </div>
          <div className="lg:col-span-2 space-y-4">
            <div className="h-48 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
            <div className="h-64 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !principal) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Principal Profile"
          description="Error"
          breadcrumbs={[
            { label: 'Dashboard', href: '/school-admin/dashboard' },
            { label: 'Principals', href: '/school-admin/principals' },
            { label: 'Error' },
          ]}
        />
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <AlertCircle className="h-12 w-12 mb-4 text-red-500" />
            <h2 className="text-lg font-semibold">Principal Not Found</h2>
            <p className="mt-1 text-sm">{error || 'Unable to load principal data.'}</p>
            <Link href="/school-admin/principals">
              <Button variant="link" className="mt-4">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to Principals
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${principal.name}`}
        description="Principal profile and account management"
        breadcrumbs={[
          { label: 'Dashboard', href: '/school-admin/dashboard' },
          { label: 'Principals', href: '/school-admin/principals' },
          { label: principal.name },
        ]}
        actions={
          <div className="flex items-center gap-2">
            {principal.status === 'active' ? (
              <Button variant="destructive" size="sm" className="gap-1.5" onClick={() => setConfirmAction({ type: 'suspend' })}>
                <ShieldOff className="h-4 w-4" /> Suspend
              </Button>
            ) : (
              <Button variant="default" size="sm" className="gap-1.5" onClick={() => setConfirmAction({ type: 'activate' })}>
                <Shield className="h-4 w-4" /> Activate
              </Button>
            )}
            {principal.status !== 'invited' && (
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setConfirmAction({ type: 'reset' })}>
                <RotateCcw className="h-4 w-4" /> Reset
              </Button>
            )}
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-2xl font-bold text-primary">
                    {principal.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                  </span>
                </div>
                <h2 className="text-lg font-bold">{principal.name}</h2>
                <p className="text-sm text-muted-foreground">Principal</p>
                <div className="mt-3 flex justify-center gap-2">
                  <Badge variant={cfg?.variant || 'outline'}>{cfg?.label || principal.status}</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="truncate">{principal.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>{principal.phone || 'Not provided'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>Joined {new Date(principal.createdAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <LogIn className="h-4 w-4 text-muted-foreground" />
                  Login History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loginHistory.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">No login history available</p>
                ) : (
                  <div className="space-y-2">
                    {loginHistory.map((entry: any, i: number) => (
                      <div key={entry.id || i} className="flex items-center gap-3 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-muted-foreground">{new Date(entry.timestamp || entry.createdAt).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {recentActivity.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {recentActivity.map((action: any, i: number) => (
                      <div key={action.id || i} className="flex items-center justify-between py-1">
                        <span className="text-sm">{action.action || action.description}</span>
                        <span className="text-xs text-muted-foreground">{new Date(action.timestamp || action.createdAt).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>

      <Modal open={!!confirmAction} onOpenChange={(v) => !v && setConfirmAction(null)}>
        <Card className="w-full max-w-md">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">
              {confirmAction?.type === 'suspend' ? 'Suspend Principal' :
               confirmAction?.type === 'activate' ? 'Activate Principal' : 'Reset Account'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {confirmAction?.type === 'suspend' ? 'This will suspend the principal\'s access to the system.' :
               confirmAction?.type === 'activate' ? 'This will activate the principal\'s account.' :
               'This will reset the principal\'s account and send a new invitation.'}
            </p>
            <p className="text-sm font-medium">Are you sure you want to proceed?</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setConfirmAction(null)}>Cancel</Button>
              <Button
                variant={confirmAction?.type === 'suspend' ? 'destructive' : 'default'}
                onClick={handleConfirmAction}
                disabled={actionLoading}
              >
                {actionLoading ? 'Processing...' : 'Confirm'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </Modal>
    </div>
  );
}
