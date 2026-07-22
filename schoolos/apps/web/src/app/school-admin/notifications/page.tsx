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
import { useSchoolAdminAuth } from '@/features/supabase/hooks/use-school-admin-auth';
import { toast } from 'sonner';

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

const TABS = ['all', 'unread', 'super_admin', 'archived'] as const;
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

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  priority: string;
  targetRole: string;
  createdBy: string;
  createdAt: string;
  read: boolean;
  archived: boolean;
}

export default function NotificationsPage() {
  const { schoolId } = useSchoolAdminAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [sending, setSending] = useState(false);
  const [newMsg, setNewMsg] = useState('');
  const [showCompose, setShowCompose] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/school-admin/notifications');
      const json = await res.json();
      if (json.success) setNotifications(json.data);
    } catch {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!schoolId) { setLoading(false); return; }
    fetchNotifications();
  }, [schoolId]);

  const filtered = notifications.filter((n) => {
    if (activeTab === 'unread') return !n.read;
    if (activeTab === 'archived') return n.archived;
    if (activeTab === 'super_admin') return n.createdBy === 'super_admin';
    return true;
  });

  const superMsgCount = notifications.filter((n) => n.createdBy === 'super_admin').length;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const handleArchive = async (id: string, archived: boolean) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, archived } : n));
    toast.success(archived ? 'Archived' : 'Restored');
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      setNotifications((prev) => prev.filter((n) => n.id !== deleteId));
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
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                </span>
                <span className="text-muted-foreground">{unreadCount} unread</span>
              </div>
            )}
            <Button variant="outline" size="sm" onClick={() => setShowCompose(!showCompose)}>
              Message Super Admin
            </Button>
          </div>
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
                {tab === 'super_admin' && superMsgCount > 0 && (
                  <Badge variant="secondary" className="ml-1.5 px-1 py-0 text-[10px]">
                    {superMsgCount}
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
          {showCompose && (
            <Card className="mb-4 border-primary/30">
              <CardContent className="p-4">
                <h4 className="text-sm font-semibold mb-2">Send Message to Super Admin</h4>
                <textarea
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm resize-none"
                  rows={3}
                  placeholder="Type your message..."
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                />
                <div className="mt-2 flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => { setShowCompose(false); setNewMsg(''); }}>
                    Cancel
                  </Button>
                  <Button size="sm" disabled={!newMsg.trim() || sending} onClick={async () => {
                    setSending(true);
                    try {
                      const res = await fetch('/api/school-admin/notifications', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          title: 'Message from School Admin',
                          message: newMsg.trim(),
                          type: 'system',
                          priority: 'normal',
                          targetRole: 'super_admin',
                        }),
                      });
                      const json = await res.json();
                      if (json.success) {
                        toast.success('Message sent to Super Admin');
                        setNewMsg('');
                        setShowCompose(false);
                        fetchNotifications();
                      } else {
                        toast.error(json.error || 'Failed to send');
                      }
                    } catch {
                      toast.error('Failed to send message');
                    } finally {
                      setSending(false);
                    }
                  }}>
                    {sending ? 'Sending...' : 'Send'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          {loading ? (
            <NotificationSkeleton />
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Inbox className="h-12 w-12 mb-3" />
              <p className="text-sm font-medium">
                {activeTab === 'all' && 'No notifications'}
                {activeTab === 'unread' && 'No unread notifications'}
                {activeTab === 'super_admin' && 'No messages from Super Admin'}
                {activeTab === 'archived' && 'No archived notifications'}
              </p>
              <p className="text-xs mt-1">
                {activeTab === 'archived'
                  ? 'Archived notifications will appear here'
                  : activeTab === 'super_admin'
                  ? 'Messages from the Super Admin will appear here'
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
