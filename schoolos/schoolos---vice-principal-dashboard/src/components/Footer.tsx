import React from 'react';
import { ShieldCheck, HardDrive, Database, Server, RefreshCw } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800/80 px-4 lg:px-6 py-3 text-slate-400 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-4">
        
        {/* Left: Status indicators */}
        <div className="flex flex-wrap items-center gap-4 text-[11px]">
          <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <Server className="w-3.5 h-3.5 text-emerald-400" />
            <span>Server Online</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <Database className="w-3.5 h-3.5 text-sky-400" />
            <span>Database Connected</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400 hidden sm:flex">
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Last Sync: Just now</span>
          </div>
        </div>

        {/* Right: Storage & Version */}
        <div className="flex items-center gap-5 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
            <span>Storage: <strong>42.8 GB / 500 GB</strong></span>
          </div>

          <div className="flex items-center gap-1 px-2 py-0.5 bg-slate-900 border border-slate-800 rounded font-mono text-slate-300">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>SchoolOS v4.2.8 Enterprise</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
