import React, { useState } from 'react';
import {
  Award,
  AlertTriangle,
  Users,
  GraduationCap,
  PhoneCall,
  Mail,
  UserCheck,
  Star,
  Search,
  ExternalLink,
} from 'lucide-react';
import { StudentPerformance, TeacherPerformance } from '../types';
import { topStudents, atRiskStudents, teachersSummary } from '../data/mockData';

export const PerformanceSection: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState<StudentPerformance | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleIntervention = (studentName: string, action: string) => {
    setToastMessage(`Initiated "${action}" for ${studentName}. Notification sent to Guidance Counselor.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <section className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-6">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="p-3 rounded-xl bg-emerald-600 text-white font-medium text-xs shadow-md animate-fade-in flex items-center justify-between">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="font-bold">✕</button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Student & Teacher Performance Intelligence
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Honor roll recognition, early intervention alerts & faculty evaluations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
            3 Honor Scholars
          </span>
          <span className="px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 text-xs font-bold">
            2 At-Risk Alerts
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Performers (Honor Roll) */}
        <div className="space-y-3 bg-slate-50/50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              Honor Roll Leaders
            </h3>
            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
              GPA 3.94+
            </span>
          </div>

          <div className="space-y-3">
            {topStudents.map((stu) => (
              <div
                key={stu.id}
                className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 shadow-2xs hover:border-slate-300 transition-all"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={stu.avatar}
                    alt={stu.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-400/40"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {stu.name}
                      </p>
                      <span className="font-black text-xs text-amber-600 dark:text-amber-400">
                        {stu.gpa} GPA
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      {stu.grade} • {stu.attendancePct}% Attendance
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {stu.achievements.map((ach, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                        >
                          {ach}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* At-Risk Student Interventions */}
        <div className="space-y-3 bg-rose-50/20 dark:bg-rose-950/10 p-4 rounded-xl border border-rose-200/50 dark:border-rose-900/40">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-500 animate-pulse" />
              At-Risk Student Alerts
            </h3>
            <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400">
              Action Required
            </span>
          </div>

          <div className="space-y-3">
            {atRiskStudents.map((stu) => (
              <div
                key={stu.id}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-rose-200/80 dark:border-rose-900/50 shadow-2xs space-y-2"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={stu.avatar}
                    alt={stu.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-400/40"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {stu.name}
                      </p>
                      <span className="font-black text-xs text-rose-600 dark:text-rose-400">
                        {stu.gpa} GPA
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      {stu.grade} • {stu.attendancePct}% Attendance
                    </p>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-300 bg-rose-50 dark:bg-rose-950/40 p-2 rounded-lg border border-rose-100 dark:border-rose-900/30">
                  <strong className="text-rose-700 dark:text-rose-300">Flag:</strong> {stu.riskReason}
                </p>

                <div className="flex items-center gap-1.5 pt-1">
                  <button
                    onClick={() => handleIntervention(stu.name, 'Parent Call')}
                    className="flex-1 py-1 px-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center gap-1"
                  >
                    <PhoneCall className="w-3 h-3" /> Call Parent
                  </button>
                  <button
                    onClick={() => handleIntervention(stu.name, 'Guidance Meeting')}
                    className="flex-1 py-1 px-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-[10px] hover:bg-slate-200"
                  >
                    Assign Counselor
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Faculty Workload & Excellence */}
        <div className="space-y-3 bg-slate-50/50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-teal-500" />
              Teacher Excellence & Workload
            </h3>
            <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400">
              Avg Rating 4.8★
            </span>
          </div>

          <div className="space-y-3">
            {teachersSummary.map((tch) => (
              <div
                key={tch.id}
                className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-2xs space-y-1.5"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={tch.avatar}
                    alt={tch.name}
                    className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {tch.name}
                      </p>
                      <span className="flex items-center gap-0.5 text-xs font-black text-amber-500">
                        <Star className="w-3 h-3 fill-amber-400" /> {tch.studentRating}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      {tch.department} • {tch.attendancePct}% Attendance
                    </p>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/80 p-1.5 rounded-lg flex items-center justify-between">
                  <span className="truncate">Classes: {tch.classesTaught.join(', ')}</span>
                  <span
                    className={`font-bold ml-1 shrink-0 ${
                      tch.status === 'Active'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {tch.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
