import React from 'react';
import { Users, UserCheck, CheckSquare, ShieldAlert, Bus } from 'lucide-react';
import { SchoolInfo } from '../types';

interface StickyKPIBarProps {
  schoolInfo: SchoolInfo;
  pendingApprovalsCount: number;
  alertsCount: number;
}

export const StickyKPIBar: React.FC<StickyKPIBarProps> = ({
  schoolInfo,
  pendingApprovalsCount,
  alertsCount,
}) => {
  const attendancePct = Math.round(
    (schoolInfo.presentStudents / schoolInfo.totalStudents) * 1000
  ) / 10;

  return (
    <div className="sticky top-0 z-30 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-2xs py-2 px-4 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto text-xs no-scrollbar">
        <div className="flex items-center gap-4 shrink-0 font-bold">
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
            <Users className="w-3.5 h-3.5 text-emerald-500" />
            <span>Attendance:</span>
            <strong className="text-emerald-600 dark:text-emerald-400 font-extrabold">
              {attendancePct}% ({schoolInfo.presentStudents})
            </strong>
          </div>

          <div className="h-3 w-px bg-slate-200 dark:bg-slate-700" />

          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
            <UserCheck className="w-3.5 h-3.5 text-teal-500" />
            <span>Teachers:</span>
            <strong className="text-slate-900 dark:text-white font-extrabold">
              {schoolInfo.presentTeachers}/{schoolInfo.totalTeachers}
            </strong>
          </div>

          <div className="h-3 w-px bg-slate-200 dark:bg-slate-700" />

          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
            <CheckSquare className="w-3.5 h-3.5 text-amber-500" />
            <span>Approvals:</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-extrabold">
              {pendingApprovalsCount}
            </span>
          </div>

          <div className="h-3 w-px bg-slate-200 dark:bg-slate-700" />

          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
            <span>Alerts:</span>
            <span className="px-1.5 py-0.2 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-extrabold">
              {alertsCount}
            </span>
          </div>
        </div>

        <div className="shrink-0 text-[11px] text-slate-400 font-medium hidden md:block">
          Green Valley International • {schoolInfo.term} ({schoolInfo.academicYear})
        </div>
      </div>
    </div>
  );
};
