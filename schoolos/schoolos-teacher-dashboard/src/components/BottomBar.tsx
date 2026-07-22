import React from "react";
import { Server, RefreshCw, HardDrive, Cpu } from "lucide-react";

export const BottomBar: React.FC = () => {
  return (
    <footer className="mt-8 border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-4 py-3 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-4 font-mono">
      <div className="flex items-center gap-4">
        {/* Server Status */}
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <Server size={13} className="text-slate-500" />
          <span>
            Server Status: <strong className="text-emerald-400">Online (Cloud Engine v4.2)</strong>
          </span>
        </div>

        {/* Last Sync */}
        <div className="hidden sm:flex items-center gap-1.5 border-l border-slate-800 pl-4">
          <RefreshCw size={13} className="text-slate-500" />
          <span>
            Last Sync: <strong className="text-slate-200">10s ago</strong>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Storage */}
        <div className="flex items-center gap-1.5">
          <HardDrive size={13} className="text-slate-500" />
          <span>
            Storage: <strong className="text-cyan-400">1.2 GB / 10 GB</strong>
          </span>
        </div>

        {/* SchoolOS Version */}
        <div className="border-l border-slate-800 pl-4 flex items-center gap-1.5">
          <Cpu size={13} className="text-emerald-400" />
          <span>
            SchoolOS Version: <strong className="text-slate-200">v2026.4.1 Enterprise</strong>
          </span>
        </div>
      </div>
    </footer>
  );
};
