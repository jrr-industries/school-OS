'use client';

import { Bus, Plus } from 'lucide-react';
import { PageContainer, PageHeader, EmptyPage } from '@/components/shared';
import { Button } from '@/components/ui/button';

export default function TransportPage() {
  return (
    <PageContainer>
      <PageHeader title="Transport" description="Manage school transportation">
        <Button size="sm">
          <Plus className="mr-1.5 size-4" />
          Add Route
        </Button>
      </PageHeader>
      <EmptyPage
        icon={Bus}
        title="No transport routes configured"
        description="Transport routes and vehicle assignments will appear here. Add bus routes, stops, and assign students."
        action={{
          label: 'Add Route',
          icon: Plus,
          onClick: () => {},
        }}
      />
    </PageContainer>
  );
}

