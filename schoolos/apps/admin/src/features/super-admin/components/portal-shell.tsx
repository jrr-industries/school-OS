'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Menu, ChevronDown, ChevronLeft, Search, PanelLeftClose, PanelLeftOpen, Bell, Shield } from 'lucide-react';
import { Button, Drawer, Dropdown, DropdownItem, DropdownLabel, DropdownSeparator } from '@schoolos/ui';
import { useAuthStore } from '@schoolos/hooks';
import { cn } from '@schoolos/ui';
import { superAdminSections, getSuperAdminPage } from '../navigation';

interface PortalShellProps {
  children: React.ReactNode;
}

function isChildActive(pathname: string, path: string) {
  return pathname === path || pathname.startsWith(`${path}/`);
}

export function PortalShell({ children }: PortalShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const currentPage = useMemo(() => getSuperAdminPage(pathname), [pathname]);

  useEffect(() => {
    const activeSections = superAdminSections
      .filter((section) => section.items.some((item) => isChildActive(pathname, item.path)))
      .map((section) => section.label);

    setExpandedSections((previous) => Array.from(new Set([...previous, ...activeSections])));
  }, [pathname]);

  const desktopSidebar = (
    <aside
      className={cn(
        'hidden min-h-screen border-r border-sidebar-border bg-sidebar text-sidebar-foreground xl:flex xl:flex-col',
        collapsed ? 'w-[88px]' : 'w-[296px]',
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
            <Shield className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <p className="text-sm font-semibold tracking-wide">SchoolOS</p>
              <p className="text-xs text-sidebar-foreground/60">Super Admin Portal</p>
            </div>
          )}
        </Link>
        <Button variant="ghost" size="icon" className="text-sidebar-foreground hover:bg-sidebar-accent" onClick={() => setCollapsed((value) => !value)} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </Button>
      </div>

      <div className="border-b border-sidebar-border px-4 py-3">
        <div className={cn('rounded-2xl border border-white/10 bg-white/5 p-3', collapsed && 'p-2')}>
          <p className="text-xs uppercase tracking-[0.24em] text-sidebar-foreground/60">Active operator</p>
          {!collapsed && (
            <>
              <p className="mt-1 text-sm font-medium">{user?.name ?? 'Super Admin'}</p>
              <p className="text-xs text-sidebar-foreground/60">{user?.email ?? 'portal@schoolos.com'}</p>
            </>
          )}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3" aria-label="Super admin navigation">
        {superAdminSections.map((section) => {
          const sectionActive = section.items.some((item) => isChildActive(pathname, item.path));
          const isExpanded = expandedSections.includes(section.label) || sectionActive;
          const hideChildren = collapsed && !sectionActive;

          return (
            <div key={section.label} className="mb-2">
              <button
                type="button"
                onClick={() => setExpandedSections((current) => current.includes(section.label) ? current.filter((label) => label !== section.label) : [...current, section.label])}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-sidebar-accent',
                  sectionActive && 'bg-sidebar-accent text-sidebar-accent-foreground',
                  collapsed && 'justify-center px-2',
                )}
                aria-expanded={isExpanded}
                title={section.label}
              >
                <section.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="flex-1">{section.label}</span>}
                {!collapsed && <ChevronDown className={cn('h-4 w-4 transition-transform', isExpanded && 'rotate-180')} />}
              </button>

              {isExpanded && !hideChildren && (
                <div className="mt-1 space-y-1 pl-2">
                  {section.items.map((item) => {
                    const active = isChildActive(pathname, item.path);
                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                          active ? 'bg-white/12 text-white' : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                          collapsed && 'justify-center px-2',
                        )}
                        title={item.label}
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!collapsed && <span className="truncate">{item.label}</span>}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className={cn('rounded-2xl border border-white/10 bg-white/5 p-3', collapsed && 'p-2')}>
          {!collapsed ? (
            <>
              <p className="text-sm font-medium">Portal health</p>
              <p className="text-xs text-sidebar-foreground/60">All operational surfaces are ready for live data.</p>
              <div className="mt-3 flex items-center gap-2 text-xs text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>Healthy</span>
              </div>
            </>
          ) : (
            <div className="flex justify-center">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </div>
          )}
        </div>
      </div>
    </aside>
  );

  const mobileSidebar = (
    <Drawer open={mobileOpen} onOpenChange={setMobileOpen} side="left" title="Super Admin Navigation" className="max-w-[320px] bg-sidebar text-sidebar-foreground p-0">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-sidebar-border px-4 py-4">
          <div>
            <p className="text-sm font-semibold">SchoolOS</p>
            <p className="text-xs text-sidebar-foreground/60">Super Admin Portal</p>
          </div>
          <Button variant="ghost" size="icon" className="text-sidebar-foreground hover:bg-sidebar-accent" onClick={() => setMobileOpen(false)} aria-label="Close navigation">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        <nav className="flex-1 overflow-y-auto p-3">
          {superAdminSections.map((section) => {
            const sectionActive = section.items.some((item) => isChildActive(pathname, item.path));
            const isExpanded = expandedSections.includes(section.label) || sectionActive;
            return (
              <div key={section.label} className="mb-2">
                <button
                  type="button"
                  onClick={() => setExpandedSections((current) => current.includes(section.label) ? current.filter((label) => label !== section.label) : [...current, section.label])}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-sidebar-accent',
                    sectionActive && 'bg-sidebar-accent text-sidebar-accent-foreground',
                  )}
                  aria-expanded={isExpanded}
                >
                  <section.icon className="h-4 w-4" />
                  <span className="flex-1 text-left">{section.label}</span>
                  <ChevronDown className={cn('h-4 w-4 transition-transform', isExpanded && 'rotate-180')} />
                </button>
                {isExpanded && (
                  <div className="mt-1 space-y-1 pl-2">
                    {section.items.map((item) => (
                      <Link
                        key={item.path}
                        href={item.path}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                          isChildActive(pathname, item.path) ? 'bg-white/12 text-white' : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </Drawer>
  );

  return (
    <div className="min-h-screen bg-background xl:flex">
      {desktopSidebar}
      {mobileSidebar}

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <Button variant="outline" size="icon" className="xl:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation">
              <Menu className="h-4 w-4" />
            </Button>

            <div className="min-w-0 flex-1">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">SchoolOS Super Admin</p>
              <div className="flex items-center gap-2 truncate text-sm text-muted-foreground">
                {currentPage ? (
                  <>
                    <span className="font-medium text-foreground">{currentPage.sectionLabel}</span>
                    <span>/</span>
                    <span className="truncate">{currentPage.label}</span>
                  </>
                ) : (
                  <span className="font-medium text-foreground">Portal home</span>
                )}
              </div>
            </div>

            <div className="hidden items-center gap-2 md:flex">
              <Button variant="ghost" size="icon" aria-label="Search portal">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Notifications">
                <Bell className="h-4 w-4" />
              </Button>
              <Dropdown
                trigger={(
                  <Button variant="outline" className="gap-2">
                    <Shield className="h-4 w-4" />
                    <span className="hidden lg:inline">{user?.name ?? 'Super Admin'}</span>
                  </Button>
                )}
              >
                <DropdownLabel>Account</DropdownLabel>
                <DropdownSeparator />
                <DropdownItem onSelect={() => router.push('/account/my-profile')}>My profile</DropdownItem>
                <DropdownItem onSelect={() => router.push('/account/security')}>Security</DropdownItem>
                <DropdownSeparator />
                <DropdownItem onSelect={() => router.push('/logout')}>Logout</DropdownItem>
              </Dropdown>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
