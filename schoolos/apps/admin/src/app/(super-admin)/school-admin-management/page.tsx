'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClientSupabaseClient } from '@schoolos/auth/client';
import { SupabaseRealtime } from '@/lib/supabase-realtime';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Button,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Avatar,
  Tooltip,
  Pagination,
  Skeleton,
  cn,
} from '@schoolos/ui';
import {
  Search,
  Plus,
  Eye,
  Ban,
  CheckCircle,
  RefreshCw,
  AlertCircle,
  Loader2,
  UserX,
  Users,
  ShieldCheck,
  UserCog,
  FilterX,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface SchoolAdminUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  schoolId: string | null;
  status: string;
  lastLogin: string | null;
  createdAt: string;
  role: string;
  school: { id: string; name: string } | null;
}

interface School {
  id: string;
  name: string;
}

const PAGE_SIZE = 10;

const STATUS_CONFIG: Record<string, { label: string; variant: 'success' | 'secondary' | 'destructive' | 'outline'; dot: string }> = {
  active: { label: 'Active', variant: 'success', dot: 'bg-emerald-500' },
  inactive: { label: 'Inactive', variant: 'secondary', dot: 'bg-gray-400' },
  suspended: { label: 'Suspended', variant: 'destructive', dot: 'bg-red-500' },
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'Never';
  try {
    return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

function StatCard({ icon: Icon, label, value, color, loading }: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
  loading: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border bg-card p-4 transition-shadow hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <div className={cn('rounded-lg p-2.5', color)}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          {loading ? (
            <Skeleton variant="text" width={48} height={24} className="mt-0.5" />
          ) : (
            <p className="text-xl font-bold tracking-tight">{value.toLocaleString()}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function SchoolAdminManagementPage() {
  const router = useRouter();
  const supabaseRef = useRef<ReturnType<typeof createClientSupabaseClient> | null>(null);
  const getSupabase = useCallback(() => {
    if (!supabaseRef.current) supabaseRef.current = createClientSupabaseClient();
    return supabaseRef.current;
  }, []);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [schoolFilter, setSchoolFilter] = useState('');
  const [schools, setSchools] = useState<School[]>([]);

  const [admins, setAdmins] = useState<SchoolAdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchSchools = useCallback(async () => {
    const { data } = await getSupabase().from('School').select('id, name').order('name');
    if (data) setSchools(data);
  }, [getSupabase]);

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let query = getSupabase()
        .from('User')
        .select('*, school:schoolId(id, name)', { count: 'exact' })
        .eq('role', 'school_admin')
        .order('createdAt', { ascending: false })
        .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

      if (statusFilter) query = query.eq('status', statusFilter);
      if (schoolFilter) query = query.eq('schoolId', schoolFilter);
      if (search) {
        query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
      }

      const { data, count, error: fetchError } = await query;
      if (fetchError) throw fetchError;
      setAdmins((data ?? []) as unknown as SchoolAdminUser[]);
      setTotal(count ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load school admins');
    } finally {
      setLoading(false);
    }
  }, [getSupabase, page, search, statusFilter, schoolFilter]);

  useEffect(() => { fetchSchools(); }, [fetchSchools]);
  useEffect(() => { fetchAdmins(); }, [fetchAdmins]);

  useEffect(() => {
    const unsubscribe = SupabaseRealtime.subscribe(
      { table: 'User', event: '*', filter: 'role=eq.school_admin' },
      () => { fetchAdmins(); },
    );
    return unsubscribe;
  }, [fetchAdmins]);

  const handleSuspendToggle = async (admin: SchoolAdminUser) => {
    setActionLoading(admin.id);
    try {
      const newStatus = admin.status === 'suspended' ? 'active' : 'suspended';
      const { error: updateError } = await getSupabase()
        .from('User')
        .update({ status: newStatus })
        .eq('id', admin.id);
      if (updateError) throw updateError;
      toast.success(`School admin ${newStatus === 'suspended' ? 'suspended' : 'activated'} successfully`);
      fetchAdmins();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleResetAccess = async (admin: SchoolAdminUser) => {
    setActionLoading(admin.id);
    try {
      const { error: resetError } = await getSupabase()
        .from('User')
        .update({ lastLogin: null })
        .eq('id', admin.id);
      if (resetError) throw resetError;
      toast.success('Access reset successfully');
      fetchAdmins();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to reset access');
    } finally {
      setActionLoading(null);
    }
  };

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('');
    setSchoolFilter('');
    setPage(1);
  };

  const hasFilters = search || statusFilter || schoolFilter;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const activeCount = admins.filter((a) => a.status === 'active').length;
  const suspendedCount = admins.filter((a) => a.status === 'suspended').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="hidden rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-3 shadow-lg shadow-indigo-500/20 sm:block">
            <UserCog className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">School Admins</h1>
            <p className="text-sm text-muted-foreground">
              Manage school administrators across all schools
            </p>
          </div>
        </div>
        <Link href="/school-admin-management/create">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create School Admin
          </Button>
        </Link>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={Users}
          label="Total Admins"
          value={total}
          color="bg-indigo-500"
          loading={loading}
        />
        <StatCard
          icon={ShieldCheck}
          label="Active"
          value={activeCount}
          color="bg-emerald-500"
          loading={loading}
        />
        <StatCard
          icon={Ban}
          label="Suspended"
          value={suspendedCount}
          color="bg-red-500"
          loading={loading}
        />
      </div>

      {/* ── Filters ── */}
      <Card className="overflow-hidden border-none bg-gradient-to-r from-indigo-500/5 to-purple-500/5 shadow-sm">
        <CardContent className="p-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="bg-background pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select value={schoolFilter} onValueChange={(v) => { setSchoolFilter(v); setPage(1); }}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="All Schools" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Schools</SelectItem>
                {schools.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={resetFilters} disabled={!hasFilters} className="gap-2">
              <FilterX className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── Error State ── */}
      {error && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="flex flex-col items-start gap-3 pt-6 sm:flex-row sm:items-center">
            <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
            <div className="flex-1">
              <p className="text-sm font-medium text-destructive">Error loading school admins</p>
              <p className="text-xs text-muted-foreground">{error}</p>
            </div>
            <Button variant="outline" size="sm" onClick={fetchAdmins} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ── Main Table Card ── */}
      <Card className="overflow-hidden shadow-md">
        {/* Loading skeleton */}
        {loading && (
          <CardContent className="p-6">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton variant="circular" width={40} height={40} />
                  <div className="flex-1 space-y-2">
                    <Skeleton variant="text" width="40%" height={14} />
                    <Skeleton variant="text" width="60%" height={12} />
                  </div>
                  <Skeleton variant="rectangular" width={80} height={24} />
                  <Skeleton variant="rectangular" width={100} height={32} />
                </div>
              ))}
            </div>
          </CardContent>
        )}

        {/* Empty state */}
        {!loading && admins.length === 0 && (
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 rounded-full bg-muted p-4">
              <UserX className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="mb-1 text-lg font-semibold">No school admins found</h3>
            <p className="mb-6 max-w-sm text-sm text-muted-foreground">
              {hasFilters
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by creating your first school administrator'}
            </p>
            {!hasFilters && (
              <Link href="/school-admin-management/create">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create School Admin
                </Button>
              </Link>
            )}
          </CardContent>
        )}

        {/* Data table */}
        {!loading && admins.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full caption-bottom text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="h-11 px-4 text-left font-semibold text-muted-foreground">Admin</th>
                    <th className="h-11 px-4 text-left font-semibold text-muted-foreground">Email</th>
                    <th className="h-11 px-4 text-left font-semibold text-muted-foreground">School</th>
                    <th className="h-11 px-4 text-left font-semibold text-muted-foreground">Status</th>
                    <th className="h-11 px-4 text-left font-semibold text-muted-foreground">Last Login</th>
                    <th className="h-11 px-4 text-left font-semibold text-muted-foreground">Created</th>
                    <th className="h-11 px-4 text-right font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {admins.map((admin, index) => {
                      const statusCfg = STATUS_CONFIG[admin.status] ?? { label: admin.status, variant: 'outline' as const, dot: 'bg-gray-400' };
                      return (
                        <motion.tr
                          key={admin.id}
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className="group border-b transition-colors hover:bg-muted/40"
                        >
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <Avatar size="sm" fallback={admin.name}>
                                <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white">
                                  {getInitials(admin.name)}
                                </div>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="truncate font-medium">{admin.name}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="text-muted-foreground">{admin.email}</span>
                          </td>
                          <td className="p-3">
                            <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                              {admin.school?.name || '\u2014'}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <span className={cn('h-2 w-2 rounded-full', statusCfg.dot)} />
                              <span className={cn(
                                'text-xs font-medium',
                                admin.status === 'active' && 'text-emerald-600',
                                admin.status === 'suspended' && 'text-red-600',
                                admin.status === 'inactive' && 'text-muted-foreground',
                              )}>
                                {statusCfg.label}
                              </span>
                            </div>
                          </td>
                          <td className="p-3 text-xs text-muted-foreground">
                            {formatDate(admin.lastLogin)}
                          </td>
                          <td className="p-3 text-xs text-muted-foreground">
                            {formatDate(admin.createdAt)}
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-0.5">
                              <Tooltip content="View details" side="top">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 opacity-60 transition-opacity hover:opacity-100"
                                  onClick={() => router.push(`/school-admin-management/${admin.id}`)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Tooltip>
                              <Tooltip content={admin.status === 'suspended' ? 'Activate' : 'Suspend'} side="top">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 opacity-60 transition-opacity hover:opacity-100"
                                  onClick={() => handleSuspendToggle(admin)}
                                  disabled={actionLoading === admin.id}
                                >
                                  {actionLoading === admin.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : admin.status === 'suspended' ? (
                                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                                  ) : (
                                    <Ban className="h-4 w-4 text-amber-500" />
                                  )}
                                </Button>
                              </Tooltip>
                              <Tooltip content="Reset access" side="top">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 opacity-60 transition-opacity hover:opacity-100"
                                  onClick={() => handleResetAccess(admin)}
                                  disabled={actionLoading === admin.id}
                                >
                                  <RefreshCw className="h-4 w-4" />
                                </Button>
                              </Tooltip>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col items-center justify-between gap-3 border-t px-4 py-3 sm:flex-row">
              <p className="text-xs text-muted-foreground">
                Showing <span className="font-medium">{(page - 1) * PAGE_SIZE + 1}</span>
                {'\u2013'}
                <span className="font-medium">{Math.min(page * PAGE_SIZE, total)}</span> of{' '}
                <span className="font-medium">{total}</span> admins
              </p>
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          </>
        )}
      </Card>
    </motion.div>
  );
}
