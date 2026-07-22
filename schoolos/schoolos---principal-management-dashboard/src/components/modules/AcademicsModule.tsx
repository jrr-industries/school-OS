import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  Search,
  Filter,
  Check,
  X,
  ChevronRight,
  TrendingUp,
  Award,
  Sparkles,
  BarChart2,
  FileCheck,
} from 'lucide-react';

export const AcademicsModule: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<string>('Overview');
  const [selectedGrade, setSelectedGrade] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const subTabs = [
    { id: 'Overview', label: 'Academics Overview' },
    { id: 'Classes', label: 'Classes & Sections' },
    { id: 'Timetable', label: 'Timetable' },
    { id: 'TimetableApproval', label: 'Timetable Approval', badge: 2 },
    { id: 'ExamSchedule', label: 'Exam Schedule' },
    { id: 'ExamApproval', label: 'Exam Schedule Approval', badge: 1 },
    { id: 'Syllabus', label: 'Syllabus Completion' },
    { id: 'Workload', label: 'Teacher Workload' },
    { id: 'Calendar', label: 'Academic Calendar' },
  ];

  // Mock data for Classes & Sections
  const classesData = [
    { id: '10-A', grade: 'Grade 10', section: 'A', classTeacher: 'Mr. Robert Vance', room: 'Room 204', studentsCount: 32, avgGpa: 3.82, syllabusPct: 91 },
    { id: '10-B', grade: 'Grade 10', section: 'B', classTeacher: 'Ms. Clara Henderson', room: 'Room 205', studentsCount: 30, avgGpa: 3.65, syllabusPct: 88 },
    { id: '11-AP', grade: 'Grade 11', section: 'AP Physics', classTeacher: 'Dr. Arthur Pendelton', room: 'Lab 3', studentsCount: 28, avgGpa: 3.91, syllabusPct: 94 },
    { id: '12-IB', grade: 'Grade 12', section: 'IB Higher', classTeacher: 'Mrs. Claire Bennett', room: 'Room 310', studentsCount: 25, avgGpa: 3.88, syllabusPct: 92 },
    { id: '9-A', grade: 'Grade 9', section: 'A', classTeacher: 'Mr. David Miller', room: 'Room 102', studentsCount: 34, avgGpa: 3.55, syllabusPct: 84 },
  ];

  // Mock data for Pending Approvals
  const pendingTimetables = [
    { id: 'TT-01', title: 'Grade 11 STEM Lab Slot Swap', requestedBy: 'Dr. Marcus Thorne', reason: 'Accommodate Robotics Tournament setup on Thursdays', submitted: 'Yesterday, 3:00 PM' },
    { id: 'TT-02', title: 'Grade 8 Physical Ed Period Extension', requestedBy: 'Coach David Miller', reason: 'Annual Swimming & Athletics training block', submitted: 'Today, 8:15 AM' },
  ];

  const pendingExams = [
    { id: 'EX-01', title: 'Term 1 Mid-Term Physics & Calculus Master Schedule', requestedBy: 'Academic Council', totalExams: 18, dates: 'Aug 15 - Aug 22, 2026', submitted: 'Yesterday, 5:30 PM' },
  ];

  const teacherWorkload = [
    { name: 'Dr. Arthur Pendelton', department: 'Mathematics', hoursPerWeek: 26, status: 'Normal', classes: ['10-A', '11-AP', '12-IB'] },
    { name: 'Mr. Robert Vance', department: 'Physical Sciences', hoursPerWeek: 29, status: 'High', classes: ['10-A', '10-B', '11-AP'] },
    { name: 'Mrs. Claire Bennett', department: 'Languages', hoursPerWeek: 22, status: 'Normal', classes: ['9-A', '12-IB'] },
    { name: 'Ms. Clara Henderson', department: 'Physical Sciences', hoursPerWeek: 24, status: 'Normal', classes: ['10-B'] },
    { name: 'Dr. Marcus Thorne', department: 'Robotics & Computer Sci', hoursPerWeek: 31, status: 'Overloaded', classes: ['10-A', '11-AP', '12-IB'] },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Subtab Navigation */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                Academics Module
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                  Principal Executive View
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage curriculum, timetables, syllabus completion, exam schedules & faculty workloads
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Academic Health Score:</span>
            <span className="px-3 py-1 rounded-xl bg-emerald-500 text-slate-950 font-black text-sm shadow-xs">
              92% Excellent
            </span>
          </div>
        </div>

        {/* Subtabs horizontal list */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
          {subTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeSubTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-sm'
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

      {/* Subtab View Content */}
      {activeSubTab === 'Overview' && (
        <div className="space-y-6">
          {/* Top 6 Summary KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Health Score</span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">92%</p>
              <span className="text-[10px] font-extrabold text-emerald-500">Above Benchmark</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Classes Today</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white">72</p>
              <span className="text-[10px] font-medium text-slate-400">100% Active</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Faculty Teaching</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white">108</p>
              <span className="text-[10px] font-medium text-teal-500">4 Substitutes</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Timetable Pending</span>
              <p className="text-2xl font-black text-amber-500">2</p>
              <span className="text-[10px] font-bold text-amber-600">Requires Approval</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Exam Approvals</span>
              <p className="text-2xl font-black text-rose-500">1</p>
              <span className="text-[10px] font-bold text-rose-600">Mid-Term Schedule</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Syllabus Complete</span>
              <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">89%</p>
              <span className="text-[10px] font-extrabold text-emerald-500">On Track for Term 1</span>
            </div>
          </div>

          {/* Grid: Teacher Workload + Upcoming Exams */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-emerald-500" />
                  Faculty Workload Overview
                </h3>
                <span className="text-xs font-bold text-slate-400">Avg: 24.4 hrs/wk</span>
              </div>

              <div className="space-y-3">
                {teacherWorkload.slice(0, 4).map((tw, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 space-y-1.5 text-xs">
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-slate-900 dark:text-white">{tw.name} ({tw.department})</span>
                      <span className={`${tw.status === 'Overloaded' ? 'text-rose-500' : 'text-emerald-600'}`}>
                        {tw.hoursPerWeek} hrs/wk ({tw.status})
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${tw.status === 'Overloaded' ? 'bg-rose-500' : 'bg-emerald-500'}`}
                        style={{ width: `${Math.min((tw.hoursPerWeek / 35) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-indigo-500" />
                  Upcoming Exam Milestones
                </h3>
                <span className="text-xs font-bold text-indigo-500">Term 1 Examinations</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Grade 12 IB Mock Examinations</h4>
                    <p className="text-[10px] text-slate-400">Aug 5 - Aug 12, 2026 • Main Examination Hall</p>
                  </div>
                  <span className="px-2 py-1 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-extrabold">
                    Ready
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Term 1 All-School Mid-Term Exams</h4>
                    <p className="text-[10px] text-slate-400">Aug 15 - Aug 22, 2026 • All Classrooms</p>
                  </div>
                  <span className="px-2 py-1 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-extrabold">
                    Approval Pending
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Classes & Sections View */}
      {activeSubTab === 'Classes' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Classes & Sections Roster (72 Total Sections)
            </h3>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search class or teacher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3 rounded-l-xl">Class / Section</th>
                  <th className="p-3">Class Teacher</th>
                  <th className="p-3">Room</th>
                  <th className="p-3">Students</th>
                  <th className="p-3">Class Avg GPA</th>
                  <th className="p-3">Syllabus Progress</th>
                  <th className="p-3 rounded-r-xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {classesData.map((cls) => (
                  <tr key={cls.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-extrabold text-slate-900 dark:text-white">
                      {cls.grade} - Section {cls.section}
                    </td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">{cls.classTeacher}</td>
                    <td className="p-3 text-slate-500">{cls.room}</td>
                    <td className="p-3 font-bold">{cls.studentsCount} Students</td>
                    <td className="p-3 font-bold text-emerald-600">{cls.avgGpa}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${cls.syllabusPct}%` }} />
                        </div>
                        <span className="font-bold text-[11px]">{cls.syllabusPct}%</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <button className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 font-bold hover:bg-emerald-500/20">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Timetable Approval Subtab */}
      {activeSubTab === 'TimetableApproval' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Pending Timetable Revision Approvals ({pendingTimetables.length})
          </h3>

          <div className="space-y-3">
            {pendingTimetables.map((item) => (
              <div key={item.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white">{item.title}</span>
                    <span className="text-[10px] text-slate-400">• {item.submitted}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">Requested by: <strong>{item.requestedBy}</strong></p>
                  <p className="text-xs text-slate-500 italic">"{item.reason}"</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => alert(`Approved ${item.title}`)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve Timetable
                  </button>
                  <button
                    onClick={() => alert(`Rejected ${item.title}`)}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-300 font-bold text-xs flex items-center gap-1 border border-rose-200 dark:border-rose-900"
                  >
                    <X className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fallback view for other subtabs */}
      {['Timetable', 'ExamSchedule', 'ExamApproval', 'Syllabus', 'Workload', 'Calendar'].includes(activeSubTab) && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 text-center space-y-3">
          <BookOpen className="w-8 h-8 text-emerald-500 mx-auto" />
          <h3 className="font-black text-base text-slate-900 dark:text-white">
            {subTabs.find(t => t.id === activeSubTab)?.label} View
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Interactive executive schedule & management table loaded for {activeSubTab}. Principal read-only access active.
          </p>
        </div>
      )}
    </div>
  );
};
