import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProviders } from '@/features/shared/providers/app-providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    template: '%s | SchoolOS',
    default: 'SchoolOS - Enterprise School Management Platform',
  },
  description: 'Enterprise-grade multi-tenant school management platform powering 10,000+ schools worldwide.',
  keywords: ['school management', 'education', 'SaaS', 'student management'],
  authors: [{ name: 'SchoolOS' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'SchoolOS',
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
