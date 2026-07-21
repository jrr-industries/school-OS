'use client';

import { Check, X, Building2, Mail, Calendar } from 'lucide-react';
import { Card, CardContent } from '@schoolos/ui';

interface PendingSchool {
  id: string;
  name: string;
  code: string;
  type: string;
  contactEmail: string;
  submittedDate: string;
  adminName: string;
}

const pendingSchools: PendingSchool[] = [
  { id: '1', name: 'Oakwood Preparatory', code: 'OAK-PREP', type: 'Private', contactEmail: 'admin@oakwood.edu', submittedDate: '2024-05-10', adminName: 'Dr. Emily Watson' },
  { id: '2', name: 'Greenfield International', code: 'GRN-INT', type: 'Private', contactEmail: 'info@greenfield.org', submittedDate: '2024-05-12', adminName: 'James Rodriguez' },
  { id: '3', name: 'North Star Academy', code: 'NTH-STA', type: 'Charter', contactEmail: 'admin@northstar.edu', submittedDate: '2024-05-14', adminName: 'Lisa Chang' },
  { id: '4', name: 'Pinecrest Elementary', code: 'PIN-ELM', type: 'Public', contactEmail: 'principal@pinecrest.k12', submittedDate: '2024-05-16', adminName: 'Michael Barnes' },
  { id: '5', name: 'Horizon Learning Institute', code: 'HRZ-LRN', type: 'Religious', contactEmail: 'info@horizoninstitute.org', submittedDate: '2024-05-18', adminName: 'Sarah Mitchell' },
];

export default function VerificationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">School Verification</h1>
        <p className="text-sm text-muted-foreground mt-1">Verify pending school registrations</p>
      </div>

      <div className="space-y-4">
        {pendingSchools.map((school) => (
          <Card key={school.id}>
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-3 flex-1">
                  <div>
                    <h3 className="font-semibold text-base">{school.name}</h3>
                    <p className="text-xs text-muted-foreground">{school.code}</p>
                  </div>

                  <div className="grid gap-2 text-sm sm:grid-cols-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building2 className="h-4 w-4 shrink-0" />
                      <span>{school.type}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4 shrink-0" />
                      <span>{school.contactEmail}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4 shrink-0" />
                      <span>Submitted {school.submittedDate}</span>
                    </div>
                  </div>

                  <p className="text-sm">
                    <span className="font-medium">Admin:</span>{' '}
                    <span className="text-muted-foreground">{school.adminName}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                    aria-label="Approve"
                  >
                    <Check className="h-4 w-4" />
                    Approve
                  </button>
                  <button
                    className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                    aria-label="Reject"
                  >
                    <X className="h-4 w-4" />
                    Reject
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
