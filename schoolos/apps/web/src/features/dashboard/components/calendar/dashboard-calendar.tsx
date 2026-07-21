'use client';

import { WidgetCard } from '../shared/widget-card';
import { EmptyState } from '../shared/empty-state';
import { Badge } from '@schoolos/ui';
import { cn } from '@schoolos/ui';
import { Calendar as CalendarIcon, BookOpen, Users, FileSpreadsheet, PartyPopper, Sun, Cake } from 'lucide-react';
import type { CalendarEvent } from '../../types';

const eventIcons = {
  class: BookOpen,
  meeting: Users,
  exam: FileSpreadsheet,
  event: PartyPopper,
  holiday: Sun,
  birthday: Cake,
};

interface DashboardCalendarProps {
  events?: CalendarEvent[];
  isLoading?: boolean;
  error?: string;
}

const today = new Date();
const todayStr = today.toISOString().split('T')[0];

const mockEvents: CalendarEvent[] = [
  { id: '1', title: 'Mathematics Class', date: todayStr, time: '08:00 - 09:00', type: 'class' },
  { id: '2', title: 'Staff Meeting', date: todayStr, time: '10:00 - 11:00', type: 'meeting' },
  { id: '3', title: 'Science Mid-Term', date: todayStr, time: '14:00 - 16:00', type: 'exam' },
  { id: '4', title: 'Annual Day Practice', date: todayStr, time: '15:00 - 17:00', type: 'event' },
  { id: '5', title: 'Holi Break', date: new Date(today.getTime() + 2 * 86400000).toISOString().split('T')[0], type: 'holiday' },
  { id: '6', title: 'Rahul\'s Birthday', date: todayStr, type: 'birthday' },
  { id: '7', title: 'Parent-Teacher Meeting', date: new Date(today.getTime() + 3 * 86400000).toISOString().split('T')[0], time: '09:00 - 12:00', type: 'meeting' },
];

export function DashboardCalendar({ events, isLoading, error }: DashboardCalendarProps) {
  const data = events ?? mockEvents;
  const todayEvents = data.filter((e) => e.date === todayStr);
  const upcomingEvents = data.filter((e) => e.date > todayStr).slice(0, 4);

  return (
    <WidgetCard
      title="Today's Schedule"
      description={today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
      isLoading={isLoading}
      error={error}
      onRefresh={() => {}}
    >
      {data.length === 0 ? (
        <EmptyState
          icon={CalendarIcon}
          title="No events today"
          description="Your schedule is clear"
        />
      ) : (
        <div className="space-y-3 px-1">
          {todayEvents.length > 0 && (
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Today
              </p>
              <div className="space-y-1.5">
                {todayEvents.map((event) => {
                  const Icon = eventIcons[event.type];
                  return (
                    <div
                      key={event.id}
                      className={cn(
                        'flex items-start gap-2.5 rounded-lg border-l-2 p-2.5',
                        'bg-muted/30',
                      )}
                    >
                      <Icon className="mt-0.5 h-3.5 w-3.5 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{event.title}</p>
                        {event.time && (
                          <p className="text-[10px] text-muted-foreground">{event.time}</p>
                        )}
                      </div>
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0">
                        {event.type}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {upcomingEvents.length > 0 && (
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Upcoming
              </p>
              <div className="space-y-1.5">
                {upcomingEvents.map((event) => {
                  const Icon = eventIcons[event.type];
                  const eventDate = new Date(event.date);
                  const dayLabel = eventDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                  return (
                    <div
                      key={event.id}
                      className="flex items-start gap-2.5 rounded-lg p-2.5 hover:bg-accent/50 transition-colors"
                    >
                      <Icon className="mt-0.5 h-3.5 w-3.5 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{event.title}</p>
                        <p className="text-[10px] text-muted-foreground">{dayLabel}{event.time ? ` \u00b7 ${event.time}` : ''}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </WidgetCard>
  );
}
