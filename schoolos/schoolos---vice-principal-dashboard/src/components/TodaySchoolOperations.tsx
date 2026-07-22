import React from 'react';
import {
  BookOpen,
  Users,
  GraduationCap,
  Clock,
  UserX,
  UserCheck,
  CheckCircle2,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { QuickStats } from '../types';

interface Props {
  stats: QuickStats;
}

export const TodaySchoolOperations: React.FC<Props> = ({ stats }) => {
  const teacherPercentage = Math.round((stats.teachersPresent / stats.totalTeachers) * 100);
  const studentPercentage = Math.round((stats.studentsPresent / stats.totalStudents) * 100);
  const attendancePercentage = Math.round((stats.attendanceSubmittedCount / stats.totalAttendanceClasses) * 100);

  const kpiList = [
    {
      title: 'Classes Running',
      value: `${stats.classesRunning}`,
      sub: '70 Active • 2 Cancelled',
      icon: BookOpen,
      iconBg: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
      progress: 97,
      progressColor: 'bg-sky-400'
    },
    {
      title: 'Teachers Present',
      value: `${stats.teachersPresent} / ${stats.totalTeachers}`,
      sub: `${teacherPercentage}% Faculty Attendance`,
      icon: Users,
      iconBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      progress: teacherPercentage,
      progressColor: 'bg-emerald-400'
    },
    {
      title: 'Students Present',
      value: `${stats.studentsPresent} / ${stats.totalStudents}`,
      sub: `${studentPercentage}% Campus Attendance`,
      icon: GraduationCap,
      iconBg: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      progress: studentPercentage,
      progressColor: 'bg-purple-400'
    },
    {
      title: 'Late Students',
      value: `${stats.lateStudents}`,
      sub: 'Gate A RFID Scans Today',
      icon: Clock,
      iconBg: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      badge: 'Action Logged',
      badgeColor: 'bg-amber-500/15 text-amber-400'
    },
    {
      title: 'Teacher Leaves',
      value: `${stats.teacherLeaves}`,
      sub: '3 Substitutes Assigned',
      icon: UserX,
      iconBg: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
      badge: 'Covered',
      badgeColor: 'bg-rose-500/15 text-rose-400'
    },
    {
      title: 'Substitute Teachers',
      value: `${stats.substituteTeachers}`,
      sub: 'All Covered For Period 4',
      icon: UserCheck,
      iconBg: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
      badge: '100% Filled',
      badgeColor: 'bg-emerald-500/15 text-emerald-400'
    },
    {
      title: 'Attendance Submitted',
      value: `${stats.attendanceSubmittedCount} / ${stats.totalAttendanceClasses}`,
      sub: `${attendancePercentage}% Submissions (4 Pending)`,
      icon: CheckCircle2,
      iconBg: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
      progress: attendancePercentage,
      progressColor: 'bg-teal-400'
    }
  ];

  return (
    <section id="operations" className="space-y-4 scroll-mt-20">
      
      {/* Section Title */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Today's Operational Status</span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-800 text-slate-300 rounded border border-slate-700">
              Real-Time Metrics
            </span>
          </h3>
          <p className="text-xs text-slate-400">High-level operational overview across all school blocks</p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3.5">
        {kpiList.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="group relative p-4 bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 rounded-2xl transition-all duration-200 shadow-xl flex flex-col justify-between space-y-3"
            >
              {/* Top row */}
              <div className="flex items-start justify-between">
                <div className={`p-2 rounded-xl border ${kpi.iconBg}`}>
                  <Icon className="w-4 h-4" />
                </div>
                {kpi.badge && (
                  <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${kpi.badgeColor}`}>
                    {kpi.badge}
                  </span>
                )}
              </div>

              {/* Middle value */}
              <div>
                <div className="text-xl font-extrabold text-white tracking-tight group-hover:scale-105 transition-transform origin-left">
                  {kpi.value}
                </div>
                <div className="text-xs font-medium text-slate-300 mt-0.5">{kpi.title}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{kpi.sub}</div>
              </div>

              {/* Progress bar if applicable */}
              {kpi.progress !== undefined && (
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full ${kpi.progressColor} rounded-full transition-all duration-500`}
                    style={{ width: `${kpi.progress}%` }}
                  ></div>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </section>
  );
};
