'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  AlertCircle,
  Search,
  Trash2,
  Loader2,
  X,
} from 'lucide-react';

interface PlatformUser {
  id: string;
  name: string | null;
  email: string;
  schoolName: string | null;
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

const statusColors: Record<string, string> = {
  active: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  inactive: 'bg-muted text-muted-foreground',
  suspended: 'bg-red-500/10 text-red-600 dark:text-red-400',
  invited: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  disabled: 'bg-muted text-muted-foreground',
};

export default function RolesPage() {
  const [roleGroups, setRoleGroups] = useState<RoleGroup[]>([]);
  const [allUsers, setAllUsers] = useState<PlatformUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // User list state
  const [search, setSearch] = useState('');
  const [removing, setRemoving] = useState<string | null>(null);
  const [removeConfirm, setRemoveConfirm] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/users?limit=1000');
      const json: UsersResponse = await res.json();

      if (!json.success) {
        setError('Failed to load data');
        setRoleGroups([]);
        setAllUsers([]);
        return;
      }

      const users = json.data ?? [];
      setAllUsers(users);

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
      setAllUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleRemove = async (id: string) => {
    setRemoving(id);
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!json.success) { setError(json.error || 'Failed to remove user'); return; }
      setRemoveConfirm(null);
      fetchData();
    } catch {
      setError('Network error');
    } finally {
      setRemoving(null);
    }
  };

  const filteredUsers = allUsers.filter(
    (u) =>
      !search ||
      (u.name && u.name.toLowerCase().includes(search.toLowerCase())) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Roles & Permissions</h1>
        <p className="mt-1 text-sm text-muted-foreground">Define and manage user roles across the platform</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">Loading roles...</span>
        </div>
      ) : (
        <>
          {/* Role Summary Cards */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {roleGroups.map((role) => (
              <div key={role.slug} className="rounded-xl border bg-card p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">{role.name}</h3>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    role.isSystem
                      ? 'bg-primary/10 text-primary'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  }`}>
                    {role.isSystem ? 'System' : 'Custom'}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{role.description}</p>
                <p className="mt-3 text-2xl font-bold text-foreground">{role.usersCount}</p>
                <p className="text-xs text-muted-foreground">users</p>
              </div>
            ))}
          </div>

          {/* Users Section */}
          <div className="rounded-xl border bg-card shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 pb-3 pt-5">
              <p className="text-sm font-semibold text-foreground">
                All Platform Users ({allUsers.length})
              </p>
              <div className="relative flex-1 min-w-[160px] max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or email..."
                  className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring/50 focus:outline-none focus:ring-1 focus:ring-ring/30"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-medium text-muted-foreground">Name</th>
                    <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-medium text-muted-foreground">Email</th>
                    <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-medium text-muted-foreground">School</th>
                    <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-medium text-muted-foreground">Roles</th>
                    <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                    <th className="whitespace-nowrap px-6 py-3 text-right text-xs font-medium text-muted-foreground"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-sm text-muted-foreground">
                        {search ? 'No users match your search.' : 'No users found.'}
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => {
                      const userRoles = user.isSuperAdmin
                        ? ['Super Admin']
                        : user.roles.map((r) => r.name);
                      return (
                        <tr
                          key={user.id}
                          className="border-b border-border/50 transition-colors last:border-0 hover:bg-muted/50"
                        >
                          <td className="whitespace-nowrap px-6 py-3 font-medium text-foreground">
                            {user.name || 'Unnamed'}
                          </td>
                          <td className="whitespace-nowrap px-6 py-3 text-muted-foreground">
                            {user.email}
                          </td>
                          <td className="whitespace-nowrap px-6 py-3 text-muted-foreground">
                            {user.schoolName || '—'}
                          </td>
                          <td className="whitespace-nowrap px-6 py-3">
                            <div className="flex flex-wrap gap-1">
                              {userRoles.map((role) => (
                                <span
                                  key={role}
                                  className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                                >
                                  {role}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-3">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                              statusColors[user.status] || 'bg-muted text-muted-foreground'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-3 text-right">
                            {!user.isSuperAdmin && removeConfirm === user.id ? (
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => setRemoveConfirm(null)}
                                  className="inline-flex items-center rounded-md border border-input bg-background p-1.5 text-xs hover:bg-muted"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() => handleRemove(user.id)}
                                  disabled={removing === user.id}
                                  className="inline-flex items-center rounded-md bg-red-600 p-1.5 text-xs text-white hover:bg-red-700 disabled:opacity-50"
                                >
                                  {removing === user.id ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-3 w-3" />
                                  )}
                                </button>
                              </div>
                            ) : (
                              !user.isSuperAdmin && (
                                <button
                                  onClick={() => setRemoveConfirm(user.id)}
                                  className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-2.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-950"
                                >
                                  <Trash2 className="h-3 w-3" />
                                  Remove
                                </button>
                              )
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
