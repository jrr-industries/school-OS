import React, { useState } from 'react';
import {
  Plus,
  Megaphone,
  AlertTriangle,
  Calendar,
  Printer,
  Sparkles,
  X,
} from 'lucide-react';

interface FloatingActionsProps {
  onTriggerAction: (actionName: string) => void;
  onOpenAIBriefing: () => void;
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({
  onTriggerAction,
  onOpenAIBriefing,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end space-y-2">
      {open && (
        <div className="flex flex-col items-end space-y-2 mb-2 animate-fade-in">
          <button
            onClick={() => {
              onTriggerAction('Create Campus Announcement');
              setOpen(false);
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-xs shadow-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
          >
            <Megaphone className="w-4 h-4 text-emerald-500" /> + Announcement
          </button>

          <button
            onClick={() => {
              onTriggerAction('Trigger Emergency Broadcast');
              setOpen(false);
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs shadow-lg hover:bg-rose-500 transition-all"
          >
            <AlertTriangle className="w-4 h-4 text-amber-300" /> + Emergency Alert
          </button>

          <button
            onClick={() => {
              onTriggerAction('Schedule Principal Meeting');
              setOpen(false);
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-xs shadow-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
          >
            <Calendar className="w-4 h-4 text-indigo-500" /> + Schedule Meeting
          </button>

          <button
            onClick={() => {
              onTriggerAction('Export SchoolOS Board Report');
              setOpen(false);
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-xs shadow-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
          >
            <Printer className="w-4 h-4 text-teal-500" /> + Export Report
          </button>

          <button
            onClick={() => {
              onOpenAIBriefing();
              setOpen(false);
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-lg hover:bg-emerald-500 transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-300" /> + AI Intelligence Report
          </button>
        </div>
      )}

      {/* Main Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        className={`w-12 h-12 rounded-full shadow-2xl flex items-center justify-center text-white font-black transition-all transform active:scale-95 ${
          open ? 'bg-slate-800 rotate-45' : 'bg-emerald-600 hover:bg-emerald-500'
        }`}
        title="Quick Command Menu"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};
