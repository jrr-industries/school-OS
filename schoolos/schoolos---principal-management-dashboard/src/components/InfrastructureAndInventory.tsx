import React from 'react';
import {
  Zap,
  Wifi,
  Video,
  Power,
  Droplets,
  UserPlus,
  PackageCheck,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import {
  infrastructureData,
  admissionSummaryData,
  inventorySummaryData,
  parentEngagementData,
} from '../data/mockData';

export const InfrastructureAndInventory: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* 8. Infrastructure Dashboard */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Infrastructure & Campus Utilities Telemetry
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Real-time monitoring for power grid, high-speed fiber internet, CCTV & water reserves
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> All Systems Nominal
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {infrastructureData.map((item, idx) => {
            const IconComp =
              item.icon === 'Zap'
                ? Zap
                : item.icon === 'Wifi'
                ? Wifi
                : item.icon === 'Video'
                ? Video
                : item.icon === 'Power'
                ? Power
                : Droplets;

            return (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-2 hover:border-emerald-300 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border border-slate-100 dark:border-slate-700">
                    <IconComp className="w-4 h-4" />
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    {item.status}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                    {item.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                    {item.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid for Admissions, Inventory & Parent Engagement */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 9. Admission Overview */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Admissions Overview
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Term 1 Admissions</p>
              </div>
            </div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              228 Applications
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800">
              <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 block">Pending</span>
              <p className="text-xl font-black text-amber-600 dark:text-amber-400 mt-1">
                {admissionSummaryData.pending}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800">
              <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 block">Approved</span>
              <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {admissionSummaryData.approved}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-800">
              <span className="text-[10px] font-bold text-rose-800 dark:text-rose-300 block">Rejected</span>
              <p className="text-xl font-black text-rose-600 dark:text-rose-400 mt-1">
                {admissionSummaryData.rejected}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
              <span className="text-[10px] font-bold text-slate-500 block">Waitlist</span>
              <p className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                {admissionSummaryData.waitingList}
              </p>
            </div>
          </div>
        </div>

        {/* 10. Inventory Overview */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
                <PackageCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Inventory Overview
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Asset & Equipment Audit</p>
              </div>
            </div>
            <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
              4 Asset Hubs
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="font-semibold text-slate-700 dark:text-slate-200">Lab Equipment</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{inventorySummaryData.labEquipment}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="font-semibold text-slate-700 dark:text-slate-200">Library Books</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">{inventorySummaryData.libraryBooks}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="font-semibold text-slate-700 dark:text-slate-200">Sports Gear</span>
              <span className="font-bold text-rose-600 dark:text-rose-400">{inventorySummaryData.sportsEquipment}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="font-semibold text-slate-700 dark:text-slate-200">IT Assets</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{inventorySummaryData.itAssets}</span>
            </div>
          </div>
        </div>

        {/* 12. Parent Engagement */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Parent Engagement
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Portal & App Metrics</p>
              </div>
            </div>
            <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
              96% Adoption
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-1">
              <div className="flex justify-between font-bold">
                <span className="text-slate-700 dark:text-slate-200">Parent App Active Rate</span>
                <span className="text-emerald-600 dark:text-emerald-400">{parentEngagementData.appActivePct}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${parentEngagementData.appActivePct}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 font-bold block">Unread Circulars</span>
                <p className="text-lg font-black text-amber-600 dark:text-amber-400 mt-0.5">
                  {parentEngagementData.unreadNotices}
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 font-bold block">Meetings Set</span>
                <p className="text-lg font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
                  {parentEngagementData.meetingsScheduled}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
