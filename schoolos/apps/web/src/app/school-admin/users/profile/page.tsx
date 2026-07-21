'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Mail, Phone, Shield, ShieldOff, RotateCcw,
  Calendar, Clock, LogIn, Monitor, History, Key,
  AlertCircle, ArrowLeft, Building, User as UserIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Button, Badge, Card, CardContent, CardHeader, CardTitle, Modal, Skeleton, cn
} from '@schoolos/ui';
import { PageHeader } from '@/features/school-admin/components/page-header';
import { useFirebaseAuth } from '@/features/firebase/hooks/use-firebase-auth';
import { RealtimeService } from '@/features/firebase/services/realtime.service';
import type { SchoolAdminUser, AuditLogEntry } from '@/features/firebase/types';

const statusConfig: Record<string, { variant: 'success' | 'warning' | 'destructive' | 'info'; label: string }> = {
  active: { variant: 'success', label: 'Active' },
  inactive: { variant: 'warning', label: 'Inactive' },
  suspended: { variant: 'destructive', label: 'Suspended' },
};

const roleLabels: Record<string, string> = {
  school_admin: 'School Admin',
  principal: 'Principal',
  vice_principal: 'Vice Principal',
  teacher: 'Teacher',
  office_staff: 'Office Staff',
  accountant: 'Accountant',
  receptionist: 'Receptionist',
  librarian: 'Librarian',
  driver: 'Driver',
  security: 'Security',
  student: 'Student',
  parent: 'Parent',
};

export default function UserProfilePage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('id');
  const { schoolId } = useFirebaseAuth();

  const [userData, setUserData] = useState<SchoolAdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  const [confirmAction, setConfirmAction] = useState<{ type: 'suspend' | 'activate' | 'reset' } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!schoolId || !userId) {
      setLoading(false);
      setError('No user ID provided');
      return;
    }

    setLoading(true);
    setError('');

    const unsub = RealtimeService.subscribe<SchoolAdminUser>(
      `schools/${schoolId}/users/${userId}`,
      (data) => {
        if (data) {
          setUserData(data);
          setLoading(false);
        } else {
          setError('User not found');
          setLoading(false);
        }
      },
    );

    const unsubAudit = RealtimeService.subscribeList<AuditLogEntry>(
      `schools/${schoolId}/auditLogs`,
      (items) => {
        setAuditLogs(items.filter((l) => l.targetUid === userId).slice(0, 20));
      },
    );

    return () => {
      unsub();
      unsubAudit();
    };
  }, [schoolId, userId]);

  async function handleConfirmAction() {
    if (!confirmAction || !schoolId || !userData) return;
    setActionLoading(true);
    try {
      if (confirmAction.type === 'suspend') {
        await RealtimeService.update(`schools/${schoolId}/users/${userData.uid}`, { status: 'suspended' });
        toast.success('User suspended');
      } else if (confirmAction.type === 'activate') {
        await RealtimeService.update(`schools/${schoolId}/users/${userData.uid}`, { status: 'active' });
        toast.success('User activated');
      } else if (confirmAction.type === 'reset') {
        await RealtimeService.update(`schools/${schoolId}/users/${userData.uid}`, { status: 'inactive' });
        toast.success('Account reset successfully');
      }
    } catch {
      toast.error('Action failed');
    } finally {
      setActionLoading(false);
      setConfirmAction(null);
    }
  }

  if (!userId) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="User Profile"
          breadcrumbs={[
            { label: 'Dashboard', href: '/school-admin/dashboard' },
            { label: 'Users', href: '/school-admin/users' },
            { label: 'Profile' },
          ]}
        />
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <AlertCircle className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No User Selected</h3>
            <p className="mt-2 text-sm text-muted-foreground">Please select a user to view their profile.</p>
            <Link href="/school-admin/users">
              <Button variant="outline" className="mt-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="User Profile"
          description="Loading..."
          breadcrumbs={[
            { label: 'Dashboard', href: '/school-admin/dashboard' },
            { label: 'Users', href: '/school-admin/users' },
            { label: 'Profile' },
          ]}
        />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-1">
            <Card><CardContent className="pt-6"><Skeleton variant="rectangular" height={220} /></CardContent></Card>
            <Card><CardContent className="pt-6"><Skeleton variant="rectangular" height={140} /></CardContent></Card>
          </div>
          <div className="space-y-6 lg:col-span-2">
            <Card><CardContent className="pt-6"><Skeleton variant="rectangular" height={200} /></CardContent></Card>
            <Card><CardContent className="pt-6"><Skeleton variant="rectangular" height={200} /></CardContent></Card>
          </div>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="User Profile"
          breadcrumbs={[
            { label: 'Dashboard', href: '/school-admin/dashboard' },
            { label: 'Users', href: '/school-admin/users' },
            { label: 'Error' },
          ]}
        />
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <h3 className="mt-4 text-lg font-medium">Error Loading User</h3>
            <p className="mt-2 text-sm text-muted-foreground">{error || 'User not found'}</p>
            <Link href="/school-admin/users">
              <Button variant="outline" className="mt-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusCfg = (statusConfig[userData.status] ?? statusConfig.inactive)!;
  const roleLabel = roleLabels[userData.role] || userData.role;

  return (
    <div className="space-y-6">
      <PageHeader
        title={userData.name || userData.email}
        description={`${roleLabel} • ${statusCfg.label}`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/school-admin/dashboard' },
          { label: 'Users', href: '/school-admin/users' },
          { label: userData.name || 'Profile' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            {userData.status !== 'suspended' ? (
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
                    {userData.photo ? (
                      <img src={userData.photo} alt="" className="h-20 w-20 rounded-full object-cover" />
                    ) : (
                      (userData.name?.charAt(0) || userData.email?.charAt(0) || '?').toUpperCase()
                    )}
                  </div>
                  <h2 className="mt-4 text-lg font-semibold">{userData.name || 'Unnamed User'}</h2>
                  <p className="text-sm text-muted-foreground">{roleLabel}</p>
                  <Badge variant={statusCfg.variant} className="mt-2">{statusCfg.label}</Badge>
                  {userData.lastLogin && (
                    <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Last login: {new Date(userData.lastLogin).toLocaleString()}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader><CardTitle className="text-sm">Contact & Info</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                  <a href={`mailto:${userData.email}`} className="hover:underline truncate">{userData.email}</a>
                </div>
                {userData.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                    <a href={`tel:${userData.phone}`} className="hover:underline">{userData.phone}</a>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <Building className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>School ID: {userData.schoolId}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>Created: {new Date(userData.createdAt).toLocaleDateString()}</span>
                </div>
                {userData.createdBy && (
                  <div className="flex items-center gap-3 text-sm">
                    <UserIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span>Created By: {userData.createdBy}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {userData.deviceInfo && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.15 }}>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Monitor className="h-4 w-4" /> Devices</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="rounded-lg border p-3 text-sm">
                      <p className="text-xs text-muted-foreground">Device</p>
                      <p className="font-medium">{userData.deviceInfo}</p>
                    </div>
                    {userData.ipAddress && (
                      <div className="rounded-lg border p-3 text-sm">
                        <p className="text-xs text-muted-foreground">IP Address</p>
                        <p className="font-medium">{userData.ipAddress}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        <div className="space-y-6 lg:col-span-2">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <LogIn className="h-4 w-4 text-muted-foreground" />
                  Login Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {auditLogs.filter((l) => l.action?.toLowerCase().includes('login')).length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <LogIn className="h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">No login activity recorded</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {auditLogs
                      .filter((l) => l.action?.toLowerCase().includes('login'))
                      .slice(0, 10)
                      .map((entry) => (
                        <div key={entry.id} className="flex items-start gap-3 rounded-lg border p-3 text-sm">
                          <LogIn className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium">{entry.action}</p>
                            {entry.details && <p className="text-xs text-muted-foreground">{entry.details}</p>}
                            {entry.device && <p className="text-[10px] text-muted-foreground">{entry.device}</p>}
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
                  <History className="h-4 w-4 text-muted-foreground" />
                  Audit History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {auditLogs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <History className="h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">No audit history available</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {auditLogs.slice(0, 15).map((entry) => (
                      <div key={entry.id} className="flex items-start gap-3 rounded-lg border p-3 text-sm">
                        <div className={cn(
                          'mt-1 h-2 w-2 rounded-full shrink-0',
                          entry.action?.includes('create') ? 'bg-emerald-500' :
                          entry.action?.includes('update') ? 'bg-blue-500' :
                          entry.action?.includes('delete') ? 'bg-red-500' :
                          entry.action?.includes('login') ? 'bg-purple-500' :
                          entry.action?.includes('suspend') ? 'bg-amber-500' :
                          entry.action?.includes('activate') ? 'bg-emerald-500' :
                          'bg-slate-400',
                        )} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium">{entry.action}</p>
                          {entry.details && <p className="text-[10px] text-muted-foreground">{entry.details}</p>}
                          <p className="text-[10px] text-muted-foreground">by {entry.performedBy}</p>
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

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.35 }}>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Key className="h-4 w-4 text-muted-foreground" />
                  Permissions & School
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Role</p>
                    <p className="text-sm font-medium">{roleLabel}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Status</p>
                    <Badge variant={statusCfg.variant} size="sm">{statusCfg.label}</Badge>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Assigned School</p>
                    <p className="text-sm font-medium">{userData.schoolId}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Created By</p>
                    <p className="text-sm font-medium">{userData.createdBy || '—'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <Modal
        open={!!confirmAction}
        onOpenChange={() => !actionLoading && setConfirmAction(null)}
        title={
          confirmAction?.type === 'suspend' ? 'Suspend User' :
          confirmAction?.type === 'activate' ? 'Activate User' :
          'Reset Account'
        }
      >
        <div className="pt-2">
          <p className="text-sm text-muted-foreground">
            {confirmAction?.type === 'suspend'
              ? `Are you sure you want to suspend ${userData.name || userData.email}?`
              : confirmAction?.type === 'activate'
              ? `Are you sure you want to activate ${userData.name || userData.email}?`
              : `Are you sure you want to reset ${userData.name || userData.email}'s account?`}
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
