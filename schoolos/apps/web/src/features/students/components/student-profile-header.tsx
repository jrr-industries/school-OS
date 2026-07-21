'use client';

import { Avatar, Badge, Button } from '@schoolos/ui';
import { DateUtils } from '@schoolos/utils';
import { MoreHorizontal, Pencil, Printer, QrCode } from 'lucide-react';

interface StudentProfileHeaderProps {
  student: {
    id: string;
    firstName: string;
    lastName: string;
    admissionNumber: string;
    rollNumber?: string;
    photo?: string;
    status: string;
    gender: string;
    dateOfBirth: string;
    class?: { name: string };
    section?: { name: string };
    campus?: { name: string };
    addresses?: Array<{ city: string; state: string }>;
    guardians?: Array<{ phone: string; email: string }>;
  };
}

const statusVariantMap: Record<string, 'success' | 'warning' | 'destructive' | 'info' | 'default'> = {
  active: 'success',
  inactive: 'warning',
  transferred: 'info',
  graduated: 'info',
  archived: 'destructive',
  suspended: 'destructive',
};

export function StudentProfileHeader({ student }: StudentProfileHeaderProps) {
  const age = Math.floor(DateUtils.differenceInDays(new Date(), new Date(student.dateOfBirth)) / 365.25);
  const primaryAddress = student.addresses?.[0];

  return (
    <div className="rounded-lg border bg-card">
      <div className="flex flex-col gap-6 p-6 md:flex-row">
        <div className="flex flex-col items-center gap-4 md:items-start">
          <Avatar
            size="xl"
            src={student.photo}
            fallback={`${student.firstName} ${student.lastName}`}
          />
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">
                  {student.firstName} {student.lastName}
                </h1>
                <Badge variant={statusVariantMap[student.status] ?? 'default'}>
                  {student.status}
                </Badge>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span>Admission: {student.admissionNumber}</span>
                {student.rollNumber && <span>Roll: {student.rollNumber}</span>}
                <span>{student.gender}</span>
                <span>{age} years</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon">
                <Printer className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <QrCode className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {student.class && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Class & Section</p>
                <p className="text-sm font-medium">
                  {student.class.name}
                  {student.section ? ` - ${student.section.name}` : ''}
                </p>
              </div>
            )}
            {student.campus && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Campus</p>
                <p className="text-sm font-medium">{student.campus.name}</p>
              </div>
            )}
            {primaryAddress && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="text-sm font-medium">
                  {primaryAddress.city}, {primaryAddress.state}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
