'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@schoolos/ui';
import { useUserStore } from '@schoolos/hooks';
import { usePermission } from '@schoolos/hooks';
import { useMediaQuery } from '@schoolos/hooks';
import { NAV_ICONS, navigationConfig, bottomNavConfig, type NavItem } from '../../constants/navigation';
import { ChevronLeft, ChevronDown } from 'lucide-react';

function isNavItemActive(item: NavItem, pathname: string): boolean {
  if (item.href && pathname.startsWith(item.href)) return true;
  if (item.children) {
    return item.children.some((child) => isNavItemActive(child, pathname));
  }
  return false;
}

function NavItemComponent({
  item,
  collapsed,
  pathname,
  depth = 0,
  onNavClick,
}: {
  item: NavItem;
  collapsed: boolean;
  pathname: string;
  depth?: number;
  onNavClick?: () => void;
}) {
  const [expanded, setExpanded] = useState(isNavItemActive(item, pathname));
  const hasPermission = item.permission ? usePermission(item.permission) : true;
  const Icon = item.icon ? NAV_ICONS[item.icon] : null;
  const isActive = item.href ? pathname.startsWith(item.href) : false;
  const hasChildren = item.children && item.children.length > 0;

  if (!hasPermission) return null;

  if (hasChildren && !collapsed) {
    return (
      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className={cn(
            'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
            isActive
              ? 'bg-sidebar-accent text-sidebar-accent-foreground'
              : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
          )}
        >
          {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
          <span className="flex-1 text-left">{item.name}</span>
          <ChevronDown
            className={cn(
              'h-3.5 w-3.5 transition-transform',
              expanded && 'rotate-180',
            )}
          />
        </button>
        {expanded && (
          <div className="ml-4 mt-1 space-y-0.5 border-l border-sidebar-border pl-2">
            {item.children!.map((child) => (
              <NavItemComponent
                key={child.name}
                item={child}
                collapsed={collapsed}
                pathname={pathname}
                depth={depth + 1}
                onNavClick={onNavClick}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href ?? '#'}
      onClick={onNavClick}
      className={cn(
        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
          : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        collapsed && 'justify-center px-2',
        depth > 0 && 'text-xs',
      )}
      title={collapsed ? item.name : undefined}
    >
      {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
      {!collapsed && (
        <>
          <span className="flex-1">{item.name}</span>
          {item.badge && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
              {item.badge}
            </span>
          )}
        </>
      )}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const collapsed = useUserStore((state) => state.preferences.sidebarCollapsed);
  const toggleSidebar = useUserStore((state) => state.toggleSidebar);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = useCallback(() => {
    if (isMobile) setMobileOpen(false);
  }, [isMobile]);

  const sidebarContent = (
    <aside
      className={cn(
        'flex flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
        isMobile && !collapsed && 'w-64',
      )}
    >
      <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-4">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2 font-bold" onClick={handleNavClick}>
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-bold">
              S
            </div>
            <span>SchoolOS</span>
          </Link>
        )}
        <button
          onClick={toggleSidebar}
          className={cn(
            'rounded-md p-1.5 hover:bg-sidebar-accent',
            collapsed && 'mx-auto',
          )}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft
            className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')}
          />
        </button>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-2" role="navigation" aria-label="Sidebar navigation">
        {navigationConfig.map((item) => (
          <NavItemComponent
            key={item.name}
            item={item}
            collapsed={collapsed}
            pathname={pathname}
            onNavClick={handleNavClick}
          />
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-2">
        {bottomNavConfig.map((item) => (
          <NavItemComponent
            key={item.name}
            item={item}
            collapsed={collapsed}
            pathname={pathname}
            onNavClick={handleNavClick}
          />
        ))}
      </div>
    </aside>
  );

  if (isMobile) {
    return (
      <>
        <button
          className="fixed left-4 top-3 z-50 rounded-md p-2 hover:bg-accent md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle sidebar"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 5H17M3 10H17M3 15H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/50"
              onClick={() => setMobileOpen(false)}
            />
            <div className="fixed left-0 top-0 z-50 h-screen">
              {sidebarContent}
            </div>
          </>
        )}
      </>
    );
  }

  return sidebarContent;
}
