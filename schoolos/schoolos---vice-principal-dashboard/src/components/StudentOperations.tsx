import React, { useState } from 'react';
import {
  GraduationCap,
  Clock,
  ShieldAlert,
  HeartPulse,
  UserCheck,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Plus,
  AlertTriangle
} from 'lucide-react';
import { StudentAlertItem } from '../types';

interface Props {
  studentAlerts: StudentAlertItem[];
  onOpenIncidentModal: (item: any) => void;
}

export const StudentOperations: React.FC<Props> = ({ studentAlerts, onOpenIncidentModal }) => {
  const [alerts, setAlerts] = useState<StudentAlertItem[]>(studentAlerts);

  const handleResolveAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'Addressed' } : a));
  };

  return (
    <section id="student-mgmt" className="space-y-4 scroll-mt-20">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Student Operations</span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-800 text-slate-300 rounded border border-slate-700">
              1,900 Enrolled
            </span>
          </h3>
          <p className="text-xs text-slate-400">Student daily attendance, gate logs, medical visits, counseling, and discipline</p>
        </div>
      </div>

      {/* Top 6 KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        
        <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Student Attendance</span>
            <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-xl font-black text-white">96.9%</div>
          <div className="text-[10px] text-purple-400 font-medium">1,842 Present</div>
        </div>

        <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Late Arrivals</span>
            <Clock className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-black text-white">28 Logged</div>
          <div className="text-[10px] text-amber-400 font-medium">Gate Pass Issued</div>
        </div>

        <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Discipline Cases</span>
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-xl font-black text-white">3 Active</div>
          <div className="text-[10px] text-rose-400 font-medium">VP Review Scheduled</div>
        </div>

        <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Medical Room</span>
            <HeartPulse className="w-3.5 h-3.5 text-red-400" />
          </div>
          <div className="text-xl font-black text-white">4 Visits</div>
          <div className="text-[10px] text-slate-400 font-medium">1 Parent Pick-up</div>
        </div>

        <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Counseling</span>
            <UserCheck className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="text-xl font-black text-white">5 Sessions</div>
          <div className="text-[10px] text-sky-400 font-medium">Ms. Adams Active</div>
        </div>

        <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Parent Meetings</span>
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-white">2 Scheduled</div>
          <div className="text-[10px] text-emerald-400 font-medium">Room 102 Conference</div>
        </div>

      </div>

      {/* Recent Student Alerts */}
      <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm font-bold text-white">Recent Student Flags & Gate Logs</h4>
          </div>
          <span className="text-xs text-slate-400">Live feed from security gate & nurse desk</span>
        </div>

        <div className="space-y-2.5">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="p-3 bg-slate-950/60 hover:bg-slate-950 border border-slate-800/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg text-xs font-bold shrink-0 ${
                  alert.type === 'Discipline' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                  alert.type === 'Medical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                  alert.type === 'Late Arrival' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                }`}>
                  {alert.type}
                </div>

                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span>{alert.studentName}</span>
                    <span className="text-slate-400 font-normal">({alert.gradeClass})</span>
                    <span className="text-[10px] text-slate-500 font-mono">• {alert.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">{alert.details}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {alert.status === 'Open' ? (
                  <button
                    onClick={() => handleResolveAlert(alert.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
                  >
                    Address Log
                  </button>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-emerald-400 font-semibold px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Addressed
                  </span>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>

    </section>
  );
};
