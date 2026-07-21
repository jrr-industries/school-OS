'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { Shield, Check, X } from 'lucide-react';

const roles = ['Super Admin', 'School Admin', 'Teacher', 'Parent', 'Support Agent'];

const permissionGroups = ['Schools', 'Users', 'Billing', 'Settings', 'Reports'];

const matrix: Record<string, Record<string, boolean>> = {
  'Super Admin': { Schools: true, Users: true, Billing: true, Settings: true, Reports: true },
  'School Admin': { Schools: true, Users: true, Billing: false, Settings: true, Reports: true },
  'Teacher': { Schools: false, Users: false, Billing: false, Settings: false, Reports: true },
  'Parent': { Schools: false, Users: false, Billing: false, Settings: false, Reports: true },
  'Support Agent': { Schools: false, Users: true, Billing: false, Settings: false, Reports: false },
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
                    <th key={group} className="pb-3 px-4 font-medium text-muted-foreground text-center">{group}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="py-3 pr-6 font-medium">{role}</td>
                    {permissionGroups.map((group) => {
                      const allowed = matrix[role][group];
                      return (
                        <td key={group} className="py-3 px-4 text-center">
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
