'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { Megaphone, Plus, Users, CalendarDays } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  preview: string;
  targetAudience: string;
  status: 'published' | 'draft' | 'scheduled';
  date: string;
}

const announcements: Announcement[] = [
  { id: '1', title: 'New Academic Year Preparation', preview: 'All schools must submit their academic calendar for the upcoming year by August 15th.', targetAudience: 'All Schools', status: 'published', date: '2026-07-15' },
  { id: '2', title: 'System Maintenance - July 20', preview: 'The platform will be under maintenance from 2 AM to 5 AM EST. Expect brief downtime.', targetAudience: 'All Users', status: 'published', date: '2026-07-14' },
  { id: '3', title: 'Teacher Training Webinar', preview: 'Mandatory webinar on new assessment tools. Register by July 25th.', targetAudience: 'Teachers', status: 'scheduled', date: '2026-07-25' },
  { id: '4', title: 'Holiday Schedule Update', preview: 'Revised holiday calendar for the fall semester has been approved.', targetAudience: 'All Schools', status: 'draft', date: '2026-07-10' },
  { id: '5', title: 'New Feature: Parent Portal', preview: 'We are excited to announce the launch of the new Parent Portal with real-time grade tracking.', targetAudience: 'Administrators', status: 'published', date: '2026-07-08' },
  { id: '6', title: 'Exam Schedule Guidelines', preview: 'Updated guidelines for mid-term examinations effective immediately.', targetAudience: 'Teachers', status: 'draft', date: '2026-07-05' },
];

const statusBadge = (status: Announcement['status']) => {
  const styles = {
    published: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    draft: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200',
    scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  };
  return styles[status];
};

export default function AnnouncementsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Announcements</h1>
          <p className="text-sm text-muted-foreground mt-1">Create and manage platform-wide announcements</p>
        </div>
        <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors gap-2">
          <Plus className="h-4 w-4" />
          Create Announcement
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-primary" />
            All Announcements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {announcements.map((a) => (
              <div key={a.id} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
                <div className="rounded-lg bg-primary/10 p-2 shrink-0 mt-0.5">
                  <Megaphone className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold">{a.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{a.preview}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" />
                      {a.targetAudience}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <CalendarDays className="h-3 w-3" />
                      {a.date}
                    </span>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge(a.status)}`}>
                      {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
