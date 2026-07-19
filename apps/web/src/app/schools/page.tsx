'use client';

import { useState, useMemo } from 'react';
import { Plus, Search, Building2 } from 'lucide-react';
import { PageContainer, PageHeader, ContentContainer } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable, ActionMenu } from '@/components/shared/data-table';
import type { Column } from '@/components/shared/data-table';
import { schools, type School } from '@/mock-data';

export default function SchoolsPage() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return schools;
    const q = search.toLowerCase();
    return schools.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q),
    );
  }, [search]);

  const columns: Column<School>[] = [
    {
      key: 'name',
      header: 'School Name',
      sortable: true,
      render: (s) => (
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Building2 className="size-4 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">{s.name}</span>
            <span className="text-xs text-muted-foreground/70">{s.code}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'city',
      header: 'Location',
      sortable: true,
      render: (s) => (
        <div className="flex flex-col">
          <span className="text-sm text-foreground">{s.city}</span>
          <span className="text-xs text-muted-foreground/70">{s.state}</span>
        </div>
      ),
      hideOnMobile: true,
    },
    {
      key: 'students',
      header: 'Students',
      sortable: true,
      className: 'text-right',
      render: (s) => (
        <span className="text-sm font-medium text-foreground">{s.students.toLocaleString()}</span>
      ),
    },
    {
      key: 'teachers',
      header: 'Teachers',
      sortable: true,
      className: 'text-right hidden sm:table-cell',
      headerClassName: 'hidden sm:table-cell',
      render: (s) => (
        <span className="text-sm text-foreground">{s.teachers}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (s) => (
        <Badge
          variant={
            s.status === 'active' ? 'success' : s.status === 'inactive' ? 'secondary' : 'warning'
          }
          className="h-6 px-2 text-[10px]"
        >
          {s.status}
        </Badge>
      ),
    },
    {
      key: 'subscription',
      header: 'Plan',
      sortable: true,
      render: (s) => (
        <Badge
          variant={
            s.subscription === 'premium' ? 'default' : s.subscription === 'standard' ? 'info' : 'secondary'
          }
          className="h-6 px-2 text-[10px]"
        >
          {s.subscription}
        </Badge>
      ),
    },
    {
      key: 'revenue',
      header: 'Revenue',
      sortable: true,
      className: 'text-right',
      render: (s) => (
        <span className="text-sm font-medium text-foreground">₹{s.revenue.toLocaleString()}</span>
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
        title="Schools"
        description="Manage all registered schools in the system"
      >
        <Button size="sm" className="h-9 gap-1.5">
          <Plus className="size-3.5" />
          Add School
        </Button>
      </PageHeader>

      <ContentContainer className="mt-6">
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(s) => s.id}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search schools by name, code, or city..."
          pageSize={10}
          emptyMessage="No schools found"
          emptyIcon={Building2}
        />
      </ContentContainer>
    </PageContainer>
  );
}
