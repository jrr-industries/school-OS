import React, { useState } from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  School,
  ChevronDown,
  Sparkles,
  Check,
  Calendar,
  Layers,
  UserCheck,
  LogOut,
  Settings,
  ShieldCheck
} from 'lucide-react';
import { NotificationItem } from '../types';

interface HeaderProps {
  onOpenSearch: () => void;
  notifications: NotificationItem[];
  onClearNotification: (id: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenBriefing: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  notifications,
  onClearNotification,
  isDarkMode,
  onToggleDarkMode,
  onOpenBriefing
}) => {
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-6 flex items-center justify-between transition-colors">
      
      {/* Left: School Logo & Name */}
      <div className="flex items-center gap-3">
        <div className="relative group flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-sky-500 p-0.5 shadow-lg shadow-emerald-950/50 cursor-pointer">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-emerald-400 group-hover:bg-transparent group-hover:text-white transition-all">
            <School className="w-5 h-5" />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm lg:text-base font-bold text-white tracking-tight">
              Green Valley International School
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              Live Ops
            </span>
          </div>
          <p className="text-[11px] text-slate-400 hidden sm:block">SchoolOS Command Center • Operational Hub</p>
        </div>
      </div>

      {/* Middle: Global Search */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <button
          onClick={onOpenSearch}
          className="w-full h-9 px-3 bg-slate-900/90 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 rounded-xl flex items-center justify-between text-slate-400 hover:text-slate-200 text-xs transition-all shadow-inner"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-sky-400" />
            <span>Search teachers, students, buses, urgent cases...</span>
          </div>
          <kbd className="hidden lg:inline-flex px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-400 rounded border border-slate-700">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* Mobile Search Button */}
        <button
          onClick={onOpenSearch}
          className="md:hidden p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Academic Year & Term Badges */}
        <div className="hidden xl:flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/90 border border-slate-800 rounded-lg text-xs text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>AY 2026–2027</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/90 border border-slate-800 rounded-lg text-xs text-slate-300">
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <span>Term 1</span>
          </div>
        </div>

        {/* AI Briefing Button */}
        <button
          onClick={onOpenBriefing}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl transition-all shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Briefing</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifDropdown(!showNotifDropdown);
              setShowProfileDropdown(false);
            }}
            className="relative p-2 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-4 h-4 px-1 text-[10px] font-bold text-white bg-red-500 rounded-full animate-pulse shadow-md shadow-red-500/50">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-50 animate-fade-in text-slate-100">
              <div className="flex items-center justify-between p-3.5 border-b border-slate-800 bg-slate-950">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">Live Operations Alerts</span>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-red-500/20 text-red-400 rounded-full">
                    {unreadCount} New
                  </span>
                </div>
                <button
                  onClick={() => setShowNotifDropdown(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Close
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">No active alerts right now.</div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      className={`p-3 text-xs flex items-start justify-between gap-3 transition-colors ${
                        n.unread ? 'bg-slate-800/40' : 'bg-slate-900/50'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="font-semibold text-white flex items-center gap-1.5">
                          <span>{n.title}</span>
                          <span className="text-[10px] text-slate-400 font-normal">• {n.time}</span>
                        </div>
                        <p className="text-slate-300 leading-snug">{n.message}</p>
                      </div>
                      <button
                        onClick={() => onClearNotification(n.id)}
                        className="p-1 text-slate-500 hover:text-emerald-400 shrink-0"
                        title="Dismiss"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={onToggleDarkMode}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-400" />}
        </button>

        {/* Vice Principal Profile */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileDropdown(!showProfileDropdown);
              setShowNotifDropdown(false);
            }}
            className="flex items-center gap-2.5 p-1.5 pl-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all"
          >
            <div className="relative w-7 h-7 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow">
              DM
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-950 rounded-full"></span>
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-white leading-none">Mr. David Miller</div>
              <div className="text-[10px] font-semibold text-emerald-400 leading-none mt-0.5">Vice Principal</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {showProfileDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-2 z-50 text-slate-100 text-xs">
              <div className="p-2.5 mb-1 bg-slate-950/80 rounded-xl border border-slate-800">
                <div className="font-bold text-white">Mr. David Miller</div>
                <div className="text-[11px] text-emerald-400 font-medium">Vice Principal • Operations</div>
                <div className="text-[10px] text-slate-400 mt-0.5">d.miller@greenvalley.edu</div>
              </div>
              
              <button className="w-full flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" /> Administrative Rights
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                <Settings className="w-3.5 h-3.5 text-slate-400" /> Command Settings
              </button>
              <div className="my-1 border-t border-slate-800"></div>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                <LogOut className="w-3.5 h-3.5" /> Lock Command Desk
              </button>
            </div>
          )}
        </div>

      </div>

    </header>
  );
};
