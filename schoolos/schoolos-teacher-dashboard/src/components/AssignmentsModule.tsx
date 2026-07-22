import React, { useState } from "react";
import { Assignment } from "../types";
import {
  FileText,
  PlusCircle,
  CheckCircle2,
  Clock,
  BarChart3,
  Search,
  Filter,
  Eye,
  Sliders,
  Check,
} from "lucide-react";

interface AssignmentsModuleProps {
  assignments: Assignment[];
  onCreateAssignment: () => void;
}

export const AssignmentsModule: React.FC<AssignmentsModuleProps> = ({
  assignments,
  onCreateAssignment,
}) => {
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(
    null
  );
  const [gradingScore, setGradingScore] = useState<number>(88);
  const [gradeFeedback, setGradeFeedback] = useState<string>(
    "Great mathematical reasoning and correct quadratic steps."
  );
  const [gradedAlert, setGradedAlert] = useState(false);

  const handleSaveGrade = () => {
    setGradedAlert(true);
    setTimeout(() => {
      setGradedAlert(false);
      setSelectedAssignment(null);
    }, 1200);
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-2xl">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <FileText size={20} className="text-indigo-400" />
            Assignments Management Hub
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track student submissions, review pending problem sets, and issue grades.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onCreateAssignment}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-950/50 transition active:scale-95"
          >
            <PlusCircle size={16} />
            Create New Assignment
          </button>
        </div>
      </div>

      {/* KPI Cards Row (Section 4 Requirement) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-lg">
          <div className="text-xs font-semibold text-slate-400">
            Assignments Created
          </div>
          <div className="text-2xl font-black text-slate-100 mt-1">12</div>
          <div className="text-[10px] text-slate-500 mt-1">This Academic Term</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-indigo-500/30 shadow-lg ring-1 ring-indigo-500/20">
          <div className="text-xs font-semibold text-slate-400">
            Pending Review
          </div>
          <div className="text-2xl font-black text-indigo-400 mt-1">28</div>
          <div className="text-[10px] text-indigo-300/80 mt-1">
            Problem Set 4 & Worksheets
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-lg">
          <div className="text-xs font-semibold text-slate-400">
            Late Submissions
          </div>
          <div className="text-2xl font-black text-rose-400 mt-1">4</div>
          <div className="text-[10px] text-slate-500 mt-1">Grade 10A & 9A</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-lg">
          <div className="text-xs font-semibold text-slate-400">
            Average Score
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-1">85.8%</div>
          <div className="text-[10px] text-slate-500 mt-1">+3.2% vs last term</div>
        </div>
      </div>

      {/* Assignments List */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800/80 p-5 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold text-slate-100">Active Assignments Roster</h3>
          <span className="text-xs text-slate-400">Showing {assignments.length} assignments</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Title & Subject</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-center">Submissions</th>
                <th className="py-3 px-4 text-center">Reviewed</th>
                <th className="py-3 px-4 text-center">Avg Score</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium text-slate-200">
              {assignments.map((a) => (
                <tr key={a.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-100">{a.title}</div>
                    <div className="text-[10px] text-slate-400">{a.subject}</div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-300">
                    {a.className}
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-mono">
                    {a.dueDate}
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-emerald-400">
                    {a.submittedCount} / {a.totalStudents}
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-cyan-400 font-bold">
                    {a.reviewedCount}
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-indigo-400">
                    {a.avgScore}%
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        a.status === "Pending Review"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : a.status === "Graded"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedAssignment(a)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 font-bold text-xs transition"
                    >
                      Review Submissions
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Submission Modal / Drawer */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-slate-100 text-sm">
                  Reviewing: {selectedAssignment.title}
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedAssignment.className} • {selectedAssignment.subject}
                </p>
              </div>
              <button
                onClick={() => setSelectedAssignment(null)}
                className="text-slate-400 hover:text-slate-100 text-sm"
              >
                ✕
              </button>
            </div>

            {gradedAlert ? (
              <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-center font-bold text-xs flex items-center justify-center gap-2">
                <Check size={18} /> Grade & Feedback Saved Successfully!
              </div>
            ) : (
              <div className="space-y-4 text-xs text-slate-200">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-semibold text-slate-300">
                    Student Submission: Alex Rivera (Roll 10A-14)
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Submitted: 2026-07-21 08:14 AM (On Time)
                  </div>
                  <div className="text-slate-300 italic pt-1">
                    "Attached PDF file: Alex_Rivera_Quadratic_ProblemSet4.pdf"
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-300 mb-1">
                    <span>Grade Score:</span>
                    <span className="text-emerald-400 font-mono font-bold text-sm">
                      {gradingScore} / 100
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={gradingScore}
                    onChange={(e) => setGradingScore(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Teacher Feedback & Evaluation Notes:
                  </label>
                  <textarea
                    rows={3}
                    value={gradeFeedback}
                    onChange={(e) => setGradeFeedback(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => setSelectedAssignment(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveGrade}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md"
                  >
                    Publish Grade & Feedback
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
