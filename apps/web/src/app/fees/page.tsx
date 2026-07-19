'use client';

import { Coins, Plus } from 'lucide-react';
import { PageContainer, PageHeader, EmptyPage } from '@/components/shared';
import { Button } from '@/components/ui/button';

export default function FeesPage() {
  return (
    <PageContainer>
      <PageHeader title="Fees" description="Manage fee collection and records">
        <Button size="sm">
          <Plus className="mr-1.5 size-4" />
          Configure Fees
        </Button>
      </PageHeader>
      <EmptyPage
        icon={Coins}
        title="No fee structures configured"
        description="Fee structures will appear here once configured. Set up fee types, amounts, due dates, and manage collections."
        action={{
          label: 'Configure Fees',
          icon: Plus,
          onClick: () => {},
        }}
      />
    </PageContainer>
  );
}

