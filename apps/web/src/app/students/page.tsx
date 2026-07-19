'use client';

import { useState, useMemo } from 'react';
import { Plus, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageContainer, PageHeader, ContentContainer } from '@/components/shared';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable, ActionMenu } from '@/components/shared/data-table';
import type { Column } from '@/components/shared/data-table';
import { students, type Student } from '@/mock-data';
import { initials } from '@/lib/utils';

export default function StudentsPage() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return students;
    const q = search.toLowerCase();
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.rollNo.toLowerCase().includes(q) ||
        s.class.toLowerCase().includes(q),
    );
  }, [search]);

  const columns: Column<Student>[] = [
    {
      key: 'name',
      header: 'Student Name',
      sortable: true,
      render: (s) => (
        <div className="flex items-center gap-3">
          <Avatar className="size-9">
            <AvatarFallback className="text-xs">{initials(s.name)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">{s.name}</span>
            <span className="text-xs text-muted-foreground/70">Roll: {s.rollNo}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'class',
      header: 'Class',
      sortable: true,
      render: (s) => (
        <span className="text-sm text-foreground">
          {s.class}-{s.section}
        </span>
      ),
    },
    {
      key: 'gender',
      header: 'Gender',
      sortable: true,
      render: (s) => (
        <span className="text-sm text-foreground">{s.gender}</span>
      ),
      hideOnMobile: true,
    },
    {
      key: 'bloodGroup',
      header: 'Blood Group',
      sortable: true,
      render: (s) => (
        <Badge variant="outline" className="h-6 px-2 text-[10px] font-mono">
          {s.bloodGroup}
        </Badge>
      ),
      hideOnMobile: true,
    },
    {
      key: 'attendance',
      header: 'Attendance',
      sortable: true,
      render: (s) => (
        <div className="flex items-center gap-2">
          <div className="h-2 w-16 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                'h-full rounded-full',
                s.attendance >= 90
                  ? 'bg-success'
                  : s.attendance >= 75
                    ? 'bg-warning'
                    : 'bg-destructive',
              )}
              style={{ width: `${s.attendance}%` }}
            />
          </div>
          <span
            className={cn(
              'text-sm font-medium',
              s.attendance >= 90
                ? 'text-success'
                : s.attendance >= 75
                  ? 'text-warning'
                  : 'text-destructive',
            )}
          >
            {s.attendance}%
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (s) => (
        <Badge
          variant={
            s.status === 'active'
              ? 'success'
              : s.status === 'inactive'
                ? 'secondary'
                : 'warning'
          }
          className="h-6 px-2 text-[10px]"
        >
          {s.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (s) => (
        <ActionMenu
          onView={() => {}}
          onEdit={() => {}}
          onDelete={() => {}}
        />
      ),
      className: 'w-12',
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Students"
        description="View and manage all student records"
      >
        <Button size="sm" className="h-9 gap-1.5">
          <Plus className="size-3.5" />
          Add Student
        </Button>
      </PageHeader>

      <ContentContainer className="mt-6">
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(s) => s.id}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search students by name, roll number, or class..."
          pageSize={10}
          emptyMessage="No students found"
          emptyIcon={Users}
        />
      </ContentContainer>
    </PageContainer>
  );
}
