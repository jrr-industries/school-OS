import { PageContainer, PageHeader, ContentContainer } from '@/components/shared';

export default function SectionsPage() {
  return (
    <PageContainer>
      <PageHeader title="Sections" description="Manage class sections" />
      <ContentContainer>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h3 className="mb-2 text-xl font-semibold tracking-tight text-foreground">Sections</h3>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            This page is under development.
          </p>
        </div>
      </ContentContainer>
    </PageContainer>
  );
}
