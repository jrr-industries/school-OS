import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertCircle,
  UserCheck,
  Megaphone,
  Bell,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  Search,
  Check
} from 'lucide-react';
import { UrgentActionItem, TeacherRecord } from '../types';

interface Props {
  urgentItems: UrgentActionItem[];
  onResolveUrgent: (id: string) => void;
  onOpenSubstituteModal: (teacher?: TeacherRecord) => void;
  onOpenAnnouncementModal: () => void;
  onOpenIncidentModal: (item: UrgentActionItem) => void;
}

export const UrgentActionCenter: React.FC<Props> = ({
  urgentItems,
  onResolveUrgent,
  onOpenSubstituteModal,
  onOpenAnnouncementModal,
  onOpenIncidentModal
}) => {
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const activeItems = urgentItems.filter(item => {
    const matchesSeverity = filterSeverity === 'all' || item.severity === filterSeverity;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  const getSeverityStyle = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high':
        return {
          bg: 'bg-red-950/40 border-red-500/40 hover:border-red-500/80',
          badge: 'bg-red-500/20 text-red-400 border-red-500/40',
          dot: 'bg-red-500',
          button: 'bg-red-500 hover:bg-red-400 text-white shadow-red-500/20'
        };
      case 'medium':
        return {
          bg: 'bg-amber-950/40 border-amber-500/40 hover:border-amber-500/80',
          badge: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
          dot: 'bg-amber-500',
          button: 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-amber-500/20'
        };
      case 'low':
      default:
        return {
          bg: 'bg-yellow-950/30 border-yellow-500/30 hover:border-yellow-500/60',
          badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
          dot: 'bg-yellow-400',
          button: 'bg-slate-800 hover:bg-slate-700 text-slate-200'
        };
    }
  };

  const handleActionClick = (item: UrgentActionItem) => {
    if (item.category === 'absence') {
      onOpenSubstituteModal();
    } else if (item.category === 'transport' || item.category === 'attendance') {
      onOpenAnnouncementModal();
    } else if (item.category === 'discipline' || item.category === 'complaint') {
      onOpenIncidentModal(item);
    } else {
      onResolveUrgent(item.id);
    }
  };

  return (
    <section id="urgent-action" className="space-y-4 scroll-mt-20">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gradient-to-r from-red-950/50 via-slate-900 to-slate-900 border border-red-500/30 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-red-500/20 border border-red-500/40 rounded-xl text-red-400 animate-pulse">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-white tracking-tight">URGENT ACTION CENTER</h3>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full uppercase tracking-wider animate-pulse">
                {urgentItems.filter(i => i.status === 'pending').length} Action Required
              </span>
            </div>
            <p className="text-xs text-slate-400">High-priority operational queue for immediate Vice Principal decision-making</p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          
          <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-xl p-0.5 text-xs">
            <button
              onClick={() => setFilterSeverity('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                filterSeverity === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({urgentItems.length})
            </button>
            <button
              onClick={() => setFilterSeverity('high')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                filterSeverity === 'high' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              🔴 High ({urgentItems.filter(i => i.severity === 'high').length})
            </button>
            <button
              onClick={() => setFilterSeverity('medium')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                filterSeverity === 'medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              🟠 Medium ({urgentItems.filter(i => i.severity === 'medium').length})
            </button>
          </div>

        </div>
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeItems.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="text-sm font-bold text-white">All Urgent Action Items Clear!</h4>
            <p className="text-xs text-slate-400">No pending critical operational disruptions flagged for Vice Principal review.</p>
          </div>
        ) : (
          activeItems.map((item) => {
            const style = getSeverityStyle(item.severity);
            const isPending = item.status === 'pending';

            return (
              <div
                key={item.id}
                className={`relative p-5 rounded-2xl border backdrop-blur-md shadow-2xl transition-all duration-300 flex flex-col justify-between space-y-4 ${
                  isPending ? style.bg : 'bg-slate-900/40 border-slate-800 opacity-60'
                }`}
              >
                
                {/* Header tag */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${style.dot} ${isPending ? 'animate-ping' : ''}`}></span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border uppercase tracking-wider ${style.badge}`}>
                      {item.severity} Priority
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" /> {item.timeReported}
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-1.5">
                  <h4 className="text-base font-bold text-white tracking-tight leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                  {item.location && (
                    <div className="text-[11px] font-semibold text-slate-400 pt-1">
                      📍 {item.location}
                    </div>
                  )}
                </div>

                {/* Actions Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                  <span className="text-[11px] font-semibold text-slate-400">
                    Status: {isPending ? '🔴 Action Required' : '🟢 Resolved'}
                  </span>

                  {isPending ? (
                    <button
                      onClick={() => handleActionClick(item)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-all shadow-lg ${style.button}`}
                    >
                      <span>{item.actionText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                      <Check className="w-3.5 h-3.5" /> Action Taken
                    </span>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

    </section>
  );
};
