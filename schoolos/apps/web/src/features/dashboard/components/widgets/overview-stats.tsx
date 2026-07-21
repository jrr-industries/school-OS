'use client';

import { StatsCard } from '../shared/stats-card';
import { usePermission } from '@schoolos/hooks';
import { Users, GraduationCap, HeartHandshake, Briefcase, UserPlus } from 'lucide-react';

interface OverviewStatsProps {
  totalStudents: number;
  totalTeachers: number;
  totalParents: number;
  totalStaff: number;
  admissionsToday: number;
  studentTrend?: { value: number; positive: boolean };
  isLoading?: boolean;
}

export function OverviewStats({
  totalStudents,
  totalTeachers,
  totalParents,
  totalStaff,
  admissionsToday,
  studentTrend,
  isLoading,
}: OverviewStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {usePermission('students:read') && (
        <StatsCard
          title="Total Students"
          value={totalStudents.toLocaleString()}
          icon={GraduationCap}
          trend={studentTrend}
          description="vs last year"
          href="/students"
          isLoading={isLoading}
        />
      )}
      {usePermission('users:read') && (
        <StatsCard
          title="Teachers"
          value={totalTeachers.toLocaleString()}
          icon={Users}
          href="/teachers"
          isLoading={isLoading}
        />
      )}
      {usePermission('parents:read') && (
        <StatsCard
          title="Parents"
          value={totalParents.toLocaleString()}
          icon={HeartHandshake}
          href="/parents"
          isLoading={isLoading}
        />
      )}
      {usePermission('users:read') && (
        <StatsCard
          title="Staff"
          value={totalStaff.toLocaleString()}
          icon={Briefcase}
          href="/employees"
          isLoading={isLoading}
        />
      )}
      {usePermission('students:read') && (
        <StatsCard
          title="Admissions Today"
          value={admissionsToday.toLocaleString()}
          icon={UserPlus}
          href="/admissions"
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
