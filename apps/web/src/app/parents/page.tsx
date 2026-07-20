'use client';

import dynamic from 'next/dynamic';

const ParentsModule = dynamic(
  () => import('@/modules/parents-module').then((m) => ({ default: m.ParentsModule })),
  { ssr: false },
);

export default function ParentsPage() {
  return <ParentsModule />;
}
