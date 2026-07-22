import React from 'react';
import { 
  Sunrise, 
  Utensils, 
  Coffee, 
  Activity, 
  Sparkles, 
  PieChart, 
  CheckCircle2, 
  Soup, 
  ShieldCheck, 
  CalendarX,
  Info
} from 'lucide-react';
import { CafeteriaData } from '../types';

interface MenuWidgetProps {
  data: CafeteriaData;
  isCompact?: boolean;
}

export const MenuWidget: React.FC<MenuWidgetProps> = ({ data, isCompact = false }) => {
  const { isPublished, categories, stats, dateString } = data;

  // Helper function to return icon for specific meal items
  const getItemIcon = (itemName: string) => {
    const lower = itemName.toLowerCase();
    if (lower.includes('idli') || lower.includes('sambar')) {
      return <Soup className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
    }
    if (lower.includes('rice')) {
      return <Utensils className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
    }
    if (lower.includes('dal') || lower.includes('curry')) {
      return <Soup className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
    }
    if (lower.includes('curd')) {
      return <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
    }
    if (lower.includes('banana') || lower.includes('fruit')) {
      return <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
    }
    if (lower.includes('milk')) {
      return <Coffee className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
    }
    return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
  };

  // Helper for category headers
  const getCategoryHeaderIcon = (title: string) => {
    switch (title.toLowerCase()) {
      case 'breakfast':
        return <Sunrise className="w-4 h-4 text-emerald-400" />;
      case 'lunch':
        return <Utensils className="w-4 h-4 text-emerald-400" />;
      case 'snacks':
        return <Coffee className="w-4 h-4 text-emerald-400" />;
      default:
        return <Utensils className="w-4 h-4 text-emerald-400" />;
    }
  };

  const mealsServedPercentage = Math.round((stats.mealsServed / stats.mealsTotal) * 100);

  return (
    <div 
      id="schoolos-cafeteria-menu-card"
      className="w-full max-w-md mx-auto bg-slate-900/90 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-5 md:p-6 shadow-2xl shadow-emerald-950/20 text-slate-100 font-sans transition-all duration-300 relative overflow-hidden group hover:border-emerald-500/30"
    >
      {/* Subtle background ambient glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Widget Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 shadow-sm">
            <span className="text-xl leading-none">🍽️</span>
          </div>
          <div>
            <h2 id="menu-widget-title" className="text-lg font-bold text-slate-100 tracking-tight flex items-center gap-2">
              Today's Menu
            </h2>
            <p className="text-xs text-slate-400 font-medium">{dateString}</p>
          </div>
        </div>

        {/* Read-Only Badge */}
        <span 
          id="read-only-badge" 
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-800/90 text-slate-300 border border-slate-700/60"
        >
          <Info className="w-3 h-3 text-emerald-400" />
          View Only
        </span>
      </div>

      {/* Main Content Area */}
      {!isPublished ? (
        /* Empty State: "No menu published for today." */
        <div 
          id="no-menu-published-container"
          className="py-10 px-4 text-center my-2 rounded-xl bg-slate-950/40 border border-slate-800/60 flex flex-col items-center justify-center gap-3"
        >
          <div className="p-3 bg-slate-800/60 rounded-full text-slate-400 border border-slate-700/50">
            <CalendarX className="w-6 h-6 text-slate-400" />
          </div>
          <div>
            <p id="no-menu-published-text" className="text-slate-200 font-semibold text-sm">
              No menu published for today.
            </p>
            <p className="text-slate-400 text-xs mt-1 max-w-xs">
              Please check back later or contact the SchoolOS cafeteria administration.
            </p>
          </div>
        </div>
      ) : (
        /* Published Menu Items List */
        <div id="menu-categories-list" className="space-y-4 mb-6">
          {categories.map((cat) => (
            <div 
              key={cat.title} 
              id={`meal-category-${cat.title.toLowerCase()}`}
              className="bg-slate-950/50 rounded-xl p-3.5 border border-slate-800/60 hover:border-slate-700/80 transition-colors"
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {getCategoryHeaderIcon(cat.title)}
                  </div>
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    {cat.title}
                  </h3>
                </div>
                <span className="text-[11px] font-medium text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-800">
                  {cat.timeSlot}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-1">
                {cat.items.map((item, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center gap-2 py-1 px-2 rounded-lg bg-slate-900/60 border border-slate-800/40 text-slate-200 text-xs font-medium"
                  >
                    {getItemIcon(item)}
                    <span className="truncate">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Footer Section - Metrics & Kitchen Status */}
      <div 
        id="cafeteria-metrics-footer"
        className="pt-4 border-t border-slate-800/80 space-y-3"
      >
        {/* Status Pills Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Meals Served Today */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-[11px] font-medium mb-1">
              <span className="flex items-center gap-1">
                <Utensils className="w-3 h-3 text-emerald-400" />
                Meals Served
              </span>
              <span className="text-emerald-400 font-semibold">{mealsServedPercentage}%</span>
            </div>
            <div className="text-slate-100 font-bold text-sm tracking-tight">
              {stats.mealsServed.toLocaleString()} / {stats.mealsTotal.toLocaleString()}
            </div>
            {/* Visual Mini Progress Bar */}
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500" 
                style={{ width: `${mealsServedPercentage}%` }}
              />
            </div>
          </div>

          {/* Nutrition Score */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-[11px] font-medium mb-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Nutrition Score
              </span>
              <span className="text-emerald-400 text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded font-semibold border border-emerald-500/20">
                Grade A+
              </span>
            </div>
            <div className="text-slate-100 font-bold text-sm tracking-tight flex items-baseline gap-1">
              <span>{stats.nutritionScore}%</span>
              <span className="text-[10px] text-slate-400 font-normal">Optimal</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${stats.nutritionScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Kitchen Status Pill */}
        <div 
          id="kitchen-status-pill"
          className="w-full bg-slate-950/80 border border-emerald-500/20 rounded-xl px-3.5 py-2.5 flex items-center justify-between text-xs font-semibold text-slate-200"
        >
          <span className="text-slate-400 text-[11px]">Kitchen Status</span>
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span>🟢 {stats.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
