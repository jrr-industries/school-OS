import React from 'react';
import { SchoolBus } from '../types';

interface DashboardHeaderProps {
  currentBus: SchoolBus;
  availableBuses: SchoolBus[];
  onSelectBus: (bus: SchoolBus) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  currentBus,
  availableBuses,
  onSelectBus,
}) => {
  return (
    <header className="w-full glass-card border-b border-slate-800/90 py-3.5 px-4 md:px-8 mb-6 sticky top-0 z-[1000]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Logo & Portal Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 border border-blue-400/40 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 font-black text-xl">
            S
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold text-white tracking-tight">SchoolOS</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                PARENTS & STUDENTS
              </span>
            </div>
            <p className="text-xs text-slate-400">Oakridge Central School District • Transit Portal</p>
          </div>
        </div>

        {/* Bus Switcher & Student Account Badge */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Child/Bus Selector dropdown */}
          <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 p-1.5 rounded-xl">
            <span className="text-xs font-semibold text-slate-400 pl-2 hidden sm:inline">Assigned Bus:</span>
            <div className="flex items-center gap-1">
              {availableBuses.map((b) => {
                const isSelected = b.id === currentBus.id;
                return (
                  <button
                    key={b.id}
                    onClick={() => onSelectBus(b)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    🚌 {b.busNumber}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Student Avatar Badge */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold text-xs flex items-center justify-center">
              AM
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-slate-100">Alex Mitchell</div>
              <div className="text-[10px] text-slate-400">Grade 8B • Morning Transit</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
