'use client';

import Link from 'next/link';
import { WidgetCard } from '../shared/widget-card';
import { usePermission } from '@schoolos/hooks';
import { QUICK_ACTIONS } from '../../constants/widgets';
import {
  UserPlus, Users, ClipboardCheck, FileEdit, ClipboardList,
  BarChart3, IndianRupee, MessageSquare, PartyPopper, Bus,
  type LucideIcon
} from 'lucide-react';

const actionIcons: Record<string, LucideIcon> = {
  'new-student': UserPlus,
  'new-teacher': Users,
  'take-attendance': ClipboardCheck,
  'create-homework': FileEdit,
  'create-assignment': ClipboardList,
  'generate-report': BarChart3,
  'collect-fee': IndianRupee,
  'send-announcement': MessageSquare,
  'schedule-event': PartyPopper,
  'add-vehicle': Bus,
};

export function QuickActions() {
  return (
    <WidgetCard title="Quick Actions" description="Common tasks and operations">
      <div className="grid grid-cols-2 gap-2">
        {QUICK_ACTIONS.map((action) => {
          const act = action as typeof action & { permission?: string };
          const hasPermission = act.permission ? usePermission(act.permission) : true;
          const Icon = actionIcons[action.id];

          if (!hasPermission) return null;

          return (
            <Link
              key={action.id}
              href={action.href}
              className="flex flex-col items-center gap-1.5 rounded-lg border p-3 text-center transition-all hover:bg-accent hover:border-accent-foreground/20"
            >
              {Icon && <Icon className="h-4 w-4 text-primary" />}
              <span className="text-[10px] font-medium leading-tight text-muted-foreground">
                {action.label}
              </span>
            </Link>
          );
        })}
      </div>
    </WidgetCard>
  );
}
