import React from 'react';
import {
  Users,
  UserCheck,
  DollarSign,
  GraduationCap,
  Bus,
  Utensils,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
} from 'lucide-react';
import { SchoolKPI } from '../types';

interface SchoolKPIsProps {
  kpis: SchoolKPI[];
  onSelectKPI?: (kpi: SchoolKPI) => void;
}

export const SchoolKPIs: React.FC<SchoolKPIsProps> = ({ kpis, onSelectKPI }) => {
  const getKPIIcon = (iconName: string) => {
    switch (iconName) {
      case 'Users':
        return <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'UserCheck':
        return <UserCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />;
      case 'DollarSign':
        return <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
      case 'Bus':
        return <Bus className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      default:
        return <Utensils className="w-5 h-5 text-orange-600 dark:text-orange-400" />;
    }
  };

  return (
    <section className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              School Key Performance Indicators (KPIs)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Real-time operational, financial, academic and attendance health metrics
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          6 Active KPIs
        </span>
      </div>

      {/* Grid of KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {kpis.map((kpi) => {
          return (
            <div
              key={kpi.id}
              onClick={() => onSelectKPI && onSelectKPI(kpi)}
              className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer shadow-2xs group"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xs">
                  {getKPIIcon(kpi.icon)}
                </div>
                <div className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  <ArrowUpRight className="w-3 h-3" />
                  <span>{kpi.change}</span>
                </div>
              </div>

              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block truncate">
                {kpi.label}
              </span>

              <div className="mt-1">
                <span className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  {kpi.value}
                </span>
                {kpi.unit && (
                  <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                    {kpi.unit}
                  </p>
                )}
              </div>

              {/* Sparkline Visual */}
              <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
                <span>Target: {kpi.target || 'N/A'}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold group-hover:underline">
                  View →
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
