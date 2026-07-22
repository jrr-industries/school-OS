import React from 'react';
import {
  FileCheck2,
  Lock,
  UserCheck,
  Building,
  FileSpreadsheet,
  AlertOctagon,
  CheckCircle2,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { ExamOperationData } from '../types';

interface Props {
  examData: ExamOperationData;
}

export const ExaminationOperations: React.FC<Props> = ({ examData }) => {
  return (
    <section id="examinations" className="space-y-4 scroll-mt-20">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Examination Operations</span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full">
              Mid-Term Season Prep
            </span>
          </h3>
          <p className="text-xs text-slate-400">Exam hall readiness, invigilation rosters, seating plans, and question paper vault lock</p>
        </div>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        
        {/* Card 1: Upcoming Exams */}
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Upcoming Exams</span>
            <div className="p-1.5 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-400">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">{examData.upcomingExamsCount} Active</div>
          <div className="text-[11px] text-purple-300 font-medium">{examData.nextExamDate}</div>
        </div>

        {/* Card 2: Invigilators Assigned */}
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Invigilators Assigned</span>
            <div className="p-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-400">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">{examData.invigilatorsAssigned}</div>
          <div className="text-[11px] text-emerald-400 font-medium">100% Roster Complete</div>
        </div>

        {/* Card 3: Exam Rooms Ready */}
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Exam Rooms Ready</span>
            <div className="p-1.5 bg-sky-500/20 border border-sky-500/30 rounded-lg text-sky-400">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">{examData.examRoomsReady}</div>
          <div className="text-[11px] text-sky-300 font-medium">Desks & Audio Ready</div>
        </div>

        {/* Card 4: Pending Seating Plans */}
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Pending Seating Plans</span>
            <div className="p-1.5 bg-amber-500/20 border border-amber-500/30 rounded-lg text-amber-400">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">{examData.pendingSeatingPlans} Pending</div>
          <div className="text-[11px] text-emerald-400 font-medium">All Approved</div>
        </div>

        {/* Card 5: Malpractice Reports */}
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Malpractice Reports</span>
            <div className="p-1.5 bg-rose-500/20 border border-rose-500/30 rounded-lg text-rose-400">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400 tracking-tight">0 Today</div>
          <div className="text-[11px] text-slate-400 font-medium">100% Integrity Logged</div>
        </div>

        {/* Card 6: Question Paper Status */}
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Question Paper Vault</span>
            <div className="p-1.5 bg-teal-500/20 border border-teal-500/30 rounded-lg text-teal-400">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-base font-extrabold text-teal-300 tracking-tight leading-tight mt-1">{examData.questionPaperStatus}</div>
          <div className="text-[10px] text-teal-400 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Biometric Safe Sealed
          </div>
        </div>

      </div>

    </section>
  );
};
