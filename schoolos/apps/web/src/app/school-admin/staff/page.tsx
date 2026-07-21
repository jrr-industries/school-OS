'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Plus, Search, SlidersHorizontal,
  Mail, Phone,
  Eye, Edit, Trash2, X, Loader2, AlertCircle
} from 'lucide-react';
import {
  Button, Input, Badge, Card, CardContent, CardHeader, CardTitle,
  Select, Modal
} from '@schoolos/ui';
import { PageHeader } from '@/features/school-admin/components/page-header';
import type { Employee } from '@/features/school-admin/types';

const statusColors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  active: 'default',
  inactive: 'secondary',
  suspended: 'destructive',
  resigned: 'outline',
  terminated: 'destructive',
};

const statusLabels: Record<string, string> = {
  active: 'Active',
  inactive: 'Inactive',
  suspended: 'Suspended',
  resigned: 'Resigned',
  terminated: 'Terminated',
};

export default function StaffPage() {
  const [staff, setStaff] = useState<Employee[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', '10');
      if (search) params.set('search', search);
      if (statusFilter !== 'all') params.set('status', statusFilter);

      const res = await fetch(`/api/school-admin/staff?${params}`);
      const data = await res.json();

      if (!data.success) {
        setError(data.error ?? 'Failed to load staff');
        setStaff([]);
      } else {
        setStaff(data.data ?? []);
        setTotal(data.meta?.total ?? 0);
      }
    } catch {
      setError('Network error. Please try again.');
      setStaff([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  async function handleDelete() {
    if (!deleteModal) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/school-admin/staff/${deleteModal}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setDeleteModal(null);
        fetchStaff();
      }
    } catch {
      setError('Failed to delete staff');
    } finally {
      setDeleting(false);
    }
  }

  function handleSearch() {
    setPage(1);
    setSearch(searchInput);
  }

  const totalPages = Math.ceil(total / 10);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Staff Management"
        description="Manage all school staff members"
        breadcrumbs={[
          { label: 'Dashboard', href: '/school-admin/dashboard' },
          { label: 'Staff' },
        ]}
        actions={
          <Link href="/school-admin/staff/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Staff
            </Button>
          </Link>
        }
      />

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>All Staff ({total})</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search staff..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-8 w-60"
                />
              </div>
              <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)}>
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {showFilters && (
            <div className="mt-3 flex items-center gap-2">
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
                <option value="resigned">Resigned</option>
                <option value="terminated">Terminated</option>
              </Select>
              {statusFilter !== 'all' && (
                <Button variant="ghost" size="sm" onClick={() => setStatusFilter('all')}>
                  <X className="mr-1 h-3 w-3" /> Clear
                </Button>
              )}
            </div>
          )}
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">Loading staff...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-xs font-medium text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Employee</th>
                    <th className="px-4 py-3 font-medium">ID</th>
                    <th className="px-4 py-3 font-medium">Designation</th>
                    <th className="px-4 py-3 font-medium">Department</th>
                    <th className="px-4 py-3 font-medium">Contact</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {staff.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center text-sm text-muted-foreground">
                        No staff members found.{' '}
                        <Link href="/school-admin/staff/create" className="text-primary hover:underline">Add your first staff member</Link>
                      </td>
                    </tr>
                  ) : (
                    staff.map((s) => (
                      <tr key={s.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                        <td className="px-4 py-3">
                          <Link href={`/school-admin/staff/${s.id}`} className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                              {s.firstName[0]}{s.lastName[0]}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{s.firstName} {s.lastName}</p>
                              <p className="text-xs text-muted-foreground">{s.email}</p>
                            </div>
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-sm">{s.employeeId}</td>
                        <td className="px-4 py-3">
                          <span className="text-sm">{s.designation?.title}</span>
                          {s.isClassTeacher && (
                            <Badge variant="secondary" className="ml-1 text-[10px]">CT</Badge>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{s.department?.name}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <a href={`tel:${s.phone}`} className="text-sm text-muted-foreground hover:text-foreground">
                              <Phone className="h-3.5 w-3.5" />
                            </a>
                            {s.email && (
                              <a href={`mailto:${s.email}`} className="text-sm text-muted-foreground hover:text-foreground">
                                <Mail className="h-3.5 w-3.5" />
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={statusColors[s.status]} className="text-[10px]">
                            {statusLabels[s.status]}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm capitalize">{s.employmentType.replace(/_/g, ' ')}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link href={`/school-admin/staff/${s.id}`}>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                            </Link>
                            <Link href={`/school-admin/staff/${s.id}/edit`}>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Edit className="h-3.5 w-3.5" />
                              </Button>
                            </Link>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => setDeleteModal(s.id)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t px-4 py-3">
              <p className="text-sm text-muted-foreground">
                Showing {(page - 1) * 10 + 1}-{Math.min(page * 10, total)} of {total}
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
        </CardContent>
      </Card>

      <Modal open={!!deleteModal} onOpenChange={(open) => !open && setDeleteModal(null)}>
        <div className="p-6">
          <h3 className="text-lg font-semibold">Confirm Deletion</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Are you sure you want to delete this staff member? This action cannot be undone.
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteModal(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}