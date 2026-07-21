'use client';

import { WidgetCard } from '../shared/widget-card';
import { EmptyState } from '../shared/empty-state';
import { Avatar } from '@schoolos/ui';
import { Cake } from 'lucide-react';

interface BirthdayItem {
  id: string;
  name: string;
  role: string;
  class?: string;
  avatar?: string;
}

interface BirthdayListProps {
  birthdays?: BirthdayItem[];
  isLoading?: boolean;
  error?: string;
}

const mockBirthdays: BirthdayItem[] = [
  { id: '1', name: 'Ananya Sharma', role: 'Student', class: '10-A' },
  { id: '2', name: 'Rahul Verma', role: 'Teacher', class: 'Mathematics' },
  { id: '3', name: 'Priya Singh', role: 'Student', class: '9-B' },
  { id: '4', name: 'Amit Kumar', role: 'Staff' },
];

export function BirthdayList({ birthdays, isLoading, error }: BirthdayListProps) {
  const data = birthdays ?? mockBirthdays;

  return (
    <WidgetCard
      title="Birthdays"
      description={`${data.length} celebration${data.length !== 1 ? 's' : ''} today`}
      isLoading={isLoading}
      error={error}
      onRefresh={() => {}}
    >
      {data.length === 0 ? (
        <EmptyState
          icon={Cake}
          title="No birthdays today"
          description="Check back tomorrow"
        />
      ) : (
        <div className="space-y-2">
          {data.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-accent/50"
            >
              <Avatar size="sm" fallback={item.name} src={item.avatar} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  {item.role}{item.class ? ` \u00b7 ${item.class}` : ''}
                </p>
              </div>
              <Cake className="h-4 w-4 text-pink-400 flex-shrink-0" />
            </div>
          ))}
        </div>
      )}
    </WidgetCard>
  );
}
