'use client';

import Link from 'next/link';
import { Construction } from 'lucide-react';
import { Button, Card, CardContent } from '@schoolos/ui';
import { PageHeader } from '@/features/school-admin/components/page-header';

export default function AttendancePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance"
        description="Manage attendance records"
        breadcrumbs={[{ label: 'Dashboard', href: '/school-admin/dashboard' }, { label: 'Attendance' }]}
      />
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Construction className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">Coming Soon</h3>
          <p className="mt-2 text-sm text-muted-foreground text-center max-w-md">
            Manage attendance records
          </p>
          <Link href="/school-admin/staff">
            <Button variant="outline" className="mt-4">Go to Staff Management</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
