'use client';

import { BookOpen, Plus } from 'lucide-react';
import { PageContainer, PageHeader, EmptyPage } from '@/components/shared';
import { Button } from '@/components/ui/button';

export default function LibraryPage() {
  return (
    <PageContainer>
      <PageHeader title="Library" description="Manage library resources">
        <Button size="sm">
          <Plus className="mr-1.5 size-4" />
          Add Book
        </Button>
      </PageHeader>
      <EmptyPage
        icon={BookOpen}
        title="No books in the library yet"
        description="Library resources will appear here once added. Manage books, track checkouts, and handle returns."
        action={{
          label: 'Add Book',
          icon: Plus,
          onClick: () => {},
        }}
      />
    </PageContainer>
  );
}

