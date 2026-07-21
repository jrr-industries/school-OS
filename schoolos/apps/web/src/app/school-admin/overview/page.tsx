'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  School, MapPin, Phone, Mail, Globe, CalendarDays, BookOpen,
  Users, GraduationCap, HeartHandshake, Briefcase, CreditCard,
  BadgeCheck, ArrowLeft, Edit3, Building2, UserCog, Clock
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Badge, cn, Button } from '@schoolos/ui';
import { useSchoolAdminAuth } from '@/features/supabase/hooks/use-school-admin-auth';
import { SupabaseService } from '@/features/supabase/services/supabase.service';
import type { SchoolData, SubscriptionData } from '@/features/school-admin/types';

export default function SchoolOverview() {
  const { schoolId } = useSchoolAdminAuth();
  const [school, setSchool] = useState<SchoolData | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!schoolId) return;

    const unsubSchool = SupabaseService.subscribe<SchoolData>('schools', schoolId, (data) => {
      if (data) setSchool(data);
      setLoading(false);
    });

    const unsubSub = SupabaseService.subscribeByField<SubscriptionData>(
      'subscription', schoolId, 'school_id', schoolId, setSubscription,
    );

    return () => { unsubSchool(); unsubSub(); };
  }, [schoolId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        <div className="grid gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
      </div>
    );
  }

  if (!school) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <School className="h-16 w-16 mb-4" />
        <h2 className="text-xl font-semibold">School Not Found</h2>
        <p className="text-sm mt-1">Unable to load school data. Please try again.</p>
      </div>
    );
  }

  const infoCards = [
    { label: 'School Code', value: school.code, icon: BadgeCheck },
    { label: 'Board', value: school.board, icon: BookOpen },
    { label: 'School Type', value: school.type, icon: Building2 },
    { label: 'Principal', value: school.principalName, icon: UserCog },
    { label: 'Academic Year', value: school.academicYear, icon: CalendarDays },
    { label: 'Status', value: school.status, icon: BadgeCheck },
  ];

  const statsCards = [
    { label: 'Students', value: school.studentCount, icon: GraduationCap, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400' },
    { label: 'Teachers', value: school.teacherCount, icon: Briefcase, color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400' },
    { label: 'Parents', value: school.parentCount, icon: HeartHandshake, color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400' },
    { label: 'Staff', value: school.staffCount, icon: Users, color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/school-admin/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">School Overview</h1>
          <p className="text-sm text-muted-foreground">Complete information about your school</p>
        </div>
        <div className="flex-1" />
        <Link href="/school-admin/settings">
          <Button variant="outline" size="sm" className="gap-2">
            <Edit3 className="h-4 w-4" /> Edit School
          </Button>
        </Link>
      </div>

      <div className="rounded-xl border bg-white p-6 dark:bg-slate-900 shadow-sm">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          {school.logo ? (
            <img src={school.logo} alt={school.name} className="h-20 w-20 rounded-xl object-cover" />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-primary/10">
              <School className="h-10 w-10 text-primary" />
            </div>
          )}
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold">{school.name}</h2>
            <p className="text-sm text-muted-foreground">{school.code} &middot; {school.board} &middot; {school.type}</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
              <Badge variant={school.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                {school.status}
              </Badge>
              <Badge variant="outline">{school.academicYear}</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className={cn('rounded-lg p-3', stat.color)}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">School Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {infoCards.map((info) => (
                <div key={info.label} className="flex items-start gap-3 rounded-lg border p-3">
                  <info.icon className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{info.label}</p>
                    <p className="text-sm font-medium capitalize truncate">{String(info.value || '-')}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Contact Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 rounded-lg border p-3">
              <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Address</p>
                <p className="text-sm font-medium">{school.address || '-'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border p-3">
              <Phone className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="text-sm font-medium">{school.phone || '-'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border p-3">
              <Mail className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium">{school.email || '-'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border p-3">
              <Globe className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Website</p>
                <p className="text-sm font-medium">{school.website || '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            Subscription Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border p-4">
              <p className="text-xs text-muted-foreground">Plan</p>
              <p className="text-lg font-bold capitalize">{subscription?.plan || 'Free'}</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-xs text-muted-foreground">Status</p>
              <Badge variant="default" className="capitalize mt-1">{subscription?.status || 'Active'}</Badge>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-xs text-muted-foreground">Start Date</p>
              <p className="text-sm font-medium">{subscription?.startDate ? new Date(subscription.startDate).toLocaleDateString() : '-'}</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-xs text-muted-foreground">Expiry Date</p>
              <p className="text-sm font-medium">{subscription?.endDate ? new Date(subscription.endDate).toLocaleDateString() : '-'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border p-4">
              <p className="text-xs text-muted-foreground">Created At</p>
              <p className="text-sm font-medium">{school.createdAt ? new Date(school.createdAt).toLocaleString() : '-'}</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-xs text-muted-foreground">Last Updated</p>
              <p className="text-sm font-medium">{school.updatedAt ? new Date(school.updatedAt).toLocaleString() : '-'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
