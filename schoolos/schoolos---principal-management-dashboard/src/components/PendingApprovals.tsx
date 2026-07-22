import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  Filter,
  DollarSign,
  UserCheck,
  Building,
  ShieldAlert,
  ChevronRight,
  Info,
} from 'lucide-react';
import { PendingApproval, ApprovalCategory } from '../types';

interface PendingApprovalsProps {
  approvals: PendingApproval[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onRequestInfo: (id: string) => void;
}

export const PendingApprovals: React.FC<PendingApprovalsProps> = ({
  approvals,
  onApprove,
  onReject,
  onRequestInfo,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalItem, setActiveModalItem] = useState<PendingApproval | null>(null);

  const categories: string[] = ['All', 'Leave', 'Budget', 'Event', 'Discipline', 'Hiring'];

  const filteredApprovals = approvals.filter((item) => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  });

  const getUrgencyBadge = (urgency: PendingApproval['urgency']) => {
    switch (urgency) {
      case 'Urgent':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-300 dark:border-rose-800';
      case 'High':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      case 'Medium':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-300 dark:border-blue-800';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700';
    }
  };

  return (
    <section className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Pending Approvals Hub
              <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-extrabold text-xs">
                {approvals.filter((a) => a.status === 'Pending').length}
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Executive authorization required for staff leave, budgets, events & discipline
            </p>
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count =
              cat === 'All'
                ? approvals.length
                : approvals.filter((a) => a.category === cat).length;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Approvals Grid */}
      {filteredApprovals.length === 0 ? (
        <div className="text-center py-8 text-slate-500 dark:text-slate-400 text-xs">
          No pending approvals found under category "{selectedCategory}".
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredApprovals.map((item) => {
            const isPending = item.status === 'Pending';

            return (
              <div
                key={item.id}
                className={`rounded-xl border p-4 transition-all flex flex-col justify-between ${
                  isPending
                    ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md'
                    : item.status === 'Approved'
                    ? 'border-emerald-200 dark:border-emerald-950 bg-emerald-50/30 dark:bg-emerald-950/20'
                    : 'border-rose-200 dark:border-rose-950 bg-rose-50/30 dark:bg-rose-950/20'
                }`}
              >
                <div>
                  {/* Top Meta Line */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      {item.id} • {item.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getUrgencyBadge(
                        item.urgency
                      )}`}
                    >
                      {item.urgency}
                    </span>
                  </div>

                  {/* Title & Amount */}
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 leading-snug">
                    {item.title}
                  </h3>

                  {item.amount && (
                    <div className="mt-1 flex items-center gap-1 font-extrabold text-sm text-emerald-600 dark:text-emerald-400">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>{item.amount.toLocaleString()}</span>
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Requester Profile */}
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
                    <img
                      src={item.requestedBy.avatar}
                      alt={item.requestedBy.name}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                      referrerPolicy="no-referrer"
                    />
                    <div className="text-xs truncate">
                      <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {item.requestedBy.name}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                        {item.requestedBy.role}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setActiveModalItem(item)}
                    className="text-[11px] font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center gap-1"
                  >
                    <Info className="w-3.5 h-3.5" /> Details
                  </button>

                  {isPending ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onReject(item.id)}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 border border-transparent hover:border-rose-200 transition-colors"
                        title="Reject Request"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onApprove(item.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm flex items-center gap-1 transition-all"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                      </button>
                    </div>
                  ) : (
                    <span
                      className={`text-xs font-extrabold px-2.5 py-1 rounded-md ${
                        item.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {item.status}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Approval Item Review • {activeModalItem.id}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  {activeModalItem.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalItem(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                {activeModalItem.description}
              </p>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-700">
                <div>
                  <span className="text-slate-400">Department:</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    {activeModalItem.department || 'General'}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Urgency:</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    {activeModalItem.urgency}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  onRequestInfo(activeModalItem.id);
                  setActiveModalItem(null);
                }}
                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
              >
                Request Clarification
              </button>
              <button
                onClick={() => {
                  onReject(activeModalItem.id);
                  setActiveModalItem(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
              >
                Reject
              </button>
              <button
                onClick={() => {
                  onApprove(activeModalItem.id);
                  setActiveModalItem(null);
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md"
              >
                Authorize & Sign
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
