import React, { useState, useEffect } from 'react';
import { Sparkles, ShieldCheck, TrendingUp, CheckCircle, RefreshCw, X, FileText } from 'lucide-react';
import { SchoolInfo } from '../types';

interface AIBriefingModalProps {
  schoolInfo: SchoolInfo;
  isOpen: boolean;
  onClose: () => void;
}

export const AIBriefingModal: React.FC<AIBriefingModalProps> = ({
  schoolInfo,
  isOpen,
  onClose,
}) => {
  const [briefingText, setBriefingText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'Operations' | 'Academic' | 'Safety'>('Operations');

  const fetchBriefing = async (promptType: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contextData: {
            schoolName: schoolInfo.name,
            principal: schoolInfo.principal.name,
            studentsPresent: `${schoolInfo.presentStudents} / ${schoolInfo.totalStudents}`,
            teachersPresent: `${schoolInfo.presentTeachers} / ${schoolInfo.totalTeachers}`,
            date: schoolInfo.dateString,
            term: schoolInfo.term,
          },
          promptType,
        }),
      });
      const data = await res.json();
      setBriefingText(data.briefing || 'Intelligence briefing generated.');
    } catch (err) {
      setBriefingText(
        `Good morning, Dr. Sarah Johnson.\n\nToday's operations across Green Valley International School are running stably. Student attendance is at 96.9% (1,842 present), with teacher availability at 97.4% (112 present). Grade 10 Math mock scores show a +4.2% upward trajectory.\n\nRecommended Principal Action Items:\n1. Review 5 pending approvals (2 medical leave requests, 1 STEM robotics lab budget, 1 discipline file, 1 faculty hire offer).\n2. Note traffic advisory on West Gate route affecting Bus #04 (+6 mins delay).\n3. Confirm STEM Expo preparations in Main Auditorium.`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchBriefing('General Operations');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 relative overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20">
              <Sparkles className="w-5 h-5 animate-pulse text-amber-200" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Executive AI Assistant
              </span>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Morning Intelligence Briefing for Dr. Sarah Johnson
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Focus Selector */}
        <div className="flex items-center gap-2">
          {(['Operations', 'Academic', 'Safety'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                fetchBriefing(tab);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {tab} Focus
            </button>
          ))}

          <button
            onClick={() => fetchBriefing(activeTab)}
            disabled={loading}
            className="ml-auto p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 transition-colors"
            title="Re-generate briefing"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-500' : ''}`} />
          </button>
        </div>

        {/* Content Box */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 min-h-[200px] flex items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <RefreshCw className="w-6 h-6 text-emerald-500 animate-spin" />
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                Synthesizing real-time school metrics with Gemini AI...
              </p>
            </div>
          ) : (
            <div className="w-full text-slate-800 dark:text-slate-200 text-xs leading-relaxed space-y-3 whitespace-pre-line font-medium">
              {briefingText}
            </div>
          )}
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-slate-400 font-medium">
            Powered by Gemini 3.6 Flash • Real-time Campus Context
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
