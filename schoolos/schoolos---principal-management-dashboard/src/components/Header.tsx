import React, { useState } from 'react';
import {
  School,
  Search,
  Bell,
  Sparkles,
  Calendar,
  Clock,
  ShieldCheck,
  ChevronDown,
  Moon,
  Sun,
  User,
  LogOut,
  SlidersHorizontal,
} from 'lucide-react';
import { SchoolInfo } from '../types';

interface HeaderProps {
  schoolInfo: SchoolInfo;
  pendingCount: number;
  onOpenAIBriefing: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  activeSection: string;
  timeRange?: string;
  onTimeRangeChange?: (range: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  schoolInfo,
  pendingCount,
  onOpenAIBriefing,
  isDarkMode,
  onToggleDarkMode,
  searchTerm,
  onSearchChange,
  timeRange = 'Today',
  onTimeRangeChange,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors duration-200">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left: Branding & Campus Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-500/20">
            <School className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                SchoolOS
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Principal Executive
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
              {schoolInfo.name}
            </p>
          </div>
        </div>

        {/* Center: Search Bar & Global Time Range Selector */}
        <div className="hidden md:flex items-center flex-1 max-w-xl mx-6 gap-3">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search students, staff, classes, bus routes or approvals..."
              className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>

          {/* Global Filter (Small UI Improvement 3) */}
          <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200">
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <select
              value={timeRange}
              onChange={(e) => onTimeRangeChange && onTimeRangeChange(e.target.value)}
              className="bg-transparent text-xs font-extrabold focus:outline-none cursor-pointer text-slate-900 dark:text-white"
            >
              <option value="Today">Range: Today</option>
              <option value="This Week">Range: This Week</option>
              <option value="This Month">Range: This Month</option>
              <option value="Current Term">Range: Current Term</option>
              <option value="Academic Year">Range: Academic Year</option>
            </select>
          </div>
        </div>


        {/* Right: Actions, AI Tool, Notifications, Profile */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Term Selector Pill */}
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{schoolInfo.academicYear}</span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
              {schoolInfo.term}
            </span>
          </div>

          {/* AI Principal Assistant Button */}
          <button
            onClick={onOpenAIBriefing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-sm shadow-emerald-500/20 active:scale-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-300" />
            <span className="hidden sm:inline">AI Intelligence Briefing</span>
          </button>

          {/* Notifications Center Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Pending Approvals & Notifications"
            >
              <Bell className="w-4 h-4" />
              {pendingCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm animate-bounce">
                  {pendingCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 text-xs">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">
                    Approval Center
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-semibold text-[10px]">
                    {pendingCount} Pending
                  </span>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  <div className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      Medical Leave: Mr. Robert Vance
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                      2 Days Physics Substitute Approval
                    </p>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                      High Priority
                    </span>
                  </div>
                  <div className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      STEM Lab Budget: $4,200
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                      VEX V5 Robotics Kits Procurement
                    </p>
                  </div>
                  <div className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      Discipline Incident #304
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                      West Wing Cafeteria Review Required
                    </p>
                  </div>
                </div>
                <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 text-center">
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold text-[11px]"
                  >
                    View All Approvals
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle theme"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Principal Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <img
                src={schoolInfo.principal.avatar}
                alt={schoolInfo.principal.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/30"
                referrerPolicy="no-referrer"
              />
              <div className="text-left hidden lg:block">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                  {schoolInfo.principal.name}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Principal
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 text-xs">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="font-bold text-slate-900 dark:text-white">
                    {schoolInfo.principal.name}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {schoolInfo.principal.email}
                  </p>
                </div>
                <div className="py-1">
                  <button className="w-full text-left px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Principal Profile & Credentials
                  </button>
                  <button className="w-full text-left px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                    Campus Security & Audit Log
                  </button>
                  <button className="w-full text-left px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                    System Preferences
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
