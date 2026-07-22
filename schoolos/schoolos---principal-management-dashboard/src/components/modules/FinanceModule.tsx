import React, { useState } from 'react';
import {
  DollarSign,
  Lock,
  TrendingUp,
  PieChart,
  FileSpreadsheet,
  Award,
  Calendar,
  ShieldCheck,
  AlertCircle,
  FileText,
  Download,
} from 'lucide-react';

export const FinanceModule: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<string>('Dashboard');

  const subTabs = [
    { id: 'Dashboard', label: 'Financial Overview' },
    { id: 'FeeCollection', label: 'Term Fee Collection' },
    { id: 'PendingFees', label: 'Pending Dues & Defaulters', badge: 14 },
    { id: 'Revenue', label: 'Monthly Revenue Stream' },
    { id: 'Scholarships', label: 'Need & Merit Scholarships' },
    { id: 'Reports', label: 'Financial Audit Reports' },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Subtabs */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                School Financial Intelligence
                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-extrabold flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-500" /> Read-Only Executive Mode
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Principal read-only financial audit monitor. Ledger entries, fee structures & accounting books are locked for editing.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('Downloading Board Financial Summary PDF')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-extrabold text-xs shadow-sm flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Export Board Statement
            </button>
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
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
              {tab.badge && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-950">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Term 1 Collected</span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">$1,240,000</p>
          <span className="text-[10px] font-bold text-emerald-500">92.5% of $1.34M Goal</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Pending Dues</span>
          <p className="text-2xl font-black text-amber-500">$100,000</p>
          <span className="text-[10px] font-bold text-amber-600">14 Outstanding Invoices</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Scholarships Granted</span>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">$85,000</p>
          <span className="text-[10px] font-bold text-slate-400">42 Merit & Need Recipients</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Monthly Operating Expense</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white">$310,000</p>
          <span className="text-[10px] font-bold text-teal-500">Payroll & Campus Utility</span>
        </div>
      </div>

      {/* Read-Only Notice Box */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200 font-medium">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Read-Only Governance Protection:</strong> Principal level accounts possess full auditing and reporting visibility, but cannot post journal entries or alter student fee concessions directly. Contact Chief Financial Officer for ledger adjustments.
          </span>
        </div>
      </div>
    </div>
  );
};
