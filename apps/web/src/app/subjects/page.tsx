import { PageContainer, PageHeader, ContentContainer } from '@/components/shared';

export default function SubjectsPage() {
  return (
    <PageContainer>
      <PageHeader title="Subjects" description="Manage subjects" />
      <ContentContainer>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h3 className="mb-2 text-xl font-semibold tracking-tight text-foreground">Subjects</h3>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            This page is under development.
          </p>
        </div>
      </ContentContainer>
    </PageContainer>
  );
}
