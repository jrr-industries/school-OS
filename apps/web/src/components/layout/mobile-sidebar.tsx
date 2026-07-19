'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSidebarStore } from '@/store';
import { sidebarNav } from '@/config/navigation';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

function isActiveRoute(pathname: string, href: string): boolean {
  if (href === '/dashboard') return pathname === '/dashboard' || pathname === '/';
  return pathname.startsWith(href);
}

export function MobileSidebar() {
  const pathname = usePathname();
  const { isMobileOpen, setMobileOpen } = useSidebarStore();

  return (
    <Sheet open={isMobileOpen} onOpenChange={setMobileOpen}>
      <SheetContent side="left" className="w-72 border-r-border p-0">
        <SheetHeader className="flex h-16 flex-row items-center gap-3 border-b border-border px-4">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary shadow-sm">
            <GraduationCap className="size-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <SheetTitle className="text-[15px] font-semibold leading-tight">
              SchoolOS
            </SheetTitle>
            <span className="text-[11px] font-medium leading-tight text-muted-foreground/50">
              Management System
            </span>
          </div>
        </SheetHeader>
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="flex flex-col gap-6">
            {sidebarNav.map((group) => {
              const hasActiveItem = group.items.some(
                (item) =>
                  isActiveRoute(pathname, item.href) ||
                  item.subItems?.some((sub) => isActiveRoute(pathname, sub.href)),
              );

              return (
                <div key={group.title} className="flex flex-col gap-0.5">
                  <span
                    className={cn(
                      'mb-1 flex items-center px-3 text-[11px] font-semibold uppercase tracking-widest',
                      hasActiveItem
                        ? 'text-muted-foreground/60'
                        : 'text-muted-foreground/30',
                    )}
                  >
                    {group.title}
                  </span>
                  {group.items.map((item) => {
                    if (item.subItems) {
                      const isItemActive = item.subItems.some((sub) =>
                        isActiveRoute(pathname, sub.href),
                      );
                      const Icon = item.icon;

                      return (
                        <div key={item.title} className="flex flex-col gap-0.5">
                          <Link
                            href={item.disabled ? '#' : item.href}
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
                              isItemActive
                                ? 'bg-gradient-to-r from-primary to-blue-600 dark:from-primary dark:to-primary text-primary-foreground'
                                : 'text-muted-foreground/50 hover:bg-accent hover:text-foreground',
                            )}
                          >
                            <Icon className="size-5 shrink-0" />
                            <span className="flex-1 truncate">{item.title}</span>
                          </Link>
                          {item.subItems.map((sub) => {
                            const isSubActive = isActiveRoute(pathname, sub.href);
                            const SubIcon = sub.icon;
                            return (
                              <Link
                                key={sub.title}
                                href={sub.disabled ? '#' : sub.href}
                                onClick={() => setMobileOpen(false)}
                                className={cn(
                                  'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-150',
                                  isSubActive
                                    ? 'bg-gradient-to-r from-primary to-blue-600 dark:from-primary dark:to-primary text-primary-foreground'
                                    : 'text-muted-foreground/50 hover:bg-accent hover:text-foreground',
                                  sub.disabled && 'pointer-events-none opacity-40',
                                )}
                                style={{ marginLeft: '20px' }}
                              >
                                <SubIcon className="size-4 shrink-0" />
                                <span className="truncate">{sub.title}</span>
                              </Link>
                            );
                          })}
                        </div>
                      );
                    }

                    const isActive = isActiveRoute(pathname, item.href);
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.title}
                        href={item.disabled ? '#' : item.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
                          isActive
                            ? 'bg-gradient-to-r from-primary to-blue-600 dark:from-primary dark:to-primary text-primary-foreground'
                            : 'text-muted-foreground/50 hover:bg-accent hover:text-foreground',
                        )}
                      >
                        <Icon className="size-5 shrink-0" />
                        <span className="flex-1 truncate">{item.title}</span>
                      </Link>
                    );
                  })}
                </div>
              );
            })}
          </nav>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
