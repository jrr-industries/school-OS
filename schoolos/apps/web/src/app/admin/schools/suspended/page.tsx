'use client';

import { AlertTriangle, RotateCcw, Eye } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';

interface SuspendedSchool {
  id: string;
  name: string;
  code: string;
  suspendedDate: string;
  reason: string;
}

const suspendedSchools: SuspendedSchool[] = [
  { id: '1', name: 'Mountain View Middle', code: 'MTN-MID', suspendedDate: '2024-03-15', reason: 'Non-payment of subscription fees for 90+ days' },
  { id: '2', name: 'Westside Academy', code: 'WST-ACA', suspendedDate: '2024-04-02', reason: 'Violation of platform terms of service' },
  { id: '3', name: 'Bright Future School', code: 'BRT-FTR', suspendedDate: '2024-04-20', reason: 'Failure to comply with data security requirements' },
  { id: '4', name: 'Harmony Institute', code: 'HRM-INS', suspendedDate: '2024-05-01', reason: 'Repeated non-compliance with reporting standards' },
];

export default function SuspendedSchoolsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Suspended Schools</h1>
        <p className="text-sm text-muted-foreground mt-1">Schools that have been suspended</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Suspended Schools ({suspendedSchools.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="text-left font-medium py-3 px-4">School</th>
                  <th className="text-left font-medium py-3 px-4">Code</th>
                  <th className="text-left font-medium py-3 px-4">Suspended Date</th>
                  <th className="text-left font-medium py-3 px-4">Reason</th>
                  <th className="text-right font-medium py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {suspendedSchools.map((school) => (
                  <tr key={school.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <td className="py-3 px-4">
                      <strong>{school.name}</strong>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{school.code}</td>
                    <td className="py-3 px-4 text-muted-foreground">{school.suspendedDate}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                        <span className="text-muted-foreground">{school.reason}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent"
                          aria-label="View details"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </button>
                        <button
                          className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
                          aria-label="Reactivate"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          Reactivate
                        </button>
                      </div>
                    </td>
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
