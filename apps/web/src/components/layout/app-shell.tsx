'use client';

import type { ReactNode } from 'react';
import { Sidebar } from './sidebar';
import { MobileSidebar } from './mobile-sidebar';
import { useSidebarStore } from '@/store';
import { SIDEBAR_WIDTH, SIDEBAR_COLLAPSED_WIDTH } from '@/constants';
import { useIsMobile } from '@/hooks/use-media-query';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const isMobile = useIsMobile();
  const { isCollapsed } = useSidebarStore();

  const sidebarWidth = isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;

  return (
    <div className="relative flex min-h-screen">
      <Sidebar />
      <MobileSidebar />
      <main
        className="flex flex-1 flex-col will-change-transform"
        style={{
          transform: isMobile ? 'translateX(0)' : `translateX(${sidebarWidth}px)`,
          transition: 'transform 180ms cubic-bezier(0.2,0,0,1)',
        }}
      >
        {children}
      </main>
    </div>
  );
}
