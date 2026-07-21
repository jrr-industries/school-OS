'use client';

import { useState, useEffect } from 'react';
import {
  Bell, CheckCheck, Archive, Trash2,
  Inbox, Megaphone, ShieldAlert, SunSnow, BellRing
} from 'lucide-react';
import {
  Button, Card, CardContent, CardHeader, Badge, Modal, cn
} from '@schoolos/ui';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader } from '@/features/school-admin/components/page-header';
import { useFirebaseAuth } from '@/features/firebase/hooks/use-firebase-auth';
import { RealtimeService } from '@/features/firebase/services/realtime.service';
import { toast } from 'sonner';
import type { Notification } from '@/features/firebase/types';

const typeIcon: Record<string, React.ComponentType<{ className?: string }>> = {
  announcement: Megaphone,
  emergency: ShieldAlert,
  holiday: SunSnow,
  system: BellRing,
};

const typeVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  announcement: 'default',
  emergency: 'destructive',
  holiday: 'secondary',
  system: 'outline',
};

const priorityStyles: Record<string, string> = {
  low: 'border-gray-200 dark:border-gray-700',
  normal: 'border-blue-200 dark:border-blue-800',
  high: 'border-orange-200 dark:border-orange-800',
  urgent: 'border-red-200 dark:border-red-800',
};

const priorityLabel: Record<string, string> = {
  low: 'Low',
  normal: 'Normal',
  high: 'High',
  urgent: 'Urgent',
};

const TABS = ['all', 'unread', 'archived'] as const;
type Tab = (typeof TABS)[number];

function NotificationSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex items-start gap-4 rounded-lg border p-4"
        >
          <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="flex-1 space-y-2">
            <div className="flex gap-2">
              <div className="h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-4 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-4 w-12 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            </div>
            <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          </div>
          <div className="flex gap-1">
            <div className="h-8 w-8 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-8 w-8 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function NotificationsPage() {
  const { schoolId } = useFirebaseAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!schoolId) return;
    const unsub = RealtimeService.subscribeList<Notification>(
      `schools/${schoolId}/notifications`,
      (items) => {
        setNotifications(items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        setLoading(false);
      },
    );
    return unsub;
  }, [schoolId]);

  const filtered = notifications.filter((n) => {
    if (activeTab === 'unread') return !n.read;
    if (activeTab === 'archived') return n.archived;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkRead = async (id: string) => {
    if (!schoolId) return;
    try {
      await RealtimeService.update(`schools/${schoolId}/notifications/${id}`, { read: true });
    } catch {
      toast.error('Failed to mark as read');
    }
  };

  const handleArchive = async (id: string, archived: boolean) => {
    if (!schoolId) return;
    try {
      await RealtimeService.update(`schools/${schoolId}/notifications/${id}`, { archived });
      toast.success(archived ? 'Archived' : 'Restored');
    } catch {
      toast.error('Failed to update');
    }
  };

  const handleDelete = async () => {
    if (!deleteId || !schoolId) return;
    setDeleting(true);
    try {
      await RealtimeService.set(`schools/${schoolId}/notifications/${deleteId}`, null);
      toast.success('Notification deleted');
      setDeleteId(null);
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="View and manage all school notifications"
        breadcrumbs={[
          { label: 'Dashboard', href: '/school-admin/dashboard' },
          { label: 'Notifications' },
        ]}
        actions={
          unreadCount > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
              </span>
              <span className="text-muted-foreground">{unreadCount} unread</span>
            </div>
          )
        }
      />

      <Card>
        <CardHeader className="pb-0">
          <div className="flex items-center border-b pb-3">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'relative px-4 py-2 text-sm font-medium transition-colors',
                  activeTab === tab
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <span className="capitalize">{tab}</span>
                {tab === 'all' && (
                  <span className="ml-1.5 text-xs text-muted-foreground">({notifications.length})</span>
                )}
                {tab === 'unread' && unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-1.5 px-1 py-0 text-[10px]">
                    {unreadCount}
                  </Badge>
                )}
                {activeTab === tab && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  />
                )}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {loading ? (
            <NotificationSkeleton />
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Inbox className="h-12 w-12 mb-3" />
              <p className="text-sm font-medium">
                {activeTab === 'all' && 'No notifications'}
                {activeTab === 'unread' && 'No unread notifications'}
                {activeTab === 'archived' && 'No archived notifications'}
              </p>
              <p className="text-xs mt-1">
                {activeTab === 'archived'
                  ? 'Archived notifications will appear here'
                  : 'New notifications will appear here'}
              </p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <div className="space-y-2">
                {filtered.map((n) => {
                  const TypeIcon = typeIcon[n.type] || Bell;
                  return (
                    <motion.div
                      key={n.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className={cn(
                        'group relative rounded-lg border p-4 transition-colors hover:bg-muted/50',
                        !n.read && 'bg-primary/5 border-primary/20',
                        priorityStyles[n.priority],
                        n.archived && 'opacity-60',
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                          !n.read && 'bg-primary/10 text-primary',
                          n.read && 'bg-muted text-muted-foreground',
                        )}>
                          <TypeIcon className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            {!n.read && (
                              <span className="h-2 w-2 rounded-full bg-primary" />
                            )}
                            <p className={cn(
                              'text-sm truncate',
                              !n.read ? 'font-semibold' : 'font-medium',
                            )}>
                              {n.title}
                            </p>
                            <Badge variant={typeVariant[n.type]} className="text-[10px] capitalize">
                              {n.type.replace(/_/g, ' ')}
                            </Badge>
                            <Badge
                              variant={
                                n.priority === 'urgent' ? 'destructive' :
                                n.priority === 'high' ? 'default' :
                                n.priority === 'low' ? 'secondary' : 'outline'
                              }
                              className="text-[10px] capitalize"
                            >
                              {priorityLabel[n.priority]}
                            </Badge>
                            {n.archived && (
                              <Badge variant="outline" className="text-[10px]">Archived</Badge>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{n.message}</p>
                          <p className="mt-1 text-[10px] text-muted-foreground">
                            {new Date(n.createdAt).toLocaleString()}
                          </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!n.read && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              title="Mark as read"
                              onClick={() => handleMarkRead(n.id)}
                            >
                              <CheckCheck className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            title={n.archived ? 'Restore' : 'Archive'}
                            onClick={() => handleArchive(n.id, !n.archived)}
                          >
                            <Archive className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-600"
                            title="Delete"
                            onClick={() => setDeleteId(n.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </AnimatePresence>
          )}
        </CardContent>
      </Card>

      <Modal open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <div className="p-6">
          <h3 className="text-lg font-semibold">Delete Notification</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Are you sure you want to delete this notification? This action cannot be undone.
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
