import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  Calendar,
  Clock,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  FileText,
  UserPlus,
  BarChart2,
  UserX,
} from 'lucide-react';

export const TeachersModule: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<string>('AllTeachers');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const subTabs = [
    { id: 'AllTeachers', label: 'All Faculty (115)' },
    { id: 'Attendance', label: 'Teacher Attendance' },
    { id: 'LeaveRequests', label: 'Leave Requests', badge: 2 },
    { id: 'Performance', label: 'Faculty Evaluation' },
    { id: 'Workload', label: 'Workload Hours' },
    { id: 'Assignment', label: 'Class Teacher Assignment' },
    { id: 'Substitutes', label: 'Substitute Roster' },
    { id: 'Profiles', label: 'Faculty Profiles' },
  ];

  const teachersList = [
    { id: 'T-201', name: 'Dr. Arthur Pendelton', dept: 'Mathematics AP', status: 'Present', role: 'HOD Math', workload: '26 hrs/wk', rating: '4.9/5' },
    { id: 'T-202', name: 'Mr. Robert Vance', dept: 'Physical Sciences', status: 'Medical Leave', role: 'Physics Lead', workload: '29 hrs/wk', rating: '4.8/5' },
    { id: 'T-203', name: 'Mrs. Claire Bennett', dept: 'Languages & Lit', status: 'Present', role: 'HOD Languages', workload: '22 hrs/wk', rating: '4.95/5' },
    { id: 'T-204', name: 'Ms. Clara Henderson', dept: 'Physical Sciences', status: 'Present (Covering)', role: 'Chemistry Lead', workload: '24 hrs/wk', rating: '4.7/5' },
    { id: 'T-205', name: 'Dr. Marcus Thorne', dept: 'STEM & Robotics', status: 'Present', role: 'HOD Tech', workload: '31 hrs/wk', rating: '4.9/5' },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Subtabs */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                Faculty & Teachers Module
                <span className="px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-xs font-bold">
                  115 Total Faculty
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Attendance, leave approval workflows, performance evaluations, workload balancing & substitute management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Faculty Present Today:</span>
            <span className="px-3 py-1 rounded-xl bg-emerald-500 text-slate-950 font-black text-sm shadow-xs">
              112 / 115 (97.4%)
            </span>
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
                  ? 'bg-teal-600 text-white shadow-sm'
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
            Faculty Directory & Duty Status
          </h3>
          <input
            type="text"
            placeholder="Search faculty by name or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none border border-slate-200 dark:border-slate-700"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3 rounded-l-xl">ID</th>
                <th className="p-3">Faculty Name</th>
                <th className="p-3">Department</th>
                <th className="p-3">Role / Designation</th>
                <th className="p-3">Today Status</th>
                <th className="p-3">Weekly Workload</th>
                <th className="p-3">Rating</th>
                <th className="p-3 rounded-r-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {teachersList.map((tc) => (
                <tr key={tc.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="p-3 font-mono text-slate-400 font-bold">{tc.id}</td>
                  <td className="p-3 font-extrabold text-slate-900 dark:text-white">{tc.name}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">{tc.dept}</td>
                  <td className="p-3 font-semibold text-slate-500">{tc.role}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                      tc.status === 'Present' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {tc.status}
                    </span>
                  </td>
                  <td className="p-3 font-bold">{tc.workload}</td>
                  <td className="p-3 font-extrabold text-amber-500">{tc.rating}</td>
                  <td className="p-3">
                    <button className="px-2.5 py-1 rounded-lg bg-teal-500/10 text-teal-600 font-bold hover:bg-teal-500/20">
                      Manage Faculty
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
