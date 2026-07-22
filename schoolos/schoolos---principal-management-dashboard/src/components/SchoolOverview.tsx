import React from 'react';
import {
  Clock,
  Sun,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
  Send,
  AlertCircle,
  Activity,
  MapPin,
} from 'lucide-react';

interface SchoolOverviewProps {
  onQuickAction: (actionName: string) => void;
}

export const SchoolOverview: React.FC<SchoolOverviewProps> = ({ onQuickAction }) => {
  const periods = [
    { name: 'Morning Assembly', time: '8:00 - 8:20 AM', status: 'Completed', icon: CheckCircle2, color: 'text-emerald-500' },
    { name: 'Period 1-2 (STEM & Lit)', time: '8:25 - 10:15 AM', status: 'Completed', icon: CheckCircle2, color: 'text-emerald-500' },
    { name: 'Morning Recess', time: '10:15 - 10:35 AM', status: 'Completed', icon: CheckCircle2, color: 'text-emerald-500' },
    { name: 'Period 3-4 (Active Now)', time: '10:40 - 12:30 PM', status: 'In Progress', icon: Activity, color: 'text-amber-500 animate-pulse' },
    { name: 'Main Campus Lunch', time: '12:35 - 1:25 PM', status: 'Upcoming', icon: Clock, color: 'text-slate-400' },
    { name: 'Period 5-6 & Dismissal', time: '1:30 - 3:15 PM', status: 'Upcoming', icon: Clock, color: 'text-slate-400' },
  ];

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Today's School Overview & Live Timeline
          </h2>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Period 4 Active • Next Bell in 28 mins
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Live Period Schedule */}
        <div className="lg:col-span-2 space-y-3">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Campus Daily Schedule
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {periods.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border transition-all ${
                    p.status === 'In Progress'
                      ? 'border-amber-400/50 bg-amber-50/50 dark:bg-amber-950/20 shadow-sm'
                      : p.status === 'Completed'
                      ? 'border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40'
                      : 'border-slate-100 dark:border-slate-800/60 bg-white dark:bg-slate-900 opacity-75'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {p.name}
                    </span>
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${p.color}`} />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    {p.time}
                  </p>
                  <span
                    className={`inline-block mt-1 text-[10px] font-bold ${
                      p.status === 'In Progress'
                        ? 'text-amber-600 dark:text-amber-400'
                        : p.status === 'Completed'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Campus Environmental & Security Index */}
        <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Campus Environment & Safety</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </p>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
              <span className="text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-500" /> Weather & AQI
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                24°C • AQI 38 (Good)
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
              <span className="text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Perimeter Gates
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                4 / 4 Secure
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
              <span className="text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-500" /> Field Trips Today
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                Grade 8 Robotics (140 STU)
              </span>
            </div>
          </div>

          <div className="pt-1 flex items-center gap-2">
            <button
              onClick={() => onQuickAction('Generate Daily Attendance Audit')}
              className="flex-1 py-1.5 px-2 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-[11px] font-bold hover:opacity-90 transition-opacity text-center"
            >
              Daily Audit PDF
            </button>
            <button
              onClick={() => onQuickAction('Notify Faculty Leads')}
              className="py-1.5 px-3 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-200 transition-colors"
            >
              Alert Staff
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
