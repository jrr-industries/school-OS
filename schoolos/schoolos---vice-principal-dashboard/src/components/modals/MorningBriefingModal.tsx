import React, { useState } from 'react';
import { Sparkles, X, Printer, Send, FileText, CheckCircle2, Clock, AlertTriangle, Users, BookOpen } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSendAnnouncement?: (text: string) => void;
}

export const MorningBriefingModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-100">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-amber-500/20 to-yellow-500/20 border border-amber-500/30 rounded-xl text-amber-400">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white tracking-tight">AI Executive Morning Briefing</h3>
                <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                  Live Operations
                </span>
              </div>
              <p className="text-xs text-slate-400">Generated for Mr. David Miller • Vice Principal • Green Valley Intl School</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Loading overlay if regenerating */}
        {isGenerating ? (
          <div className="py-16 text-center space-y-4">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm text-slate-300 font-medium">Synthesizing real-time operational data across campus...</p>
          </div>
        ) : (
          /* Briefing Content */
          <div className="space-y-6 text-sm">
            
            {/* Top Summary Box */}
            <div className="p-4 bg-slate-800/60 border border-slate-700/60 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Date: Wednesday, 22 July 2026</span>
                <span>Time: 10:15 AM (Period 4)</span>
              </div>
              <p className="text-slate-200 leading-relaxed font-medium">
                Campus operations are <span className="text-emerald-400 font-semibold">96.8% nominal</span>. Morning assembly concluded smoothly. 70 out of 72 scheduled classes are currently running. Priority focus for VP office today includes 1 substitute assignment and monitoring Bus #5 delay communications.
              </p>
            </div>

            {/* Grid Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Staffing & Substitutes */}
              <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center gap-2 font-semibold text-slate-200">
                  <Users className="w-4 h-4 text-sky-400" />
                  <span>Faculty & Substitutes</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span><strong>108 / 115</strong> Teachers present (93.9%).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                    <span>Dr. Robert Harrison (Physics) absent. <strong>Period 3 & 4 requires substitute.</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span>2 Teacher leaves covered smoothly by free period staff.</span>
                  </li>
                </ul>
              </div>

              {/* Student Attendance & Discipline */}
              <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center gap-2 font-semibold text-slate-200">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>Student Gate & Discipline</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span><strong>1,842 / 1,900</strong> Students present (96.9%).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                    <span><strong>28 Late Arrivals</strong> logged at Gate A (Traffic & weather).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
                    <span>1 Active discipline review (Grade 8 Math disruption).</span>
                  </li>
                </ul>
              </div>

              {/* Transportation & Facilities */}
              <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center gap-2 font-semibold text-slate-200">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Transportation & Facilities</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
                    <span><strong>Bus #5 delayed 25 mins</strong> due to highway accident (Parents notified).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span>64 / 64 CCTV cameras & RFID gates fully operational.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span>Cafeteria lunch preparation on schedule for 11:45 AM.</span>
                  </li>
                </ul>
              </div>

              {/* Academic & Mid-Term Exams */}
              <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center gap-2 font-semibold text-slate-200">
                  <BookOpen className="w-4 h-4 text-purple-400" />
                  <span>Academic & Mid-Term Prep</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span>68 of 72 classes submitted Period 1 attendance.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span>Mid-Term Exam invigilation roster 100% assigned.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span>4 VP classroom observations scheduled for today.</span>
                  </li>
                </ul>
              </div>

            </div>

            {/* VP Action Plan */}
            <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-2">
              <h4 className="font-semibold text-emerald-300 text-xs uppercase tracking-wider">Recommended Action Steps For Vice Principal</h4>
              <ol className="list-decimal list-inside space-y-1 text-xs text-slate-300">
                <li>Assign Mr. Alan Turing or Ms. Sarah Connor to cover Period 4 AP Physics (Room 204).</li>
                <li>Send missing attendance reminder to 4 teachers (Math 9B, History 10A, Art 7C, Bio 11C).</li>
                <li>Conduct Period 5 observation in Chemistry Lab B (Dr. Evelyn Reed).</li>
              </ol>
            </div>

          </div>
        )}

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 mt-6 border-t border-slate-800">
          <button
            onClick={handleRegenerate}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Refresh Operational Synthesis
          </button>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shadow-lg shadow-emerald-500/20"
            >
              <FileText className="w-3.5 h-3.5" />
              {copied ? 'Copied to Clipboard!' : 'Copy Executive Briefing'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
