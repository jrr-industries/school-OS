import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Megaphone,
  AlertTriangle,
  UserCheck,
  Clock,
  Calendar,
  Building2,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

interface Props {
  onOpenBriefing: () => void;
  onOpenAnnouncement: () => void;
  onOpenEmergency: () => void;
  onOpenAssignSubstitute: () => void;
}

export const WelcomeBanner: React.FC<Props> = ({
  onOpenBriefing,
  onOpenAnnouncement,
  onOpenEmergency,
  onOpenAssignSubstitute
}) => {
  const [time, setTime] = useState('10:18:24 AM');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800/80 p-6 shadow-2xl">
      
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-sky-500/10 blur-3xl rounded-full pointer-events-none"></div>

      <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        
        {/* Left Welcome Details */}
        <div className="space-y-3">
          
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 rounded-lg flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              School Status: Open 🟢
            </span>

            <span className="px-2.5 py-1 text-xs font-semibold text-sky-300 bg-sky-500/15 border border-sky-500/30 rounded-lg flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              Current Period: <strong>Period 4</strong> (10:15 - 11:00 AM)
            </span>

            <span className="px-2.5 py-1 text-xs font-semibold text-slate-300 bg-slate-800/80 border border-slate-700/80 rounded-lg flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Wednesday, 22 July 2026
            </span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Good Morning, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400">Mr. David Miller</span>
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-1">
              <span className="font-semibold text-emerald-400">Vice Principal</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-300"><Building2 className="w-3.5 h-3.5 text-slate-400" /> Green Valley International School</span>
              <span>•</span>
              <span className="text-slate-400">Academic Year 2026–2027</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Welcome to today's Operational Command Desk. 70 classes are currently running smoothly. 3 faculty substitution requests require your attention today.
          </p>

        </div>

        {/* Right Quick Action Buttons */}
        <div className="shrink-0 space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <span>Quick Action Center</span>
            <span className="text-slate-600">• Live Clock {time}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5">
            
            {/* Generate Morning Briefing */}
            <button
              onClick={onOpenBriefing}
              className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-amber-200 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 rounded-xl transition-all shadow-md group"
            >
              <Sparkles className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <div className="leading-tight">Generate Morning Briefing</div>
                <div className="text-[10px] text-amber-400/80 font-normal">AI Synthesis Report</div>
              </div>
            </button>

            {/* Send Announcement */}
            <button
              onClick={onOpenAnnouncement}
              className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-emerald-200 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 rounded-xl transition-all shadow-md group"
            >
              <Megaphone className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <div className="leading-tight">Send Announcement</div>
                <div className="text-[10px] text-emerald-400/80 font-normal">Staff & Parents</div>
              </div>
            </button>

            {/* Emergency Alert */}
            <button
              onClick={onOpenEmergency}
              className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-red-200 bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 rounded-xl transition-all shadow-md group"
            >
              <AlertTriangle className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <div className="leading-tight">Emergency Alert</div>
                <div className="text-[10px] text-red-400/80 font-normal">Priority PA Broadcast</div>
              </div>
            </button>

            {/* Assign Substitute */}
            <button
              onClick={onOpenAssignSubstitute}
              className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-sky-200 bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 rounded-xl transition-all shadow-md group"
            >
              <UserCheck className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <div className="leading-tight">Assign Substitute</div>
                <div className="text-[10px] text-sky-400/80 font-normal">3 Covered Today</div>
              </div>
            </button>

          </div>
        </div>

      </div>

    </div>
  );
};
