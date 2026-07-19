'use client';

import { useState, useMemo } from 'react';
import { Plus, Presentation } from 'lucide-react';
import { PageContainer, PageHeader, ContentContainer } from '@/components/shared';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable, ActionMenu } from '@/components/shared/data-table';
import type { Column } from '@/components/shared/data-table';
import { teachers, type Teacher } from '@/mock-data';
import { initials } from '@/lib/utils';

export default function TeachersPage() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return teachers;
    const q = search.toLowerCase();
    return teachers.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.employeeId.toLowerCase().includes(q) ||
        t.department.toLowerCase().includes(q),
    );
  }, [search]);

  const columns: Column<Teacher>[] = [
    {
      key: 'name',
      header: 'Teacher Name',
      sortable: true,
      render: (t) => (
        <div className="flex items-center gap-3">
          <Avatar className="size-9">
            <AvatarFallback className="text-xs">{initials(t.name)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">{t.name}</span>
            <span className="text-xs text-muted-foreground/70">{t.employeeId}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'department',
      header: 'Department',
      sortable: true,
      render: (t) => (
        <span className="text-sm text-foreground">{t.department}</span>
      ),
    },
    {
      key: 'subjects',
      header: 'Subjects',
      render: (t) => (
        <div className="flex flex-wrap gap-1">
          {t.subjects.map((sub) => (
            <Badge key={sub} variant="secondary" className="h-5 px-1.5 text-[10px] font-normal">
              {sub}
            </Badge>
          ))}
        </div>
      ),
      hideOnMobile: true,
    },
    {
      key: 'qualification',
      header: 'Qualification',
      sortable: true,
      render: (t) => (
        <span className="text-sm text-foreground">{t.qualification}</span>
      ),
      hideOnMobile: true,
    },
    {
      key: 'experience',
      header: 'Experience',
      sortable: true,
      render: (t) => (
        <span className="text-sm font-medium text-foreground">{t.experience} yrs</span>
      ),
    },
    {
      key: 'students',
      header: 'Students',
      sortable: true,
      className: 'text-right',
      render: (t) => (
        <span className="text-sm text-foreground">{t.students}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (t) => (
        <Badge
          variant={
            t.status === 'active'
              ? 'success'
              : t.status === 'on-leave'
                ? 'warning'
                : 'secondary'
          }
          className="h-6 px-2 text-[10px]"
        >
          {t.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (t) => (
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
        title="Teachers"
        description="Manage teacher profiles and assignments"
      >
        <Button size="sm" className="h-9 gap-1.5">
          <Plus className="size-3.5" />
          Add Teacher
        </Button>
      </PageHeader>

      <ContentContainer className="mt-6">
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(t) => t.id}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search teachers by name, ID, or department..."
          pageSize={10}
          emptyMessage="No teachers found"
          emptyIcon={Presentation}
        />
      </ContentContainer>
    </PageContainer>
  );
}
