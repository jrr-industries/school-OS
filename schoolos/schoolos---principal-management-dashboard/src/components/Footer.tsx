import React from 'react';
import { ShieldCheck, Server, Database, Cpu, HardDrive, LifeBuoy, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-900 text-slate-300 border-t border-slate-800 py-6 px-4 md:px-8 mt-12 text-xs">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 border-b border-slate-800 pb-4 text-center sm:text-left">
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
              OS Platform
            </span>
            <p className="font-extrabold text-white flex items-center justify-center sm:justify-start gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" /> SchoolOS v4.8
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
              Server Status
            </span>
            <p className="font-bold text-emerald-400 flex items-center justify-center sm:justify-start gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Online
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
              Database
            </span>
            <p className="font-bold text-slate-200 flex items-center justify-center sm:justify-start gap-1">
              <Database className="w-3 h-3 text-teal-400" /> Firestore DB
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
              AI Engine
            </span>
            <p className="font-bold text-amber-300 flex items-center justify-center sm:justify-start gap-1">
              <Cpu className="w-3 h-3" /> Gemini 3.6
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
              Last Telemetry Sync
            </span>
            <p className="font-bold text-slate-300">Just Now</p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
              Storage Used
            </span>
            <p className="font-bold text-slate-300 flex items-center justify-center sm:justify-start gap-1">
              <HardDrive className="w-3 h-3 text-indigo-400" /> 14.2 GB / 100 GB
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
              License
            </span>
            <p className="font-extrabold text-emerald-400">Enterprise Platinum</p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
              Support Desk
            </span>
            <p className="font-bold text-indigo-300 flex items-center justify-center sm:justify-start gap-1">
              <LifeBuoy className="w-3 h-3" /> 24/7 Priority
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <span>
            © 2026 Green Valley International School • Powered by SchoolOS Executive Intelligence
          </span>
          <span className="flex items-center gap-1 text-slate-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> ISO 27001 Certified • FERPA & GDPR Compliant
          </span>
        </div>
      </div>
    </footer>
  );
};
