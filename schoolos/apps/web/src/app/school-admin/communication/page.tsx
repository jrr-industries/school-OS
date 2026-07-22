'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Send, Loader2, CheckCircle2, Megaphone,
  ShieldAlert, SunSnow, BellRing, UserCheck, Users, Briefcase,
  Building2, Flag
} from 'lucide-react';
import {
  Button, Input, Card, CardContent, CardHeader, CardTitle, Badge, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Textarea, cn
} from '@schoolos/ui';
import { PageHeader } from '@/features/school-admin/components/page-header';
import { useSchoolAdminAuth } from '@/features/supabase/hooks/use-school-admin-auth';
import { toast } from 'sonner';

const TARGET_OPTIONS = [
  { value: 'all', label: 'Entire School', icon: Users },
  { value: 'teachers', label: 'Teachers', icon: UserCheck },
  { value: 'staff', label: 'Staff', icon: Briefcase },
  { value: 'principal', label: 'Principal', icon: Building2 },
] as const;

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300' },
  { value: 'normal', label: 'Normal', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' },
  { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
] as const;

const TYPE_OPTIONS = [
  { value: 'announcement', label: 'Announcement', icon: Megaphone },
  { value: 'emergency', label: 'Emergency Alert', icon: ShieldAlert },
  { value: 'holiday', label: 'Holiday Notice', icon: SunSnow },
  { value: 'system', label: 'System Notification', icon: BellRing },
] as const;

const typeBadgeVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  announcement: 'default',
  emergency: 'destructive',
  holiday: 'secondary',
  system: 'outline',
};

const priorityBadgeVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  low: 'secondary',
  normal: 'default',
  high: 'default',
  urgent: 'destructive',
};

interface FormState {
  targetRole: string;
  title: string;
  message: string;
  priority: string;
  type: string;
}

const initialForm: FormState = {
  targetRole: 'all',
  title: '',
  message: '',
  priority: 'normal',
  type: 'announcement',
};

export default function CommunicationPage() {
  const { user: _user } = useSchoolAdminAuth();
  const [form, setForm] = useState<FormState>(initialForm);
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch('/api/school-admin/notifications');
      const json = await res.json();
      if (json.success) {
        setMessages(json.data);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const validate = useCallback(() => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.message.trim()) errs.message = 'Message is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [form]);

  const handleSend = async () => {
    if (!validate()) return;
    setSending(true);
    try {
      const res = await fetch('/api/school-admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title.trim(),
          message: form.message.trim(),
          type: form.type,
          priority: form.priority,
          targetRole: form.targetRole,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Announcement sent successfully');
        setForm(initialForm);
        fetchMessages();
      } else {
        toast.error(json.error || 'Failed to send');
      }
    } catch {
      toast.error('Failed to send announcement');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Communication"
        description="Broadcast announcements to your school"
        breadcrumbs={[
          { label: 'Dashboard', href: '/school-admin/dashboard' },
          { label: 'Communication' },
        ]}
        actions={
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Flag className="h-4 w-4" />
            <span>{messages.length} sent</span>
          </div>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Megaphone className="h-5 w-5 text-primary" />
            New Announcement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Target Audience</label>
                <Select value={form.targetRole} onValueChange={(v) => setForm((p) => ({ ...p, targetRole: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select audience" /></SelectTrigger>
                  <SelectContent>
                    {TARGET_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select value={form.type} onValueChange={(v) => setForm((p) => ({ ...p, type: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    {TYPE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Title *</label>
              <Input
                value={form.title}
                onChange={(e) => { setForm((p) => ({ ...p, title: e.target.value })); if (errors.title) setErrors((p) => ({ ...p, title: '' })); }}
                placeholder="Announcement title"
                className={cn(errors.title && 'border-destructive')}
              />
              {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Message *</label>
              <Textarea
                value={form.message}
                onChange={(e) => { setForm((p) => ({ ...p, message: e.target.value })); if (errors.message) setErrors((p) => ({ ...p, message: '' })); }}
                placeholder="Type your announcement here..."
                rows={5}
                error={errors.message}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <div className="flex flex-wrap gap-2">
                {PRIORITY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, priority: opt.value }))}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all border',
                      form.priority === opt.value
                        ? 'ring-2 ring-primary ring-offset-1 border-primary'
                        : 'border-border hover:border-muted-foreground',
                      opt.color,
                    )}
                  >
                    <Flag className="h-3 w-3" />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setForm(initialForm)}>
                Reset
              </Button>
              <Button onClick={handleSend} disabled={sending || !form.title.trim() || !form.message.trim()}>
                {sending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Announcement
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BellRing className="h-5 w-5 text-muted-foreground" />
            Sent Messages
            <Badge variant="secondary" className="ml-1">{messages.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border p-4">
                  <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                    <div className="h-3 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                    <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                  </div>
                </div>
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Megaphone className="h-12 w-12 mb-3" />
              <p className="text-sm font-medium">No messages sent yet</p>
              <p className="text-xs">Your announcements will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((msg) => {
                const TargetIcon = TARGET_OPTIONS.find((t) => t.value === msg.targetRole)?.icon || Users;
                return (
                  <div
                    key={msg.id}
                    className="group rounded-lg border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className={cn(
                          'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                          msg.priority === 'urgent' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                          msg.priority === 'high' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' :
                          'bg-primary/10 text-primary',
                        )}>
                          <TargetIcon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-medium truncate">{msg.title}</p>
                            <Badge variant={typeBadgeVariant[msg.type]} className="text-[10px] capitalize">
                              {msg.type.replace(/_/g, ' ')}
                            </Badge>
                            <Badge variant={priorityBadgeVariant[msg.priority]} className="text-[10px] capitalize">
                              {msg.priority}
                            </Badge>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{msg.message}</p>
                          <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                            <span>{new Date(msg.createdAt).toLocaleString()}</span>
                            <span>&middot;</span>
                            <span className="capitalize">To: {TARGET_OPTIONS.find((t) => t.value === msg.targetRole)?.label || msg.targetRole}</span>
                            {msg.read && (
                              <>
                                <span>&middot;</span>
                                <span className="flex items-center gap-1">
                                  <CheckCircle2 className="h-3 w-3" />
                                  Read
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
