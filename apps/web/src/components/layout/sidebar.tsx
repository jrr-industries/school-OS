'use client';

import Link from 'next/link';
import { memo, useCallback } from 'react';
import {
  ChevronLeft,
  GraduationCap,
  UserCircle,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useSidebarStore, useActivePathStore } from '@/store';
import { sidebarNav } from '@/config/navigation';
import type { NavGroup } from '@/types/navigation';
import { SIDEBAR_WIDTH, SIDEBAR_COLLAPSED_WIDTH } from '@/constants';
import { useIsMobile } from '@/hooks/use-media-query';

function isActiveRoute(pathname: string, href: string): boolean {
  if (href === '/dashboard') {
    return pathname === '/dashboard' || pathname === '/';
  }
  return pathname.startsWith(href);
}

function BadgeLabel({ label }: { label?: string | number }) {
  if (label === undefined || label === null) return null;
  if (typeof label === 'string' && !isNaN(Number(label))) {
    return (
      <span className="ml-auto flex size-5 items-center justify-center rounded-md bg-primary/20 text-[10px] font-bold text-primary">
        {label}
      </span>
    );
  }
  if (typeof label === 'number') {
    return (
      <span className="ml-auto flex size-5 items-center justify-center rounded-md bg-primary/20 text-[10px] font-bold text-primary">
        {label > 99 ? '99+' : label}
      </span>
    );
  }
  return (
    <span className="ml-auto rounded-md bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
      {label}
    </span>
  );
}

const NavItem = memo(function NavItem({
  href,
  disabled,
  icon: Icon,
  title,
  isActive,
  isCollapsed,
  badge,
  depth = 0,
  onClick,
}: {
  href: string;
  disabled?: boolean;
  icon: LucideIcon;
  title: string;
  isActive: boolean;
  isCollapsed: boolean;
  badge?: string | number;
  depth?: number;
  onClick?: () => void;
}) {
  const link = (
    <Link
      href={disabled ? '#' : href}
      prefetch={true}
      onClick={disabled ? (e) => e.preventDefault() : onClick}
      className={cn(
        'group/sidebar-link relative flex items-center gap-3 text-sm font-medium',
        'transition-all duration-100',
        depth === 0 ? 'px-3 py-3' : 'px-3 py-2',
        isActive
          ? 'rounded-xl bg-gradient-to-r from-primary to-blue-500 dark:from-primary dark:to-primary text-primary-foreground shadow-sm shadow-blue-500/20'
          : 'rounded-lg text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground',
        disabled && 'pointer-events-none opacity-40',
      )}
      style={depth > 0 ? { marginLeft: '20px' } : undefined}
    >
      {isActive && !depth && (
        <div className="absolute left-0.5 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary-foreground/60" />
      )}
      <Icon className={cn('size-5 shrink-0', depth > 0 && 'size-4')} />
      {!isCollapsed && (
        <span className="flex-1 truncate">{title}</span>
      )}
      {!isCollapsed && <BadgeLabel label={badge} />}
    </Link>
  );

  if (isCollapsed) {
    return (
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-2">
          <span>{title}</span>
          {badge !== undefined && (
            <span className="rounded-md bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
              {badge}
            </span>
          )}
        </TooltipContent>
      </Tooltip>
    );
  }

  return link;
});

const NavItemWithActive = memo(function NavItemWithActive({
  href,
  disabled,
  icon,
  title,
  badge,
  depth,
  isCollapsed,
}: {
  href: string;
  disabled?: boolean;
  icon: LucideIcon;
  title: string;
  badge?: string | number;
  depth?: number;
  isCollapsed: boolean;
}) {
  const isActive = useActivePathStore(
    useCallback((s) => isActiveRoute(s.activePath, href), [href]),
  );
  const setActivePath = useActivePathStore((s) => s.setActivePath);
  const handleClick = useCallback(() => {
    setActivePath(href);
  }, [href, setActivePath]);

  return (
    <NavItem
      href={href}
      disabled={disabled}
      icon={icon}
      title={title}
      isActive={isActive}
      isCollapsed={isCollapsed}
      badge={badge}
      depth={depth}
      onClick={handleClick}
    />
  );
});

const SectionActiveHeader = memo(function SectionActiveHeader({
  title,
  group,
}: {
  title: string;
  group: NavGroup;
}) {
  const hasActiveItem = useActivePathStore(
    useCallback(
      (s) =>
        group.items.some(
          (item) =>
            isActiveRoute(s.activePath, item.href) ||
            item.subItems?.some((sub) => isActiveRoute(s.activePath, sub.href)),
        ),
      [group],
    ),
  );

  return (
    <span
      className={cn(
        'flex items-center text-[11px] font-semibold uppercase tracking-widest',
        hasActiveItem
          ? 'text-sidebar-foreground/60'
          : 'text-sidebar-foreground/30',
      )}
    >
      {title}
    </span>
  );
});

const SidebarInner = memo(function SidebarInner({
  isCollapsed,
  toggleCollapse,
}: {
  isCollapsed: boolean;
  toggleCollapse: () => void;
}) {
  const width = isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;

  return (
    <aside
      className="fixed left-0 top-0 z-30 flex h-full flex-col border-r border-sidebar-border bg-sidebar shadow-sidebar"
      style={{ width, transition: 'width 180ms cubic-bezier(0.2,0,0,1)' }}
    >
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-sidebar-border px-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary shadow-sm shadow-primary/20">
          <GraduationCap className="size-5 text-primary-foreground" />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col overflow-hidden">
            <span className="truncate text-[15px] font-semibold leading-tight text-sidebar-foreground">
              SchoolOS
            </span>
            <span className="truncate text-[11px] font-medium leading-tight text-sidebar-foreground/40">
              Management System
            </span>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-6">
          {sidebarNav.map((group) => (
            <div key={group.title} className="flex flex-col gap-0.5">
              {!isCollapsed && (
                <div className="sticky top-0 z-10 -mx-3 -mt-1 mb-1 bg-sidebar px-3 pb-1 pt-1">
                  <SectionActiveHeader title={group.title} group={group} />
                </div>
              )}
              {group.items.map((item) => {
                if (item.subItems) {
                  return (
                    <div key={item.title} className="flex flex-col gap-0.5">
                      <NavItemWithActive
                        href={item.href}
                        disabled={item.disabled}
                        icon={item.icon}
                        title={item.title}
                        badge={item.badge}
                        isCollapsed={isCollapsed}
                      />
                      {item.subItems.map((sub) => (
                        <NavItemWithActive
                          key={sub.title}
                          href={sub.href}
                          disabled={sub.disabled}
                          icon={sub.icon}
                          title={sub.title}
                          badge={sub.badge}
                          depth={1}
                          isCollapsed={isCollapsed}
                        />
                      ))}
                    </div>
                  );
                }

                return (
                  <NavItemWithActive
                    key={item.title}
                    href={item.href}
                    disabled={item.disabled}
                    icon={item.icon}
                    title={item.title}
                    badge={item.badge}
                    isCollapsed={isCollapsed}
                  />
                );
              })}
            </div>
          ))}
        </nav>
      </ScrollArea>

      <div className="flex shrink-0 items-center border-t border-sidebar-border px-3 py-3">
        {isCollapsed ? (
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={toggleCollapse}
                className="flex h-8 w-full items-center justify-center rounded-lg text-sidebar-foreground/40 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              >
                <ChevronLeft className={cn('size-4 transition-transform duration-100', isCollapsed && 'rotate-180')} />
                <span className="sr-only">Expand sidebar</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Expand sidebar</TooltipContent>
          </Tooltip>
        ) : (
          <div className="flex w-full items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-sidebar-accent">
              <UserCircle className="size-5 text-sidebar-foreground/60" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-medium text-sidebar-foreground">Admin User</span>
              <span className="truncate text-xs text-sidebar-foreground/40">Super Admin</span>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={toggleCollapse}
              className="shrink-0 rounded-lg text-sidebar-foreground/40 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            >
              <ChevronLeft className={cn('size-4 transition-transform duration-100')} />
              <span className="sr-only">Collapse sidebar</span>
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
});

export function Sidebar() {
  const isMobile = useIsMobile();
  const { isCollapsed, toggleCollapse } = useSidebarStore();
  if (isMobile) return null;
  return <SidebarInner isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} />;
}
