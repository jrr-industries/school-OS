import React, { useState } from 'react';
import {
  FileCheck,
  Calendar,
  Users,
  Award,
  Send,
  BarChart2,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';

export const ExamsModule: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<string>('Dashboard');

  const subTabs = [
    { id: 'Dashboard', label: 'Exams Dashboard' },
    { id: 'Timetable', label: 'Master Timetable' },
    { id: 'Seating', label: 'Seating Arrangement' },
    { id: 'Invigilators', label: 'Invigilators Roster' },
    { id: 'Results', label: 'Exam Results' },
    { id: 'Publish', label: 'Publish Results', badge: 1 },
    { id: 'Analytics', label: 'Exam Analytics' },
    { id: 'Reports', label: 'Exam Reports' },
  ];

  const examSchedules = [
    { id: 'EX-01', subject: 'AP Physics C: Mechanics', grade: 'Grade 11 & 12', date: 'Aug 15, 2026', time: '09:00 AM - 12:00 PM', hall: 'Auditorium Hall A', invigilator: 'Ms. Clara Henderson', students: 58 },
    { id: 'EX-02', subject: 'Advanced Mathematics & Calculus', grade: 'Grade 12 IB', date: 'Aug 16, 2026', time: '09:00 AM - 12:00 PM', hall: 'Main Gym Complex', invigilator: 'Dr. Arthur Pendelton', students: 64 },
    { id: 'EX-03', subject: 'English Literature & Composition', grade: 'Grade 10 & 11', date: 'Aug 17, 2026', time: '01:00 PM - 03:30 PM', hall: 'Science Building Block B', invigilator: 'Mrs. Claire Bennett', students: 120 },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Subtabs */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                Examinations & Assessment Suite
                <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 text-xs font-bold">
                  Term 1 Mid-Terms
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Exam scheduling, seating plans, invigilator assignments, results processing & principal publishing clearance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('Publish Clearance granted for Term 1 Results')}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-sm flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" /> Principal Publish Clearance
            </button>
          </div>
        </div>

        {/* Subtabs horizontal bar */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
          {subTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeSubTab === tab.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
              {tab.badge && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-950">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table Content */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
            Upcoming Examination Master Schedule
          </h3>
          <span className="text-xs font-bold text-slate-400">3 Major Exam Blocks Scheduled</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3 rounded-l-xl">Exam Code</th>
                <th className="p-3">Subject</th>
                <th className="p-3">Grade Level</th>
                <th className="p-3">Date & Time</th>
                <th className="p-3">Hall / Location</th>
                <th className="p-3">Chief Invigilator</th>
                <th className="p-3">Candidates</th>
                <th className="p-3 rounded-r-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {examSchedules.map((ex) => (
                <tr key={ex.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="p-3 font-mono text-slate-400 font-bold">{ex.id}</td>
                  <td className="p-3 font-extrabold text-slate-900 dark:text-white">{ex.subject}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">{ex.grade}</td>
                  <td className="p-3 font-bold text-purple-600 dark:text-purple-400">{ex.date} ({ex.time})</td>
                  <td className="p-3 text-slate-500">{ex.hall}</td>
                  <td className="p-3 font-semibold">{ex.invigilator}</td>
                  <td className="p-3 font-bold">{ex.students} Students</td>
                  <td className="p-3">
                    <button className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-600 font-bold hover:bg-purple-500/20">
                      Manage Exam
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
