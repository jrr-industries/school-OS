'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@schoolos/ui';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  CreditCard,
  Settings,
  HelpCircle,
  ChevronLeft,
} from 'lucide-react';
import { useUserStore } from '@schoolos/hooks';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Students', href: '/students', icon: GraduationCap },
  { name: 'Parents', href: '/parents', icon: Users },
  { name: 'Classes', href: '/classes', icon: BookOpen },
  { name: 'Subjects', href: '/subjects', icon: BookOpen },
  { name: 'Schedule', href: '/schedule', icon: Calendar },
  { name: 'Fees', href: '/fees', icon: CreditCard },
];

const bottomNav = [
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Help', href: '/help', icon: HelpCircle },
];

export function Sidebar() {
  const pathname = usePathname();
  const collapsed = useUserStore((state) => state.preferences.sidebarCollapsed);
  const toggleSidebar = useUserStore((state) => state.toggleSidebar);

  return (
    <aside
      className={cn(
        'flex flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
      )}
    >
      <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-4">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2 font-bold">
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
        >
          <ChevronLeft
            className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')}
          />
        </button>
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                collapsed && 'justify-center px-2',
              )}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-2">
        {bottomNav.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              collapsed && 'justify-center px-2',
            )}
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </div>
    </aside>
  );
}
