'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Building2, Pencil, ShieldOff, ShieldCheck, Trash2,
  Mail, Phone, Globe, MapPin, Calendar, Users, Loader2,
  GraduationCap, Briefcase,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '@schoolos/ui';

interface SchoolDetail {
  id: string;
  name: string;
  slug: string;
  type: string;
  status: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postalCode: string | null;
  website: string | null;
  logo: string | null;
  curriculum: string | null;
  establishedYear: number | null;
  users: number;
  students: number;
  employees: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

const STATUS_BADGE: Record<string, { variant: 'success' | 'info' | 'destructive' | 'secondary'; label: string }> = {
  active: { variant: 'success', label: 'Active' },
  trial: { variant: 'info', label: 'Trial' },
  suspended: { variant: 'destructive', label: 'Suspended' },
  inactive: { variant: 'secondary', label: 'Inactive' },
};

export default function SchoolDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [resolvedId, setResolvedId] = useState<string | null>(null);
  const [school, setSchool] = useState<SchoolDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { params.then((p) => setResolvedId(p.id)); }, [params]);

  const fetchSchool = useCallback(async () => {
    if (!resolvedId) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/schools/${resolvedId}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error ?? 'School not found');
      setSchool(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load school');
    } finally {
      setLoading(false);
    }
  }, [resolvedId]);

  useEffect(() => { fetchSchool(); }, [fetchSchool]);

  const handleSuspendToggle = async () => {
    if (!school) return;
    const newStatus = school.status === 'suspended' ? 'active' : 'suspended';
    try {
      const res = await fetch(`/api/admin/schools/${school.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setSchool(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!school) return;
    if (!window.confirm(`Delete ${school.name}? This will soft-delete the school.`)) return;
    try {
      const res = await fetch(`/api/admin/schools/${school.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'inactive', deletedAt: new Date().toISOString() }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      router.push('/admin/schools');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !school) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-4 rounded-full bg-destructive/10 p-4">
          <Loader2 className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold">School not found</h3>
        <p className="mb-6 text-sm text-muted-foreground">{error}</p>
        <Button onClick={() => router.push('/admin/schools')}>Back to Schools</Button>
      </div>
    );
  }

  const badge = STATUS_BADGE[school.status] ?? STATUS_BADGE.inactive;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/admin/schools')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted">
            <Building2 className="h-7 w-7 text-muted-foreground" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{school.name}</h1>
              <Badge variant={badge.variant}>{badge.label}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {school.slug} &middot; <span className="capitalize">{school.type.replace(/_/g, ' ')}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/admin/schools/${school.id}/edit`}>
            <Button variant="outline" size="sm">
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={handleSuspendToggle}>
            {school.status === 'suspended' ? (
              <ShieldCheck className="mr-2 h-4 w-4 text-emerald-500" />
            ) : (
              <ShieldOff className="mr-2 h-4 w-4 text-amber-500" />
            )}
            {school.status === 'suspended' ? 'Activate' : 'Suspend'}
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><MapPin className="h-4 w-4" /> Contact & Address</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p><span className="text-muted-foreground">Address:</span> {school.address || '—'}</p>
            <div className="grid grid-cols-2 gap-2">
              <p><span className="text-muted-foreground">City:</span> {school.city || '—'}</p>
              <p><span className="text-muted-foreground">State:</span> {school.state || '—'}</p>
              <p><span className="text-muted-foreground">Country:</span> {school.country || '—'}</p>
              <p><span className="text-muted-foreground">Postal:</span> {school.postalCode || '—'}</p>
            </div>
            <p><Mail className="inline h-3.5 w-3.5 mr-1" /> {school.email || '—'}</p>
            <p><Phone className="inline h-3.5 w-3.5 mr-1" /> {school.phone || '—'}</p>
            {school.website && <p><Globe className="inline h-3.5 w-3.5 mr-1" /> {school.website}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><GraduationCap className="h-4 w-4" /> Academic Info</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p><span className="text-muted-foreground">Curriculum:</span> {school.curriculum || '—'}</p>
            <p><span className="text-muted-foreground">Established:</span> {school.establishedYear || '—'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Users className="h-4 w-4" /> Quick Stats</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg border bg-card p-4 text-center">
                <Users className="mx-auto mb-1 h-5 w-5 text-muted-foreground" />
                <p className="text-2xl font-bold">{school.users}</p>
                <p className="text-xs text-muted-foreground">Users</p>
              </div>
              <div className="rounded-lg border bg-card p-4 text-center">
                <GraduationCap className="mx-auto mb-1 h-5 w-5 text-muted-foreground" />
                <p className="text-2xl font-bold">{school.students}</p>
                <p className="text-xs text-muted-foreground">Students</p>
              </div>
              <div className="rounded-lg border bg-card p-4 text-center">
                <Briefcase className="mx-auto mb-1 h-5 w-5 text-muted-foreground" />
                <p className="text-2xl font-bold">{school.employees}</p>
                <p className="text-xs text-muted-foreground">Employees</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Calendar className="h-4 w-4" /> Timestamps</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p><span className="text-muted-foreground">Created:</span> {new Date(school.createdAt).toLocaleString()}</p>
            <p><span className="text-muted-foreground">Updated:</span> {new Date(school.updatedAt).toLocaleString()}</p>
            {school.deletedAt && <p><span className="text-muted-foreground">Deleted:</span> {new Date(school.deletedAt).toLocaleString()}</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
