'use client';

import Link from 'next/link';

export function DashboardFooter() {
  return (
    <footer className="mt-auto border-t bg-background px-6 py-4">
      <div className="flex flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
        <p>&copy; {new Date().getFullYear()} SchoolOS. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="hover:text-foreground transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-foreground transition-colors">
            Terms
          </Link>
          <Link href="/support" className="hover:text-foreground transition-colors">
            Support
          </Link>
          <span>v1.0.0</span>
        </div>
      </div>
    </footer>
  );
}
