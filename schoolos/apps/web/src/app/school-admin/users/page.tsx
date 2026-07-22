'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Search, Eye, Shield, ShieldOff, RotateCcw,
  Users, ArrowUpDown, ArrowUp, ArrowDown, X, Mail, Phone, UserPlus
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Button, Input, Badge, Card, CardContent, CardHeader, CardTitle,
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Modal
} from '@schoolos/ui';
import { PageHeader } from '@/features/school-admin/components/page-header';
import { useSchoolAdminAuth } from '@/features/supabase/hooks/use-school-admin-auth';

interface ApiUser {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  status: string;
  roles: { id: string; name: string; slug: string }[];
  lastLoginAt: string | null;
  createdAt: string;
}

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

const roleColors: Record<string, 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning' | 'info'> = {
  school_admin: 'default',
  principal: 'info',
  vice_principal: 'info',
  teacher: 'secondary',
  office_staff: 'secondary',
  accountant: 'secondary',
  receptionist: 'secondary',
  librarian: 'secondary',
  driver: 'outline',
  security: 'outline',
  student: 'success',
  parent: 'warning',
};

type SortField = 'name' | 'status' | 'lastLogin' | 'createdAt';
type SortDir = 'asc' | 'desc';

const PAGE_SIZE = 10;

export default function UsersPage() {
  const { loading: authLoading } = useSchoolAdminAuth();
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const [confirmAction, setConfirmAction] = useState<{ type: 'suspend' | 'activate' | 'reset'; user: ApiUser } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', email: '', password: '', roleSlug: 'teacher' });
  const [addLoading, setAddLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch('/api/school-admin/users');
      const json = await res.json();
      if (json.success) {
        setUsers(json.data);
      }
    } catch {
      toast.error('Failed to load users');
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filtered = useMemo(() => {
    let result = [...users];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (u) =>
          u.name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.phone?.toLowerCase().includes(q),
      );
    }
    if (roleFilter !== 'all') result = result.filter((u) => u.roles.some((r) => r.slug === roleFilter));
    if (statusFilter !== 'all') result = result.filter((u) => u.status === statusFilter);

    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'name':
          cmp = (a.name || '').localeCompare(b.name || '');
          break;
        case 'status':
          cmp = (a.status || '').localeCompare(b.status || '');
          break;
        case 'lastLogin':
          cmp = (a.lastLoginAt || '').localeCompare(b.lastLoginAt || '');
          break;
        case 'createdAt':
          cmp = (a.createdAt || '').localeCompare(b.createdAt || '');
          break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [users, search, roleFilter, statusFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
    setPage(1);
  }

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return <ArrowUpDown className="ml-1 h-3 w-3 opacity-40" />;
    return sortDir === 'asc'
      ? <ArrowUp className="ml-1 h-3 w-3" />
      : <ArrowDown className="ml-1 h-3 w-3" />;
  }

  async function handleConfirmAction() {
    if (!confirmAction) return;
    setActionLoading(true);
    const { type, user: target } = confirmAction;
    try {
      let newStatus: string;
      if (type === 'suspend') newStatus = 'suspended';
      else if (type === 'activate') newStatus = 'active';
      else newStatus = 'inactive';

      const res = await fetch('/api/school-admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: target.id, status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`User ${type === 'suspend' ? 'suspended' : type === 'activate' ? 'activated' : 'reset'}`);
        setUsers((prev) => prev.map((u) => (u.id === target.id ? { ...u, status: newStatus } : u)));
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

  async function handleAddUser() {
    if (!addForm.name.trim() || !addForm.email.trim() || !addForm.password.trim()) {
      toast.error('Name, email, and password are required');
      return;
    }
    setAddLoading(true);
    try {
      const res = await fetch('/api/school-admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('User created successfully');
        setShowAddModal(false);
        setAddForm({ name: '', email: '', password: '', roleSlug: 'teacher' });
        fetchUsers();
      } else {
        toast.error(json.error || 'Failed to create user');
      }
    } catch {
      toast.error('Failed to create user');
    } finally {
      setAddLoading(false);
    }
  }

  const isLoading = authLoading || dataLoading;

  return (
    <div className="space-y-6">
      <PageHeader
        title="All Users"
        description="Manage all users across the school"
        breadcrumbs={[
          { label: 'Dashboard', href: '/school-admin/dashboard' },
          { label: 'Users' },
        ]}
        actions={
          <Button onClick={() => setShowAddModal(true)} className="gap-2">
            <UserPlus className="h-4 w-4" /> Add User
          </Button>
        }
      />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Users ({filtered.length})</CardTitle>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email or phone..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-8 w-full"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setPage(1); }}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {Object.entries(roleLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              {(roleFilter !== 'all' || statusFilter !== 'all' || search) && (
                <Button variant="ghost" size="sm" onClick={() => { setRoleFilter('all'); setStatusFilter('all'); setSearch(''); setPage(1); }}>
                  <X className="mr-1 h-3 w-3" /> Clear
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-4 p-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/3 bg-muted animate-pulse rounded" />
                    <div className="h-3 w-1/5 bg-muted animate-pulse rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-sm font-medium">No Users Found</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {search || roleFilter !== 'all' || statusFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'No users have been added yet'}
              </p>
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
                      <th className="px-4 py-3 font-medium cursor-pointer hover:text-foreground" onClick={() => toggleSort('name')}>
                        <span className="inline-flex items-center">User <SortIcon field="name" /></span>
                      </th>
                      <th className="px-4 py-3 font-medium">Role</th>
                      <th className="px-4 py-3 font-medium">Email</th>
                      <th className="px-4 py-3 font-medium">Phone</th>
                      <th className="px-4 py-3 font-medium cursor-pointer hover:text-foreground" onClick={() => toggleSort('status')}>
                        <span className="inline-flex items-center">Status <SortIcon field="status" /></span>
                      </th>
                      <th className="px-4 py-3 font-medium cursor-pointer hover:text-foreground" onClick={() => toggleSort('lastLogin')}>
                        <span className="inline-flex items-center">Last Login <SortIcon field="lastLogin" /></span>
                      </th>
                      <th className="px-4 py-3 font-medium cursor-pointer hover:text-foreground" onClick={() => toggleSort('createdAt')}>
                        <span className="inline-flex items-center">Created <SortIcon field="createdAt" /></span>
                      </th>
                      <th className="px-4 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((u) => {
                      const statusCfg = (statusConfig[u.status] ?? statusConfig.inactive)!;
                      const roleColor = roleColors[u.roles[0]?.slug] || 'secondary';
                      return (
                        <tr key={u.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                          <td className="px-4 py-3">
                            <Link href={`/school-admin/users/profile?id=${u.id}`} className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary shrink-0">
                                {(u.name?.charAt(0) || u.email?.charAt(0) || '?').toUpperCase()}
                              </div>
                              <span className="text-sm font-medium">{u.name || u.email}</span>
                            </Link>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={roleColor} size="sm">{roleLabels[u.roles[0]?.slug] || u.roles[0]?.name || 'N/A'}</Badge>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                              <span className="text-sm text-muted-foreground truncate max-w-[180px]">{u.email}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {u.phone ? (
                              <div className="flex items-center gap-1.5">
                                <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                <span className="text-sm text-muted-foreground">{u.phone}</span>
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={statusCfg.variant} size="sm">{statusCfg.label}</Badge>
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString() : '—'}
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Link href={`/school-admin/users/profile?id=${u.id}`}>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Eye className="h-3.5 w-3.5" />
                                </Button>
                              </Link>
                              {u.status !== 'suspended' ? (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-amber-600"
                                  onClick={() => setConfirmAction({ type: 'suspend', user: u })}
                                >
                                  <ShieldOff className="h-3.5 w-3.5" />
                                </Button>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-emerald-600"
                                  onClick={() => setConfirmAction({ type: 'activate', user: u })}
                                >
                                  <Shield className="h-3.5 w-3.5" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setConfirmAction({ type: 'reset', user: u })}
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

              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t px-4 py-3">
                  <p className="text-sm text-muted-foreground">
                    Showing {(page - 1) * PAGE_SIZE + 1}–
                    {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>

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
              ? `Are you sure you want to suspend ${confirmAction?.user.name || confirmAction?.user.email}?`
              : confirmAction?.type === 'activate'
              ? `Are you sure you want to activate ${confirmAction?.user.name || confirmAction?.user.email}?`
              : `Are you sure you want to reset ${confirmAction?.user.name || confirmAction?.user.email}'s account?`}
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

      <Modal open={showAddModal} onOpenChange={() => !addLoading && setShowAddModal(false)} title="Add New User">
        <div className="pt-2 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name *</label>
            <Input value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} placeholder="Full name" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email *</label>
            <Input type="email" value={addForm.email} onChange={(e) => setAddForm({ ...addForm, email: e.target.value })} placeholder="user@school.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password *</label>
            <Input type="password" value={addForm.password} onChange={(e) => setAddForm({ ...addForm, password: e.target.value })} placeholder="Min 6 characters" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Role *</label>
            <Select value={addForm.roleSlug} onValueChange={(v) => setAddForm({ ...addForm, roleSlug: v })}>
              <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
              <SelectContent>
                {Object.entries(roleLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setShowAddModal(false)} disabled={addLoading}>Cancel</Button>
            <Button onClick={handleAddUser} disabled={addLoading}>
              {addLoading ? 'Creating...' : 'Create User'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
