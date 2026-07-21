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
  Button, Badge, Card, CardContent, CardHeader, CardTitle, Modal, cn, Skeleton
} from '@schoolos/ui';
import { PageHeader } from '@/features/school-admin/components/page-header';
import { useSchoolAdminAuth } from '@/features/supabase/hooks/use-school-admin-auth';
import { SupabaseService } from '@/features/supabase/services/supabase.service';
import type { PrincipalData, AuditLogEntry, RecentActivity } from '@/features/school-admin/types';

const statusConfig: Record<string, { variant: 'success' | 'info' | 'destructive' | 'warning'; label: string }> = {
  active: { variant: 'success', label: 'Active' },
  invited: { variant: 'info', label: 'Invited' },
  suspended: { variant: 'destructive', label: 'Suspended' },
  inactive: { variant: 'warning', label: 'Inactive' },
};

export default function PrincipalDetailPage() {
  const params = useParams();
  const { schoolId } = useSchoolAdminAuth();
  const [principal, setPrincipal] = useState<PrincipalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loginHistory, setLoginHistory] = useState<AuditLogEntry[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  const [confirmAction, setConfirmAction] = useState<{ type: 'suspend' | 'activate' | 'reset' } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const principalId = params.id as string;

  useEffect(() => {
    if (!schoolId || !principalId) return;

    setLoading(true);
    setError('');

    const unsub = SupabaseService.subscribe<PrincipalData>(
      'principals', principalId,
      (data) => {
        if (data) {
          setPrincipal(data);
          setLoading(false);
        } else {
          setError('Principal not found');
          setLoading(false);
        }
      },
    );

    const unsubLogins = SupabaseService.subscribeList<AuditLogEntry>(
      'auditLogs', schoolId,
      (items) => {
        setLoginHistory(
          items
            .filter((l) => l.targetUid === principalId && l.action.toLowerCase().includes('login'))
            .slice(0, 10),
        );
      },
    );

    const unsubActivity = SupabaseService.subscribeList<RecentActivity>(
      'recentActivity', schoolId,
      (items) => {
        setRecentActivity(
          items.filter((a) => a.user === principalId || a.target === principalId).slice(0, 10),
        );
      },
    );

    return () => {
      unsub();
      unsubLogins();
      unsubActivity();
    };
  }, [schoolId, principalId]);

  async function handleConfirmAction() {
    if (!confirmAction || !schoolId || !principal) return;
    setActionLoading(true);
    try {
      if (confirmAction.type === 'suspend') {
        await SupabaseService.update('principals', principal.id, { status: 'suspended' });
        toast.success('Principal suspended');
      } else if (confirmAction.type === 'activate') {
        await SupabaseService.update('principals', principal.id, { status: 'active' });
        toast.success('Principal activated');
      } else if (confirmAction.type === 'reset') {
        await SupabaseService.update('principals', principal.id, { status: 'invited' });
        toast.success('Account reset successfully');
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
          <div className="space-y-6 lg:col-span-1">
            <Card><CardContent className="pt-6"><Skeleton variant="rectangular" height={200} /></CardContent></Card>
            <Card><CardContent className="pt-6"><Skeleton variant="rectangular" height={120} /></CardContent></Card>
          </div>
          <div className="space-y-6 lg:col-span-2">
            <Card><CardContent className="pt-6"><Skeleton variant="rectangular" height={300} /></CardContent></Card>
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
          breadcrumbs={[
            { label: 'Dashboard', href: '/school-admin/dashboard' },
            { label: 'Principals', href: '/school-admin/principals' },
            { label: 'Error' },
          ]}
        />
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <h3 className="mt-4 text-lg font-medium">Error Loading Principal</h3>
            <p className="mt-2 text-sm text-muted-foreground">{error || 'Principal not found'}</p>
            <Link href="/school-admin/principals">
              <Button variant="outline" className="mt-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Principals
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
        title={principal.name}
        description={`Principal • ${cfg?.label || principal.status}`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/school-admin/dashboard' },
          { label: 'Principals', href: '/school-admin/principals' },
          { label: principal.name },
        ]}
        actions={
          <div className="flex items-center gap-2">
            {principal.status !== 'suspended' ? (
              <Button variant="outline" className="text-amber-600 border-amber-200 hover:bg-amber-50" onClick={() => setConfirmAction({ type: 'suspend' })}>
                <ShieldOff className="mr-2 h-4 w-4" /> Suspend
              </Button>
            ) : (
              <Button variant="outline" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50" onClick={() => setConfirmAction({ type: 'activate' })}>
                <Shield className="mr-2 h-4 w-4" /> Activate
              </Button>
            )}
            <Button variant="outline" onClick={() => setConfirmAction({ type: 'reset' })}>
              <RotateCcw className="mr-2 h-4 w-4" /> Reset Account
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                    {principal.name.charAt(0).toUpperCase()}
                  </div>
                  <h2 className="mt-4 text-lg font-semibold">{principal.name}</h2>
                  <p className="text-sm text-muted-foreground">Principal</p>
                  {cfg && (
                    <Badge variant={cfg.variant} className="mt-2">{cfg.label}</Badge>
                  )}
                  {principal.lastLogin && (
                    <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Last login: {new Date(principal.lastLogin).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader><CardTitle className="text-sm">Contact Information</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${principal.email}`} className="hover:underline">{principal.email}</a>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {principal.phone ? (
                    <a href={`tel:${principal.phone}`} className="hover:underline">{principal.phone}</a>
                  ) : (
                    <span className="text-muted-foreground">Not provided</span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Created {new Date(principal.createdAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <LogIn className="h-4 w-4 text-muted-foreground" />
                  Login History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loginHistory.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <LogIn className="h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">No login history available</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {loginHistory.map((entry) => (
                      <div key={entry.id} className="flex items-start gap-3 rounded-lg border p-3 text-sm">
                        <LogIn className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">{entry.action}</p>
                          {entry.details && <p className="text-xs text-muted-foreground">{entry.details}</p>}
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(entry.timestamp).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }}>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentActivity.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Activity className="h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">No recent activity</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentActivity.map((entry) => (
                      <div key={entry.id} className="flex items-start gap-3 rounded-lg border p-3 text-sm">
                        <div className={cn(
                          'mt-1 h-2 w-2 rounded-full shrink-0',
                          entry.type === 'create' ? 'bg-emerald-500' :
                          entry.type === 'update' ? 'bg-blue-500' :
                          entry.type === 'delete' ? 'bg-red-500' :
                          entry.type === 'login' ? 'bg-purple-500' :
                          entry.type === 'suspend' ? 'bg-amber-500' :
                          entry.type === 'activate' ? 'bg-emerald-500' :
                          'bg-slate-400',
                        )} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs">
                            <span className="font-medium">{entry.user}</span>
                            {' '}{entry.action}{' '}
                            <span className="font-medium">{entry.target}</span>
                          </p>
                        </div>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                          {new Date(entry.timestamp).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <Modal
        open={!!confirmAction}
        onOpenChange={() => !actionLoading && setConfirmAction(null)}
        title={
          confirmAction?.type === 'suspend' ? 'Suspend Principal' :
          confirmAction?.type === 'activate' ? 'Activate Principal' :
          'Reset Account'
        }
      >
        <div className="pt-2">
          <p className="text-sm text-muted-foreground">
            {confirmAction?.type === 'suspend'
              ? `Are you sure you want to suspend ${principal.name}? They will lose access to the system.`
              : confirmAction?.type === 'activate'
              ? `Are you sure you want to activate ${principal.name}? They will regain access.`
              : `Are you sure you want to reset ${principal.name}'s account? They will need to re-register.`}
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirmAction(null)} disabled={actionLoading}>Cancel</Button>
            <Button
              variant={confirmAction?.type === 'suspend' ? 'destructive' : 'default'}
              onClick={handleConfirmAction}
              disabled={actionLoading}
            >
              {actionLoading ? 'Processing...' : 'Confirm'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
