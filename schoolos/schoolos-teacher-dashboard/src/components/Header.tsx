import React, { useState } from "react";
import { TeacherProfile } from "../types";
import {
  Search,
  Bell,
  Moon,
  Sun,
  GraduationCap,
  Sparkles,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
} from "lucide-react";

interface HeaderProps {
  profile: TeacherProfile;
  onOpenSearch?: () => void;
  onOpenNotifications?: () => void;
  onQuickAction?: (action: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  onOpenSearch,
  onQuickAction,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const notifications = [
    {
      id: "n1",
      title: "Attendance Pending",
      desc: "Grade 9B Foundation Math attendance needs completion for Period 4.",
      time: "10 mins ago",
      type: "alert",
    },
    {
      id: "n2",
      title: "New Parent Message",
      desc: "Mrs. Rivera sent a note regarding Alex Rivera's absence reason.",
      time: "25 mins ago",
      type: "message",
    },
    {
      id: "n3",
      title: "Exam Duty Confirmation",
      desc: "Mid-Term Invigilation schedule confirmed for Aug 4.",
      time: "1 hour ago",
      type: "info",
    },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 md:px-6 flex items-center justify-between text-slate-100">
      {/* Left: School Branding & Term Info */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <GraduationCap size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 leading-tight">
              {profile.schoolName}
            </h2>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
              <span className="text-emerald-400 font-semibold">
                AY {profile.academicYear}
              </span>
              <span>•</span>
              <span className="px-1.5 py-0.2 bg-slate-800 rounded text-slate-300">
                Term 1
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Center: Global Search */}
      <div className="flex-1 max-w-md mx-4">
        <div
          onClick={onOpenSearch}
          className="relative flex items-center w-full px-3 py-2 bg-slate-900/90 hover:bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-slate-200 cursor-pointer transition shadow-inner"
        >
          <Search size={16} className="text-slate-500 mr-2 shrink-0" />
          <span className="text-xs truncate">
            Search students, classes, attendance, assignments, lesson plans...
          </span>
          <kbd className="hidden sm:inline-flex items-center gap-1 ml-auto text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Actions, Badges & Profile */}
      <div className="flex items-center gap-3">
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-slate-100 transition"
          title="Toggle Dark/Light Mode"
        >
          {darkMode ? (
            <Moon size={18} className="text-emerald-400" />
          ) : (
            <Sun size={18} className="text-amber-400" />
          )}
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-slate-100 transition relative"
            title="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-slate-950 animate-pulse" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 text-xs z-50">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="font-bold text-slate-100 text-sm flex items-center gap-2">
                  Notifications
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px]">
                    3 New
                  </span>
                </span>
                <button className="text-emerald-400 hover:underline text-[11px]">
                  Mark all as read
                </button>
              </div>

              <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto custom-scrollbar">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 hover:border-slate-700 transition flex gap-3"
                  >
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0 h-fit mt-0.5">
                      {n.type === "alert" ? (
                        <AlertCircle size={14} className="text-amber-400" />
                      ) : n.type === "message" ? (
                        <MessageSquare size={14} className="text-emerald-400" />
                      ) : (
                        <CheckCircle2 size={14} className="text-cyan-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-200">
                        {n.title}
                      </div>
                      <div className="text-slate-400 mt-0.5">{n.desc}</div>
                      <div className="text-[10px] text-slate-500 mt-1">
                        {n.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Teacher Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 p-1.5 pl-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center font-bold text-white text-xs shadow-md">
              EC
            </div>
            <div className="hidden md:block text-left text-xs">
              <div className="font-semibold text-slate-100 flex items-center gap-1">
                {profile.name}
              </div>
              <div className="text-slate-400 text-[10px]">
                {profile.title}
              </div>
            </div>
            <ChevronDown size={14} className="text-slate-400 hidden md:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 text-xs z-50">
              <div className="p-2.5 border-b border-slate-800">
                <div className="font-bold text-slate-100">{profile.name}</div>
                <div className="text-emerald-400 font-medium">
                  {profile.classTeacherOf} Teacher
                </div>
                <div className="text-slate-400 text-[10px] mt-0.5">
                  {profile.department}
                </div>
              </div>
              <div className="py-1 space-y-0.5">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onQuickAction?.("profile");
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-slate-100 transition"
                >
                  View Profile & Schedule
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onQuickAction?.("settings");
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-slate-100 transition"
                >
                  Account Settings
                </button>
              </div>
              <div className="pt-1 border-t border-slate-800">
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-500/20 text-rose-400 transition font-medium">
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
