'use client';

import { FileSpreadsheet, Plus } from 'lucide-react';
import { PageContainer, PageHeader, EmptyPage } from '@/components/shared';
import { Button } from '@/components/ui/button';

export default function ExaminationsPage() {
  return (
    <PageContainer>
      <PageHeader title="Examinations" description="Manage exams and assessments">
        <Button size="sm">
          <Plus className="mr-1.5 size-4" />
          Create Exam
        </Button>
      </PageHeader>
      <EmptyPage
        icon={FileSpreadsheet}
        title="No examinations scheduled"
        description="Exams and assessments will appear here once scheduled. Create exams, define grading criteria, and manage results."
        action={{
          label: 'Create Exam',
          icon: Plus,
          onClick: () => {},
        }}
      />
    </PageContainer>
  );
}

