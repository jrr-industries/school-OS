'use client';

import { Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';

interface TrialSchool {
  id: string;
  school: string;
  started: string;
  endsIn: string;
  daysRemaining: number;
  status: 'active' | 'expiring' | 'expired';
}

const trialSchools: TrialSchool[] = [
  { id: '1', school: 'Oakwood Preparatory', started: '2024-05-01', endsIn: '2024-05-31', daysRemaining: 10, status: 'active' },
  { id: '2', school: 'Greenfield International', started: '2024-05-05', endsIn: '2024-06-04', daysRemaining: 14, status: 'active' },
  { id: '3', school: 'North Star Academy', started: '2024-04-15', endsIn: '2024-05-15', daysRemaining: -6, status: 'expired' },
  { id: '4', school: 'Pinecrest Elementary', started: '2024-04-28', endsIn: '2024-05-28', daysRemaining: 7, status: 'expiring' },
  { id: '5', school: 'Horizon Learning Institute', started: '2024-05-10', endsIn: '2024-06-09', daysRemaining: 19, status: 'active' },
];

const statusStyles: Record<string, string> = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  expiring: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  expired: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export default function TrialSchoolsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Trial Schools</h1>
        <p className="text-sm text-muted-foreground mt-1">Schools currently on a free trial</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Trial Schools ({trialSchools.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="text-left font-medium py-3 px-4">School</th>
                  <th className="text-left font-medium py-3 px-4">Started</th>
                  <th className="text-left font-medium py-3 px-4">Ends In</th>
                  <th className="text-left font-medium py-3 px-4">Days Remaining</th>
                  <th className="text-right font-medium py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {trialSchools.map((trial) => (
                  <tr key={trial.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <td className="py-3 px-4">
                      <strong>{trial.school}</strong>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{trial.started}</td>
                    <td className="py-3 px-4 text-muted-foreground">{trial.endsIn}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Clock className={`h-4 w-4 ${trial.daysRemaining < 0 ? 'text-red-500' : trial.daysRemaining <= 7 ? 'text-amber-500' : 'text-muted-foreground'}`} />
                        <span className={`font-medium ${trial.daysRemaining < 0 ? 'text-red-600' : ''}`}>
                          {trial.daysRemaining < 0 ? 'Expired' : `${trial.daysRemaining} days`}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[trial.status]}`}>
                        {trial.status}
                      </span>
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
