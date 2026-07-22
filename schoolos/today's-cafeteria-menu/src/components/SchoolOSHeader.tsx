import React from 'react';
import { Shield, User, Users, GraduationCap, Eye, Calendar, Sparkles } from 'lucide-react';
import { Role } from '../types';

interface HeaderProps {
  role: Role;
  setRole: (role: Role) => void;
  isPublished: boolean;
  setIsPublished: (published: boolean) => void;
}

export const SchoolOSHeader: React.FC<HeaderProps> = ({
  role,
  setRole,
  isPublished,
  setIsPublished,
}) => {
  return (
    <header className="w-full bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 px-4 sm:px-8 py-3.5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Brand & Portal Title */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-950/30">
            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center text-emerald-400 font-extrabold text-lg">
              S
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-100 tracking-tight flex items-center gap-1.5">
                School<span className="text-emerald-400">OS</span>
              </h1>
              <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Enterprise
              </span>
            </div>
            <p className="text-xs text-slate-400">Student & Parent Portal • Campus Cafeteria</p>
          </div>
        </div>

        {/* View Controls & Interactive State Switcher for Evaluator */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          
          {/* Menu Published Toggle */}
          <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setIsPublished(true)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                isPublished
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Menu Published
            </button>
            <button
              onClick={() => setIsPublished(false)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                !isPublished
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              No Menu State
            </button>
          </div>

          {/* Student vs Parent View Selector */}
          <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setRole('student')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                role === 'student'
                  ? 'bg-slate-800 text-slate-100 border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
              Student View
            </button>
            <button
              onClick={() => setRole('parent')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                role === 'parent'
                  ? 'bg-slate-800 text-slate-100 border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              Parent View
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};
