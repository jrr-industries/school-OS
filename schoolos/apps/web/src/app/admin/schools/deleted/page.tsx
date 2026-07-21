'use client';

import { Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';

interface DeletedSchool {
  id: string;
  name: string;
  code: string;
  deletedDate: string;
  deletedBy: string;
}

const deletedSchools: DeletedSchool[] = [
  { id: '1', name: 'Sunrise Learning Center', code: 'SNR-LRN', deletedDate: '2024-02-28', deletedBy: 'System Admin' },
  { id: '2', name: 'City Public School #42', code: 'CPS-042', deletedDate: '2024-03-10', deletedBy: 'Sarah Johnson' },
  { id: '3', name: 'St. Mary\'s Academy', code: 'STM-ACA', deletedDate: '2024-04-05', deletedBy: 'Mike Thompson' },
];

export default function DeletedSchoolsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Deleted Schools</h1>
        <p className="text-sm text-muted-foreground mt-1">Schools that have been removed from the platform</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Deleted Schools ({deletedSchools.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="text-left font-medium py-3 px-4">School</th>
                  <th className="text-left font-medium py-3 px-4">Code</th>
                  <th className="text-left font-medium py-3 px-4">Deleted Date</th>
                  <th className="text-right font-medium py-3 px-4">Deleted By</th>
                </tr>
              </thead>
              <tbody>
                {deletedSchools.map((school) => (
                  <tr key={school.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Trash2 className="h-4 w-4 text-red-500 shrink-0" />
                        <strong>{school.name}</strong>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{school.code}</td>
                    <td className="py-3 px-4 text-muted-foreground">{school.deletedDate}</td>
                    <td className="py-3 px-4 text-right text-muted-foreground">{school.deletedBy}</td>
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
