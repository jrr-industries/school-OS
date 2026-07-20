'use client';

import dynamic from 'next/dynamic';

const StudentsModule = dynamic(
  () => import('@/modules/students-module').then((m) => ({ default: m.StudentsModule })),
  { ssr: false },
);

export default function StudentsPage() {
  return <StudentsModule />;
}
