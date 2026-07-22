import React, { useState } from 'react';
import {
  FileText,
  Download,
  BarChart2,
  PieChart,
  Filter,
  CheckCircle2,
  Printer,
  Share2,
} from 'lucide-react';

export const ReportsModule: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<string>('ExportCenter');

  const subTabs = [
    { id: 'Attendance', label: 'Attendance Audit' },
    { id: 'Academic', label: 'Academic & GPA Reports' },
    { id: 'Staff', label: 'Faculty & Staff Reports' },
    { id: 'Finance', label: 'Financial Audit Report' },
    { id: 'Transport', label: 'Transport Fleet Report' },
    { id: 'Lunch', label: 'Cafeteria & Meals Report' },
    { id: 'Inventory', label: 'Asset & Inventory Report' },
    { id: 'ExportCenter', label: 'Export Center (PDF/XLSX)' },
  ];

  const reportPacks = [
    { id: 'REP-01', name: 'Comprehensive Monthly Board Report (July 2026)', category: 'Executive', format: 'PDF & Excel', size: '4.2 MB', generated: 'Today, 6:00 AM' },
    { id: 'REP-02', name: 'Term 1 Academic GPA & Syllabus Progress Matrix', category: 'Academics', format: 'PDF', size: '2.8 MB', generated: 'Yesterday, 4:15 PM' },
    { id: 'REP-03', name: 'Faculty Attendance & Workload Audit', category: 'Staff', format: 'Excel', size: '1.4 MB', generated: '20 July 2026' },
    { id: 'REP-04', name: 'Campus Safety & Transport GPS Log', category: 'Operations', format: 'PDF', size: '3.1 MB', generated: '19 July 2026' },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Subtabs */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                Reports & Institutional Export Center
                <span className="px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-800 dark:text-violet-300 text-xs font-bold">
                  Compliance Ready
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Generate high-resolution executive PDFs, Excel matrices, ministry compliance audits & board decks
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('Generating Custom Multi-Department Report...')}
              className="px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-extrabold text-xs shadow-sm flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Bulk Export Package
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
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Report Packs Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
            Available Executive Report Bundles
          </h3>
          <span className="text-xs font-bold text-violet-600 dark:text-violet-400">Automated Weekly Digests</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportPacks.map((rep) => (
            <div
              key={rep.id}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">{rep.name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-violet-100 dark:bg-violet-950 text-violet-800 dark:text-violet-300">
                    {rep.category}
                  </span>
                </div>
                <p className="text-xs text-slate-400">Format: <strong>{rep.format}</strong> • Size: {rep.size} • Generated: {rep.generated}</p>
              </div>

              <button
                onClick={() => alert(`Downloading ${rep.name}`)}
                className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shrink-0 flex items-center gap-1 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" /> Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
