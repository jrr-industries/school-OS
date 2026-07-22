import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  X,
  Check,
  FileCheck,
  Building,
  UserCheck,
  DollarSign,
  Briefcase,
  History,
} from 'lucide-react';
import { initialApprovals } from '../../data/mockData';
import { PendingApproval } from '../../types';

export const ApprovalCenterModule: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<string>('All');
  const [approvalsList, setApprovalsList] = useState<PendingApproval[]>(initialApprovals);

  const subTabs = [
    { id: 'All', label: 'All Pending (5)', badge: approvalsList.filter(a => a.status === 'Pending').length },
    { id: 'Leave', label: 'Faculty Leave' },
    { id: 'Admission', label: 'Admissions & Transfer' },
    { id: 'Certificates', label: 'Certificates & Transcripts' },
    { id: 'Timetable', label: 'Timetable Revisions' },
    { id: 'Exams', label: 'Exam Schedules' },
    { id: 'Purchases', label: 'Purchase & Procurement' },
    { id: 'History', label: 'Approval History Log' },
  ];

  const handleAction = (id: string, action: 'Approve' | 'Reject') => {
    setApprovalsList(prev =>
      prev.map(item => (item.id === id ? { ...item, status: action === 'Approve' ? 'Approved' : 'Rejected' } : item))
    );
  };

  const pendingItems = approvalsList.filter(a => activeSubTab === 'All' || a.category.toLowerCase().includes(activeSubTab.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Header & Subtabs */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                Executive Approval Center
                <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-bold">
                  {approvalsList.filter(a => a.status === 'Pending').length} Pending Requests
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Principal signature authority for medical leaves, STEM procurement budgets, field trips & student disciplinary sanctions
              </p>
            </div>
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
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-rose-500 text-white">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Approval List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
            Requests Awaiting Executive Sign-Off
          </h3>
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Require Principal Decision</span>
        </div>

        <div className="space-y-3">
          {pendingItems.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                item.status === 'Approved'
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900'
                  : item.status === 'Rejected'
                  ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">{item.title}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                    {item.category}
                  </span>
                  {item.urgency === 'Urgent' || item.urgency === 'High' ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-500 text-white">
                      {item.urgency}
                    </span>
                  ) : null}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300">{item.description}</p>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                  <span>Requested by: <strong>{item.requestedBy.name}</strong> ({item.requestedBy.role})</span>
                  <span>Submitted: {item.date}</span>
                  {item.amount && <span className="font-bold text-emerald-600">${item.amount.toLocaleString()} Budget</span>}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {item.status === 'Pending' ? (
                  <>
                    <button
                      onClick={() => handleAction(item.id, 'Approve')}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" /> Grant Approval
                    </button>
                    <button
                      onClick={() => handleAction(item.id, 'Reject')}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-900 font-bold text-xs flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" /> Reject
                    </button>
                  </>
                ) : (
                  <span className={`px-3 py-1 rounded-xl text-xs font-bold ${
                    item.status === 'Approved' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}>
                    {item.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
