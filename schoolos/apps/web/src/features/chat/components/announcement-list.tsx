'use client';

import { Megaphone, CalendarDays, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import type { Announcement } from '../types';

export function AnnouncementList({
  announcements,
  loading,
  error,
  onRetry,
}: {
  announcements: Announcement[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}) {
  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 gap-3">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="text-sm text-muted-foreground">{error}</p>
          <button onClick={onRetry} className="text-sm text-primary hover:underline">
            Retry
          </button>
        </CardContent>
      </Card>
    );
  }

  if (announcements.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Megaphone className="h-10 w-10 text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">No announcements yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-primary" />
          Announcements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-0 divide-y">
        {announcements.map((a) => (
          <div key={a.id} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
            <div className="rounded-lg bg-primary/10 p-2 shrink-0 mt-0.5">
              <Megaphone className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold">{a.title}</h3>
                <span className={cn(
                  'text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0',
                  a.priority === 'high' ? 'bg-destructive/10 text-destructive' :
                  a.priority === 'low' ? 'bg-muted text-muted-foreground' :
                  'bg-primary/10 text-primary'
                )}>
                  {a.priority}
                </span>
              </div>
              {a.content && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2 whitespace-pre-wrap">
                  {a.content}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <CalendarDays className="h-3 w-3" />
                  {new Date(a.createdAt).toLocaleDateString()}
                </span>
                <span className="text-xs text-muted-foreground">&middot;</span>
                <span className="text-xs text-muted-foreground">
                  by {a.createdBy.name}
                </span>
                <span className="text-xs text-muted-foreground">&middot;</span>
                <span className="text-xs text-muted-foreground capitalize">
                  {a.target === 'all_schools' ? 'All Schools' : `${a.targetSchoolIds.length} school(s)`}
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}
