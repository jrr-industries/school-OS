'use client';

import { useState, useEffect } from 'react';
import {
  Plus, Search, Shield, ShieldOff,
  Loader2, UserPlus, X, Mail
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Button, Input, Badge, Card, CardContent, CardHeader, CardTitle, Modal, Select,
  SelectTrigger, SelectValue, SelectContent, SelectItem
} from '@schoolos/ui';
import { PageHeader } from '@/features/school-admin/components/page-header';
import { useSchoolAdminAuth } from '@/features/supabase/hooks/use-school-admin-auth';

interface UserData {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  status: string;
  roles: { id: string; name: string; slug: string }[];
  lastLoginAt: string | null;
  createdAt: string;
}

const statusConfig: Record<string, { variant: 'success' | 'info' | 'destructive' | 'warning' | 'default'; label: string }> = {
  active: { variant: 'success', label: 'Active' },
  invited: { variant: 'info', label: 'Invited' },
  suspended: { variant: 'destructive', label: 'Suspended' },
  inactive: { variant: 'warning', label: 'Inactive' },
};

const roleOptions = [
  { value: 'school_admin', label: 'School Admin' },
  { value: 'teacher', label: 'Teacher' },
  { value: 'staff', label: 'Staff' },
  { value: 'parent', label: 'Parent' },
  { value: 'student', label: 'Student' },
];

export default function PrincipalsPage() {
  const { schoolId, loading: authLoading } = useSchoolAdminAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [createOpen, setCreateOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState('school_admin');
  const [submitting, setSubmitting] = useState(false);

  const [confirmAction, setConfirmAction] = useState<{ type: 'suspend' | 'activate'; user: UserData } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const filtered = users.filter((u) => {
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== 'all' && u.status !== statusFilter) return false;
    return true;
  });

  useEffect(() => {
    if (!schoolId) return;
    setLoading(true);
    fetch('/api/school-admin/users')
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setUsers(json.data);
        else toast.error(json.error);
      })
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  }, [schoolId]);

  async function handleCreate() {
    if (!formName.trim() || !formEmail.trim() || !formPassword.trim()) {
      toast.error('Name, email, and password are required');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/school-admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName.trim(),
          email: formEmail.trim(),
          password: formPassword,
          roleSlug: formRole,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setUsers((prev) => [json.data, ...prev]);
        toast.success('User created successfully');
        setCreateOpen(false);
        setFormName('');
        setFormEmail('');
        setFormPassword('');
        setFormRole('school_admin');
      } else {
        toast.error(json.error || 'Failed to create user');
      }
    } catch {
      toast.error('Failed to create user');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleConfirmAction() {
    if (!confirmAction) return;
    setActionLoading(true);
    const { type, user: target } = confirmAction;
    const newStatus = type === 'suspend' ? 'suspended' : 'active';
    try {
      const res = await fetch(`/api/school-admin/users`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: target.id, status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setUsers((prev) => prev.map((u) => u.id === target.id ? { ...u, status: newStatus } : u));
        toast.success(`User ${type === 'suspend' ? 'suspended' : 'activated'}`);
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
        title="User Management"
        description="Create and manage users for your school"
        breadcrumbs={[
          { label: 'Dashboard', href: '/school-admin/dashboard' },
          { label: 'Users' },
        ]}
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create User
          </Button>
        }
      />

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>All Users ({filtered.length})</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
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
              <h3 className="mt-4 text-sm font-medium">No Users Found</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {search || statusFilter !== 'all' ? 'Try adjusting your search or filters' : 'Get started by creating your first user'}
              </p>
              {!search && statusFilter === 'all' && (
                <Button variant="outline" className="mt-4" size="sm" onClick={() => setCreateOpen(true)}>
                  <Plus className="mr-1 h-3 w-3" /> Create User
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
                      <th className="px-4 py-3 font-medium">Roles</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Created</th>
                      <th className="px-4 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((userItem) => {
                      const cfg = (statusConfig[userItem.status] ?? statusConfig.inactive)!;
                      return (
                        <tr key={userItem.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                                {userItem.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-sm font-medium">{userItem.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">{userItem.email}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              {userItem.roles.map((r) => (
                                <Badge key={r.id} variant="secondary" size="sm">{r.name}</Badge>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={cfg.variant} size="sm">{cfg.label}</Badge>
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {new Date(userItem.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {userItem.status !== 'suspended' ? (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-amber-600"
                                  onClick={() => setConfirmAction({ type: 'suspend', user: userItem })}
                                >
                                  <ShieldOff className="h-3.5 w-3.5" />
                                </Button>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-emerald-600"
                                  onClick={() => setConfirmAction({ type: 'activate', user: userItem })}
                                >
                                  <Shield className="h-3.5 w-3.5" />
                                </Button>
                              )}
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

      <Modal open={createOpen} onOpenChange={setCreateOpen} title="Create User" description="Add a new user to the school">
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input placeholder="Full name" value={formName} onChange={(e) => setFormName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input type="email" placeholder="user@school.edu" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input type="password" placeholder="Set a password for the user" value={formPassword} onChange={(e) => setFormPassword(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Role</label>
            <Select value={formRole} onValueChange={setFormRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={submitting}>
              {submitting ? 'Creating...' : 'Create User'}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={!!confirmAction}
        onOpenChange={() => !actionLoading && setConfirmAction(null)}
        title={confirmAction?.type === 'suspend' ? 'Suspend User' : 'Activate User'}
      >
        <div className="pt-2">
          <p className="text-sm text-muted-foreground">
            {confirmAction?.type === 'suspend'
              ? `Are you sure you want to suspend ${confirmAction?.user.name}? They will lose access to the system.`
              : `Are you sure you want to activate ${confirmAction?.user.name}? They will regain access to the system.`}
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
