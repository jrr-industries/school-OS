'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  School,
  Zap,
  Bell,
  Calendar,
  BarChart3,
  BookOpen,
  Grid,
  Book,
  Clock,
  TrendingUp,
  FileText,
  ClipboardCheck,
  FileCheck,
  Eye,
  BarChart2,
  Users,
  UserPlus,
  UserCheck,
  User,
  Activity,
  Smile,
  AlertTriangle,
  HeartPulse,
  FileX,
  FileBarChart,
  UsersRound,
  Briefcase,
  CalendarMinus,
  Star,
  CheckCircle,
  GraduationCap,
  CalendarDays,
  MapPin,
  UserCog,
  FileQuestion,
  PenLine,
  BadgeCheck,
  PieChart,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Search,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { useThemeStore } from '@schoolos/hooks';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'Dashboard',
    items: [
      { label: 'Overview', href: '/principal/dashboard', icon: LayoutDashboard },
      { label: 'Live School Status', href: '/principal/live-status', icon: School },
      { label: 'Quick Actions', href: '/principal/quick-actions', icon: Zap },
      { label: 'Notifications', href: '/principal/notifications', icon: Bell },
      { label: 'Calendar', href: '/principal/calendar', icon: Calendar },
      { label: 'School Analytics', href: '/principal/analytics', icon: BarChart3 },
    ],
  },
  {
    title: 'Academic',
    items: [
      { label: 'Classes', href: '/principal/academic/classes', icon: BookOpen },
      { label: 'Sections', href: '/principal/academic/sections', icon: Grid },
      { label: 'Subjects', href: '/principal/academic/subjects', icon: Book },
      { label: 'Timetable', href: '/principal/academic/timetable', icon: Clock },
      { label: 'Curriculum Progress', href: '/principal/academic/curriculum', icon: TrendingUp },
      { label: 'Lesson Plans', href: '/principal/academic/lesson-plans', icon: FileText },
      { label: 'Homework Review', href: '/principal/academic/homework', icon: ClipboardCheck },
      { label: 'Assignments', href: '/principal/academic/assignments', icon: FileCheck },
      { label: 'Class Observation', href: '/principal/academic/observation', icon: Eye },
      { label: 'Academic Reports', href: '/principal/academic/reports', icon: BarChart2 },
    ],
  },
  {
    title: 'Students',
    items: [
      { label: 'All Students', href: '/principal/students', icon: Users },
      { label: 'Admissions', href: '/principal/students/admissions', icon: UserPlus },
      { label: 'Attendance', href: '/principal/students/attendance', icon: UserCheck },
      { label: 'Student Profiles', href: '/principal/students/profiles', icon: User },
      { label: 'Performance', href: '/principal/students/performance', icon: Activity },
      { label: 'Behaviour', href: '/principal/students/behaviour', icon: Smile },
      { label: 'Discipline Cases', href: '/principal/students/discipline', icon: AlertTriangle },
      { label: 'Medical Alerts', href: '/principal/students/medical', icon: HeartPulse },
      { label: 'TC Requests', href: '/principal/students/tc-requests', icon: FileX },
      { label: 'Student Reports', href: '/principal/students/reports', icon: FileBarChart },
    ],
  },
  {
    title: 'Teachers',
    items: [
      { label: 'All Teachers', href: '/principal/teachers', icon: UsersRound },
      { label: 'Attendance', href: '/principal/teachers/attendance', icon: UserCheck },
      { label: 'Workload', href: '/principal/teachers/workload', icon: Briefcase },
      { label: 'Timetable', href: '/principal/teachers/timetable', icon: Clock },
      { label: 'Leave Requests', href: '/principal/teachers/leave', icon: CalendarMinus },
      { label: 'Performance', href: '/principal/teachers/performance', icon: Star },
      { label: 'Classroom Observation', href: '/principal/teachers/observation', icon: Eye },
      { label: 'Lesson Completion', href: '/principal/teachers/lessons', icon: CheckCircle },
      { label: 'Training', href: '/principal/teachers/training', icon: GraduationCap },
      { label: 'Teacher Reports', href: '/principal/teachers/reports', icon: FileBarChart },
    ],
  },
  {
    title: 'Examinations',
    items: [
      { label: 'Exam Schedule', href: '/principal/exams/schedule', icon: CalendarDays },
      { label: 'Seat Arrangement', href: '/principal/exams/seating', icon: Grid },
      { label: 'Hall Allocation', href: '/principal/exams/halls', icon: MapPin },
      { label: 'Invigilator Assignment', href: '/principal/exams/invigilators', icon: UserCog },
      { label: 'Question Paper Status', href: '/principal/exams/question-papers', icon: FileQuestion },
      { label: 'Marks Entry Progress', href: '/principal/exams/marks-entry', icon: PenLine },
      { label: 'Result Approval', href: '/principal/exams/results', icon: BadgeCheck },
      { label: 'Report Cards', href: '/principal/exams/report-cards', icon: FileText },
      { label: 'Analytics', href: '/principal/exams/analytics', icon: PieChart },
    ],
  },
];

export default function PrincipalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(navSections.map((s) => s.title)));
  const { resolvedTheme, toggleTheme } = useThemeStore();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  };

  const isActive = (href: string) => {
    return pathname === href || (href !== '/principal/dashboard' && pathname?.startsWith(href + '/'));
  };

  const handleLogout = async () => {
    await fetch('/api/auth/dev-logout', { method: 'POST' });
    router.push('/login');
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="flex min-h-screen bg-slate-50/50 dark:bg-slate-950">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out dark:border-slate-800 dark:bg-slate-900 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
        aria-label="Principal navigation"
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-800">
          <Link href="/principal/dashboard" className="flex items-center gap-2 font-bold text-lg" aria-label="Principal Dashboard">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
              P
            </div>
            <span>Principal<span className="text-indigo-600">.</span></span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-muted-foreground hover:text-foreground"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 sidebar-scroll" aria-label="Principal navigation">
          {navSections.map((section) => {
            const isExpanded = expandedSections.has(section.title);
            const hasActiveChild = section.items.some((item) => isActive(item.href));

            return (
              <div key={section.title}>
                <button
                  onClick={() => toggleSection(section.title)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    hasActiveChild
                      ? 'text-primary'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-500'
                  }`}
                  aria-expanded={isExpanded}
                >
                  <span className="flex-1 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    {section.title}
                  </span>
                  {isExpanded ? (
                    <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                </button>
                {isExpanded && (
                  <div className="mt-1 space-y-0.5" role="group" aria-label={section.title}>
                    {section.items.map((item) => {
                      const ItemIcon = item.icon;
                      const active = isActive(item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                            active
                              ? 'bg-slate-100 font-medium text-slate-900 dark:bg-slate-800 dark:text-slate-100'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50'
                          }`}
                          aria-current={active ? 'page' : undefined}
                        >
                          <ItemIcon className={`h-4 w-4 shrink-0 ${active ? 'text-indigo-600' : 'text-slate-500'}`} aria-hidden="true" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 p-4 dark:border-slate-800 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
            DR
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-700 truncate dark:text-slate-300">Dr. R. Sharma</p>
            <p className="text-[11px] text-slate-400 truncate">Principal</p>
          </div>
          <button onClick={handleLogout} aria-label="Logout">
            <LogOut className="h-4 w-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-slate-200/60 bg-white/70 backdrop-blur-sm px-4 lg:px-6 dark:border-slate-800 dark:bg-slate-950/70">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>

          <div className="hidden sm:flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full text-sm text-slate-600 dark:text-slate-400">
            <Calendar className="h-4 w-4" />
            <span>{today}</span>
          </div>

          <div className="flex-1" />

          <button
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          <button
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
          </button>

          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
            aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {resolvedTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
