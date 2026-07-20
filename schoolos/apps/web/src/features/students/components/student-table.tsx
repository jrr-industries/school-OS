'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Table, Badge, Avatar, Pagination, Button, Input } from '@schoolos/ui';
import { Search, Plus, Download, Upload, MoreHorizontal } from 'lucide-react';
import { useDebounce } from '@schoolos/hooks';
import { DateUtils } from '@schoolos/utils';

interface StudentTableProps {
  schoolId: string;
}

const statusVariantMap: Record<string, 'success' | 'warning' | 'destructive' | 'info' | 'default'> = {
  active: 'success',
  inactive: 'warning',
  transferred: 'info',
  graduated: 'info',
  alumni: 'default',
  archived: 'destructive',
  suspended: 'destructive',
  expelled: 'destructive',
  withdrawn: 'warning',
};

export function StudentTable({ schoolId }: StudentTableProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  const [classId, setClassId] = useState<string>('');
  const debouncedSearch = useDebounce(search, 300);

  const queryParams = new URLSearchParams({
    schoolId,
    page: String(page),
    limit: '20',
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(status && { status }),
    ...(classId && { classId }),
  });

  const { data, isLoading } = {
    // This would use useQuery from @tanstack/react-query in production
    data: undefined as { data: unknown[]; meta: { total: number; page: number; totalPages: number } } | undefined,
    isLoading: false,
  };

  const columns = [
    {
      key: 'name',
      header: 'Student',
      render: (item: Record<string, unknown>) => (
        <div className="flex items-center gap-3">
          <Avatar size="sm" fallback={`${item.firstName} ${item.lastName}` as string} />
          <div>
            <Link href={`/students/${item.id}`} className="font-medium hover:underline">
              {item.firstName} {item.lastName}
            </Link>
            <p className="text-xs text-muted-foreground">{item.admissionNumber as string}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'class',
      header: 'Class',
      render: (item: Record<string, unknown>) => (
        <span>{((item.class as Record<string, string>)?.name) ?? '-'}</span>
      ),
    },
    {
      key: 'section',
      header: 'Section',
      render: (item: Record<string, unknown>) => (
        <span>{((item.section as Record<string, string>)?.name) ?? '-'}</span>
      ),
    },
    {
      key: 'gender',
      header: 'Gender',
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: Record<string, unknown>) => (
        <Badge variant={statusVariantMap[item.status as string] ?? 'default'}>
          {item.status as string}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Admitted',
      render: (item: Record<string, unknown>) => (
        <span className="text-sm text-muted-foreground">
          {DateUtils.formatShort(item.admissionDate as string)}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: () => (
        <button className="rounded-md p-1 hover:bg-accent">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9"
            />
          </div>
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="archived">Archived</option>
            <option value="transferred">Transferred</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Link href="/students/new">
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          </Link>
        </div>
      </div>

      <Table
        columns={columns}
        data={(data?.data as Record<string, unknown>[]) ?? []}
        isLoading={isLoading}
        emptyMessage="No students found"
      />

      {data && (
        <Pagination
          page={data.meta.page}
          totalPages={data.meta.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
