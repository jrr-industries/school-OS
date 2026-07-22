'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  UserCog,
  Clock,
  Shield,
  ClipboardList,
  School,
  MessageSquare,
  Flag,
  FileText,
  CheckSquare,
  GraduationCap,
  BarChart3,
  Bell,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Search,
  ChevronRight,
  ChevronDown,
  Calendar,
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
    title: 'Main',
    items: [
      { label: 'Dashboard', href: '/vice-principal/dashboard', icon: LayoutDashboard },
      { label: 'Academic Operations', href: '/vice-principal/academic', icon: BookOpen },
      { label: 'Students', href: '/vice-principal/students', icon: Users },
      { label: 'Teachers', href: '/vice-principal/teachers', icon: UserCog },
      { label: 'Attendance', href: '/vice-principal/attendance', icon: Clock },
      { label: 'Discipline', href: '/vice-principal/discipline', icon: Shield },
      { label: 'Examinations', href: '/vice-principal/examinations', icon: ClipboardList },
    ],
  },
  {
    title: 'Operations',
    items: [
      { label: 'School Operations', href: '/vice-principal/operations', icon: School },
      { label: 'Communication', href: '/vice-principal/communication', icon: MessageSquare },
      { label: 'Activities', href: '/vice-principal/activities', icon: Flag },
    ],
  },
  {
    title: 'Reports',
    items: [
      { label: 'Reports', href: '/vice-principal/reports', icon: FileText },
      { label: 'Approvals', href: '/vice-principal/approvals', icon: CheckSquare },
      { label: 'Analytics', href: '/vice-principal/analytics', icon: BarChart3 },
    ],
  },
];

export default function VicePrincipalLayout({ children }: { children: React.ReactNode }) {
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
    return pathname === href || (href !== '/vice-principal/dashboard' && pathname?.startsWith(href + '/'));
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
    <div className="flex min-h-screen bg-background">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
        aria-label="Vice Principal navigation"
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
          <Link href="/vice-principal/dashboard" className="flex items-center gap-2 font-bold text-lg" aria-label="VP Dashboard">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span>VP<span className="text-primary">.</span>Dashboard</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-muted-foreground hover:text-foreground"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4" aria-label="Vice Principal navigation">
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
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                  aria-expanded={isExpanded}
                >
                  <span className="flex-1 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
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
                              ? 'bg-primary/10 text-primary'
                              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                          }`}
                          aria-current={active ? 'page' : undefined}
                        >
                          <ItemIcon className={`h-4 w-4 shrink-0 ${active ? 'text-primary' : 'text-muted-foreground'}`} aria-hidden="true" />
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

        <div className="border-t border-border p-4 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            VP
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">Vice Principal</p>
            <p className="text-[11px] text-muted-foreground truncate">vp@schoolos.dev</p>
          </div>
          <button onClick={handleLogout} aria-label="Logout">
            <LogOut className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-border bg-background/95 backdrop-blur-sm px-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>

          <div className="hidden sm:flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{today}</span>
          </div>

          <div className="flex-1" />

          <div className="relative max-w-md w-full hidden md:block">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search..."
              className="flex h-9 w-full rounded-md border border-input bg-background pl-8 pr-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <button
            className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
          </button>

          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
            aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {resolvedTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
