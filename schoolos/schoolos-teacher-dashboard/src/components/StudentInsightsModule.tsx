import React, { useState } from "react";
import { studentInsightsList } from "../data/mockData";
import { Users, Award, AlertTriangle, UserX, Heart, Search } from "lucide-react";

export const StudentInsightsModule: React.FC = () => {
  const [filterType, setFilterType] = useState<string>("All");

  const filteredInsights =
    filterType === "All"
      ? studentInsightsList
      : studentInsightsList.filter((s) => s.type === filterType);

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "Top Performer":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "Needs Improvement":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "Frequent Absentee":
        return "bg-rose-500/20 text-rose-300 border-rose-500/30";
      case "Discipline Alert":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "Special Needs":
        return "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";
      default:
        return "bg-slate-800 text-slate-300";
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-2xl">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Users size={20} className="text-emerald-400" />
            360° Student Insights & Support Matrix
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Personalized behavioral tracking, academic milestones, and IEP special needs accommodations.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {[
            "All",
            "Top Performer",
            "Needs Improvement",
            "Frequent Absentee",
            "Discipline Alert",
            "Special Needs",
          ].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                filterType === t
                  ? "bg-emerald-500 text-slate-950 shadow-md"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredInsights.map((st) => (
          <div
            key={st.id}
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-xl space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center font-bold text-slate-950 text-sm shadow-md">
                    {st.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100 text-sm">{st.name}</h3>
                    <div className="text-[11px] text-slate-400">{st.className}</div>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getTypeBadge(
                    st.type
                  )}`}
                >
                  {st.type}
                </span>
              </div>

              <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800 mt-3 leading-relaxed">
                {st.note}
              </p>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800 font-mono">
              <span className="text-slate-400">
                GPA: <strong className="text-slate-100">{st.gpa}</strong>
              </span>
              <span className="text-slate-400">
                Attendance:{" "}
                <strong
                  className={
                    st.attendancePct < 75 ? "text-rose-400" : "text-emerald-400"
                  }
                >
                  {st.attendancePct}%
                </strong>
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
