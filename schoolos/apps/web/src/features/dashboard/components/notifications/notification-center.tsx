'use client';

import { useNotificationStore } from '@schoolos/hooks';
import { cn } from '@schoolos/ui';
import { X, Bell, AlertTriangle, Info, CheckCheck, AlertCircle, CheckCircle2, type LucideIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const notificationIcons: Record<string, LucideIcon> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
  alert: AlertTriangle,
};

const notificationColors: Record<string, string> = {
  info: 'text-blue-500',
  success: 'text-emerald-500',
  warning: 'text-amber-500',
  error: 'text-red-500',
  alert: 'text-purple-500',
};

interface NotificationCenterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotificationCenter({ open, onOpenChange }: NotificationCenterProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const notifications = useNotificationStore((state) => state.notifications);
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);

  const displayed = activeTab === 'unread'
    ? notifications.filter((n) => !n.isRead)
    : notifications;

  const handleNotificationClick = (id: string, link?: string) => {
    markAsRead(id);
    if (link) {
      router.push(link);
      onOpenChange(false);
    }
  };

  return (
    <div
      className={cn(
        'fixed inset-0 z-50',
        open ? 'visible' : 'invisible',
      )}
    >
      <div className="fixed inset-0" onClick={() => onOpenChange(false)} />
      <div
        className={cn(
          'absolute right-4 top-14 z-50 w-80 rounded-lg border bg-popover text-popover-foreground shadow-lg',
          open ? 'animate-in fade-in zoom-in-95' : 'animate-out fade-out zoom-out-95',
        )}
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                aria-label="Mark all as read"
              >
                <CheckCheck className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              aria-label="Close"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('all')}
            className={cn(
              'flex-1 px-4 py-2 text-xs font-medium transition-colors',
              activeTab === 'all'
                ? 'border-b-2 border-primary text-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab('unread')}
            className={cn(
              'flex-1 px-4 py-2 text-xs font-medium transition-colors',
              activeTab === 'unread'
                ? 'border-b-2 border-primary text-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            Unread
            {unreadCount > 0 && (
              <span className="ml-1.5 rounded-full bg-destructive px-1.5 py-0.5 text-[9px] font-bold text-destructive-foreground">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {displayed.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="mb-2 h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          ) : (
            displayed.map((notif) => {
              const Icon = notificationIcons[notif.type] ?? Info;
              return (
                <button
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif.id, notif.link)}
                  className={cn(
                    'flex w-full gap-3 border-b px-4 py-3 text-left transition-colors hover:bg-accent/50',
                    !notif.isRead && 'bg-primary/5',
                  )}
                >
                  <div className="mt-0.5">
                    <Icon className={cn('h-4 w-4', notificationColors[notif.type] ?? 'text-muted-foreground')} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className={cn('text-xs', !notif.isRead && 'font-medium')}>
                      {notif.title}
                    </p>
                    {notif.message && (
                      <p className="text-[11px] text-muted-foreground line-clamp-2">
                        {notif.message}
                      </p>
                    )}
                    <p className="text-[10px] text-muted-foreground">
                      {formatRelativeTime(notif.createdAt)}
                    </p>
                  </div>
                  {!notif.isRead && (
                    <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

function formatRelativeTime(timestamp: string): string {
  const now = Date.now();
  const diff = now - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}
