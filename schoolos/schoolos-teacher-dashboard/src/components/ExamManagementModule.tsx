import React from "react";
import { examDutiesList } from "../data/mockData";
import { Award, Calendar, Clock, MapPin, FileText, CheckCircle2, AlertCircle } from "lucide-react";

export const ExamManagementModule: React.FC = () => {
  return (
    <section className="space-y-6">
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-2xl">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Award size={20} className="text-purple-400" />
          Examination Management & Invigilation Control
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Monitor exam schedules, invigilation duties, question paper status, and pending grading entries.
        </p>
      </div>

      {/* KPI Cards Row (Section 7 Requirement) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-lg">
          <div className="text-xs font-semibold text-slate-400">
            Upcoming Exams
          </div>
          <div className="text-2xl font-black text-purple-400 mt-1">2</div>
          <div className="text-[10px] text-slate-500 mt-1">Mid-Term Term 1</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-lg">
          <div className="text-xs font-semibold text-slate-400">
            Invigilation Duty
          </div>
          <div className="text-2xl font-black text-cyan-400 mt-1">2 Sessions</div>
          <div className="text-[10px] text-slate-500 mt-1">Aug 4 & Aug 8</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-lg">
          <div className="text-xs font-semibold text-slate-400">
            Question Papers
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-1">1 Ready</div>
          <div className="text-[10px] text-slate-500 mt-1">1 Draft In Progress</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-lg">
          <div className="text-xs font-semibold text-slate-400">
            Marks Pending
          </div>
          <div className="text-2xl font-black text-amber-400 mt-1">1 Batch</div>
          <div className="text-[10px] text-slate-500 mt-1">Quiz 4 Diagnostic</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-lg">
          <div className="text-xs font-semibold text-slate-400">
            Results Submitted
          </div>
          <div className="text-2xl font-black text-indigo-400 mt-1">4 Batches</div>
          <div className="text-[10px] text-slate-500 mt-1">Approved by Board</div>
        </div>
      </div>

      {/* Duty Table */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800/80 p-5 shadow-2xl space-y-4">
        <h3 className="text-sm font-bold text-slate-100">Scheduled Examination & Duty Roster</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Exam Title</th>
                <th className="py-3 px-4">Subject & Class</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Room</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4 text-center">Paper Status</th>
                <th className="py-3 px-4 text-center">Marks Entry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium text-slate-200">
              {examDutiesList.map((e) => (
                <tr key={e.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-bold text-slate-100">
                    {e.title}
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {e.subject} ({e.className})
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-mono">
                    {e.date} • {e.time}
                  </td>
                  <td className="py-3 px-4 text-slate-300">{e.room}</td>
                  <td className="py-3 px-4 font-bold text-purple-400">
                    {e.role}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        e.questionPaperStatus === "Ready"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {e.questionPaperStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                      {e.marksStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
