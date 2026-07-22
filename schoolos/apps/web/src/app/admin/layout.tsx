// ============================================================
// Super Admin Portal Layout - SchoolOS
// ============================================================

'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  ShieldCheck,
  Ban,
  Archive,
  Activity,
  CreditCard,
  Receipt,
  FileText,
  DollarSign,
  Users,

  UserCog,
  Shield,
  ShieldAlert,
  Flag,
  Box,
  Key,
  Megaphone,
  Bell,
  Mail,
  MessageSquare,
  Zap,
  Headphones,
  LifeBuoy,
  TrendingUp,
  BarChart3,
  ClipboardList,
  KeyRound,
  Clock,
  AlertTriangle,
  Server,
  Monitor,
  Cpu,
  Database,
  HardDrive,
  Layers,
  Terminal,
  Lock,
  Fingerprint,
  Key as KeyIcon,
  Webhook,
  WifiOff,
  Gauge,
  PlugZap,
  Mailbox,
  Smartphone,
  Globe,
  Chrome,
  Settings,
  UserCircle,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
  ChevronRight,
  School,
  HeartPulse,
  Code2,
  Calendar,
  RotateCcw,
  Globe2,
  Construction,
  Wrench,
  DatabaseBackup,
  Palette,
  CheckCircle2,
} from 'lucide-react';
import { Avatar } from '@schoolos/ui';
import { useThemeStore } from '@schoolos/hooks';

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
  permission?: string;
}

const navSections: NavSection[] = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    items: [{ label: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard }],
  },
  {
    title: 'Role Dashboards',
    icon: LayoutDashboard,
    items: [
      { label: 'Teacher Dashboard', href: '/dashboard/teacher', icon: Users },
      { label: 'Principal Dashboard', href: '/dashboard/principal', icon: Users },
      { label: 'Vice Principal Dashboard', href: '/dashboard/vice-principal', icon: Users },
      { label: 'Live Bus Tracker', href: '/dashboard/bus-tracker', icon: Users },
    ],
  },
  {
    title: 'School Management',
    icon: Building2,
    items: [
      { label: 'All Schools', href: '/admin/schools', icon: Building2 },
      { label: 'Create School', href: '/admin/schools/create', icon: PlusCircle },
      { label: 'School Verification', href: '/admin/schools/verification', icon: ShieldCheck },
      { label: 'Suspended Schools', href: '/admin/schools/suspended', icon: Ban },
      { label: 'Deleted Schools', href: '/admin/schools/deleted', icon: Archive },
      { label: 'School Activity', href: '/admin/schools/activity', icon: Activity },
    ],
  },
  {
    title: 'Subscription Management',
    icon: CreditCard,
    items: [
      { label: 'Plans', href: '/admin/subscriptions/plans', icon: CreditCard },
      { label: 'Active Subscriptions', href: '/admin/subscriptions/active', icon: CheckCircle2 },
      { label: 'Trial Schools', href: '/admin/subscriptions/trials', icon: Clock },
      { label: 'Expiring Soon', href: '/admin/subscriptions/expiring', icon: AlertTriangle },
      { label: 'Billing', href: '/admin/subscriptions/billing', icon: DollarSign },
      { label: 'Invoices', href: '/admin/subscriptions/invoices', icon: FileText },
      { label: 'Payments', href: '/admin/subscriptions/payments', icon: Receipt },
      { label: 'Payment Setup', href: '/admin/subscriptions/payment-setup', icon: CreditCard },
    ],
  },
  {
    title: 'Platform Users',
    icon: Users,
    items: [
      { label: 'Users', href: '/admin/users', icon: Users },
      { label: 'Roles', href: '/admin/users/roles', icon: UserCog },
      { label: 'Permissions', href: '/admin/users/permissions', icon: Shield },
    ],
  },
  {
    title: 'Feature Management',
    icon: Flag,
    items: [
      { label: 'Feature Flags', href: '/admin/features/flags', icon: Flag },
      { label: 'Modules', href: '/admin/features/modules', icon: Box },
      { label: 'License Management', href: '/admin/features/licenses', icon: Key },
    ],
  },
  {
    title: 'Communication',
    icon: Megaphone,
    items: [
      { label: 'Chat', href: '/admin/communication/chat', icon: MessageSquare },
      { label: 'Announcements', href: '/admin/communication/announcements', icon: Megaphone },
      { label: 'Notifications', href: '/admin/communication/notifications', icon: Bell },
      { label: 'Email Campaigns', href: '/admin/communication/email-campaigns', icon: Mail },
      { label: 'SMS', href: '/admin/communication/sms', icon: MessageSquare },
      { label: 'Push Notifications', href: '/admin/communication/push', icon: Zap },
    ],
  },
  {
    title: 'Support',
    icon: Headphones,
    items: [
      { label: 'Tickets', href: '/admin/support/tickets', icon: Headphones },
      { label: 'Knowledge Base', href: '/admin/support/knowledge-base', icon: LifeBuoy },
      { label: 'Live Chat', href: '/admin/support/live-chat', icon: MessageSquare },
      { label: 'Feedback', href: '/admin/support/feedback', icon: HeartPulse },
    ],
  },
  {
    title: 'Analytics',
    icon: TrendingUp,
    items: [
      { label: 'Platform Analytics', href: '/admin/analytics/platform', icon: BarChart3 },
      { label: 'Revenue', href: '/admin/analytics/revenue', icon: DollarSign },
      { label: 'Schools', href: '/admin/analytics/schools', icon: Building2 },
      { label: 'Users', href: '/admin/analytics/users', icon: Users },
      { label: 'API Usage', href: '/admin/analytics/api-usage', icon: Code2 },
      { label: 'Storage', href: '/admin/analytics/storage', icon: HardDrive },
    ],
  },
  {
    title: 'Audit & Compliance',
    icon: ClipboardList,
    items: [
      { label: 'Audit Logs', href: '/admin/audit/logs', icon: ClipboardList },
      { label: 'Login History', href: '/admin/audit/login-history', icon: KeyRound },
      { label: 'Activity Timeline', href: '/admin/audit/activity', icon: Clock },
      { label: 'Security Events', href: '/admin/audit/security-events', icon: ShieldAlert },
    ],
  },
  {
    title: 'System',
    icon: Server,
    items: [
      { label: 'Health', href: '/admin/system/health', icon: HeartPulse },
      { label: 'Monitoring', href: '/admin/system/monitoring', icon: Monitor },
      { label: 'Background Jobs', href: '/admin/system/jobs', icon: Cpu },
      { label: 'Queue Monitor', href: '/admin/system/queue', icon: RotateCcw },
      { label: 'Storage', href: '/admin/system/storage', icon: HardDrive },
      { label: 'Database', href: '/admin/system/database', icon: Database },
      { label: 'Cache', href: '/admin/system/cache', icon: Layers },
      { label: 'Logs', href: '/admin/system/logs', icon: Terminal },
      { label: 'Backup', href: '/admin/system/backup', icon: DatabaseBackup },
    ],
  },
  {
    title: 'Security',
    icon: Lock,
    items: [
      { label: 'Sessions', href: '/admin/security/sessions', icon: KeyRound },
      { label: 'MFA', href: '/admin/security/mfa', icon: Fingerprint },
      { label: 'API Keys', href: '/admin/security/api-keys', icon: KeyIcon },
      { label: 'Webhooks', href: '/admin/security/webhooks', icon: Webhook },
      { label: 'IP Allowlist', href: '/admin/security/ip-allowlist', icon: WifiOff },
      { label: 'Rate Limits', href: '/admin/security/rate-limits', icon: Gauge },
    ],
  },
  {
    title: 'Integrations',
    icon: PlugZap,
    items: [
      { label: 'Payment Gateways', href: '/admin/integrations/payments', icon: CreditCard },
      { label: 'Email Providers', href: '/admin/integrations/email', icon: Mailbox },
      { label: 'SMS Providers', href: '/admin/integrations/sms', icon: Smartphone },
      { label: 'WhatsApp', href: '/admin/integrations/whatsapp', icon: MessageSquare },
      { label: 'Google Workspace', href: '/admin/integrations/google', icon: Chrome },
      { label: 'Microsoft 365', href: '/admin/integrations/microsoft', icon: Globe },
      { label: 'Supabase', href: '/admin/integrations/supabase', icon: Database },
    ],
  },
  {
    title: 'Platform Settings',
    icon: Settings,
    items: [
      { label: 'General', href: '/admin/settings/general', icon: Settings },
      { label: 'Branding', href: '/admin/settings/branding', icon: Palette },
      { label: 'Email', href: '/admin/settings/email', icon: Mail },
      { label: 'SMS', href: '/admin/settings/sms', icon: MessageSquare },
      { label: 'Notifications', href: '/admin/settings/notifications', icon: Bell },
      { label: 'Storage', href: '/admin/settings/storage', icon: HardDrive },
      { label: 'Localization', href: '/admin/settings/localization', icon: Globe2 },
      { label: 'Maintenance Mode', href: '/admin/settings/maintenance', icon: Construction },
      { label: 'Environment', href: '/admin/settings/environment', icon: Wrench },
    ],
  },
  {
    title: 'Developer',
    icon: Code2,
    items: [
      { label: 'API Explorer', href: '/admin/developer/api-explorer', icon: Code2 },
      { label: 'Webhooks', href: '/admin/developer/webhooks', icon: Webhook },
      { label: 'Environment', href: '/admin/developer/environment', icon: Server },
      { label: 'Cron Jobs', href: '/admin/developer/cron-jobs', icon: Calendar },
      { label: 'Cache Manager', href: '/admin/developer/cache', icon: Layers },
      { label: 'System Information', href: '/admin/developer/system-info', icon: Cpu },
    ],
  },
];


export default function AdminLayout({ children }: { children: React.ReactNode }) {
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
    return pathname === href || (href !== '/admin/dashboard' && pathname?.startsWith(href + '/'));
  };

  const handleLogout = async () => {
    await fetch('/api/auth/dev-logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out dark:border-slate-800 dark:bg-slate-900 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-800">
          <Link href="/admin/dashboard" className="flex items-center gap-2 font-bold text-lg" aria-label="SchoolOS Admin">
            <School className="h-6 w-6 text-primary" aria-hidden="true" />
            <span>SchoolOS</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-muted-foreground hover:text-foreground"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1" aria-label="Admin navigation">
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
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  <ItemIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            }

            return (
              <div key={section.title}>
                <button
                  onClick={() => toggleSection(section.title)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    sectionActive
                      ? 'text-primary'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-500'
                  }`}
                  aria-expanded={isExpanded}
                  aria-controls={`section-${section.title}`}
                >
                  <SectionIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="flex-1 text-left">{section.title}</span>
                  {isExpanded ? (
                    <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                </button>
                {isExpanded && (
                  <div
                    id={`section-${section.title}`}
                    className="ml-4 mt-1 space-y-1 border-l border-slate-200 pl-3 dark:border-slate-700"
                    role="group"
                    aria-label={section.title}
                  >
                    {section.items.map((item) => {
                      const ItemIcon = item.icon;
                      const active = isActive(item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                            active
                              ? 'text-primary'
                              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50'
                          }`}
                          aria-current={active ? 'page' : undefined}
                        >
                          <ItemIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
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

        {/* Bottom section: Settings, Profile, Logout */}
        <div className="border-t border-slate-200 p-3 dark:border-slate-800 space-y-1">
          <Link
            href="/admin/settings/general"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive('/admin/settings')
                ? 'bg-primary/10 text-primary'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50'
            }`}
            aria-current={isActive('/admin/settings') ? 'page' : undefined}
          >
            <Settings className="h-4 w-4 shrink-0" aria-hidden="true" />
            Settings
          </Link>
          <Link
            href="/admin/account/profile"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive('/admin/account')
                ? 'bg-primary/10 text-primary'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50'
            }`}
            aria-current={isActive('/admin/account') ? 'page' : undefined}
          >
            <UserCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 transition-colors"
          >
            <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
            Logout
          </button>
        </div>
      </aside>

        {/* Main content */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-2 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>

          {/* Breadcrumb */}
          <nav className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">SchoolOS</span>
            <ChevronRight className="h-3.5 w-3.5" />
            {(() => {
              const segments = pathname?.split('/').filter(Boolean) ?? [];
              if (segments.length <= 2) return <span className="text-foreground font-medium">Admin</span>;
              const last = segments[segments.length - 1];
              return <span className="text-foreground font-medium capitalize">{last.replace(/-/g, ' ')}</span>;
            })()}
          </nav>

          <div className="flex-1" />

          {/* Quick actions */}
          <div className="hidden md:flex items-center gap-1">
            <button
              onClick={() => window.open('/admin/schools/create', '_self')}
              className="rounded-lg px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              + New School
            </button>
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
            aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {resolvedTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* User info */}
          <div className="flex items-center gap-2.5 border-l border-border pl-3">
            <Avatar size="sm" fallback="SA" className="ring-2 ring-primary/20" />
            <div className="hidden lg:block">
              <p className="text-sm font-medium text-foreground leading-tight">Super Admin</p>
              <p className="text-xs text-muted-foreground leading-tight">admin@schoolos.dev</p>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}