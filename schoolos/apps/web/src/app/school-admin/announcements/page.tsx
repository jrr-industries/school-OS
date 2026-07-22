'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Send, Loader2, Megaphone, Users, Briefcase, Building2, BellRing, CheckCircle2,
} from 'lucide-react';
import {
  Button, Input, Card, CardContent, CardHeader, CardTitle, Badge,
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Textarea,
} from '@schoolos/ui';
import { PageHeader } from '@/features/school-admin/components/page-header';
import { useSchoolAdminAuth } from '@/features/supabase/hooks/use-school-admin-auth';
import { toast } from 'sonner';

const TARGET_OPTIONS = [
  { value: 'all', label: 'Everyone', icon: Users },
  { value: 'parents', label: 'Parents', icon: Users },
  { value: 'teachers', label: 'Teachers', icon: Briefcase },
  { value: 'staff', label: 'Staff', icon: Briefcase },
  { value: 'principal', label: 'Principal', icon: Building2 },
  { value: 'vice_principal', label: 'Vice Principal', icon: Building2 },
];

const UPDATE_TYPES = [
  { value: 'general', label: 'General Update', color: 'bg-blue-100 text-blue-700' },
  { value: 'academic', label: 'Academic Update', color: 'bg-green-100 text-green-700' },
  { value: 'event', label: 'Event Notice', color: 'bg-purple-100 text-purple-700' },
  { value: 'holiday', label: 'Holiday', color: 'bg-amber-100 text-amber-700' },
  { value: 'emergency', label: 'Emergency', color: 'bg-red-100 text-red-700' },
  { value: 'exam', label: 'Exam Notice', color: 'bg-indigo-100 text-indigo-700' },
];

export default function AnnouncementsPage() {
  useSchoolAdminAuth();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetRole, setTargetRole] = useState('all');
  const [updateType, setUpdateType] = useState('general');
  const [sending, setSending] = useState(false);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnnouncements = useCallback(async () => {
    try {
      const res = await fetch('/api/school-admin/notifications');
      const json = await res.json();
      if (json.success) setAnnouncements(json.data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) {
      toast.error('Title and message are required');
      return;
    }
    setSending(true);
    try {
      const res = await fetch('/api/school-admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          message: message.trim(),
          type: updateType,
          priority: updateType === 'emergency' ? 'urgent' : 'normal',
          targetRole,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Announcement sent');
        setTitle('');
        setMessage('');
        fetchAnnouncements();
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
        title="Announcements"
        description="Send announcements to parents, teachers, and staff"
        breadcrumbs={[
          { label: 'Dashboard', href: '/school-admin/dashboard' },
          { label: 'Announcements' },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Megaphone className="h-5 w-5 text-primary" /> New Announcement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Send To</label>
              <Select value={targetRole} onValueChange={setTargetRole}>
                <SelectTrigger><SelectValue placeholder="Select audience" /></SelectTrigger>
                <SelectContent>
                  {TARGET_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Update Type</label>
              <Select value={updateType} onValueChange={setUpdateType}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {UPDATE_TYPES.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Title *</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Announcement title" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Message *</label>
            <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type your announcement..." rows={4} />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => { setTitle(''); setMessage(''); }}>Clear</Button>
            <Button onClick={handleSend} disabled={sending || !title.trim() || !message.trim()}>
              {sending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</> : <><Send className="mr-2 h-4 w-4" /> Send Announcement</>}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellRing className="h-4 w-4 text-muted-foreground" />
            Sent Announcements
            <Badge variant="secondary" className="ml-1">{announcements.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-20 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
              ))}
            </div>
          ) : announcements.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Megaphone className="h-12 w-12 mb-3" />
              <p className="text-sm font-medium">No announcements yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {announcements.map((a: any) => (
                <div key={a.id} className="rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium">{a.title}</p>
                        <Badge variant="outline" className="text-[10px] capitalize">{a.targetRole}</Badge>
                        {a.read && <CheckCircle2 className="h-3 w-3 text-emerald-500" />}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{a.message}</p>
                      <p className="mt-1 text-[10px] text-muted-foreground">{new Date(a.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
