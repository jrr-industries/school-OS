'use client';

import dynamic from 'next/dynamic';

const AttendanceModule = dynamic(
  () => import('@/modules/attendance-module').then((m) => ({ default: m.AttendanceModule })),
  { ssr: false },
);

export default function AttendancePage() {
  return <AttendanceModule />;
}
