import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Eye,
  Search,
  Filter,
  Plus,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { TeacherRecord } from '../types';

interface Props {
  teachers: TeacherRecord[];
  onOpenSubstituteModal: (teacher?: TeacherRecord) => void;
}

export const TeacherOperations: React.FC<Props> = ({ teachers, onOpenSubstituteModal }) => {
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  const departments = ['All', 'Mathematics', 'Science & Physics', 'Humanities & History', 'Chemistry & Bio', 'English Literature', 'Computer Science', 'Physical Education'];

  const filteredTeachers = teachers.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
                          t.currentClass.toLowerCase().includes(search.toLowerCase()) ||
                          t.room.toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDept === 'All' || t.department.includes(selectedDept);
    return matchesSearch && matchesDept;
  });

  const getStatusBadge = (status: TeacherRecord['status']) => {
    switch (status) {
      case 'Present':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'On Leave':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'Substitute Assigned':
        return 'bg-sky-500/20 text-sky-400 border-sky-500/30';
      case 'Late':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'In Observation':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-slate-800 text-slate-300';
    }
  };

  return (
    <section id="teacher-mgmt" className="space-y-4 scroll-mt-20">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Teacher Operations</span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-800 text-slate-300 rounded border border-slate-700">
              115 Faculty Members
            </span>
          </h3>
          <p className="text-xs text-slate-400">Faculty attendance, substitute coverage, workload monitoring, and observations</p>
        </div>
      </div>

      {/* Top 6 Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        
        <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Teacher Attendance</span>
            <Users className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-white">97%</div>
          <div className="text-[10px] text-emerald-400 font-medium">108 / 115 Present</div>
        </div>

        <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Leave Requests</span>
            <UserX className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-xl font-black text-white">3 Pending</div>
          <div className="text-[10px] text-rose-400 font-medium">Action Needed</div>
        </div>

        <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Substitutes</span>
            <UserCheck className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="text-xl font-black text-white">3 Assigned</div>
          <div className="text-[10px] text-sky-400 font-medium">100% Period Coverage</div>
        </div>

        <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Today's Workload</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
          </div>
          <div className="text-xl font-black text-white">Balanced</div>
          <div className="text-[10px] text-teal-400 font-medium">Avg 4.8 Periods/Day</div>
        </div>

        <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Late Teachers</span>
            <Clock className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-black text-white">2 Flagged</div>
          <div className="text-[10px] text-amber-400 font-medium">Gate Scan Logged</div>
        </div>

        <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Observations</span>
            <Eye className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-xl font-black text-white">4 Scheduled</div>
          <div className="text-[10px] text-purple-400 font-medium">VP Calendar Active</div>
        </div>

      </div>

      {/* Teacher Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        
        {/* Table Filter Bar */}
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950/60">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search teacher, room..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
            >
              {departments.map((d, i) => (
                <option key={i} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Teacher Name</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Current Class & Room</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Operational Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTeachers.map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-white">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sky-400 text-xs">
                        {t.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div>{t.name}</div>
                        <div className="text-[10px] text-slate-500 font-normal">{t.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 font-medium">{t.department}</td>
                  <td className="py-3.5 px-4 text-slate-300">
                    <div>{t.currentClass}</div>
                    <div className="text-[10px] text-slate-500">{t.room}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${getStatusBadge(t.status)}`}>
                      {t.status}
                    </span>
                    {t.substituteName && (
                      <div className="text-[10px] text-sky-400 mt-1 font-medium">
                        Cover: {t.substituteName}
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {t.status === 'On Leave' && (
                        <button
                          onClick={() => onOpenSubstituteModal(t)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-sky-300 bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/30 rounded-lg transition-colors"
                        >
                          Assign Cover
                        </button>
                      )}
                      <button
                        title="Contact Teacher"
                        className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg hover:bg-slate-700"
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </button>
                      <button
                        title="Schedule VP Classroom Observation"
                        className="p-1.5 text-purple-400 hover:text-purple-300 bg-purple-500/10 border border-purple-500/20 rounded-lg hover:bg-purple-500/20"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </section>
  );
};
