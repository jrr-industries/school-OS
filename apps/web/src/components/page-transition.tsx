'use client';

import type { ReactNode } from 'react';

/**
 * PageTransition wraps page content with a subtle animation.
 * 
 * IMPORTANT: This component does NOT use `key={pathname}` because that would
 * force React to unmount/remount the entire page tree on every navigation,
 * causing:
 *   - Loss of component state (search, filters, pagination, scroll)
 *   - Unnecessary full re-renders
 *   - Visual flash as fade-in restarts
 * 
 * Instead, the layout (AppShell, Sidebar, Navbar) persists via Next.js App Router,
 * and only the page content updates naturally via React reconciliation.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <div className="animate-fade-in">
      {children}
    </div>
  );
}
