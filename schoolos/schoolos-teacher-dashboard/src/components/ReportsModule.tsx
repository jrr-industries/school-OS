import React from "react";
import { FileSpreadsheet, FileText, Download, CheckCircle2, BarChart3, Users } from "lucide-react";

export const ReportsModule: React.FC = () => {
  const reportsList = [
    {
      title: "Attendance Ledger & Heatmap Report",
      type: "Attendance",
      format: "PDF & Excel",
      desc: "Full academic year daily breakdown, at-risk flags, and monthly class averages.",
      icon: CheckCircle2,
      color: "text-emerald-400",
    },
    {
      title: "Comprehensive Marks & Grading Ledger",
      type: "Marks Report",
      format: "PDF & Excel",
      desc: "Term 1 exam marks, quiz averages, topic proficiency, and pass percentages.",
      icon: BarChart3,
      color: "text-cyan-400",
    },
    {
      title: "Assignment Submission & Review Audit",
      type: "Assignment Report",
      format: "Excel Worksheet",
      desc: "Submission timestamps, late submission logs, and average scores per task.",
      icon: FileText,
      color: "text-indigo-400",
    },
    {
      title: "Class 360° Academic Performance Analysis",
      type: "Class Performance",
      format: "PDF Document",
      desc: "Executive summary for principal inspection and parent-teacher conference distribution.",
      icon: Users,
      color: "text-purple-400",
    },
  ];

  return (
    <section className="space-y-6">
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-2xl">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <FileSpreadsheet size={20} className="text-emerald-400" />
          SchoolOS Reports & Export Center
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Generate official institutional compliance reports, attendance ledgers, and academic transcripts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportsList.map((r, idx) => {
          const Icon = r.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-xl space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                    <Icon size={18} className={r.color} />
                  </span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {r.type}
                  </span>
                </div>
                <h3 className="font-bold text-slate-100 text-sm">{r.title}</h3>
                <p className="text-xs text-slate-400">{r.desc}</p>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
                <button
                  onClick={() => alert(`Exporting ${r.title} as PDF...`)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
                >
                  <FileText size={14} className="text-rose-400" /> Export PDF
                </button>
                <button
                  onClick={() => alert(`Exporting ${r.title} as Excel...`)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
                >
                  <FileSpreadsheet size={14} className="text-emerald-400" /> Export Excel
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
