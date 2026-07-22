'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, AlertCircle } from 'lucide-react';
import { PageHeader, DataTable } from '@/features/super-admin/components';
import type { Column } from '@/features/super-admin/components/SearchFilter';

interface PlatformUser {
  id: string;
  schoolId: string | null;
  email: string;
  name: string | null;
  phone: string | null;
  status: string;
  isSuperAdmin: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  schoolName: string | null;
  roles: Array<{ id: string; name: string; slug: string }>;
}

interface UsersResponse {
  success: boolean;
  data: PlatformUser[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  inactive: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400',
  suspended: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  invited: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  disabled: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
};

export default function UsersPage() {
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', '10');
      if (search) params.set('search', search);

      const res = await fetch(`/api/admin/users?${params}`);
      const json: UsersResponse = await res.json();

      if (!json.success) {
        setError('Failed to load users');
        setUsers([]);
      } else {
        setUsers(json.data ?? []);
        setTotal(json.meta?.total ?? 0);
      }
    } catch {
      setError('Network error. Please try again.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearch(value);
      setPage(1);
    }, 400);
  };

  const formatDate = (date: string | null) => {
    if (!date) return 'Never';
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    return d.toLocaleDateString('en-CA');
  };

  const columns: Column<PlatformUser>[] = [
    {
      key: 'name',
      header: 'Name',
      accessor: (row) => (
        <div>
          <div className="font-medium">{row.name || 'Unnamed'}</div>
          <div className="text-xs text-muted-foreground">{row.email}</div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'email',
      header: 'Email',
      accessor: (row) => row.email,
      sortable: true,
    },
    {
      key: 'schoolName',
      header: 'School',
      accessor: (row) => row.schoolName || '-',
      sortable: true,
    },
    {
      key: 'roles',
      header: 'Roles',
      accessor: (row) =>
        row.roles.length > 0
          ? row.roles.map((r) => r.name).join(', ')
          : row.isSuperAdmin
            ? 'Super Admin'
            : '-',
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (row) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            statusColors[row.status] || 'bg-slate-100 text-slate-800'
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: 'lastLoginAt',
      header: 'Last Active',
      accessor: (row) => (
        <span className="text-muted-foreground text-xs">{formatDate(row.lastLoginAt)}</span>
      ),
      sortable: true,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Users"
        description="Manage all platform users"
      />

      {error && (
        <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <DataTable
        columns={columns}
        data={users}
        keyExtractor={(row) => row.id}
        loading={loading}
        emptyMessage="No users found."
        pagination={{
          page,
          pageSize: 10,
          total,
          onPageChange: setPage,
          onPageSizeChange: () => {},
        }}
      />
    </div>
  );
}
