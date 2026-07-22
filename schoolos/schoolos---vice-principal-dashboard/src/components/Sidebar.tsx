import React from 'react';
import {
  LayoutDashboard,
  ShieldAlert,
  Clock,
  Users,
  GraduationCap,
  BookOpen,
  CalendarCheck,
  Shield,
  FileCheck2,
  Megaphone,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  School,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSelectSection: (sectionId: string) => void;
  urgentCount: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSelectSection,
  urgentCount,
  isCollapsed,
  onToggleCollapse
}) => {
  const menuItems = [
    { id: 'operations', label: 'Operations Dashboard', icon: LayoutDashboard },
    { id: 'urgent-action', label: 'Urgent Action Center', icon: ShieldAlert, badge: urgentCount, badgeColor: 'bg-red-500 text-white animate-pulse' },
    { id: 'daily-ops', label: 'Daily Operations', icon: Clock },
    { id: 'teacher-mgmt', label: 'Teacher Management', icon: Users },
    { id: 'student-mgmt', label: 'Student Management', icon: GraduationCap },
    { id: 'academics', label: 'Academics', icon: BookOpen },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
    { id: 'discipline', label: 'Discipline', icon: Shield },
    { id: 'examinations', label: 'Examinations', icon: FileCheck2 },
    { id: 'communication', label: 'Communication', icon: Megaphone },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside
      className={`relative sticky top-16 h-[calc(100vh-4rem)] bg-slate-950/90 border-r border-slate-800/80 transition-all duration-300 flex flex-col justify-between shrink-0 z-30 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Top Branding Section */}
      <div className="p-3 border-b border-slate-800/60">
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-2.5 overflow-hidden transition-all ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-sky-500 flex items-center justify-center text-slate-950 font-black text-xs shadow">
              S
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white text-sm tracking-wide">SchoolOS</span>
                <span className="px-1.5 py-0.2 text-[9px] font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded">
                  VP
                </span>
              </div>
              <p className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase">Vice Principal Mode</p>
            </div>
          </div>

          <button
            onClick={onToggleCollapse}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition-colors mx-auto"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        <div className={`px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 ${isCollapsed ? 'hidden' : 'block'}`}>
          Menu Navigation
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectSection(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500/20 to-sky-500/10 text-emerald-300 border border-emerald-500/30 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'
                }`} />
                {!isCollapsed && (
                  <span className="truncate tracking-tight">{item.label}</span>
                )}
              </div>

              {!isCollapsed && item.badge !== undefined && item.badge > 0 && (
                <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Command Card */}
      {!isCollapsed && (
        <div className="p-3 border-t border-slate-800/60 bg-slate-950/40">
          <div className="p-3 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Operational Command</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Focused on today's school logistics, faculty readiness, and student discipline.
            </p>
          </div>
        </div>
      )}

    </aside>
  );
};
