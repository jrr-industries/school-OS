'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { Users, Search } from 'lucide-react';

interface PlatformUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  lastActive: string;
}

const mockUsers: PlatformUser[] = [
  { id: '1', name: 'John Smith', email: 'john@schools.edu', role: 'School Admin', status: 'active', lastActive: '2 min ago' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah@academy.edu', role: 'Teacher', status: 'active', lastActive: '15 min ago' },
  { id: '3', name: 'Michael Brown', email: 'michael@district.edu', role: 'Super Admin', status: 'active', lastActive: '1 hour ago' },
  { id: '4', name: 'Emily Davis', email: 'emily@prep.edu', role: 'Teacher', status: 'inactive', lastActive: '2 days ago' },
  { id: '5', name: 'Robert Wilson', email: 'robert@hs.edu', role: 'Parent', status: 'active', lastActive: '30 min ago' },
  { id: '6', name: 'Jessica Martinez', email: 'jessica@elementary.edu', role: 'School Admin', status: 'suspended', lastActive: '1 week ago' },
  { id: '7', name: 'David Thompson', email: 'david@middle.edu', role: 'Teacher', status: 'active', lastActive: '5 min ago' },
  { id: '8', name: 'Amanda Garcia', email: 'amanda@tech.edu', role: 'Support Agent', status: 'inactive', lastActive: '3 days ago' },
];

const statusStyles: Record<string, string> = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  inactive: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400',
  suspended: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Platform Users</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage all platform users</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search users..."
              className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium text-muted-foreground">Name</th>
                  <th className="pb-3 font-medium text-muted-foreground">Email</th>
                  <th className="pb-3 font-medium text-muted-foreground">Role</th>
                  <th className="pb-3 font-medium text-muted-foreground">Status</th>
                  <th className="pb-3 font-medium text-muted-foreground">Last Active</th>
                </tr>
              </thead>
              <tbody>
                {mockUsers.map((user) => (
                  <tr key={user.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="py-3 font-medium">{user.name}</td>
                    <td className="py-3 text-muted-foreground">{user.email}</td>
                    <td className="py-3">{user.role}</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[user.status]}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 text-muted-foreground">{user.lastActive}</td>
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
