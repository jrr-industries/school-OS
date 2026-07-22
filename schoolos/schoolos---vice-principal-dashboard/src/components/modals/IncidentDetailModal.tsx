import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle, FileText, UserCheck, MessageSquare } from 'lucide-react';
import { UrgentActionItem } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  item: UrgentActionItem | null;
  onResolve: (id: string) => void;
}

export const IncidentDetailModal: React.FC<Props> = ({ isOpen, onClose, item, onResolve }) => {
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [resolvedSuccess, setResolvedSuccess] = useState(false);

  if (!isOpen || !item) return null;

  const handleConfirmResolve = (e: React.FormEvent) => {
    e.preventDefault();
    onResolve(item.id);
    setResolvedSuccess(true);
    setTimeout(() => {
      setResolvedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-100">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 border border-amber-500/30 rounded-xl text-amber-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Incident Review & Action Log</h3>
              <p className="text-xs text-slate-400">Vice Principal administrative case resolution</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {resolvedSuccess ? (
          <div className="py-10 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-base font-semibold text-white">Incident Action Logged & Resolved!</h4>
            <p className="text-xs text-slate-400">Case archived in SchoolOS discipline log and status notified to relevant faculty.</p>
          </div>
        ) : (
          <form onSubmit={handleConfirmResolve} className="space-y-4">
            
            {/* Case Overview */}
            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">{item.category} Case</span>
                <span className="text-[10px] text-slate-400">{item.timeReported}</span>
              </div>
              <h4 className="text-sm font-bold text-white">{item.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
              {item.location && (
                <div className="text-[11px] font-semibold text-slate-400">📍 Location: {item.location}</div>
              )}
            </div>

            {/* Resolution Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Vice Principal Action / Administrative Decision
              </label>
              <textarea
                required
                rows={3}
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="e.g., Conducted administrative meeting with student & counselor. Issued formal warning and contacted parent."
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-lg shadow-amber-500/20"
              >
                Confirm Resolution
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
