import React, { useState } from "react";
import {
  ClassAttendanceSummary,
  HeatmapDay,
  StudentAtRisk,
} from "../types";
import {
  dailyAttendanceTrendData,
  classWiseAttendanceData,
  presentVsAbsentPieData,
  monthlyAttendanceTrendData,
} from "../data/mockData";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  UserX,
  TrendingUp,
  Calendar,
  Sparkles,
  Download,
  Filter,
  Search,
  PhoneCall,
  Mail,
  ShieldAlert,
  Bot,
  RefreshCw,
  FileSpreadsheet,
  FileText,
} from "lucide-react";

interface AttendanceCenterProps {
  classSummaries: ClassAttendanceSummary[];
  heatmapDays: HeatmapDay[];
  atRiskStudents: StudentAtRisk[];
  onMarkAttendance: (className: string) => void;
  onRunAIRecommendations: () => void;
}

export const AttendanceCenter: React.FC<AttendanceCenterProps> = ({
  classSummaries,
  heatmapDays,
  atRiskStudents,
  onMarkAttendance,
  onRunAIRecommendations,
}) => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "heatmap" | "analytics" | "atrisk" | "frequent"
  >("overview");

  const [hoveredDay, setHoveredDay] = useState<HeatmapDay | null>(null);
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Helper for Heatmap square color class
  const getHeatmapColor = (level: 0 | 1 | 2 | 3 | 4) => {
    switch (level) {
      case 4:
        return "bg-emerald-500 hover:ring-2 hover:ring-emerald-300"; // 100%
      case 3:
        return "bg-emerald-400/80 hover:ring-2 hover:ring-emerald-300"; // 95%
      case 2:
        return "bg-amber-400 hover:ring-2 hover:ring-amber-200"; // 90%
      case 1:
        return "bg-orange-500 hover:ring-2 hover:ring-orange-300"; // 80%
      case 0:
        return "bg-rose-500 hover:ring-2 hover:ring-rose-300"; // <80%
      default:
        return "bg-slate-800";
    }
  };

  const handleFetchAiRecommendations = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "attendance_recommendations",
          subject: "Mathematics",
          grade: "10A",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAiAnalysis(data.text);
      }
    } catch (err) {
      console.error("Error running AI attendance analysis:", err);
      setAiAnalysis("AI Analysis error: Unable to contact SchoolOS Gemini server.");
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <section className="space-y-6">
      {/* Module Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/30 border border-slate-800/80 shadow-2xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 size={20} />
            </span>
            <h2 className="text-xl font-black text-slate-100 tracking-tight">
              Attendance Command Center
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              Enterprise HR-Grade
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Complete daily, monthly, and full academic year attendance tracking, GitHub-style heatmaps, real-time analytics, and AI risk prediction.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleFetchAiRecommendations}
            disabled={loadingAi}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition active:scale-95 shadow-md"
          >
            <Bot size={15} className={loadingAi ? "animate-spin" : ""} />
            {loadingAi ? "Analyzing..." : "AI Attendance Insights"}
          </button>

          <button
            onClick={() => alert("Exporting Attendance Ledger (PDF)...")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
            title="Export PDF Report"
          >
            <FileText size={15} className="text-rose-400" />
            PDF
          </button>

          <button
            onClick={() => alert("Exporting Attendance Data (Excel)...")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
            title="Export Excel Worksheet"
          >
            <FileSpreadsheet size={15} className="text-emerald-400" />
            Excel
          </button>
        </div>
      </div>

      {/* KPI Cards Row (Section 3 Requirement) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-lg">
          <div className="text-xs font-semibold text-slate-400">
            Today's Attendance
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-1 flex items-baseline gap-1">
            96%
            <span className="text-[10px] text-emerald-500 font-normal">
              +1.2% vs avg
            </span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">183/197 Present</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 shadow-lg ring-1 ring-amber-500/20">
          <div className="text-xs font-semibold text-slate-400">
            Pending Attendance
          </div>
          <div className="text-2xl font-black text-amber-400 mt-1">1 Class</div>
          <div className="text-[10px] text-amber-300/80 mt-1">
            Grade 9B Foundation
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-lg">
          <div className="text-xs font-semibold text-slate-400">
            Late Students
          </div>
          <div className="text-2xl font-black text-amber-400 mt-1">8</div>
          <div className="text-[10px] text-slate-500 mt-1">
            Period 1 Tardiness
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-lg">
          <div className="text-xs font-semibold text-slate-400">
            Absent Students
          </div>
          <div className="text-2xl font-black text-rose-400 mt-1">14</div>
          <div className="text-[10px] text-slate-500 mt-1">
            9 Excused, 5 Unexcused
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-lg">
          <div className="text-xs font-semibold text-slate-400">
            Monthly Average
          </div>
          <div className="text-2xl font-black text-cyan-400 mt-1">95%</div>
          <div className="text-[10px] text-slate-500 mt-1">July 2026 Term</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-lg">
          <div className="text-xs font-semibold text-slate-400">
            Yearly Average
          </div>
          <div className="text-2xl font-black text-indigo-400 mt-1">96%</div>
          <div className="text-[10px] text-slate-500 mt-1">Academic Year 2026-27</div>
        </div>
      </div>

      {/* AI Recommendation Output Box if triggered */}
      {aiAnalysis && (
        <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-xs text-slate-200 shadow-2xl relative">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20 mb-3">
            <span className="font-bold text-emerald-300 flex items-center gap-2 text-sm">
              <Bot size={16} /> Gemini AI Attendance Intervention Strategy
            </span>
            <button
              onClick={() => setAiAnalysis(null)}
              className="text-slate-400 hover:text-slate-100"
            >
              ✕
            </button>
          </div>
          <div className="prose prose-invert prose-xs max-w-none space-y-2 whitespace-pre-line leading-relaxed">
            {aiAnalysis}
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto custom-scrollbar">
        {[
          { id: "overview", label: "Overview & Class Table" },
          { id: "heatmap", label: "GitHub-Style Year Heatmap" },
          { id: "analytics", label: "Analytics & Trends" },
          { id: "atrisk", label: "At-Risk Students (<75%)", badge: atRiskStudents.length },
          { id: "frequent", label: "Frequent Absentees & Late" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === tab.id
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-md"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            {tab.label}
            {tab.badge && (
              <span className="px-1.5 py-0.2 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-full text-[10px]">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW & CLASS ATTENDANCE TABLE */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800/80 p-5 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100">
                Class Attendance Today (Grade Breakdown)
              </h3>
              <div className="text-xs text-slate-400 font-medium">
                4/5 Classes Completed
              </div>
            </div>

            <div className="overflow-x-auto mt-3">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4 text-center">Total Students</th>
                    <th className="py-3 px-4 text-center">Present</th>
                    <th className="py-3 px-4 text-center">Absent</th>
                    <th className="py-3 px-4 text-center">Late</th>
                    <th className="py-3 px-4 text-center">Attendance %</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium text-slate-200">
                  {classSummaries.map((cls) => (
                    <tr
                      key={cls.className}
                      className="hover:bg-slate-800/40 transition"
                    >
                      <td className="py-3 px-4 font-bold text-slate-100 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        {cls.className}
                      </td>
                      <td className="py-3 px-4 text-slate-300">{cls.subject}</td>
                      <td className="py-3 px-4 text-center font-mono">
                        {cls.totalStudents}
                      </td>
                      <td className="py-3 px-4 text-center text-emerald-400 font-bold font-mono">
                        {cls.present}
                      </td>
                      <td className="py-3 px-4 text-center text-rose-400 font-bold font-mono">
                        {cls.absent}
                      </td>
                      <td className="py-3 px-4 text-center text-amber-400 font-bold font-mono">
                        {cls.late}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            cls.percentage >= 95
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : cls.percentage >= 90
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          }`}
                        >
                          {cls.percentage}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onMarkAttendance(cls.className)}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                            cls.status === "pending"
                              ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 hover:bg-amber-400"
                              : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                          }`}
                        >
                          {cls.status === "pending"
                            ? "Take Attendance"
                            : "Edit Roster"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GITHUB-STYLE YEAR HEATMAP & MONTHLY HEATMAP */}
      {activeTab === "heatmap" && (
        <div className="space-y-6">
          {/* GitHub Style Heatmap Grid */}
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800/80 p-6 shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  Academic Year Attendance Heatmap (GitHub Style)
                  <span className="text-xs text-slate-400 font-normal">
                    120 Teaching Days
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Visualizes overall daily attendance density across all teaching periods.
                </p>
              </div>

              {/* Color Legend (Requirement) */}
              <div className="flex items-center gap-3 text-xs text-slate-300 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[11px]">Attendance %:</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-emerald-500" />
                  <span className="text-[10px]">100%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-emerald-400/80" />
                  <span className="text-[10px]">95%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-amber-400" />
                  <span className="text-[10px]">90%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-orange-500" />
                  <span className="text-[10px]">80%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-rose-500" />
                  <span className="text-[10px]">&lt;80%</span>
                </div>
              </div>
            </div>

            {/* Heatmap Grid Rendering */}
            <div className="relative overflow-x-auto py-2 custom-scrollbar">
              <div className="flex gap-1.5 min-w-max">
                {/* 5 Rows for Days Mon - Fri */}
                {["Mon", "Tue", "Wed", "Thu", "Fri"].map((dayName, rowIdx) => (
                  <div key={dayName} className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-mono text-slate-500 h-3.5 w-6 flex items-center">
                      {dayName}
                    </span>
                  </div>
                ))}

                {/* Heatmap Columns */}
                <div className="grid grid-rows-5 grid-flow-col gap-1.5">
                  {heatmapDays.map((day, idx) => (
                    <div
                      key={idx}
                      onMouseEnter={() => setHoveredDay(day)}
                      onMouseLeave={() => setHoveredDay(null)}
                      className={`w-3.5 h-3.5 rounded-sm transition cursor-pointer ${getHeatmapColor(
                        day.level
                      )}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Hover Tooltip Box */}
            <div className="min-h-12 p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              {hoveredDay ? (
                <div className="flex items-center gap-4 text-slate-200">
                  <div>
                    <span className="text-slate-500">Date:</span>{" "}
                    <strong className="text-emerald-400">{hoveredDay.date}</strong> ({hoveredDay.dayOfWeek})
                  </div>
                  <div>
                    <span className="text-slate-500">Class:</span>{" "}
                    <strong>{hoveredDay.className}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Present:</span>{" "}
                    <strong className="text-emerald-400">{hoveredDay.present}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Absent:</span>{" "}
                    <strong className="text-rose-400">{hoveredDay.absent}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Late:</span>{" "}
                    <strong className="text-amber-400">{hoveredDay.late}</strong>
                  </div>
                  <div className="ml-auto">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                      Attendance: {hoveredDay.percentage}%
                    </span>
                  </div>
                </div>
              ) : (
                <span className="text-slate-500 italic">
                  Hover over any heatmap cell above to display detailed daily attendance stats.
                </span>
              )}
            </div>
          </div>

          {/* Monthly Calendar Heatmap (Mon Tue Wed Thu Fri Sat) */}
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800/80 p-6 shadow-2xl">
            <h3 className="text-sm font-bold text-slate-100 mb-3">
              Monthly Calendar Heatmap (July 2026)
            </h3>
            <div className="grid grid-cols-6 gap-2 text-center text-xs">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} className="font-semibold text-slate-500 pb-2">
                  {d}
                </div>
              ))}

              {/* Sample July Days Grid */}
              {[
                { day: 1, color: "bg-emerald-500", pct: "100%" },
                { day: 2, color: "bg-emerald-500", pct: "100%" },
                { day: 3, color: "bg-amber-400", pct: "92%" },
                { day: 4, color: "bg-emerald-500", pct: "100%" },
                { day: 5, color: "bg-rose-500", pct: "78%" },
                { day: 6, color: "bg-slate-800", pct: "Off" },

                { day: 7, color: "bg-emerald-500", pct: "100%" },
                { day: 8, color: "bg-emerald-500", pct: "100%" },
                { day: 9, color: "bg-emerald-400/80", pct: "96%" },
                { day: 10, color: "bg-emerald-500", pct: "100%" },
                { day: 11, color: "bg-emerald-500", pct: "100%" },
                { day: 12, color: "bg-slate-800", pct: "Off" },

                { day: 13, color: "bg-amber-400", pct: "90%" },
                { day: 14, color: "bg-emerald-500", pct: "100%" },
                { day: 15, color: "bg-orange-500", pct: "85%" },
                { day: 16, color: "bg-emerald-500", pct: "100%" },
                { day: 17, color: "bg-emerald-500", pct: "100%" },
                { day: 18, color: "bg-slate-800", pct: "Off" },

                { day: 19, color: "bg-emerald-500", pct: "100%" },
                { day: 20, color: "bg-emerald-500", pct: "100%" },
                { day: 21, color: "bg-emerald-500", pct: "100%" },
                { day: 22, color: "bg-emerald-400/80", pct: "96%" },
                { day: 23, color: "bg-emerald-500", pct: "100%" },
                { day: 24, color: "bg-slate-800", pct: "Off" },
              ].map((item) => (
                <div
                  key={item.day}
                  className={`p-3 rounded-xl border border-slate-800/80 ${item.color} text-slate-950 font-bold text-xs shadow-md`}
                >
                  <div>{item.day}</div>
                  <div className="text-[10px] opacity-90">{item.pct}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ANALYTICS & CHARTS */}
      {activeTab === "analytics" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Attendance Trend Line Chart */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-2xl">
            <h3 className="text-sm font-bold text-slate-100 mb-1">
              Daily Attendance Trend (% vs Target)
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Mon - Sat weekly attendance performance tracking.
            </p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyAttendanceTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                  <YAxis domain={[80, 100]} stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "0.75rem",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="attendance"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ r: 5, fill: "#10b981" }}
                    name="Actual Attendance %"
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="#f59e0b"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    name="Benchmark Target (95%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Class-wise Attendance Bar Chart */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-2xl">
            <h3 className="text-sm font-bold text-slate-100 mb-1">
              Class-wise Attendance Comparison
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Present, Late, and Absent breakdown per grade.
            </p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={classWiseAttendanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="className" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "0.75rem",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="present" fill="#10b981" name="Present" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="late" fill="#f59e0b" name="Late" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="absent" fill="#ef4444" name="Absent" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart: Present vs Absent Distribution */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-2xl">
            <h3 className="text-sm font-bold text-slate-100 mb-1">
              Present vs Absent Distribution
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Total 197 registered students overall distribution today.
            </p>

            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={presentVsAbsentPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {presentVsAbsentPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "0.75rem",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Trend & Attendance Forecast Area Chart */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-2xl">
            <h3 className="text-sm font-bold text-slate-100 mb-1">
              Monthly Attendance Trend & AI Forecast
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Historical monthly averages and AI predicted forecast curve.
            </p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyAttendanceTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                  <YAxis domain={[90, 100]} stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "0.75rem",
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="avgPct"
                    stroke="#06b6d4"
                    fill="#06b6d4"
                    fillOpacity={0.2}
                    name="Actual Average %"
                  />
                  <Area
                    type="monotone"
                    dataKey="forecast"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.1}
                    name="AI Forecast %"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AT-RISK STUDENTS (<75%) */}
      {activeTab === "atrisk" && (
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800/80 p-5 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <ShieldAlert size={18} className="text-rose-400" />
                At-Risk Students Below 75% Threshold
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Automated attendance warnings issued to parents and school administration.
              </p>
            </div>
            <div className="text-xs font-semibold px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
              {atRiskStudents.length} Students Require Intervention
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4 text-center">Attendance %</th>
                  <th className="py-3 px-4 text-center">Days Absent</th>
                  <th className="py-3 px-4">Last Present</th>
                  <th className="py-3 px-4">Risk Factor</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium text-slate-200">
                {atRiskStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-100">{st.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Roll: {st.rollNumber}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-300">
                      {st.className}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2.5 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        {st.attendancePct}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-bold font-mono text-rose-400">
                      {st.daysAbsent} Days
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono">
                      {st.lastPresent}
                    </td>
                    <td className="py-3 px-4 text-slate-300 max-w-xs truncate">
                      {st.riskReason}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => alert(`Calling Parent: ${st.parentContact}`)}
                          className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition"
                          title="Contact Parent"
                        >
                          <PhoneCall size={14} />
                        </button>
                        <button
                          onClick={() => alert(`Sending Email to: ${st.parentContact}`)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                          title="Send Email"
                        >
                          <Mail size={14} />
                        </button>
                        <button
                          onClick={() => handleFetchAiRecommendations()}
                          className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30 hover:bg-emerald-500/30 transition"
                        >
                          AI Plan
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: FREQUENT ABSENTEES & LATE ARRIVALS */}
      {activeTab === "frequent" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-2xl space-y-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <UserX size={16} className="text-rose-400" />
              Frequent Absentees (Top 5)
            </h3>
            <div className="space-y-2">
              {[
                { name: "Sarah Jenkins", class: "10A", count: "16 Days", pct: "68%" },
                { name: "Alex Rivera", class: "10A", count: "14 Days", pct: "71%" },
                { name: "Marcus Vance", class: "9A", count: "12 Days", pct: "73%" },
                { name: "Chloe Zhao", class: "11A", count: "11 Days", pct: "74%" },
                { name: "Brandon Roy", class: "9B", count: "9 Days", pct: "79%" },
              ].map((s, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-100">{s.name}</div>
                    <div className="text-[10px] text-slate-400">Class {s.class}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-rose-400">{s.count}</div>
                    <div className="text-[10px] text-slate-500">{s.pct} Rate</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-2xl space-y-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Clock size={16} className="text-amber-400" />
              Frequent Late Arrivals (Period 1)
            </h3>
            <div className="space-y-2">
              {[
                { name: "Tyler Durden", class: "10A", count: "8 Lates", avg: "12 mins late" },
                { name: "Alex Rivera", class: "10A", count: "7 Lates", avg: "15 mins late" },
                { name: "Marcus Vance", class: "9A", count: "6 Lates", avg: "20 mins late" },
                { name: "Jessica Alba", class: "10B", count: "5 Lates", avg: "8 mins late" },
                { name: "Leo Miller", class: "11A", count: "4 Lates", avg: "10 mins late" },
              ].map((s, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-100">{s.name}</div>
                    <div className="text-[10px] text-slate-400">Class {s.class}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-amber-400">{s.count}</div>
                    <div className="text-[10px] text-slate-500">{s.avg}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
