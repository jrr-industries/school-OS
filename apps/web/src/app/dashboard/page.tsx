'use client';

import dynamic from 'next/dynamic';

// Lazy-load the dashboard module for better initial bundle size
const DashboardModule = dynamic(
  () => import('@/modules/dashboard-module').then((m) => ({ default: m.DashboardModule })),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-1 flex-col gap-6 p-6 lg:p-8">
        <div className="space-y-2">
          <div className="h-9 w-48 animate-pulse rounded-lg bg-muted" />
          <div className="h-4 w-72 animate-pulse rounded-lg bg-muted" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[120px] animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
        <div className="h-[300px] animate-pulse rounded-2xl bg-muted" />
      </div>
    ),
  },
);

export default function DashboardPage() {
  return <DashboardModule />;
}
