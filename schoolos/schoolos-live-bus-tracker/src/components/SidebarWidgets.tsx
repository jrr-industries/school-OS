import React from 'react';
import { SchoolBus } from '../types';

interface SidebarWidgetsProps {
  bus: SchoolBus;
  onCallDriver: () => void;
}

export const SidebarWidgets: React.FC<SidebarWidgetsProps> = ({ bus, onCallDriver }) => {
  return (
    <div className="space-y-5">
      {/* 1. Student Transit Schedule Card */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2 mb-3">
          <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Today's Transit Summary</span>
        </h3>

        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-300">Morning Pickup</div>
              <div className="text-slate-400 text-[11px] mt-0.5">{bus.homeLocation.name}</div>
            </div>
            <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-300 font-mono font-bold">
              8:42 AM
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-300">School Arrival</div>
              <div className="text-slate-400 text-[11px] mt-0.5">{bus.schoolLocation.name}</div>
            </div>
            <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-300 font-mono font-bold">
              9:00 AM
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-300">Afternoon Departure</div>
              <div className="text-slate-400 text-[11px] mt-0.5">Return Home Transit</div>
            </div>
            <span className="px-2 py-1 rounded bg-amber-500/10 text-amber-300 font-mono font-bold">
              3:30 PM
            </span>
          </div>
        </div>
      </div>

      {/* 2. Driver & Vehicle Profile */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2 mb-3">
          <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>Assigned Driver Info</span>
        </h3>

        <div className="flex items-center gap-3.5">
          <img
            src={bus.driverPhoto}
            alt={bus.driverName}
            className="w-12 h-12 rounded-xl object-cover border border-amber-400/50"
          />
          <div>
            <div className="font-bold text-white text-sm">{bus.driverName}</div>
            <div className="text-xs text-slate-400 mt-0.5">Vehicle: <span className="text-slate-200 font-mono">{bus.licensePlate}</span></div>
            <div className="text-[11px] text-amber-400 font-semibold mt-0.5">Rating: ★ {bus.driverRating} / 5.0</div>
          </div>
        </div>

        <button
          onClick={onCallDriver}
          className="w-full mt-4 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <span>📞 Contact Driver Directly</span>
        </button>
      </div>

      {/* 3. School District Transit Notice */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800/80 bg-gradient-to-br from-slate-900/90 to-blue-950/30">
        <div className="flex items-start gap-2.5">
          <span className="text-lg">📢</span>
          <div>
            <h4 className="text-xs font-bold text-slate-200">District Transit Notice</h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Bus 12 is operating on time. Parents are advised to have students at Stop #4 five minutes prior to 8:42 AM.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
