import React from 'react';
import {
  GraduationCap,
  BookOpen,
  Building,
  Users,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Award,
  TrendingUp,
  Percent,
} from 'lucide-react';
import {
  academicHealthData,
  departmentPerformanceData,
  classroomStatusData,
  staffSummaryData,
} from '../data/mockData';

export const AcademicAndDepartments: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Priority 2 Grid 1: Academic Health & Department Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 5. Academic Health Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Academic Health Card
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Concise campus academic performance & course completion metrics
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              Target Exceeded
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Average GPA
              </span>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {academicHealthData.avgGPA}
              </p>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold">
                +0.12 vs Term 4
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Assignments
              </span>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {academicHealthData.assignmentsSubmittedPct}%
              </p>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                Submitted
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Syllabus
              </span>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {academicHealthData.syllabusCompletionPct}%
              </p>
              <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold">
                Completed
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="font-bold text-amber-900 dark:text-amber-200">
                Target Intervention Needed:
              </span>
            </div>
            <div className="flex gap-1">
              {academicHealthData.weakSubjects.map((sbj, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200/80 dark:bg-amber-900 text-amber-900 dark:text-amber-100"
                >
                  {sbj}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 6. Department Performance */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Department Performance (HOD Summary)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Academic quality scores across main faculty departments
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
              5 HOD Units
            </span>
          </div>

          <div className="space-y-2.5">
            {departmentPerformanceData.map((dept, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {dept.department}
                  </span>
                  <span className="font-black text-emerald-600 dark:text-emerald-400">
                    {dept.performancePct}%
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${dept.performancePct}%` }}
                  />
                </div>

                <p className="text-[10px] text-slate-400 flex items-center justify-between pt-0.5">
                  <span>HOD: {dept.headName}</span>
                  <span>{dept.teachersCount} Faculty Teachers</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Priority 2 Grid 2: Classroom Status & Staff Summary Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 7. Classroom Status */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Classroom Facility Status
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Total 72 Classrooms • Smart board & maintenance status
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
              70 Active (97%)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
            <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800">
              <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-bold block">
                Active
              </span>
              <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-400 mt-1">
                {classroomStatusData.active}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800">
              <span className="text-[10px] text-amber-800 dark:text-amber-300 font-bold block">
                Maintenance
              </span>
              <p className="text-xl font-extrabold text-amber-700 dark:text-amber-400 mt-1">
                {classroomStatusData.maintenance}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-800">
              <span className="text-[10px] text-rose-800 dark:text-rose-300 font-bold block">
                Closed
              </span>
              <p className="text-xl font-extrabold text-rose-700 dark:text-rose-400 mt-1">
                {classroomStatusData.closed}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
              <span className="text-[10px] text-slate-500 font-bold block">
                Smart Boards Off
              </span>
              <p className="text-xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">
                {classroomStatusData.smartBoardsOffline}
              </p>
            </div>
          </div>
        </div>

        {/* 11. Staff Summary Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Staff Summary Breakdown
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Total 192 Campus Personnel
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
              97.4% Present Today
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold block">Teachers</span>
              <p className="text-xl font-black text-slate-900 dark:text-white mt-1">
                {staffSummaryData.teachers}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold block">Admin Staff</span>
              <p className="text-xl font-black text-slate-900 dark:text-white mt-1">
                {staffSummaryData.adminStaff}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold block">Support Staff</span>
              <p className="text-xl font-black text-slate-900 dark:text-white mt-1">
                {staffSummaryData.supportStaff}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold block">Temporary</span>
              <p className="text-xl font-black text-slate-900 dark:text-white mt-1">
                {staffSummaryData.tempStaff}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
