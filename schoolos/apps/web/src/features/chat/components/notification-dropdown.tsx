'use client';

import { useState, useEffect, useCallback } from 'react';
import { Bell, BellOff, MessageSquare, Trash2 } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  body: string;
  conversationId?: string;
  senderName?: string;
  timestamp: number;
}

let notificationIdCounter = 0;
const listeners: ((n: Notification) => void)[] = [];

export function emitNotification(n: Omit<Notification, 'id' | 'timestamp'>) {
  const notification: Notification = { ...n, id: `notif-${++notificationIdCounter}`, timestamp: Date.now() };
  listeners.forEach((l) => l(notification));

  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(n.title, { body: n.body, icon: '/favicon.ico' });
  }
}

export function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const handler = (n: Notification) => {
      setNotifications((prev) => [n, ...prev].slice(0, 20));
      setUnread((prev) => prev + 1);
    };
    listeners.push(handler);
    return () => { const idx = listeners.indexOf(handler); if (idx >= 0) listeners.splice(idx, 1); };
  }, []);

  const clearAll = () => {
    setNotifications([]);
    setUnread(0);
  };

  const markRead = useCallback(() => setUnread(0), []);

  return (
    <div className="relative">
      <button
        onClick={() => { setOpen(!open); if (!open) markRead(); }}
        className="relative p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
        title="Notifications"
      >
        {unread > 0 ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-4 min-w-[14px] flex items-center justify-center rounded-full bg-destructive text-[9px] font-medium text-destructive-foreground px-1">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-50 w-80 rounded-lg border bg-popover shadow-lg">
            <div className="flex items-center justify-between px-3 py-2 border-b">
              <h3 className="text-sm font-semibold">Notifications</h3>
              {notifications.length > 0 && (
                <button onClick={clearAll} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                  <Trash2 className="h-3 w-3" /> Clear all
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-8">No notifications</p>
              ) : (
                notifications.map((n) => (
                  <div key={n.id} className="flex items-start gap-3 px-3 py-2.5 hover:bg-muted/50 transition-colors border-b last:border-0">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <MessageSquare className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium">{n.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{n.body}</p>
                      <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                        {formatRelativeTime(n.timestamp)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function formatRelativeTime(timestamp: number) {
  const diff = Date.now() - timestamp;
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}
