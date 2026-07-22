'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { PageHeader, DataTable } from '@/features/super-admin/components';
import { Plus, Edit, Eye, Loader2, AlertCircle, Search } from 'lucide-react';
import { Button } from '@schoolos/ui';

interface SchoolRow {
  id: string;
  name: string;
  slug: string;
  type: string;
  status: string;
  users: number;
  email: string | null;
  phone: string | null;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  inactive: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400',
  suspended: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  closed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  trial: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
};

export default function SchoolsPage() {
  const [schools, setSchools] = useState<SchoolRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchSchools = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', '10');
      if (search) params.set('search', search);

      const res = await fetch(`/api/admin/schools?${params}`);
      const data = await res.json();

      if (!data.success) {
        setError(data.error ?? 'Failed to load schools');
        setSchools([]);
      } else {
        setSchools(data.data ?? []);
        setTotal(data.meta?.total ?? 0);
      }
    } catch {
      setError('Network error. Please try again.');
      setSchools([]);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  const columns = [
    {
      key: 'name',
      header: 'School',
      accessor: (row: SchoolRow) => (
        <div>
          <strong>{row.name}</strong>
          <br />
          <span className="text-xs text-muted-foreground">{row.slug}</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'type',
      header: 'Type',
      accessor: (row: SchoolRow) => row.type.replace(/_/g, ' '),
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (row: SchoolRow) => (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[row.status] || 'bg-slate-100 text-slate-800'}`}>
          {row.status}
        </span>
      ),
    },
    {
      key: 'users',
      header: 'Users',
      accessor: (row: SchoolRow) => row.users.toLocaleString(),
      align: 'right' as const,
      sortable: true,
    },
    {
      key: 'email',
      header: 'Contact',
      accessor: (row: SchoolRow) => row.email || '-',
    },
    {
      key: 'createdAt',
      header: 'Created',
      accessor: (row: SchoolRow) => new Date(row.createdAt).toLocaleDateString('en-CA'),
      sortable: true,
    },
  ];

  const totalPages = Math.ceil(total / 10);

  return (
    <div className="space-y-6">
      <PageHeader
        title="All Schools"
        description="Manage and monitor all schools on the platform"
        actions={
          <Link href="/admin/schools/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create School
            </Button>
          </Link>
        }
      />

      {error && (
        <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search schools..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { setSearch(searchInput); setPage(1); } }}
            className="flex h-10 w-full rounded-md border border-input bg-background pl-8 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">Loading schools...</span>
        </div>
      ) : (
        <>
          <DataTable
            columns={columns as any}
            data={schools}
            keyExtractor={(row: SchoolRow) => row.id}
            searchKey="name"
            selectable
            rowActions={(row: SchoolRow) => (
              <div className="flex items-center justify-end gap-1">
                <Link href={`/admin/schools/${row.id}`} className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 inline-flex" aria-label="View">
                  <Eye className="h-4 w-4" />
                </Link>
                <Link href={`/admin/schools/${row.id}/edit`} className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 inline-flex" aria-label="Edit">
                  <Edit className="h-4 w-4" />
                </Link>
              </div>
            )}
            pagination={{
              page,
              pageSize: 10,
              total,
              onPageChange: setPage,
              onPageSizeChange: () => {},
            }}
          />
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-1">
              <p className="text-sm text-muted-foreground">Page {page} of {totalPages}</p>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}