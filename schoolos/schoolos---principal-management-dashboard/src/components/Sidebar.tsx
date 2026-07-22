import React from 'react';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  UserCheck,
  FileCheck,
  Bus,
  Utensils,
  DollarSign,
  Megaphone,
  Trophy,
  FileText,
  CheckCircle2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  pendingCount: number;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  pendingCount,
  collapsed,
  onToggleCollapse,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'academics', label: '1. Academics', icon: GraduationCap },
    { id: 'students', label: '2. Students', icon: Users },
    { id: 'teachers', label: '3. Teachers', icon: UserCheck },
    { id: 'exams', label: '4. Exams', icon: FileCheck },
    { id: 'transport', label: '5. Transport', icon: Bus },
    { id: 'lunch', label: '6. School Lunch', icon: Utensils },
    { id: 'finance', label: '7. Finance (Read-Only)', icon: DollarSign },
    { id: 'communication', label: '8. Communication', icon: Megaphone },
    { id: 'activities', label: '9. Activities', icon: Trophy },
    { id: 'reports', label: '10. Reports', icon: FileText },
    { id: 'approvals', label: '11. Approval Center', icon: CheckCircle2, badge: pendingCount },
    { id: 'ai-assistant', label: 'AI Principal Suite', icon: Sparkles, highlight: true },
  ];

  return (
    <aside
      className={`relative flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 z-30 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={onToggleCollapse}
        className="absolute -right-3 top-6 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white shadow-sm z-40 transition-transform"
        title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Navigation List */}
      <div className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          {!collapsed && 'Main Menu'}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all relative ${
                isActive
                  ? 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
              } ${item.highlight ? 'ring-1 ring-amber-400/30' : ''}`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : item.highlight
                    ? 'text-amber-500'
                    : 'text-slate-400'
                }`}
              />

              {!collapsed && (
                <span className="truncate flex-1 text-left">{item.label}</span>
              )}

              {/* Badge for Approvals */}
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`flex h-4 min-w-4 items-center justify-center px-1 rounded-full text-[10px] font-bold text-white bg-rose-500 ${
                    collapsed ? 'absolute top-1 right-1' : ''
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      {!collapsed && (
        <div className="p-3 m-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-bold text-slate-800 dark:text-slate-200">
              Campus Online
            </span>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500">
            SchoolOS v4.2.0 • Green Valley
          </p>
        </div>
      )}
    </aside>
  );
};
