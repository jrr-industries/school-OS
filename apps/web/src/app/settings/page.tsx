'use client';

import { Settings } from 'lucide-react';
import { PageContainer, PageHeader, ContentContainer } from '@/components/shared';

export default function SettingsPage() {
  return (
    <PageContainer>
      <PageHeader title="Settings" description="Manage system settings" />
      <ContentContainer>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-6 flex size-20 items-center justify-center rounded-2xl bg-primary/5 ring-1 ring-primary/10">
            <Settings className="size-10 text-primary/60" />
          </div>
          <h3 className="mb-2 text-xl font-semibold">This page is under development</h3>
          <p className="mb-8 max-w-sm text-sm text-muted-foreground">
            System settings including school configuration, user management, and global preferences are coming soon.
          </p>
        </div>
      </ContentContainer>
    </PageContainer>
  );
}

