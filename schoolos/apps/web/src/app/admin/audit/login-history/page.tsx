'use client';

import { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { PageHeader, DataTable } from '@/features/super-admin/components';
import type { Column } from '@/features/super-admin/components/SearchFilter';

interface AuditLog {
  id: string;
  action: string;
  entity: string;
  description: string | null;
  ipAddress: string | null;
  createdAt: string;
  userEmail: string | null;
  userName: string | null;
}

interface AuditLogsResponse {
  success: boolean;
  data: AuditLog[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export default function LoginHistoryPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', '10');
      params.set('action', 'login');

      const res = await fetch(`/api/admin/audit/logs?${params}`);
      const json: AuditLogsResponse = await res.json();

      if (!json.success) {
        setError('Failed to load login history');
        setLogs([]);
      } else {
        setLogs(json.data ?? []);
        setTotal(json.meta?.total ?? 0);
      }
    } catch {
      setError('Network error. Please try again.');
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleString('en-CA', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false,
    });
  };

  const isSuccess = (log: AuditLog) => {
    const desc = (log.description || '').toLowerCase();
    return !desc.includes('fail') && !desc.includes('error') && !desc.includes('denied');
  };

  const successCount = logs.filter(isSuccess).length;
  const failureCount = logs.length - successCount;

  const columns: Column<AuditLog>[] = [
    {
      key: 'createdAt',
      header: 'Timestamp',
      accessor: (row) => (
        <span className="text-muted-foreground whitespace-nowrap text-xs">
          {formatDate(row.createdAt)}
        </span>
      ),
      sortable: true,
    },
    {
      key: 'userEmail',
      header: 'User',
      accessor: (row) => (
        <div>
          <div className="font-medium text-xs">{row.userEmail || row.userName || 'Unknown'}</div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'ipAddress',
      header: 'IP Address',
      accessor: (row) => (
        <span className="font-mono text-xs text-muted-foreground">{row.ipAddress || '-'}</span>
      ),
    },
    {
      key: 'description',
      header: 'Details',
      accessor: (row) => (
        <span className="text-muted-foreground text-xs">{row.description || '-'}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (row) =>
        isSuccess(row) ? (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Success
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600">
            <XCircle className="h-3.5 w-3.5" />
            Failure
          </span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Login History"
        description="User login activity across the platform"
      />

      {error && (
        <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex items-center gap-4 text-sm">
        <span className="inline-flex items-center gap-1.5 text-emerald-600">
          <CheckCircle2 className="h-4 w-4" />
          {successCount} successful
        </span>
        <span className="inline-flex items-center gap-1.5 text-red-600">
          <XCircle className="h-4 w-4" />
          {failureCount} failed
        </span>
      </div>

      <DataTable
        columns={columns}
        data={logs}
        keyExtractor={(row) => row.id}
        loading={loading}
        emptyMessage="No login history found."
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
