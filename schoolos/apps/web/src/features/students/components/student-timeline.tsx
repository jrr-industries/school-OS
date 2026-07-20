'use client';

import { DateUtils } from '@schoolos/utils';
import { GraduationCap, ArrowRightFromLine, Archive, FileText, UserPlus } from 'lucide-react';

interface TimelineEvent {
  id: string;
  type: 'admission' | 'promotion' | 'transfer' | 'archive' | 'document' | 'update';
  title: string;
  description?: string;
  date: string;
  user?: string;
}

const iconMap = {
  admission: UserPlus,
  promotion: GraduationCap,
  transfer: ArrowRightFromLine,
  archive: Archive,
  document: FileText,
  update: FileText,
};

interface StudentTimelineProps {
  events: TimelineEvent[];
}

export function StudentTimeline({ events }: StudentTimelineProps) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-sm text-muted-foreground">No timeline events</p>
      </div>
    );
  }

  return (
    <div className="relative space-y-4">
      <div className="absolute left-4 top-0 h-full w-px bg-border" />
      {events.map((event) => {
        const Icon = iconMap[event.type];
        return (
          <div key={event.id} className="relative flex items-start gap-4 pl-10">
            <div className="absolute left-2.5 flex h-3 w-3 items-center justify-center rounded-full border-2 border-primary bg-background">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            </div>
            <div className="flex-1 space-y-1 rounded-lg border p-3">
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">{event.title}</p>
              </div>
              {event.description && (
                <p className="text-xs text-muted-foreground">{event.description}</p>
              )}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{DateUtils.formatRelative(event.date)}</span>
                {event.user && (
                  <>
                    <span>by</span>
                    <span>{event.user}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
