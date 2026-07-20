'use client';

import { useAuthStore } from '@schoolos/hooks';
import { useRouter } from 'next/navigation';
import { Avatar, Dropdown, DropdownItem, DropdownSeparator } from '@schoolos/ui';
import { Bell, Search, Moon, Sun, LogOut, User, Settings } from 'lucide-react';
import { useThemeStore } from '@schoolos/hooks';

export function TopNav() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { theme, toggleTheme } = useThemeStore();

  const handleLogout = async () => {
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
  };

  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-4">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search..."
            className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-4 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="rounded-md p-2 hover:bg-accent"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>

        <button className="relative rounded-md p-2 hover:bg-accent">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
        </button>

        <Dropdown
          trigger={
            <button className="flex items-center gap-2 rounded-md p-1 hover:bg-accent">
              <Avatar
                size="sm"
                fallback={user?.name ?? 'U'}
                src={undefined}
              />
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
  );
}
