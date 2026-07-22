'use client';

import { useState, useEffect, useCallback } from 'react';
import { AlertCircle } from 'lucide-react';
import { PageHeader, DataTable } from '@/features/super-admin/components';
import type { Column } from '@/features/super-admin/components/SearchFilter';

interface PlatformUser {
  id: string;
  status: string;
  roles: Array<{ id: string; name: string; slug: string }>;
  isSuperAdmin: boolean;
}

interface UsersResponse {
  success: boolean;
  data: PlatformUser[];
  meta: { total: number };
}

interface RoleGroup {
  name: string;
  slug: string;
  usersCount: number;
  description: string;
  isSystem: boolean;
}

const roleDefinitions: Record<string, { description: string; isSystem: boolean }> = {
  super_admin: { description: 'Unrestricted access to all platform features and settings', isSystem: true },
  school_admin: { description: 'Manage school settings, users, and subscriptions', isSystem: true },
  teacher: { description: 'Create and manage classes, assignments, and grades', isSystem: true },
  parent: { description: 'View student progress, communicate with teachers', isSystem: true },
  support_agent: { description: 'Handle support tickets and user inquiries', isSystem: false },
  accountant: { description: 'Manage billing, invoices, and financial reports', isSystem: false },
  analyst: { description: 'View analytics and generate reports', isSystem: false },
};

export default function RolesPage() {
  const [roleGroups, setRoleGroups] = useState<RoleGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/users?limit=1000');
      const json: UsersResponse = await res.json();

      if (!json.success) {
        setError('Failed to load roles');
        setRoleGroups([]);
        return;
      }

      const users = json.data ?? [];
      const roleCounts: Record<string, number> = {};

      for (const user of users) {
        if (user.isSuperAdmin) {
          roleCounts['super_admin'] = (roleCounts['super_admin'] || 0) + 1;
        }
        for (const role of user.roles) {
          roleCounts[role.slug] = (roleCounts[role.slug] || 0) + 1;
        }
      }

      const groups: RoleGroup[] = Object.entries(roleDefinitions).map(([slug, def]) => ({
        name: slug.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        slug,
        usersCount: roleCounts[slug] || 0,
        description: def.description,
        isSystem: def.isSystem,
      }));

      groups.sort((a, b) => b.usersCount - a.usersCount);
      setRoleGroups(groups);
    } catch {
      setError('Network error. Please try again.');
      setRoleGroups([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const columns: Column<RoleGroup>[] = [
    {
      key: 'name',
      header: 'Role Name',
      accessor: (row) => (
        <div>
          <div className="font-medium">{row.name}</div>
          <div className="text-xs text-muted-foreground">{row.slug}</div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'usersCount',
      header: 'Users',
      accessor: (row) => row.usersCount.toLocaleString(),
      sortable: true,
      align: 'right',
    },
    {
      key: 'description',
      header: 'Description',
      accessor: (row) => <span className="text-muted-foreground">{row.description}</span>,
    },
    {
      key: 'isSystem',
      header: 'Type',
      accessor: (row) =>
        row.isSystem ? (
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            System
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
            Custom
          </span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles & Permissions"
        description="Define and manage user roles"
      />

      {error && (
        <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <DataTable
        columns={columns}
        data={roleGroups}
        keyExtractor={(row) => row.slug}
        loading={loading}
        emptyMessage="No roles found."
      />
    </div>
  );
}
