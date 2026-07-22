import React from "react";
import { NavSection } from "../types";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  CheckCircle2,
  FileText,
  BookOpen,
  GraduationCap,
  Award,
  BarChart3,
  MessageSquare,
  Presentation,
  FolderOpen,
  Calendar,
  FileSpreadsheet,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";

interface SidebarProps {
  activeSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  unreadCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSelectSection,
  collapsed,
  onToggleCollapse,
  unreadCount = 8,
}) => {
  const menuItems: {
    id: NavSection;
    label: string;
    icon: React.ElementType;
    badge?: string | number;
    badgeColor?: string;
  }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "timetable", label: "My Timetable", icon: CalendarDays },
    { id: "classes", label: "My Classes", icon: Users, badge: "5 Classes" },
    {
      id: "attendance",
      label: "Attendance",
      icon: CheckCircle2,
      badge: "1 Pending",
      badgeColor: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
    },
    { id: "assignments", label: "Assignments", icon: FileText, badge: 28 },
    { id: "lessons", label: "Lesson Plans", icon: BookOpen },
    { id: "students", label: "Students", icon: GraduationCap },
    { id: "exams", label: "Exams", icon: Award },
    { id: "grading", label: "Marks & Grading", icon: BarChart3 },
    {
      id: "communication",
      label: "Communication",
      icon: MessageSquare,
      badge: unreadCount,
      badgeColor: "bg-rose-500/20 text-rose-400 border border-rose-500/30",
    },
    { id: "classroom", label: "Classroom", icon: Presentation },
    { id: "resources", label: "Resources", icon: FolderOpen },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "reports", label: "Reports", icon: FileSpreadsheet },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-slate-950/80 backdrop-blur-xl border-r border-slate-800/80 text-slate-200 transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-900/30 shrink-0">
            S
          </div>
          {!collapsed && (
            <div className="truncate">
              <h1 className="font-bold text-base tracking-wide text-slate-100 flex items-center gap-1.5">
                SchoolOS
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Pro
                </span>
              </h1>
              <p className="text-xs text-slate-400 font-medium truncate">
                Teacher Portal
              </p>
            </div>
          )}
        </div>

        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition border border-slate-800"
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
        {!collapsed && (
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Menu Navigation
          </div>
        )}

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative group ${
                isActive
                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-md shadow-emerald-950/40"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/60"
              }`}
              title={collapsed ? item.label : undefined}
            >
              {isActive && (
                <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-emerald-400 rounded-r" />
              )}

              <Icon
                size={18}
                className={`shrink-0 ${
                  isActive ? "text-emerald-400" : "text-slate-400 group-hover:text-slate-200"
                }`}
              />

              {!collapsed && (
                <span className="truncate flex-1 text-left">{item.label}</span>
              )}

              {!collapsed && item.badge !== undefined && (
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                    item.badgeColor ||
                    "bg-slate-800 text-slate-300 border border-slate-700"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Class Teacher Badge Box */}
      {!collapsed && (
        <div className="p-3 m-3 rounded-xl bg-slate-900/90 border border-slate-800/80 text-xs">
          <div className="flex items-center gap-2 font-semibold text-slate-200">
            <ShieldAlert size={14} className="text-emerald-400 shrink-0" />
            Class Teacher
          </div>
          <p className="text-slate-400 mt-1">Grade 10A • 41 Students</p>
          <div className="mt-2 text-[10px] text-emerald-400 font-mono">
            Room 302 • Attendance 95%
          </div>
        </div>
      )}
    </aside>
  );
};
