import React from "react";
import { TimetablePeriod } from "../types";
import {
  Play,
  CheckCircle2,
  PlusCircle,
  BookOpen,
  MapPin,
  Clock,
  Sparkles,
  Users,
} from "lucide-react";

interface LiveTimetableProps {
  periods: TimetablePeriod[];
  onStartClass: (period: TimetablePeriod) => void;
  onTakeAttendance: (period: TimetablePeriod) => void;
  onCreateAssignment: (period: TimetablePeriod) => void;
  onAddLessonNotes: (period: TimetablePeriod) => void;
}

export const LiveTimetable: React.FC<LiveTimetableProps> = ({
  periods,
  onStartClass,
  onTakeAttendance,
  onCreateAssignment,
  onAddLessonNotes,
}) => {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <h2 className="text-lg font-bold text-slate-100">Live Timetable</h2>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            Today • 6 Teaching Periods
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Period</th>
                <th className="py-3.5 px-4">Subject & Topic</th>
                <th className="py-3.5 px-4">Class</th>
                <th className="py-3.5 px-4">Room</th>
                <th className="py-3.5 px-4">Time</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium text-slate-200">
              {periods.map((p) => {
                const isActive = p.status === "active";
                const isCompleted = p.status === "completed";

                return (
                  <tr
                    key={p.id}
                    className={`transition duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-emerald-950/50 via-slate-900 to-slate-900 ring-1 ring-emerald-500/50 shadow-lg shadow-emerald-950/40"
                        : "hover:bg-slate-800/40"
                    }`}
                  >
                    {/* Period Number */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                            isActive
                              ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/50 animate-pulse"
                              : isCompleted
                              ? "bg-slate-800 text-slate-400"
                              : "bg-slate-800 text-slate-200"
                          }`}
                        >
                          P{p.period}
                        </span>
                      </div>
                    </td>

                    {/* Subject & Topic */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-100 flex items-center gap-2">
                        {p.subject}
                        {isActive && (
                          <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse">
                            <Sparkles size={11} /> NOW LIVE
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-xs mt-0.5">
                        {p.topic}
                      </div>
                    </td>

                    {/* Class */}
                    <td className="py-3.5 px-4 whitespace-nowrap font-semibold text-slate-200">
                      <span className="flex items-center gap-1.5">
                        <Users size={14} className="text-slate-400" />
                        {p.className}
                      </span>
                    </td>

                    {/* Room */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-300">
                      <span className="flex items-center gap-1 text-slate-400">
                        <MapPin size={13} className="text-slate-500" />
                        {p.room}
                      </span>
                    </td>

                    {/* Time */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-300 font-mono">
                      <span className="flex items-center gap-1">
                        <Clock size={13} className="text-slate-500" />
                        {p.time}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {isActive ? (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm">
                          In Progress
                        </span>
                      ) : isCompleted ? (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
                          Completed ({p.presentCount}/{p.totalStudents})
                        </span>
                      ) : p.status === "break" ? (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-800/60 text-slate-400">
                          Break / Prep
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                          Upcoming
                        </span>
                      )}
                    </td>

                    {/* Quick Actions */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-right">
                      {p.status === "break" ? (
                        <span className="text-xs text-slate-500 italic">
                          Planning Hour
                        </span>
                      ) : (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onStartClass(p)}
                            className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition"
                            title="Start Class / Smartboard"
                          >
                            <Play size={14} />
                          </button>
                          <button
                            onClick={() => onTakeAttendance(p)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                            title="Take Attendance"
                          >
                            <CheckCircle2 size={14} className="text-teal-400" />
                          </button>
                          <button
                            onClick={() => onCreateAssignment(p)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                            title="Create Assignment"
                          >
                            <PlusCircle size={14} className="text-cyan-400" />
                          </button>
                          <button
                            onClick={() => onAddLessonNotes(p)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                            title="Lesson Notes"
                          >
                            <BookOpen size={14} className="text-indigo-400" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
