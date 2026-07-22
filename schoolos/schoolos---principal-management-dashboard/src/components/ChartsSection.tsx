import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { BarChart3, GraduationCap, TrendingUp, Calendar, Filter } from 'lucide-react';
import { weeklyAttendanceData, gradeDistributionData } from '../data/mockData';

export const ChartsSection: React.FC = () => {
  const [attendanceView, setAttendanceView] = useState<'overall' | 'byGrade'>('overall');

  return (
    <section className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Attendance & Academic Performance Analytics
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive grade-wise attendance trends and Term 1 academic score distribution
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAttendanceView('overall')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              attendanceView === 'overall'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            Overall Trend
          </button>
          <button
            onClick={() => setAttendanceView('byGrade')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              attendanceView === 'byGrade'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            By Grade Breakdown
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend Chart */}
        <div className="space-y-3 bg-slate-50/50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Daily Attendance Rate (%)
            </h3>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              Avg 96.9% Present
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyAttendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="grade12Gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis domain={[85, 100]} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={attendanceView === 'overall' ? 'overall' : 'grade10'}
                  name={attendanceView === 'overall' ? 'Overall Attendance %' : 'Grade 10 Attendance %'}
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#attendanceGradient)"
                />
                {attendanceView === 'byGrade' && (
                  <Area
                    type="monotone"
                    dataKey="grade12"
                    name="Grade 12 Senior %"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#grade12Gradient)"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grade Distribution Chart */}
        <div className="space-y-3 bg-slate-50/50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-500" />
              Academic Grade Distribution (A, B, C, D, F)
            </h3>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              GPA Lead: 3.91 (Arts)
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="subject" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="gradeA" name="A Grade %" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="gradeB" name="B Grade %" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="gradeC" name="C Grade %" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="gradeD" name="D/F Grade %" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
};
