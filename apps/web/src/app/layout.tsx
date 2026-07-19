import type { Metadata } from 'next';
import { Providers } from '@/providers/providers';
import { ActivePathWatcher } from '@/components/active-path-watcher';
import { PageTransition } from '@/components/page-transition';
import { AppShell } from '@/components/layout/app-shell';
import { Navbar } from '@/components/layout/navbar';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s | SchoolOS',
    default: 'SchoolOS - Enterprise School Management',
  },
  description: 'Enterprise School Management System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>
          <ActivePathWatcher />
          <AppShell>
            <Navbar />
            <PageTransition>{children}</PageTransition>
          </AppShell>
        </Providers>
      </body>
    </html>
  );
}
