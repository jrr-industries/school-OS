import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageScaffold } from '@/features/super-admin/components/page-scaffold';
import { getSuperAdminPage } from '@/features/super-admin/navigation';

interface SuperAdminPageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

function resolvePath(slug?: string[]) {
  if (!slug || slug.length === 0) {
    return '/dashboard';
  }

  return `/${slug.join('/')}`;
}

export async function generateMetadata({ params }: SuperAdminPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const page = getSuperAdminPage(resolvePath(resolvedParams.slug));

  if (!page) {
    return {
      title: 'Page not found',
    };
  }

  return {
    title: page.label,
    description: page.description,
  };
}

export default async function SuperAdminPage({ params }: SuperAdminPageProps) {
  const resolvedParams = await params;
  const page = getSuperAdminPage(resolvePath(resolvedParams.slug));

  if (!page) {
    notFound();
  }

  return <PageScaffold page={page} />;
}
