import React from "react";
import { classPerformanceData } from "../data/mockData";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { BarChart3, Award, TrendingUp, AlertCircle } from "lucide-react";

export const ClassPerformanceModule: React.FC = () => {
  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-2xl">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <BarChart3 size={20} className="text-cyan-400" />
          Class Academic Performance & Marks Analytics
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Detailed mark distributions, highest/lowest scores, and pass rates across topics.
        </p>
      </div>

      {/* KPI Cards Row (Section 6 Requirement) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-lg">
          <div className="text-xs font-semibold text-slate-400">
            Average Marks
          </div>
          <div className="text-2xl font-black text-cyan-400 mt-1">84.8%</div>
          <div className="text-[10px] text-slate-500 mt-1">Class Grade 10A Overall</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-lg">
          <div className="text-xs font-semibold text-slate-400">
            Highest Marks
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-1">100%</div>
          <div className="text-[10px] text-slate-500 mt-1">David Chen (Algebra)</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-lg">
          <div className="text-xs font-semibold text-slate-400">
            Lowest Marks
          </div>
          <div className="text-2xl font-black text-rose-400 mt-1">48%</div>
          <div className="text-[10px] text-slate-500 mt-1">Trigonometry Assessment</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-lg">
          <div className="text-xs font-semibold text-slate-400">Pass %</div>
          <div className="text-2xl font-black text-indigo-400 mt-1">93.2%</div>
          <div className="text-[10px] text-slate-500 mt-1">38 of 41 passed</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart: Subject / Topic Wise Marks */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-2xl">
          <h3 className="text-sm font-bold text-slate-100 mb-1">
            Subject & Topic Performance Breakdown
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Comparing average vs highest and lowest scores.
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="topic" stroke="#94a3b8" fontSize={12} />
                <YAxis domain={[40, 100]} stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "0.75rem",
                  }}
                />
                <Legend />
                <Bar dataKey="avg" fill="#06b6d4" name="Average %" radius={[4, 4, 0, 0]} />
                <Bar dataKey="highest" fill="#10b981" name="Highest %" radius={[4, 4, 0, 0]} />
                <Bar dataKey="lowest" fill="#ef4444" name="Lowest %" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar Chart: Topic Proficiency */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-2xl">
          <h3 className="text-sm font-bold text-slate-100 mb-1">
            Curriculum Competency Radar
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Math topic mastery levels vs Pass Percentage.
          </p>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={classPerformanceData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="topic" stroke="#94a3b8" fontSize={11} />
                <PolarRadiusAxis domain={[0, 100]} stroke="#94a3b8" />
                <Radar
                  name="Pass %"
                  dataKey="passPct"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.4}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "0.75rem",
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
};
