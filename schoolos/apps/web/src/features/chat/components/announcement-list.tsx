'use client';

import { useState } from 'react';
import { cn } from '@schoolos/ui';
import { Megaphone, Loader2, AlertCircle, Download, Check, CheckCheck, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import type { Announcement } from '../types';

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

const priorityColors: Record<string, string> = {
  urgent: 'bg-red-500/10 text-red-500 border-red-500/20',
  high: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  normal: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  low: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
};

export function AnnouncementList({
  announcements,
  isLoading,
  error,
  onMarkRead,
  canCreate,
  onCreate,
}: {
  announcements: Announcement[];
  isLoading?: boolean;
  error?: Error | null;
  onMarkRead?: (id: string) => void;
  canCreate?: boolean;
  onCreate?: () => void;
}) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-sm text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {canCreate && onCreate && (
        <button
          onClick={onCreate}
          className="flex items-center gap-2 px-4 py-2.5 w-full rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
        >
          <Megaphone className="h-4 w-4" />
          New Announcement
        </button>
      )}

      {announcements.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <Megaphone className="h-6 w-6 text-primary" />
          </div>
          <p className="text-sm font-medium">No announcements</p>
          <p className="text-xs text-muted-foreground mt-1">Announcements will appear here</p>
        </div>
      ) : (
        announcements.map((announcement) => {
          const isExpanded = expanded.has(announcement.id);
          const isRead = announcement.receipts && announcement.receipts.length > 0;
          const priorityColor = priorityColors[announcement.priority] ?? priorityColors.normal;

          return (
            <div
              key={announcement.id}
              className={cn(
                'rounded-lg border p-4 transition-colors',
                isRead ? 'bg-card' : 'bg-primary/5 border-primary/20'
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn('px-2 py-0.5 text-[10px] font-medium rounded-full border', priorityColor)}>
                      {announcement.priority}
                    </span>
                    {!isRead && (
                      <span className="h-2 w-2 rounded-full bg-primary" />
                    )}
                    <span className="text-[11px] text-muted-foreground">
                      {formatTime(announcement.createdAt)}
                    </span>
                  </div>
                  <h3 className={cn('text-sm', isRead ? 'font-medium' : 'font-semibold')}>
                    {announcement.title}
                  </h3>
                </div>
                <button
                  onClick={() => toggleExpand(announcement.id)}
                  className="p-1 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors shrink-0"
                >
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </div>

              {isExpanded && (
                <div className="mt-3 space-y-3">
                  {announcement.content && (
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{announcement.content}</p>
                  )}

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>By {announcement.createdBy.name}</span>
                    <span>·</span>
                    <span>{announcement.target.replace(/_/g, ' ')}</span>
                  </div>

                  {announcement.attachmentUrl && (
                    <a
                      href={announcement.attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-background hover:bg-muted transition-colors text-sm"
                    >
                      <Download className="h-4 w-4 text-muted-foreground" />
                      <span className="flex-1 truncate">{announcement.attachmentName ?? 'Download Attachment'}</span>
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </a>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    {!isRead && onMarkRead && (
                      <button
                        onClick={() => onMarkRead(announcement.id)}
                        className="flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        <Check className="h-3 w-3" />
                        Mark as read
                      </button>
                    )}
                    {isRead && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <CheckCheck className="h-3 w-3" />
                        Read
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
