import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SchoolOS Admin',
  description: 'SchoolOS Admin Dashboard',
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
