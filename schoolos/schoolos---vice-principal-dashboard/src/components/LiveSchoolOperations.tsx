import React, { useState, useEffect } from 'react';
import {
  BellRing,
  Clock,
  CheckCircle2,
  XCircle,
  Play,
  Flame,
  Building,
  Layers,
  Sparkles
} from 'lucide-react';

export const LiveSchoolOperations: React.FC = () => {
  const [secondsLeft, setSecondsLeft] = useState(18 * 60 + 35); // 18m 35s

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 18 * 60));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <section id="daily-ops" className="space-y-4 scroll-mt-20">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Live School Operations</span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full animate-pulse">
              Active Pulse
            </span>
          </h3>
          <p className="text-xs text-slate-400">Current period status, timetable progress, and bell timing monitor</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Card 1: Bell Ring Countdown & Current Period */}
        <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl shadow-xl space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 blur-2xl rounded-full pointer-events-none"></div>

          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-sky-500/20 border border-sky-500/30 rounded-xl text-sky-400">
                <BellRing className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Current Period</h4>
                <p className="text-[11px] text-slate-400">Period 4 (10:15 – 11:00 AM)</p>
              </div>
            </div>
            <span className="px-2.5 py-1 text-xs font-bold text-sky-300 bg-sky-500/20 border border-sky-500/30 rounded-lg">
              Active
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Next Bell Ring In</div>
              <div className="text-2xl font-black text-white tracking-tight font-mono mt-0.5">
                {minutes}m {seconds < 10 ? `0${seconds}` : seconds}s
              </div>
            </div>

            <div className="text-right">
              <div className="text-[11px] text-slate-400">Followed by</div>
              <div className="text-xs font-bold text-amber-300 mt-0.5">Period 5 (Recess / Lunch)</div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Period Elapsed: 27 mins</span>
              <span>18 mins remaining</span>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div className="h-full bg-gradient-to-r from-sky-500 to-teal-400 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>

        </div>

        {/* Card 2: Morning Assembly & Class Status */}
        <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl shadow-xl space-y-4">
          
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Morning Assembly</h4>
                <p className="text-[11px] text-slate-400">Concluded at 08:45 AM</p>
              </div>
            </div>
            <span className="px-2.5 py-1 text-xs font-bold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
              Completed
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Classes Running</span>
                <Play className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-2xl font-extrabold text-white mt-1">70</div>
              <div className="text-[10px] text-emerald-400 mt-0.5">Active & Covered</div>
            </div>

            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Cancelled</span>
                <XCircle className="w-3.5 h-3.5 text-rose-400" />
              </div>
              <div className="text-2xl font-extrabold text-rose-400 mt-1">2</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Study Halls Assigned</div>
            </div>
          </div>

        </div>

        {/* Card 3: Attendance Roll Call Submissions */}
        <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl shadow-xl space-y-4">
          
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-500/20 border border-purple-500/30 rounded-xl text-purple-400">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Attendance Submissions</h4>
                <p className="text-[11px] text-slate-400">Period 1 Roll Call Monitor</p>
              </div>
            </div>
            <span className="px-2.5 py-1 text-xs font-bold text-purple-300 bg-purple-500/20 border border-purple-500/30 rounded-lg">
              94.4% Done
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">Classes Completed</span>
              <span className="font-bold text-emerald-400">68 / 72 Classes</span>
            </div>

            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: '94.4%' }}></div>
            </div>

            <div className="p-2.5 bg-slate-950/60 border border-slate-800/80 rounded-xl text-xs flex items-center justify-between">
              <span className="text-slate-400">Pending Reminders: <strong>4 Teachers</strong></span>
              <span className="text-amber-400 font-semibold cursor-pointer hover:underline">Ping All</span>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};
