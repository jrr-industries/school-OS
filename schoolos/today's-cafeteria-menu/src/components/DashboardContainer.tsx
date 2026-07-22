import React from 'react';
import { 
  GraduationCap, 
  Users, 
  Clock, 
  BookOpen, 
  BellRing, 
  CheckCircle, 
  Sparkles,
  Calendar,
  Layers
} from 'lucide-react';
import { CafeteriaData, Role } from '../types';
import { MenuWidget } from './MenuWidget';

interface DashboardContainerProps {
  role: Role;
  data: CafeteriaData;
}

export const DashboardContainer: React.FC<DashboardContainerProps> = ({ role, data }) => {
  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Welcome Banner */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-5 sm:p-6 relative overflow-hidden shadow-xl shadow-black/40">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  {role === 'student' ? <GraduationCap className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
                  {role === 'student' ? 'Student Account' : 'Parent Account'}
                </span>
                <span className="text-xs text-slate-400">Section 10-B</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
                {role === 'student' ? 'Welcome back, Alex!' : 'Welcome, Parent of Alex Smith'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Here is your campus daily overview for {data.dateString}.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-slate-950/60 border border-slate-800/80 rounded-xl px-4 py-2.5 text-xs">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="text-slate-400 font-medium">Academic Term</p>
                <p className="text-slate-200 font-bold">Fall Semester 2026</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Column: Featured Cafeteria Menu Widget */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                Featured Widget
              </h3>
              <span className="text-[11px] text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Live Sync
              </span>
            </div>

            {/* Read-Only Cafeteria Menu Widget */}
            <MenuWidget data={data} />
          </div>

          {/* Secondary Dashboard Content for SchoolOS Context */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Quick Stats Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl p-4 shadow-lg">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold">Today's Attendance</span>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-lg font-bold text-slate-100">Present</p>
                <p className="text-[11px] text-emerald-400 font-medium mt-1">Checked in at 8:15 AM</p>
              </div>

              <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl p-4 shadow-lg">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold">Classes Today</span>
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-lg font-bold text-slate-100">6 Lectures</p>
                <p className="text-[11px] text-slate-400 mt-1">Next: Physics (Lab 2)</p>
              </div>

              <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl p-4 shadow-lg">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold">Cafeteria Balance</span>
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-lg font-bold text-emerald-400">$45.50</p>
                <p className="text-[11px] text-slate-400 mt-1">Meal plan active</p>
              </div>

            </div>

            {/* Today's Schedule & Announcements Preview */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  Today's Timeline
                </h3>
                <span className="text-xs text-slate-400 font-medium">July 22, 2026</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <div>
                      <p className="font-bold text-slate-200">Breakfast Service</p>
                      <p className="text-slate-400">Cafeteria Hall A • Idli & Sambar</p>
                    </div>
                  </div>
                  <span className="text-slate-400 font-medium bg-slate-900 px-2 py-1 rounded border border-slate-800">
                    07:30 - 08:30
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <div>
                      <p className="font-bold text-emerald-300">Lunch Hour Service (Active)</p>
                      <p className="text-emerald-400/80">Rice, Dal, Vegetable Curry, Curd</p>
                    </div>
                  </div>
                  <span className="text-emerald-300 font-semibold bg-emerald-950/60 px-2 py-1 rounded border border-emerald-500/30">
                    12:00 - 13:30
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-slate-600" />
                    <div>
                      <p className="font-bold text-slate-200">Evening Snack Break</p>
                      <p className="text-slate-400">Banana & Milk Service</p>
                    </div>
                  </div>
                  <span className="text-slate-400 font-medium bg-slate-900 px-2 py-1 rounded border border-slate-800">
                    16:00 - 16:45
                  </span>
                </div>
              </div>

            </div>

            {/* SchoolOS Policy Card */}
            <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-4 flex items-center gap-3 text-xs text-slate-400">
              <BellRing className="w-5 h-5 text-emerald-400 shrink-0" />
              <p>
                <strong className="text-slate-200">Dietary Notice:</strong> All cafeteria items are prepared following standard SchoolOS nutritional guidelines. Meals are 100% vegetarian, balanced, and prepared fresh daily.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
