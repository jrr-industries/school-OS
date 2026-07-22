'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { Shield, Check, X } from 'lucide-react';

const roles = [
  { name: 'Super Admin', key: 'super_admin' },
  { name: 'School Admin', key: 'school_admin' },
  { name: 'Teacher', key: 'teacher' },
  { name: 'Parent', key: 'parent' },
  { name: 'Support Agent', key: 'support_agent' },
];

const permissionGroups = [
  { name: 'Schools', key: 'schools' },
  { name: 'Users', key: 'users' },
  { name: 'Billing', key: 'billing' },
  { name: 'Settings', key: 'settings' },
  { name: 'Reports', key: 'reports' },
  { name: 'Communication', key: 'communication' },
  { name: 'Analytics', key: 'analytics' },
  { name: 'Security', key: 'security' },
];

const matrix: Record<string, Record<string, boolean>> = {
  super_admin: {
    schools: true, users: true, billing: true, settings: true,
    reports: true, communication: true, analytics: true, security: true,
  },
  school_admin: {
    schools: true, users: true, billing: false, settings: true,
    reports: true, communication: true, analytics: true, security: false,
  },
  teacher: {
    schools: false, users: false, billing: false, settings: false,
    reports: true, communication: true, analytics: false, security: false,
  },
  parent: {
    schools: false, users: false, billing: false, settings: false,
    reports: true, communication: true, analytics: false, security: false,
  },
  support_agent: {
    schools: false, users: true, billing: false, settings: false,
    reports: false, communication: true, analytics: false, security: false,
  },
};

const groupIcons: Record<string, string> = {
  schools: '🏫',
  users: '👤',
  billing: '💳',
  settings: '⚙️',
  reports: '📊',
  communication: '📢',
  analytics: '📈',
  security: '🔒',
};

export default function PermissionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Permissions Matrix</h1>
        <p className="text-sm text-muted-foreground mt-1">Granular permission controls for each role</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Role Permissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 pr-6 font-medium text-muted-foreground">Role</th>
                  {permissionGroups.map((group) => (
                    <th key={group.key} className="pb-3 px-4 font-medium text-muted-foreground text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-base">{groupIcons[group.key]}</span>
                        <span className="text-xs">{group.name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role.key} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="py-3 pr-6 font-medium">{role.name}</td>
                    {permissionGroups.map((group) => {
                      const allowed = matrix[role.key][group.key];
                      return (
                        <td key={group.key} className="py-3 px-4 text-center">
                          <span
                            className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${
                              allowed
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            }`}
                          >
                            {allowed ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                          </span>
                        </td>
                      );
                    })}
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
