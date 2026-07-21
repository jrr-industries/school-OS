import { Sidebar } from '@/features/shared/components/sidebar';
import { TopNav } from '@/features/shared/components/top-nav';
import { DashboardFooter } from '@/features/dashboard/components/layout/footer';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <TopNav />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
        <DashboardFooter />
      </div>
    </div>
  );
}
