'use client';

import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { UserAvatar } from '@/components/shared/user-avatar';
import { NotificationBell } from '@/components/shared/notification-bell';
import { SearchBar } from '@/components/shared/search-bar';
import { AppBreadcrumb } from '@/components/shared/app-breadcrumb';
import { useSidebarStore } from '@/store';
import { HEADER_HEIGHT } from '@/constants';
import { useIsMobile } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const { toggleCollapse, setMobileOpen, isCollapsed } = useSidebarStore();

  return (
    <header
      className={cn(
        'sticky top-0 z-20 flex h-[72px] shrink-0 items-center gap-3 border-b border-border/80 bg-card px-4 lg:px-6',
        className,
      )}
      style={{ height: HEADER_HEIGHT }}
    >
      <div className="flex items-center gap-2">
        {isMobile ? (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="text-muted-foreground"
          >
            <Menu className="size-4.5" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggleCollapse}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="text-muted-foreground hover:text-foreground"
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu className="size-4.5" />
            </motion.div>
          </Button>
        )}
        <div className="hidden sm:block">
          <AppBreadcrumb pathname={pathname} />
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-4">
        {!isMobile && <SearchBar />}
      </div>

      <div className="flex items-center gap-1">
        <ThemeToggle />
        <NotificationBell />
        <UserAvatar />
      </div>
    </header>
  );
}
