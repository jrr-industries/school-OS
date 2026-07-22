'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Search,
  AlertCircle,
  Trash2,
  Loader2,
  X,
} from 'lucide-react';
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

  // Kick modal state
  const [showKickModal, setShowKickModal] = useState(false);
  const [kickTarget, setKickTarget] = useState<PlatformUser | null>(null);
  const [kicking, setKicking] = useState(false);
  const [kickError, setKickError] = useState('');

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

  const handleKick = async () => {
    if (!kickTarget) return;
    setKicking(true);
    setKickError('');
    try {
      const res = await fetch(`/api/admin/users/${kickTarget.id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (!json.success) {
        setKickError(json.error || 'Failed to remove user');
        return;
      }
      setShowKickModal(false);
      setKickTarget(null);
      fetchUsers();
    } catch {
      setKickError('Network error');
    } finally {
      setKicking(false);
    }
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
        rowActions={(row) =>
          row.isSuperAdmin ? null : (
            <button
              onClick={() => { setKickTarget(row); setShowKickModal(true); }}
              className="inline-flex items-center gap-1.5 rounded-md bg-red-500/10 px-2.5 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-500/20"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Kick
            </button>
          )
        }
        pagination={{
          page,
          pageSize: 10,
          total,
          onPageChange: setPage,
          onPageSizeChange: () => {},
        }}
      />

      {/* Kick Confirmation Modal */}
      {showKickModal && kickTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => !kicking && setShowKickModal(false)} />
          <div className="relative w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                  <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Remove User</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    This action cannot be undone.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowKickModal(false)}
                disabled={kicking}
                className="rounded-md p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-800/50">
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-slate-500 dark:text-slate-400">Name:</span>{' '}
                  <span className="font-medium text-slate-900 dark:text-slate-100">{kickTarget.name || 'Unnamed'}</span>
                </p>
                <p>
                  <span className="text-slate-500 dark:text-slate-400">Email:</span>{' '}
                  <span className="font-medium text-slate-900 dark:text-slate-100">{kickTarget.email}</span>
                </p>
                <p>
                  <span className="text-slate-500 dark:text-slate-400">School:</span>{' '}
                  <span className="font-medium text-slate-900 dark:text-slate-100">{kickTarget.schoolName || '-'}</span>
                </p>
                <p>
                  <span className="text-slate-500 dark:text-slate-400">Status:</span>{' '}
                  <span className="font-medium capitalize text-slate-900 dark:text-slate-100">{kickTarget.status}</span>
                </p>
              </div>
            </div>

            {kickError && (
              <div className="mt-3 flex items-center gap-2 rounded-md bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{kickError}</span>
              </div>
            )}

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setShowKickModal(false)}
                disabled={kicking}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleKick}
                disabled={kicking}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {kicking ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Removing...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Confirm Remove
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
