'use client';

import { useState, useMemo } from 'react';
import { Plus, UserCheck } from 'lucide-react';
import { PageContainer, PageHeader, ContentContainer } from '@/components/shared';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable, ActionMenu } from '@/components/shared/data-table';
import type { Column } from '@/components/shared/data-table';
import { parents, type Parent } from '@/mock-data';
import { initials } from '@/lib/utils';

export default function ParentsPage() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return parents;
    const q = search.toLowerCase();
    return parents.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.occupation.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q),
    );
  }, [search]);

  const columns: Column<Parent>[] = [
    {
      key: 'name',
      header: 'Parent Name',
      sortable: true,
      render: (p) => (
        <div className="flex items-center gap-3">
          <Avatar className="size-9">
            <AvatarFallback className="text-xs">{initials(p.name)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">{p.name}</span>
            <span className="text-xs text-muted-foreground/70">{p.relationship}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'children',
      header: 'Children',
      render: (p) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground">{p.childrenNames.join(', ')}</span>
          <span className="text-xs text-muted-foreground/70">{p.children} child{p.children > 1 ? 'ren' : ''}</span>
        </div>
      ),
    },
    {
      key: 'occupation',
      header: 'Occupation',
      sortable: true,
      render: (p) => (
        <span className="text-sm text-foreground">{p.occupation}</span>
      ),
      hideOnMobile: true,
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (p) => (
        <span className="text-sm text-foreground">{p.phone}</span>
      ),
      hideOnMobile: true,
    },
    {
      key: 'email',
      header: 'Email',
      render: (p) => (
        <span className="text-sm text-muted-foreground">{p.email}</span>
      ),
      hideOnMobile: true,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (p) => (
        <Badge
          variant={p.status === 'active' ? 'success' : 'secondary'}
          className="h-6 px-2 text-[10px]"
        >
          {p.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (p) => (
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
        title="Parents"
        description="Manage parent and guardian information"
      >
        <Button size="sm" className="h-9 gap-1.5">
          <Plus className="size-3.5" />
          Add Parent
        </Button>
      </PageHeader>

      <ContentContainer className="mt-6">
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(p) => p.id}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search parents by name, occupation, or email..."
          pageSize={10}
          emptyMessage="No parents found"
          emptyIcon={UserCheck}
        />
      </ContentContainer>
    </PageContainer>
  );
}
