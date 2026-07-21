'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, School, UserCog, Users, Settings, Building2,
  CalendarDays, BookOpen, ClipboardCheck, IndianRupee, Bus,
  MessageSquare, Bell, ScrollText, BarChart3, CreditCard,
  UserCircle, LogOut, Sun, Moon, Menu, X, ChevronDown, ChevronRight,
  BookMarked, FileSpreadsheet, Trophy, Wallet, PiggyBank,
  Library, Monitor, Shield, Calendar, HeartPulse, Truck,
  ChefHat
} from 'lucide-react';
import { Avatar, cn } from '@schoolos/ui';
import { SchoolAdminAuthProvider, useSchoolAdminAuth } from '@/features/supabase/hooks/use-school-admin-auth';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
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
    title: 'School Overview',
    icon: School,
    items: [{ label: 'School Info', href: '/school-admin/overview', icon: School }],
  },
  {
    title: 'Principal',
    icon: UserCog,
    items: [{ label: 'Manage Principal', href: '/school-admin/principals', icon: UserCog }],
  },
  {
    title: 'Users',
    icon: Users,
    items: [
      { label: 'All Users', href: '/school-admin/users', icon: Users },
      { label: 'User Profile', href: '/school-admin/users/profile', icon: UserCircle },
    ],
  },
  {
    title: 'School Settings',
    icon: Settings,
    items: [{ label: 'Settings', href: '/school-admin/settings', icon: Settings }],
  },
  {
    title: 'Departments',
    icon: Building2,
    items: [{ label: 'Departments', href: '/school-admin/departments', icon: Building2 }],
  },
  {
    title: 'Academic Years',
    icon: CalendarDays,
    items: [{ label: 'Academic Years', href: '/school-admin/academic-years', icon: CalendarDays }],
  },
  {
    title: 'Classes',
    icon: BookOpen,
    items: [{ label: 'View Classes', href: '/school-admin/classes', icon: BookOpen, badge: 'View Only' }],
  },
  {
    title: 'Subjects',
    icon: BookMarked,
    items: [{ label: 'View Subjects', href: '/school-admin/subjects', icon: BookMarked, badge: 'View Only' }],
  },
  {
    title: 'Attendance',
    icon: ClipboardCheck,
    items: [{ label: 'View Attendance', href: '/school-admin/attendance', icon: ClipboardCheck, badge: 'View Only' }],
  },
  {
    title: 'Fee Reports',
    icon: IndianRupee,
    items: [
      { label: 'Fee Collection', href: '/school-admin/fee-reports', icon: IndianRupee },
      { label: 'Pending Fees', href: '/school-admin/fee-reports/pending', icon: FileSpreadsheet },
    ],
  },
  {
    title: 'Transport Reports',
    icon: Bus,
    items: [
      { label: 'Transport', href: '/school-admin/transport-reports', icon: Bus },
    ],
  },
  {
    title: 'Communication',
    icon: MessageSquare,
    items: [
      { label: 'Broadcast', href: '/school-admin/communication', icon: MessageSquare },
    ],
  },
  {
    title: 'Notifications',
    icon: Bell,
    items: [{ label: 'All Notifications', href: '/school-admin/notifications', icon: Bell }],
  },
  {
    title: 'Audit Logs',
    icon: ScrollText,
    items: [{ label: 'Audit Trail', href: '/school-admin/audit-logs', icon: ScrollText }],
  },
  {
    title: 'Academic Performance',
    icon: Trophy,
    items: [{ label: 'Performance', href: '/school-admin/academic-performance', icon: Trophy }],
  },
  {
    title: 'Sports',
    icon: HeartPulse,
    items: [{ label: 'Sports Dashboard', href: '/school-admin/sports', icon: HeartPulse }],
  },
  {
    title: 'School Bus',
    icon: Truck,
    items: [{ label: 'Bus Management', href: '/school-admin/bus-management', icon: Truck }],
  },
  {
    title: 'Lunch Management',
    icon: ChefHat,
    items: [{ label: 'Lunch Dashboard', href: '/school-admin/lunch-management', icon: ChefHat }],
  },
  {
    title: 'Fee Dashboard',
    icon: Wallet,
    items: [{ label: 'Fee Overview', href: '/school-admin/fee-dashboard', icon: Wallet }],
  },
  {
    title: 'Salary',
    icon: PiggyBank,
    items: [{ label: 'Payroll', href: '/school-admin/salary', icon: PiggyBank }],
  },
  {
    title: 'Finance',
    icon: BarChart3,
    items: [{ label: 'Finance', href: '/school-admin/finance', icon: BarChart3 }],
  },
  {
    title: 'Library',
    icon: Library,
    items: [{ label: 'Library', href: '/school-admin/library-dashboard', icon: Library }],
  },
  {
    title: 'Facilities',
    icon: Monitor,
    items: [{ label: 'Facilities', href: '/school-admin/facilities', icon: Monitor }],
  },
  {
    title: 'HR',
    icon: Users,
    items: [{ label: 'HR Dashboard', href: '/school-admin/hr-dashboard', icon: Users }],
  },
  {
    title: 'Security',
    icon: Shield,
    items: [{ label: 'Security', href: '/school-admin/security-dashboard', icon: Shield }],
  },
  {
    title: 'Calendar',
    icon: Calendar,
    items: [{ label: 'Calendar', href: '/school-admin/calendar', icon: Calendar }],
  },
  {
    title: 'Analytics',
    icon: BarChart3,
    items: [
      { label: 'Analytics', href: '/school-admin/analytics', icon: BarChart3 },
    ],
  },
  {
    title: 'Subscription',
    icon: CreditCard,
    items: [{ label: 'Subscription', href: '/school-admin/subscription', icon: CreditCard }],
  },
];

export default function SchoolAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SchoolAdminAuthProvider>
      <SchoolAdminLayoutInner>{children}</SchoolAdminLayoutInner>
    </SchoolAdminAuthProvider>
  );
}

function SchoolAdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout: authLogout } = useSchoolAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set([
    'Dashboard', 'School Overview', 'Principal', 'Users'
  ]));
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const preferred = saved || (window.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light');
    setTheme(preferred);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(preferred);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', next);
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(next);
      return next;
    });
  }, []);

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  };

  const isActive = (href: string) =>
    pathname === href || (pathname?.startsWith(href + '/'));

  const SidebarLink = ({ item: { label, href, icon: Icon, badge } }: { item: NavItem }) => {
    const active = isActive(href);
    return (
      <Link
        href={href}
        className={cn(
          'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
          active
            ? 'bg-primary/10 text-primary shadow-sm'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50',
        )}
      >
        <Icon className={cn('h-4 w-4 shrink-0 transition-transform duration-200', active && 'scale-110')} />
        <span className="flex-1 truncate">{label}</span>
        {badge && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            {badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-white transition-all duration-300 ease-in-out dark:border-slate-800 dark:bg-slate-900',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
        aria-label="School Admin Navigation"
      >
        <div className="flex h-16 shrink-0 items-center gap-3 border-b px-4 dark:border-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <School className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <Link href="/school-admin/dashboard" className="block truncate text-sm font-bold">
              {user?.name || 'SchoolOS'}
            </Link>
            <p className="truncate text-[10px] text-muted-foreground">School Admin</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5 scrollbar-thin">
          {navSections.map((section) => {
            const SectionIcon = section.icon;
            const isExpanded = expandedSections.has(section.title);
            const hasActiveChild = section.items.some((item) => isActive(item.href));

            if (section.items.length === 1) {
              return <SidebarLink key={section.items[0].href} item={section.items[0]} />;
            }

            return (
              <div key={section.title}>
                <button
                  onClick={() => toggleSection(section.title)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    hasActiveChild
                      ? 'text-primary'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50',
                  )}
                >
                  <SectionIcon className="h-4 w-4 shrink-0" />
                  <span className="flex-1 text-left">{section.title}</span>
                  {isExpanded
                    ? <ChevronDown className="h-3.5 w-3.5 transition-transform" />
                    : <ChevronRight className="h-3.5 w-3.5 transition-transform" />
                  }
                </button>
                {isExpanded && (
                  <div className="ml-4 mt-0.5 space-y-0.5 border-l border-slate-200 pl-3 dark:border-slate-700">
                    {section.items.map((item) => (
                      <SidebarLink key={item.href} item={item} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="border-t p-3 space-y-0.5 dark:border-slate-800">
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
            onClick={authLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 transition-colors"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 px-4 lg:px-6 dark:border-slate-800 dark:bg-slate-900/95">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-muted-foreground hover:text-foreground"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex-1" />

          <button
            onClick={toggleTheme}
            className="rounded-full p-2 text-muted-foreground hover:bg-slate-100 hover:text-foreground dark:hover:bg-slate-800 transition-colors"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <div className="flex items-center gap-3 border-l pl-4 dark:border-slate-800">
            <Avatar size="sm" src={user?.photo} fallback={user?.name?.charAt(0) || 'A'} />
            <div className="hidden sm:block">
              <p className="text-sm font-medium leading-tight">{user?.name || 'School Admin'}</p>
              <p className="text-xs text-muted-foreground">{user?.email || ''}</p>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
