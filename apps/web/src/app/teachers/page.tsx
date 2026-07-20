'use client';

import dynamic from 'next/dynamic';

const TeachersModule = dynamic(
  () => import('@/modules/teachers-module').then((m) => ({ default: m.TeachersModule })),
  { ssr: false },
);

export default function TeachersPage() {
  return <TeachersModule />;
}
