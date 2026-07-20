'use client';

import { StudentTable } from '@/features/students/components/student-table';
import { Button } from '@schoolos/ui';
import Link from 'next/link';
import { Plus, Download, Upload } from 'lucide-react';

export default function StudentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">
            Manage all student records
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Link href="/students/new">
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          </Link>
        </div>
      </div>

      <StudentTable schoolId="current-school-id" />
    </div>
  );
}
