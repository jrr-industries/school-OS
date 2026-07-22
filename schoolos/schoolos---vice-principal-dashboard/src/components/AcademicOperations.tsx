import React from 'react';
import {
  BookOpen,
  Calendar,
  XCircle,
  FileCheck,
  BarChart2,
  Eye,
  CheckCircle2,
  Clock,
  Layers
} from 'lucide-react';
import { SyllabusItem } from '../types';

interface Props {
  syllabusData: SyllabusItem[];
}

export const AcademicOperations: React.FC<Props> = ({ syllabusData }) => {
  const observationSchedule = [
    { teacher: 'Dr. Evelyn Reed', dept: 'Chemistry Lab B', class: 'Grade 12 Chemistry', time: '11:15 AM (Period 5)', status: 'Upcoming' },
    { teacher: 'Mr. James Sterling', dept: 'English Lit', class: 'Grade 8 Literature', time: '01:30 PM (Period 7)', status: 'Upcoming' },
    { teacher: 'Mrs. Sarah Connor', dept: 'CS Lab 1', class: 'Grade 10 Robotics', time: '02:15 PM (Period 8)', status: 'Upcoming' },
    { teacher: 'Mr. Marcus Brody', dept: 'Room 112', class: 'Grade 9 World History', time: '09:15 AM (Period 2)', status: 'Completed' }
  ];

  return (
    <section id="academics" className="space-y-4 scroll-mt-20">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Academic Operations</span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-800 text-slate-300 rounded border border-slate-700">
              Curriculum & Observations
            </span>
          </h3>
          <p className="text-xs text-slate-400">Timetable oversight, syllabus progress tracking, lesson plans, and classroom audits</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Column 1: Timetable & Cancelled Classes */}
        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sky-400" />
              <h4 className="text-sm font-bold text-white">Today's Timetable Status</h4>
            </div>
            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Active Schedule
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-white">Classes Running Smoothly</div>
                <div className="text-[10px] text-slate-400">70 of 72 Classes Active</div>
              </div>
              <span className="text-sm font-extrabold text-emerald-400">70 Active</span>
            </div>

            <div className="p-3 bg-slate-950/70 border border-rose-500/30 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-rose-400 flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" /> Cancelled Classes (2)
                </span>
                <span className="text-[10px] text-slate-400">Study Hall Assigned</span>
              </div>
              <p className="text-[11px] text-slate-300">
                • Period 3 Math (Room 104) — Self-study supervisor present.<br />
                • Period 4 German (Room 208) — Library period assigned.
              </p>
            </div>

            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-white">Pending Lesson Plans</div>
                <div className="text-[10px] text-slate-400">12 / 115 Faculty Submissions</div>
              </div>
              <span className="text-xs font-bold text-amber-400">12 Pending</span>
            </div>
          </div>
        </div>

        {/* Column 2: Syllabus Completion Progress Bars */}
        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-purple-400" />
              <h4 className="text-sm font-bold text-white">Syllabus Completion Tracker</h4>
            </div>
            <span className="text-[10px] font-semibold text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
              Term 1 Goal
            </span>
          </div>

          <div className="space-y-3.5">
            {syllabusData.map((s, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">{s.grade} — {s.subject}</span>
                  <span className={`font-bold ${
                    s.status === 'Ahead' ? 'text-emerald-400' : s.status === 'On Track' ? 'text-sky-400' : 'text-amber-400'
                  }`}>
                    {s.completionPercentage}% ({s.status})
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full ${
                      s.completionPercentage >= 80 ? 'bg-emerald-400' : 'bg-purple-400'
                    }`}
                    style={{ width: `${s.completionPercentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: VP Classroom Observation Schedule */}
        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-400" />
              <h4 className="text-sm font-bold text-white">Classroom Observation Schedule</h4>
            </div>
            <span className="text-[10px] font-semibold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
              4 Today
            </span>
          </div>

          <div className="space-y-2.5">
            {observationSchedule.map((obs, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-white">{obs.teacher}</div>
                  <div className="text-[11px] text-slate-400">{obs.class} • {obs.dept}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {obs.time}
                  </div>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                  obs.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-300'
                }`}>
                  {obs.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </section>
  );
};
