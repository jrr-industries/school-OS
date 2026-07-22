import React from 'react';
import { SchoolInfo } from '../types';
import { Sparkles, Radio, CheckCircle, AlertTriangle } from 'lucide-react';

interface WelcomeBannerProps {
  schoolInfo: SchoolInfo;
  onOpenAIBriefing: () => void;
  onOpenBroadcastModal?: () => void;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  schoolInfo,
  onOpenAIBriefing,
  onOpenBroadcastModal,
}) => {
  const studentPct = ((schoolInfo.presentStudents / schoolInfo.totalStudents) * 100).toFixed(1);
  const teacherPct = ((schoolInfo.presentTeachers / schoolInfo.totalTeachers) * 100).toFixed(1);

  return (
    <div className="space-y-4">
      {/* Primary Welcome Banner */}
      <section className="w-full rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-5 md:p-6 shadow-xl relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border border-emerald-800/40">
        {/* Glow Effects */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -top-12 w-48 h-48 bg-teal-400/10 rounded-full blur-2xl pointer-events-none" />

        {/* Left Side */}
        <div className="z-10 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Good Morning, Dr. Sarah Johnson <span className="inline-block animate-bounce">👋</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {schoolInfo.term}
            </span>
          </div>

          <p className="text-emerald-100/90 text-xs font-medium flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-bold text-white">{schoolInfo.name}</span>
            <span className="text-emerald-400/60">•</span>
            <span>Academic Year: {schoolInfo.academicYear}</span>
            <span className="text-emerald-400/60">•</span>
            <span className="text-amber-200 font-semibold">{schoolInfo.dateString}</span>
          </p>

          {/* Quick Action Buttons Row (Priority 5) */}
          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={() => onOpenBroadcastModal && onOpenBroadcastModal()}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold shadow-md transition-all active:scale-95"
            >
              + Create Announcement
            </button>
            <button
              onClick={() => alert('Initiating Emergency Campus Alert Broadcast')}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold shadow-md transition-all active:scale-95"
            >
              + Emergency Alert
            </button>
            <button
              onClick={() => alert('Opening Principal Calendar Scheduler')}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold border border-white/20 transition-all"
            >
              + Schedule Meeting
            </button>
            <button
              onClick={() => alert('Generating Board Report PDF')}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold border border-white/20 transition-all"
            >
              + Export Report
            </button>
            <button
              onClick={onOpenAIBriefing}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black shadow-md transition-all active:scale-95 flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
              + Generate AI Report
            </button>
          </div>
        </div>

        {/* Right Side Quick Metrics */}
        <div className="z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto shrink-0">
          <div className="flex flex-col justify-center px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm">
            <span className="text-[10px] font-bold text-emerald-200/80 uppercase tracking-wider">
              Campus Status
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-extrabold text-white">
                🟢 {schoolInfo.status}
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-center px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm">
            <span className="text-[10px] font-bold text-emerald-200/80 uppercase tracking-wider">
              Students Present
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-sm font-extrabold text-white">
                {schoolInfo.presentStudents.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-200/70 font-medium">
                / {schoolInfo.totalStudents.toLocaleString()}
              </span>
              <span className="ml-auto text-[11px] font-bold text-emerald-300">
                ({studentPct}%)
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-center px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm">
            <span className="text-[10px] font-bold text-emerald-200/80 uppercase tracking-wider">
              Teachers Present
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-sm font-extrabold text-white">
                {schoolInfo.presentTeachers}
              </span>
              <span className="text-[10px] text-emerald-200/70 font-medium">
                / {schoolInfo.totalTeachers}
              </span>
              <span className="ml-auto text-[11px] font-bold text-emerald-300">
                ({teacherPct}%)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Priority 4: Embedded AI Daily Brief Card */}
      <section className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-emerald-500/30 dark:border-emerald-800/50 p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
            <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                AI Daily Executive Briefing
              </h3>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                Gemini 3.6 Live
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
              Good Morning. Today's attendance is expected to reach <strong>97%</strong>. Grade 10 has the lowest attendance. Bus #04 delayed 6 mins. Term fee collection increased <strong>+6%</strong> ($1.24M). One science teacher on medical leave.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAIBriefing}
          className="shrink-0 px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-extrabold text-xs shadow-sm hover:bg-slate-800 dark:hover:bg-slate-200 transition-all active:scale-95 flex items-center gap-1.5"
        >
          Read Full Brief →
        </button>
      </section>
    </div>
  );
};

