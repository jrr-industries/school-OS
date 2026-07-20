'use client';

import dynamic from 'next/dynamic';

const SchoolsModule = dynamic(
  () => import('@/modules/schools-module').then((m) => ({ default: m.SchoolsModule })),
  { ssr: false },
);

export default function SchoolsPage() {
  return <SchoolsModule />;
}
