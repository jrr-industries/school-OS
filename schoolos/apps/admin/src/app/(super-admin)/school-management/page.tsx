'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Search,
  Plus,
  Eye,
  Pencil,
  ShieldOff,
  ShieldCheck,
  Trash2,
  ArrowUpDown,
  Building2,
  Loader2,
  School,
} from 'lucide-react';
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
  cn,
} from '@schoolos/ui';

interface SchoolRecord {
  id: string;
  name: string;
  code: string;
  logo?: string;
  type: string;
  board: string;
  city?: string;
  state?: string;
  principal?: string;
  studentsCount: number;
  teachersCount: number;
  subscription: string;
  status: 'active' | 'trial' | 'suspended' | 'inactive';
  lastActivity: string;
  createdAt: string;
}

const ITEMS_PER_PAGE = 10;

const STATUS_OPTIONS = ['all', 'active', 'trial', 'suspended', 'inactive'] as const;

const STATUS_BADGE: Record<string, { variant: 'success' | 'info' | 'destructive' | 'secondary'; label: string }> = {
  active: { variant: 'success', label: 'Active' },
  trial: { variant: 'info', label: 'Trial' },
  suspended: { variant: 'destructive', label: 'Suspended' },
  inactive: { variant: 'secondary', label: 'Inactive' },
};

export default function SchoolListPage() {
  const router = useRouter();
  const [schools, setSchools] = useState<SchoolRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortColumn, setSortColumn] = useState('createdAt');
  const [sortAsc, setSortAsc] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));

  const buildFilters = useCallback(() => {
    const filters: Record<string, unknown> = {};
    if (statusFilter !== 'all') {
      filters.status = statusFilter;
    }
    if (search.trim()) {
      filters.name = search.trim();
    }
    return filters;
  }, [search, statusFilter]);

  const fetchSchools = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await SupabaseRealtime.getPaginated<SchoolRecord>(
        'School',
        page,
        ITEMS_PER_PAGE,
        sortColumn,
        sortAsc,
        buildFilters(),
      );
      setSchools(result.data);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch schools');
    } finally {
      setLoading(false);
    }
  }, [page, sortColumn, sortAsc, buildFilters]);

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  useEffect(() => {
    const unsubscribe = SupabaseRealtime.subscribe(
      { table: 'School', event: '*' },
      fetchSchools,
    );
    return unsubscribe;
  }, [fetchSchools]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortAsc((prev) => !prev);
    } else {
      setSortColumn(column);
      setSortAsc(false);
    }
  };

  const handleSuspendToggle = async (school: SchoolRecord) => {
    const newStatus = school.status === 'suspended' ? 'active' : 'suspended';
    try {
      const res = await fetch(`/api/admin/schools/${school.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      toast.success(`School ${newStatus === 'suspended' ? 'suspended' : 'activated'} successfully`);
      fetchSchools();
    } catch {
      toast.error('Failed to update school status');
    }
  };

  const handleDelete = async (school: SchoolRecord) => {
    if (!window.confirm(`Are you sure you want to delete ${school.name}?`)) return;
    try {
      const res = await fetch(`/api/admin/schools/${school.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete school');
      toast.success('School deleted successfully');
      fetchSchools();
    } catch {
      toast.error('Failed to delete school');
    }
  };

  const SortHeader = ({ column, children }: { column: string; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(column)}
      className="inline-flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground transition-colors"
    >
      {children}
      <ArrowUpDown className="h-3 w-3" />
    </button>
  );

  const renderSkeleton = () => (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-lg border p-4">
          <div className="h-10 w-10 animate-pulse rounded-lg bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-48 animate-pulse rounded bg-muted" />
            <div className="h-3 w-32 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-4 w-20 animate-pulse rounded bg-muted" />
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="h-8 w-24 animate-pulse rounded bg-muted" />
        </div>
      ))}
    </div>
  );

  const renderEmpty = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <School className="mb-4 h-12 w-12 text-muted-foreground" />
      <h3 className="mb-1 text-lg font-semibold">No schools found</h3>
      <p className="mb-6 text-sm text-muted-foreground">
        {search || statusFilter !== 'all'
          ? 'Try adjusting your search or filter criteria'
          : 'Get started by creating your first school'}
      </p>
      {!search && statusFilter === 'all' && (
        <Button onClick={() => router.push('/school-management/create')}>
          <Plus className="mr-2 h-4 w-4" />
          Create School
        </Button>
      )}
    </div>
  );

  const renderError = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 rounded-full bg-destructive/10 p-4">
        <Loader2 className="h-8 w-8 text-destructive" />
      </div>
      <h3 className="mb-1 text-lg font-semibold">Something went wrong</h3>
      <p className="mb-6 text-sm text-muted-foreground">{error}</p>
      <Button variant="outline" onClick={fetchSchools}>
        Try Again
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Schools</CardTitle>
          <Button onClick={() => router.push('/school-management/create')}>
            <Plus className="mr-2 h-4 w-4" />
            Create School
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by school name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="relative w-full sm:w-44">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {STATUS_OPTIONS.filter((s) => s !== 'all').map((s) => (
                    <SelectItem key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            renderSkeleton()
          ) : error ? (
            renderError()
          ) : schools.length === 0 ? (
            renderEmpty()
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">
                        Logo
                      </th>
                      <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">
                        <SortHeader column="name">School Name</SortHeader>
                      </th>
                      <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">
                        Code
                      </th>
                      <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">
                        Type
                      </th>
                      <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">
                        Board
                      </th>
                      <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">
                        Location
                      </th>
                      <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">
                        Principal
                      </th>
                      <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">
                        <SortHeader column="studentsCount">Students</SortHeader>
                      </th>
                      <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">
                        <SortHeader column="teachersCount">Teachers</SortHeader>
                      </th>
                      <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">
                        Subscription
                      </th>
                      <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">
                        <SortHeader column="status">Status</SortHeader>
                      </th>
                      <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">
                        <SortHeader column="lastActivity">Last Activity</SortHeader>
                      </th>
                      <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {schools.map((school, index) => {
                      const badge = STATUS_BADGE[school.status] ?? STATUS_BADGE.inactive;
                      return (
                        <motion.tr
                          key={school.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className="border-b transition-colors hover:bg-muted/50"
                        >
                          <td className="p-2 align-middle">
                            {school.logo ? (
                              <img
                                src={school.logo}
                                alt=""
                                className="h-10 w-10 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                <Building2 className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                          </td>
                          <td className="p-2 align-middle font-medium">{school.name}</td>
                          <td className="p-2 align-middle text-muted-foreground">{school.code}</td>
                          <td className="p-2 align-middle text-muted-foreground">{school.type}</td>
                          <td className="p-2 align-middle text-muted-foreground">{school.board}</td>
                          <td className="p-2 align-middle text-muted-foreground">
                            {[school.city, school.state].filter(Boolean).join(', ') || '—'}
                          </td>
                          <td className="p-2 align-middle text-muted-foreground">
                            {school.principal || '—'}
                          </td>
                          <td className="p-2 align-middle">{school.studentsCount ?? 0}</td>
                          <td className="p-2 align-middle">{school.teachersCount ?? 0}</td>
                          <td className="p-2 align-middle text-muted-foreground">
                            {school.subscription}
                          </td>
                          <td className="p-2 align-middle">
                            <Badge variant={badge.variant}>{badge.label}</Badge>
                          </td>
                          <td className="p-2 align-middle text-muted-foreground">
                            {school.lastActivity
                              ? new Date(school.lastActivity).toLocaleDateString()
                              : '—'}
                          </td>
                          <td className="p-2 align-middle">
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => router.push(`/school-management/${school.id}`)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => router.push(`/school-management/${school.id}/edit`)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleSuspendToggle(school)}
                              >
                                {school.status === 'suspended' ? (
                                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                ) : (
                                  <ShieldOff className="h-4 w-4 text-amber-500" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(school)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, total)} of{' '}
                  {total} schools
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Previous
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                    .map((p, idx, arr) => {
                      const showEllipsis = idx > 0 && p - arr[idx - 1] > 1;
                      return (
                        <span key={p} className="flex items-center gap-1">
                          {showEllipsis && <span className="px-1 text-muted-foreground">...</span>}
                          <Button
                            variant={p === page ? 'default' : 'outline'}
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setPage(p)}
                          >
                            {p}
                          </Button>
                        </span>
                      );
                    })}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
