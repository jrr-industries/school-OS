'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { UserCog } from 'lucide-react';

interface Role {
  id: string;
  name: string;
  users: number;
  permissions: number;
  lastModified: string;
}

const mockRoles: Role[] = [
  { id: '1', name: 'Super Admin', users: 3, permissions: 48, lastModified: '2024-03-15' },
  { id: '2', name: 'School Admin', users: 24, permissions: 36, lastModified: '2024-03-12' },
  { id: '3', name: 'Teacher', users: 184, permissions: 22, lastModified: '2024-03-10' },
  { id: '4', name: 'Parent', users: 1205, permissions: 12, lastModified: '2024-02-28' },
  { id: '5', name: 'Support Agent', users: 8, permissions: 18, lastModified: '2024-03-08' },
];

export default function RolesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Roles & Permissions</h1>
        <p className="text-sm text-muted-foreground mt-1">Define and manage user roles</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <UserCog className="h-5 w-5 text-primary" />
            Roles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium text-muted-foreground">Role Name</th>
                  <th className="pb-3 font-medium text-muted-foreground">Users</th>
                  <th className="pb-3 font-medium text-muted-foreground">Permissions</th>
                  <th className="pb-3 font-medium text-muted-foreground">Last Modified</th>
                </tr>
              </thead>
              <tbody>
                {mockRoles.map((role) => (
                  <tr key={role.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="py-3 font-medium">{role.name}</td>
                    <td className="py-3">{role.users.toLocaleString()}</td>
                    <td className="py-3">{role.permissions}</td>
                    <td className="py-3 text-muted-foreground">{role.lastModified}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
