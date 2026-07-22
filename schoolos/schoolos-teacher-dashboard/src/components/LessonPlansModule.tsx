import React, { useState } from "react";
import { LessonPlan } from "../types";
import {
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  FileCheck,
  PlusCircle,
  ExternalLink,
  Sparkles,
} from "lucide-react";

interface LessonPlansModuleProps {
  lessonPlans: LessonPlan[];
  onCreateLessonPlan: () => void;
}

export const LessonPlansModule: React.FC<LessonPlansModuleProps> = ({
  lessonPlans,
  onCreateLessonPlan,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<LessonPlan | null>(
    lessonPlans[0]
  );

  const todayPlans = lessonPlans.filter((p) => p.status === "Today");
  const upcomingPlans = lessonPlans.filter((p) => p.status === "Upcoming");
  const completedPlans = lessonPlans.filter((p) => p.status === "Completed");
  const pendingPlans = lessonPlans.filter((p) => p.status === "Pending Review");

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-2xl">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <BookOpen size={20} className="text-emerald-400" />
            Curriculum & Lesson Plans Repository
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Organize daily teaching units, learning outcomes, and classroom slides.
          </p>
        </div>

        <button
          onClick={onCreateLessonPlan}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-950/50 transition active:scale-95"
        >
          <PlusCircle size={16} />
          Create New Lesson Plan
        </button>
      </div>

      {/* Grid of 4 Categorized Columns (Section 5 Requirement) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Today's Lessons */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/30 shadow-lg space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="font-bold text-xs text-emerald-400 flex items-center gap-1.5">
              <Clock size={14} /> Today's Lessons
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
              {todayPlans.length}
            </span>
          </div>
          <div className="space-y-2">
            {todayPlans.map((lp) => (
              <div
                key={lp.id}
                onClick={() => setSelectedPlan(lp)}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition ${
                  selectedPlan?.id === lp.id
                    ? "bg-emerald-500/15 border-emerald-500/50 text-slate-100 shadow-md"
                    : "bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300"
                }`}
              >
                <div className="font-bold">{lp.title}</div>
                <div className="text-[10px] text-slate-400 mt-1">
                  {lp.className} • {lp.duration}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Lessons */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-lg space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="font-bold text-xs text-cyan-400 flex items-center gap-1.5">
              <Calendar size={14} /> Upcoming Lessons
            </span>
            <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">
              {upcomingPlans.length}
            </span>
          </div>
          <div className="space-y-2">
            {upcomingPlans.map((lp) => (
              <div
                key={lp.id}
                onClick={() => setSelectedPlan(lp)}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition ${
                  selectedPlan?.id === lp.id
                    ? "bg-cyan-500/15 border-cyan-500/50 text-slate-100 shadow-md"
                    : "bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300"
                }`}
              >
                <div className="font-bold">{lp.title}</div>
                <div className="text-[10px] text-slate-400 mt-1">
                  {lp.className} • {lp.date}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Completed Lessons */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-lg space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="font-bold text-xs text-indigo-400 flex items-center gap-1.5">
              <CheckCircle2 size={14} /> Completed Lessons
            </span>
            <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
              {completedPlans.length}
            </span>
          </div>
          <div className="space-y-2">
            {completedPlans.map((lp) => (
              <div
                key={lp.id}
                onClick={() => setSelectedPlan(lp)}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition ${
                  selectedPlan?.id === lp.id
                    ? "bg-indigo-500/15 border-indigo-500/50 text-slate-100 shadow-md"
                    : "bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300"
                }`}
              >
                <div className="font-bold">{lp.title}</div>
                <div className="text-[10px] text-slate-400 mt-1">
                  {lp.className} • {lp.date}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Review Lessons */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-lg space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="font-bold text-xs text-amber-400 flex items-center gap-1.5">
              <FileCheck size={14} /> Pending Approval
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
              {pendingPlans.length}
            </span>
          </div>
          <div className="space-y-2">
            {pendingPlans.map((lp) => (
              <div
                key={lp.id}
                onClick={() => setSelectedPlan(lp)}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition ${
                  selectedPlan?.id === lp.id
                    ? "bg-amber-500/15 border-amber-500/50 text-slate-100 shadow-md"
                    : "bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300"
                }`}
              >
                <div className="font-bold">{lp.title}</div>
                <div className="text-[10px] text-slate-400 mt-1">
                  {lp.className} • {lp.subject}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Lesson Detail Viewer */}
      {selectedPlan && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                {selectedPlan.className} • {selectedPlan.subject}
              </span>
              <h3 className="text-base font-bold text-slate-100 mt-1">
                {selectedPlan.title}
              </h3>
            </div>
            <div className="text-xs text-slate-400">
              Duration: <strong className="text-slate-200">{selectedPlan.duration}</strong>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Learning Objectives:
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              {selectedPlan.objectives.map((obj, idx) => (
                <li key={idx}>{obj}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
};
