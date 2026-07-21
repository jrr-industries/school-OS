'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, Users, GraduationCap, HeartHandshake,
  Briefcase, BookOpen, ClipboardCheck, CalendarClock, FileEdit,
  ClipboardList, Trophy, IndianRupee, Calculator,
  Bus, Library, Building2, Package, MessageSquare,
  BarChart3, LineChart, Settings, LogOut,
  School, ChevronDown, ChevronRight, Menu, X, Sun, Moon,
  UserCircle, Monitor, FileSpreadsheet, Notebook,
  UserCheck, UserCog, Route, UserPlus, UserRoundCog,
  BedDouble
} from 'lucide-react';
import { Avatar } from '@schoolos/ui';
import { useThemeStore } from '@schoolos/hooks';
import { cn } from '@schoolos/ui';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: string;
  children?: NavItem[];
}

interface NavSection {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    items: [{ label: 'Overview', href: '/school-admin/dashboard', icon: LayoutDashboard }],
  },
  {
    title: 'Admissions',
    icon: ClipboardCheck,
    items: [
      { label: 'All Admissions', href: '/school-admin/admissions', icon: ClipboardCheck },
      { label: 'Pending', href: '/school-admin/admissions/pending', icon: ClipboardList },
    ],
  },
  {
    title: 'Students',
    icon: GraduationCap,
    items: [
      { label: 'All Students', href: '/school-admin/students', icon: Users },
      { label: 'Add New', href: '/school-admin/students/new', icon: UserPlus },
      { label: 'Promotions', href: '/school-admin/students/promotions', icon: UserCheck },
      { label: 'Transfers', href: '/school-admin/students/transfers', icon: Route },
    ],
  },
  {
    title: 'Parents',
    icon: HeartHandshake,
    items: [
      { label: 'All Parents', href: '/school-admin/parents', icon: Users },
      { label: 'Guardians', href: '/school-admin/parents/guardians', icon: UserCog },
    ],
  },
  {
    title: 'Staff Management',
    icon: Briefcase,
    items: [
      { label: 'All Staff', href: '/school-admin/staff', icon: Users },
      { label: 'Add Staff', href: '/school-admin/staff/create', icon: UserPlus },
      { label: 'Teachers', href: '/school-admin/teachers', icon: Monitor },
      { label: 'Principals', href: '/school-admin/principals', icon: UserRoundCog },
      { label: 'HR', href: '/school-admin/hr', icon: Users },
      { label: 'Accountants', href: '/school-admin/accountants', icon: Calculator },
      { label: 'Librarians', href: '/school-admin/librarians', icon: Library },
      { label: 'Transport', href: '/school-admin/transport-staff', icon: Bus },
      { label: 'Hostel', href: '/school-admin/hostel-staff', icon: BedDouble },
    ],
  },
  {
    title: 'Academic',
    icon: BookOpen,
    items: [
      { label: 'Academic Years', href: '/school-admin/academics/years', icon: BookOpen },
      { label: 'Classes', href: '/school-admin/classes', icon: Notebook },
      { label: 'Sections', href: '/school-admin/sections', icon: Notebook },
      { label: 'Subjects', href: '/school-admin/subjects', icon: FileEdit },
      { label: 'Class Teachers', href: '/school-admin/academics/class-teachers', icon: UserCog },
    ],
  },
  {
    title: 'Attendance',
    icon: ClipboardCheck,
    items: [
      { label: 'Mark Attendance', href: '/school-admin/attendance', icon: ClipboardCheck },
      { label: 'Reports', href: '/school-admin/attendance/reports', icon: BarChart3 },
    ],
  },
  {
    title: 'Timetable',
    icon: CalendarClock,
    items: [
      { label: 'Class Timetable', href: '/school-admin/timetable', icon: CalendarClock },
      { label: 'Teacher Schedule', href: '/school-admin/timetable/teachers', icon: Monitor },
      { label: 'Room Allocation', href: '/school-admin/timetable/rooms', icon: Building2 },
    ],
  },
  {
    title: 'Homework',
    icon: FileEdit,
    items: [
      { label: 'All Homework', href: '/school-admin/homework', icon: FileEdit },
      { label: 'Pending Review', href: '/school-admin/homework/pending', icon: ClipboardList },
    ],
  },
  {
    title: 'Assignments',
    icon: ClipboardList,
    items: [
      { label: 'All Assignments', href: '/school-admin/assignments', icon: ClipboardList },
      { label: 'Submissions', href: '/school-admin/assignments/submissions', icon: FileEdit },
    ],
  },
  {
    title: 'Examinations',
    icon: Trophy,
    items: [
      { label: 'Exam Schedule', href: '/school-admin/examinations', icon: FileSpreadsheet },
      { label: 'Results', href: '/school-admin/results', icon: Trophy },
      { label: 'Grade Cards', href: '/school-admin/examinations/grade-cards', icon: FileEdit },
    ],
  },
  {
    title: 'Fees',
    icon: IndianRupee,
    items: [
      { label: 'Fee Structure', href: '/school-admin/fees', icon: IndianRupee },
      { label: 'Collections', href: '/school-admin/fees/collections', icon: Calculator },
      { label: 'Pending Fees', href: '/school-admin/fees/pending', icon: ClipboardList },
      { label: 'Fee Reports', href: '/school-admin/fees/reports', icon: BarChart3 },
    ],
  },
  {
    title: 'Accounting',
    icon: Calculator,
    items: [
      { label: 'Income', href: '/school-admin/accounting/income', icon: IndianRupee },
      { label: 'Expenses', href: '/school-admin/accounting/expenses', icon: Calculator },
      { label: 'Ledger', href: '/school-admin/accounting/ledger', icon: BookOpen },
    ],
  },
  {
    title: 'Library',
    icon: Library,
    items: [
      { label: 'Books', href: '/school-admin/library', icon: Library },
      { label: 'Issue/Return', href: '/school-admin/library/issue-return', icon: ClipboardCheck },
      { label: 'Library Reports', href: '/school-admin/library/reports', icon: BarChart3 },
    ],
  },
  {
    title: 'Transport',
    icon: Bus,
    items: [
      { label: 'Routes', href: '/school-admin/transport', icon: Bus },
      { label: 'Vehicles', href: '/school-admin/transport/vehicles', icon: Bus },
      { label: 'Drivers', href: '/school-admin/transport/drivers', icon: Users },
      { label: 'Student Stops', href: '/school-admin/transport/stops', icon: Route },
    ],
  },
  {
    title: 'Hostel',
    icon: Building2,
    items: [
      { label: 'Rooms', href: '/school-admin/hostel', icon: Building2 },
      { label: 'Residents', href: '/school-admin/hostel/residents', icon: Users },
      { label: 'Facilities', href: '/school-admin/hostel/facilities', icon: BedDouble },
    ],
  },
  {
    title: 'Inventory',
    icon: Package,
    items: [
      { label: 'All Items', href: '/school-admin/inventory', icon: Package },
      { label: 'Stock Alerts', href: '/school-admin/inventory/alerts', icon: ClipboardList },
      { label: 'Purchase Orders', href: '/school-admin/inventory/purchases', icon: FileEdit },
    ],
  },
  {
    title: 'Communication',
    icon: MessageSquare,
    items: [
      { label: 'Messages', href: '/school-admin/communication', icon: MessageSquare },
      { label: 'Announcements', href: '/school-admin/communication/announcements', icon: MessageSquare },
      { label: 'Notifications', href: '/school-admin/communication/notifications', icon: MessageSquare },
    ],
  },
  {
    title: 'Reports',
    icon: BarChart3,
    items: [
      { label: 'Student Reports', href: '/school-admin/reports/students', icon: Users },
      { label: 'Staff Reports', href: '/school-admin/reports/staff', icon: Briefcase },
      { label: 'Financial Reports', href: '/school-admin/reports/financial', icon: IndianRupee },
      { label: 'Academic Reports', href: '/school-admin/reports/academic', icon: BookOpen },
      { label: 'Attendance Reports', href: '/school-admin/reports/attendance', icon: ClipboardCheck },
    ],
  },
  {
    title: 'Analytics',
    icon: LineChart,
    items: [
      { label: 'School Analytics', href: '/school-admin/analytics', icon: LineChart },
      { label: 'Performance', href: '/school-admin/analytics/performance', icon: BarChart3 },
    ],
  },
];

export default function SchoolAdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(navSections.map((s) => s.title)));
  const [sessionInfo, setSessionInfo] = useState<{ name: string; email: string; schoolName: string } | null>(null);
  const { resolvedTheme, toggleTheme } = useThemeStore();

  useEffect(() => {
    fetch('/api/auth/session')
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data) {
          setSessionInfo({
            name: d.data.name,
            email: d.data.email,
            schoolName: d.data.schoolName,
          });
        }
      })
      .catch(() => {});
  }, []);

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
    return pathname === href || (href !== '/school-admin/dashboard' && pathname?.startsWith(href + '/'));
  };

  const handleLogout = async () => {
    await fetch('/api/auth/dev-logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-white transition-transform duration-200 ease-in-out dark:border-slate-800 dark:bg-slate-900',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
        aria-label="School Admin navigation"
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b px-4 dark:border-slate-800">
          <Link href="/school-admin/dashboard" className="flex items-center gap-2 font-bold text-lg min-w-0">
            <School className="h-6 w-6 text-primary shrink-0" />
            <span className="truncate">{sessionInfo?.schoolName || 'SchoolOS'}</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navSections.map((section) => {
            const SectionIcon = section.icon;
            const isExpanded = expandedSections.has(section.title);
            const hasActiveChild = section.items.some((item) => isActive(item.href));
            const sectionActive = hasActiveChild || isExpanded;

            if (section.items.length === 1) {
              const item = section.items[0];
              const ItemIcon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50',
                  )}
                >
                  <ItemIcon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            }

            return (
              <div key={section.title}>
                <button
                  onClick={() => toggleSection(section.title)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    sectionActive
                      ? 'text-primary'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-500',
                  )}
                >
                  <SectionIcon className="h-4 w-4 shrink-0" />
                  <span className="flex-1 text-left">{section.title}</span>
                  {isExpanded ? (
                    <ChevronDown className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5" />
                  )}
                </button>
                {isExpanded && (
                  <div className="ml-4 mt-1 space-y-1 border-l border-slate-200 pl-3 dark:border-slate-700">
                    {section.items.map((item) => {
                      const ItemIcon = item.icon;
                      const active = isActive(item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                            active
                              ? 'text-primary'
                              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50',
                          )}
                        >
                          <ItemIcon className="h-3.5 w-3.5 shrink-0" />
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

        <div className="border-t p-3 space-y-1 dark:border-slate-800">
          <Link
            href="/school-admin/settings"
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive('/school-admin/settings')
                ? 'bg-primary/10 text-primary'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50',
            )}
          >
            <Settings className="h-4 w-4 shrink-0" />
            School Settings
          </Link>
          <Link
            href="/school-admin/profile"
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive('/school-admin/profile')
                ? 'bg-primary/10 text-primary'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50',
            )}
          >
            <UserCircle className="h-4 w-4 shrink-0" />
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 transition-colors"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 px-4 lg:px-6 dark:border-slate-800 dark:bg-slate-900/95">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-muted-foreground hover:text-foreground"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex-1" />

          <button
            onClick={toggleTheme}
            className="rounded-full p-2 text-muted-foreground hover:bg-slate-100 hover:text-foreground dark:hover:bg-slate-800"
            title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {resolvedTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <div className="flex items-center gap-3 border-l pl-4 dark:border-slate-800">
            <Avatar size="sm" fallback={sessionInfo?.name?.charAt(0) || 'A'} />
            <div className="hidden sm:block">
              <p className="text-sm font-medium">{sessionInfo?.name || 'School Admin'}</p>
              <p className="text-xs text-muted-foreground">{sessionInfo?.email || 'Loading...'}</p>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
