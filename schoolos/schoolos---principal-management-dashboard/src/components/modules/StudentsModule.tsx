import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  UserCheck,
  Award,
  AlertTriangle,
  ArrowRightLeft,
  GraduationCap,
  TrendingUp,
  ShieldAlert,
  ChevronRight,
  User,
} from 'lucide-react';

export const StudentsModule: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<string>('AllStudents');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGrade, setSelectedGrade] = useState<string>('All');

  const subTabs = [
    { id: 'AllStudents', label: 'All Students (1,900)' },
    { id: 'Attendance', label: 'Student Attendance' },
    { id: 'Performance', label: 'Academic Performance' },
    { id: 'Discipline', label: 'Discipline Records', badge: 3 },
    { id: 'Promotion', label: 'Grade Promotion' },
    { id: 'Transfer', label: 'Transfer Requests', badge: 2 },
    { id: 'Analytics', label: 'Student Analytics' },
    { id: 'Profiles', label: 'Student Profiles' },
  ];

  const studentsList = [
    { id: 'ST-1001', name: 'Alexander Wright', grade: 'Grade 12 IB', gpa: '3.98', attendance: '99%', discipline: 'Clean', house: 'Phoenix' },
    { id: 'ST-1002', name: 'Sophia Chen', grade: 'Grade 11 AP', gpa: '3.95', attendance: '98%', discipline: 'Clean', house: 'Griffin' },
    { id: 'ST-1003', name: 'Marcus Brody', grade: 'Grade 10 Section B', gpa: '3.12', attendance: '88%', discipline: 'Warning (Late)', house: 'Dragon' },
    { id: 'ST-1004', name: 'Emily Watson', grade: 'Grade 9 Section A', gpa: '3.75', attendance: '96%', discipline: 'Clean', house: 'Phoenix' },
    { id: 'ST-1005', name: 'Liam O\'Connor', grade: 'Grade 8 Section C', gpa: '2.85', attendance: '82%', discipline: 'Counseling Assigned', house: 'Pegasus' },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Subtabs */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                Students Module
                <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 text-xs font-bold">
                  1,900 Total Enrolled
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Attendance tracking, academic performance, behavior monitoring, promotions & transfers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Morning Attendance:</span>
            <span className="px-3 py-1 rounded-xl bg-emerald-500 text-slate-950 font-black text-sm shadow-xs">
              97.0% (1,842 Present)
            </span>
          </div>
        </div>

        {/* Subtabs Bar */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
          {subTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeSubTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
              {tab.badge && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-rose-500 text-white">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Student Directory & Analytics Filter
            </h3>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
            >
              <option value="All">All Grades (Grades 1-12)</option>
              <option value="Grade 12">Grade 12 IB/AP</option>
              <option value="Grade 11">Grade 11</option>
              <option value="Grade 10">Grade 10</option>
              <option value="Grade 9">Grade 9</option>
            </select>

            <input
              type="text"
              placeholder="Search student by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none border border-slate-200 dark:border-slate-700"
            />
          </div>
        </div>

        {/* Student Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3 rounded-l-xl">Student ID</th>
                <th className="p-3">Student Name</th>
                <th className="p-3">Grade & Section</th>
                <th className="p-3">GPA</th>
                <th className="p-3">Attendance</th>
                <th className="p-3">Discipline Status</th>
                <th className="p-3 rounded-r-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {studentsList.map((st) => (
                <tr key={st.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="p-3 font-mono font-bold text-slate-400">{st.id}</td>
                  <td className="p-3 font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold text-xs">
                      {st.name[0]}
                    </div>
                    {st.name}
                  </td>
                  <td className="p-3 text-slate-700 dark:text-slate-300">{st.grade}</td>
                  <td className="p-3 font-extrabold text-emerald-600">{st.gpa}</td>
                  <td className="p-3 font-bold">{st.attendance}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      st.discipline === 'Clean' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}>
                      {st.discipline}
                    </span>
                  </td>
                  <td className="p-3">
                    <button className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 font-bold hover:bg-indigo-500/20">
                      View Profile
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
