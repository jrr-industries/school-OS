'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus, Search, Eye, Shield, ShieldOff, RotateCcw,
  Loader2, UserPlus, X, Mail, Phone
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Button, Input, Badge, Card, CardContent, CardHeader, CardTitle, Modal, Select,
  SelectTrigger, SelectValue, SelectContent, SelectItem
} from '@schoolos/ui';
import { PageHeader } from '@/features/school-admin/components/page-header';
import { useSchoolAdminAuth } from '@/features/supabase/hooks/use-school-admin-auth';
import { SupabaseService } from '@/features/supabase/services/supabase.service';
import type { PrincipalData } from '@/features/school-admin/types';

const statusConfig: Record<string, { variant: 'success' | 'info' | 'destructive' | 'warning' | 'default'; label: string }> = {
  active: { variant: 'success', label: 'Active' },
  invited: { variant: 'info', label: 'Invited' },
  suspended: { variant: 'destructive', label: 'Suspended' },
  inactive: { variant: 'warning', label: 'Inactive' },
};

export default function PrincipalsPage() {
  const { user, schoolId, loading: authLoading } = useSchoolAdminAuth();
  const [principals, setPrincipals] = useState<PrincipalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [createOpen, setCreateOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [confirmAction, setConfirmAction] = useState<{ type: 'suspend' | 'activate' | 'reset'; principal: PrincipalData } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const filtered = principals.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.email.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    return true;
  });

  useEffect(() => {
    if (!schoolId) return;
    setLoading(true);
    const unsub = SupabaseService.subscribeList<PrincipalData>('principals', schoolId, (items) => {
      setPrincipals(items);
      setLoading(false);
    });
    return () => unsub();
  }, [schoolId]);

  async function handleCreate() {
    if (!formName.trim() || !formEmail.trim()) {
      toast.error('Name and email are required');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        name: formName.trim(),
        email: formEmail.trim(),
        phone: formPhone.trim(),
        schoolId,
        status: 'invited' as const,
        createdBy: user?.uid || '',
        createdAt: new Date().toISOString(),
      };
      await SupabaseService.insert('principals', { ...payload, school_id: schoolId });
      toast.success('Principal created successfully');
      setCreateOpen(false);
      setFormName('');
      setFormEmail('');
      setFormPhone('');
    } catch {
      toast.error('Failed to create principal');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleConfirmAction() {
    if (!confirmAction || !schoolId) return;
    setActionLoading(true);
    const { type, principal } = confirmAction;
    try {
      if (type === 'suspend') {
        await SupabaseService.update('principals', principal.id, { status: 'suspended' });
        toast.success('Principal suspended');
      } else if (type === 'activate') {
        await SupabaseService.update('principals', principal.id, { status: 'active' });
        toast.success('Principal activated');
      } else if (type === 'reset') {
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

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Principal Management"
        description="Manage school principals and administrators"
        breadcrumbs={[
          { label: 'Dashboard', href: '/school-admin/dashboard' },
          { label: 'Principals' },
        ]}
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Principal
          </Button>
        }
      />

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>All Principals ({filtered.length})</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search principals..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 w-60"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="invited">Invited</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              {statusFilter !== 'all' && (
                <Button variant="ghost" size="sm" onClick={() => setStatusFilter('all')}>
                  <X className="mr-1 h-3 w-3" /> Clear
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-4 p-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/3 bg-muted animate-pulse rounded" />
                    <div className="h-3 w-1/4 bg-muted animate-pulse rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <UserPlus className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-sm font-medium">No Principals Found</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {search || statusFilter !== 'all' ? 'Try adjusting your search or filters' : 'Get started by creating your first principal'}
              </p>
              {!search && statusFilter === 'all' && (
                <Button variant="outline" className="mt-4" size="sm" onClick={() => setCreateOpen(true)}>
                  <Plus className="mr-1 h-3 w-3" /> Create Principal
                </Button>
              )}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-xs font-medium text-muted-foreground">
                      <th className="px-4 py-3 font-medium">Name</th>
                      <th className="px-4 py-3 font-medium">Email</th>
                      <th className="px-4 py-3 font-medium">Phone</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Created</th>
                      <th className="px-4 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((principal) => {
                      const cfg = (statusConfig[principal.status] ?? statusConfig.inactive)!;
                      return (
                        <tr key={principal.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                          <td className="px-4 py-3">
                            <Link href={`/school-admin/principals/${principal.id}`} className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                                {principal.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-sm font-medium">{principal.name}</span>
                            </Link>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                              <a href={`mailto:${principal.email}`} className="text-sm text-muted-foreground hover:text-foreground hover:underline">
                                {principal.email}
                              </a>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {principal.phone ? (
                              <div className="flex items-center gap-1.5">
                                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                                <a href={`tel:${principal.phone}`} className="text-sm text-muted-foreground hover:text-foreground hover:underline">
                                  {principal.phone}
                                </a>
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={cfg.variant} size="sm">{cfg.label}</Badge>
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {new Date(principal.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Link href={`/school-admin/principals/${principal.id}`}>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Eye className="h-3.5 w-3.5" />
                                </Button>
                              </Link>
                              {principal.status !== 'suspended' ? (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-amber-600"
                                  onClick={() => setConfirmAction({ type: 'suspend', principal })}
                                >
                                  <ShieldOff className="h-3.5 w-3.5" />
                                </Button>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-emerald-600"
                                  onClick={() => setConfirmAction({ type: 'activate', principal })}
                                >
                                  <Shield className="h-3.5 w-3.5" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setConfirmAction({ type: 'reset', principal })}
                              >
                                <RotateCcw className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      <Modal open={createOpen} onOpenChange={setCreateOpen} title="Create Principal" description="Add a new principal to the school">
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input placeholder="Full name" value={formName} onChange={(e) => setFormName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Google Email</label>
            <Input type="email" placeholder="principal@school.edu" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Phone</label>
            <Input placeholder="Phone number" value={formPhone} onChange={(e) => setFormPhone(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Principal'}
            </Button>
          </div>
        </div>
      </Modal>

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
              ? `Are you sure you want to suspend ${confirmAction?.principal.name}? They will lose access to the system.`
              : confirmAction?.type === 'activate'
              ? `Are you sure you want to activate ${confirmAction?.principal.name}? They will regain access to the system.`
              : `Are you sure you want to reset ${confirmAction?.principal.name}'s account? They will need to re-register.`}
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
