import React, { useState } from 'react';
import {
  Utensils,
  Calendar,
  CheckCircle2,
  Users,
  Flame,
  PackageCheck,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';
import { todayLunchMenu } from '../../data/mockData';

export const LunchModule: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<string>('Dashboard');

  const subTabs = [
    { id: 'Dashboard', label: 'Lunch Dashboard' },
    { id: 'Menu', label: "Today's Special Menu" },
    { id: 'Attendance', label: 'Cafeteria Turnout' },
    { id: 'Kitchen', label: 'Kitchen & Safety Hygiene' },
    { id: 'Nutrition', label: 'Caloric & Nutrition Report' },
    { id: 'Inventory', label: 'Perishable Pantry Inventory' },
    { id: 'Reports', label: 'Cafeteria Reports' },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Subtabs */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                School Lunch & Cafeteria Program
                <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-bold">
                  1,840 Meals Served Today
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Nutritional balance audits, allergy warnings, cafeteria headcount, kitchen safety standards & pantry inventory
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Dietary Compliance:</span>
            <span className="px-3 py-1 rounded-xl bg-emerald-500 text-slate-950 font-black text-sm shadow-xs">
              100% Organic & Nut-Free
            </span>
          </div>
        </div>

        {/* Subtabs bar */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
          {subTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeSubTab === tab.id
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content View */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
            Today's Fresh Culinary Menu (Wednesday, July 22)
          </h3>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">4 Balanced Meal Options</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {todayLunchMenu.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 uppercase">
                  {item.category}
                </span>
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                  {item.calories} kcal
                </span>
              </div>

              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{item.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Allergens: {item.allergens.join(', ')}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Served Count:</span>
                <span className="font-black text-slate-900 dark:text-white">{item.servedCount} Meals</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
