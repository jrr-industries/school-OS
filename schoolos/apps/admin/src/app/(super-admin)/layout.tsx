import type { ReactNode } from 'react';
import { PortalShell } from '@/features/super-admin/components/portal-shell';

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  return <PortalShell>{children}</PortalShell>;
}
