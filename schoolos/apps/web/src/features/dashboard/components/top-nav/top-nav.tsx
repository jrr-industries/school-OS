'use client';

import { useState, useCallback } from 'react';
import { useAuthStore } from '@schoolos/hooks';
import { useRouter } from 'next/navigation';
import { Avatar, Dropdown, DropdownItem, DropdownSeparator } from '@schoolos/ui';
import { Bell, Search, Moon, Sun, LogOut, User, Settings, Plus, MessageSquare, CheckSquare, Menu, Calendar } from 'lucide-react';
import { useThemeStore, useNotificationStore, useUserStore } from '@schoolos/hooks';
import { ACADEMIC_YEARS } from '../../constants/widgets';
import { GlobalSearch } from '../search/global-search';
import { NotificationCenter } from '../notifications/notification-center';

const quickCreateItems = [
  { label: 'New Student', href: '/students/new', icon: User },
  { label: 'New Teacher', href: '/teachers/new', icon: Settings },
  { label: 'New Class', href: '/classes/new', icon: Calendar },
  { label: 'Collect Fee', href: '/fees/collect', icon: Settings },
  { label: 'Send Announcement', href: '/communication/announcements/new', icon: MessageSquare },
];

export function TopNav() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { theme, toggleTheme } = useThemeStore();
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const toggleSidebar = useUserStore((state) => state.toggleSidebar);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [academicYear, setAcademicYear] = useState('2025-26');

  const handleLogout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id }),
      });
    } finally {
      logout();
      router.push('/login');
    }
  }, [user, logout, router]);

  return (
    <>
      <header className="flex h-14 items-center justify-between border-b bg-background px-4 lg:px-6 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="rounded-md p-1.5 hover:bg-accent lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-4 w-4" />
          </button>

          <button
            onClick={() => setSearchOpen(true)}
            className="inline-flex h-9 w-full max-w-sm items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground shadow-sm hover:bg-accent lg:w-80"
          >
            <Search className="h-4 w-4" />
            <span className="hidden lg:inline">Search students, teachers, classes...</span>
            <span className="lg:hidden">Search</span>
            <kbd className="ml-auto hidden rounded border bg-muted px-1.5 font-mono text-[10px] font-medium lg:inline-block">
              Ctrl+K
            </kbd>
          </button>

          <select
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            className="hidden h-9 rounded-md border border-input bg-background px-3 text-sm text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:inline-flex"
            aria-label="Select academic year"
          >
            {ACADEMIC_YEARS.map((year) => (
              <option key={year.id} value={year.id}>{year.label}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <Dropdown
            trigger={
              <button className="relative rounded-md p-2 hover:bg-accent" aria-label="Quick create">
                <Plus className="h-4 w-4" />
              </button>
            }
          >
            <div className="px-2 py-1.5">
              <p className="text-xs font-medium text-muted-foreground">Quick Create</p>
            </div>
            <DropdownSeparator />
            {quickCreateItems.map((item) => (
              <DropdownItem key={item.label} onClick={() => router.push(item.href)}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </DropdownItem>
            ))}
          </Dropdown>

          <button
            onClick={() => router.push('/tasks')}
            className="relative rounded-md p-2 hover:bg-accent"
            aria-label="Tasks"
          >
            <CheckSquare className="h-4 w-4" />
          </button>

          <button
            onClick={() => router.push('/messages')}
            className="relative rounded-md p-2 hover:bg-accent"
            aria-label="Messages"
          >
            <MessageSquare className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
          </button>

          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative rounded-md p-2 hover:bg-accent"
            aria-label={`Notifications (${unreadCount} unread)`}
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <div className="mx-1 h-6 w-px bg-border" />

          <button
            onClick={toggleTheme}
            className="rounded-md p-2 hover:bg-accent"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          <Dropdown
            trigger={
              <button className="flex items-center gap-2 rounded-md p-1 hover:bg-accent">
                <Avatar
                  size="sm"
                  fallback={user?.name ?? 'U'}
                  src={undefined}
                />
                <div className="hidden text-left lg:block">
                  <p className="text-sm font-medium leading-tight">{user?.name}</p>
                  <p className="text-[10px] text-muted-foreground">{user?.email}</p>
                </div>
              </button>
            }
          >
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <DropdownSeparator />
            <DropdownItem onClick={() => router.push('/profile')}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownItem>
            <DropdownItem onClick={() => router.push('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownItem>
            <DropdownSeparator />
            <DropdownItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownItem>
          </Dropdown>
        </div>
      </header>

      {searchOpen && <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />}
      {notifOpen && <NotificationCenter open={notifOpen} onOpenChange={setNotifOpen} />}
    </>
  );
}
