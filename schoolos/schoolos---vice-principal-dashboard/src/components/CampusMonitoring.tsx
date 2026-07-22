import React from 'react';
import {
  Sun,
  ShieldCheck,
  Camera,
  UserCheck,
  DoorClosed,
  Zap,
  Wifi,
  Droplets,
  Bus,
  Utensils,
  CheckCircle2,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { CampusFacility } from '../types';

interface Props {
  facilities: CampusFacility[];
}

export const CampusMonitoring: React.FC<Props> = ({ facilities }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sun': return Sun;
      case 'ShieldCheck': return ShieldCheck;
      case 'Camera': return Camera;
      case 'UserCheck': return UserCheck;
      case 'DoorClosed': return DoorClosed;
      case 'Zap': return Zap;
      case 'Wifi': return Wifi;
      case 'Droplets': return Droplets;
      case 'Bus': return Bus;
      case 'Utensils': return Utensils;
      default: return CheckCircle2;
    }
  };

  return (
    <section id="discipline" className="space-y-4 scroll-mt-20">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Campus Monitoring & Operations</span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
              Facilities Telemetry
            </span>
          </h3>
          <p className="text-xs text-slate-400">Real-time infrastructure, gate security, utilities, CCTV, and transportation status</p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {facilities.map((fac) => {
          const IconComp = getIcon(fac.iconName);

          return (
            <div
              key={fac.id}
              className={`p-4 rounded-2xl border backdrop-blur-md shadow-xl flex flex-col justify-between space-y-3 transition-all hover:scale-[1.02] ${
                fac.isOperational
                  ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  : 'bg-rose-950/20 border-rose-500/40 hover:border-rose-500'
              }`}
            >
              
              {/* Icon & Status Pill */}
              <div className="flex items-start justify-between">
                <div className={`p-2 rounded-xl border ${
                  fac.isOperational
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                    : 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                }`}>
                  <IconComp className="w-4 h-4" />
                </div>

                <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${
                  fac.isOperational
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}>
                  {fac.isOperational ? 'Nominal' : 'Attention'}
                </span>
              </div>

              {/* Title & Metric */}
              <div>
                <div className="text-xs font-semibold text-slate-400">{fac.name}</div>
                <div className="text-sm font-extrabold text-white mt-0.5 tracking-tight">{fac.statusText}</div>
                {fac.metric && (
                  <div className="text-[11px] font-medium text-sky-400 mt-0.5">{fac.metric}</div>
                )}
              </div>

              {/* Details & Timestamp */}
              <div className="pt-2 border-t border-slate-800/80 space-y-1">
                <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">{fac.details}</p>
                <div className="text-[9px] text-slate-500 font-mono">Checked: {fac.lastChecked}</div>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
};
