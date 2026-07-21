'use client';

import { WidgetCard } from '../shared/widget-card';
import { Badge } from '@schoolos/ui';
import { cn } from '@schoolos/ui';
import { HardDrive, Server, Wifi, Activity } from 'lucide-react';

interface SystemHealthProps {
  health?: 'healthy' | 'warning' | 'critical';
  serverStatus?: 'online' | 'offline' | 'maintenance';
  storageUsed?: number;
  storageTotal?: number;
  subscriptionStatus?: 'active' | 'expired' | 'suspended';
  isLoading?: boolean;
  error?: string;
}

export function SystemHealth({
  health = 'healthy',
  serverStatus = 'online',
  storageUsed = 256,
  storageTotal = 500,
  subscriptionStatus = 'active',
  isLoading,
  error,
}: SystemHealthProps) {
  const healthColor = { healthy: 'success', warning: 'warning', critical: 'destructive' } as const;
  const serverColor = { online: 'success', offline: 'destructive', maintenance: 'warning' } as const;
  const subColor = { active: 'success', expired: 'destructive', suspended: 'warning' } as const;

  return (
    <WidgetCard
      title="System Health"
      description="Platform status overview"
      isLoading={isLoading}
      error={error}
      onRefresh={() => {}}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="flex items-center gap-2.5">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs font-medium">System Health</p>
              <p className="text-[10px] text-muted-foreground capitalize">{health}</p>
            </div>
          </div>
          <Badge variant={healthColor[health]}>{health}</Badge>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="flex items-center gap-2.5">
            <Server className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs font-medium">Server Status</p>
              <p className="text-[10px] text-muted-foreground capitalize">{serverStatus}</p>
            </div>
          </div>
          <Badge variant={serverColor[serverStatus]}>{serverStatus}</Badge>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="flex items-center gap-2.5">
            <HardDrive className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs font-medium">Storage</p>
              <p className="text-[10px] text-muted-foreground">{storageUsed}GB / {storageTotal}GB</p>
            </div>
          </div>
          <div className="h-2 w-16 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                (storageUsed / storageTotal) > 0.9 ? 'bg-destructive' : (storageUsed / storageTotal) > 0.7 ? 'bg-amber-500' : 'bg-emerald-500',
              )}
              style={{ width: `${(storageUsed / storageTotal) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="flex items-center gap-2.5">
            <Wifi className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs font-medium">Subscription</p>
              <p className="text-[10px] text-muted-foreground capitalize">{subscriptionStatus}</p>
            </div>
          </div>
          <Badge variant={subColor[subscriptionStatus]}>{subscriptionStatus}</Badge>
        </div>
      </div>
    </WidgetCard>
  );
}
