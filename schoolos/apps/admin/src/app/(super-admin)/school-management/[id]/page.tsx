'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Building2,
  Pencil,
  ShieldOff,
  ShieldCheck,
  Trash2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  Clock,
  Users,
  GraduationCap,
  Briefcase,
  Loader2,
  School,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Button,
  cn,
} from '@schoolos/ui';

interface SchoolDetail {
  id: string;
  name: string;
  code: string;
  logo?: string;
  banner?: string;
  type: string;
  board: string;
  medium: string;
  status: 'active' | 'trial' | 'suspended' | 'inactive';
  country: string;
  state: string;
  district: string;
  city: string;
  postalCode: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  academicYear: string;
  timezone: string;
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  subscriptionPlan: string;
  subscriptionStatus: string;
  subscriptionStart: string;
  subscriptionEnd: string;
  studentsCount: number;
  teachersCount: number;
  staffCount: number;
  createdAt: string;
  updatedAt: string;
}

const STATUS_BADGE: Record<string, { variant: 'success' | 'info' | 'destructive' | 'secondary'; label: string }> = {
  active: { variant: 'success', label: 'Active' },
  trial: { variant: 'info', label: 'Trial' },
  suspended: { variant: 'destructive', label: 'Suspended' },
  inactive: { variant: 'secondary', label: 'Inactive' },
};

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-muted-foreground">{icon}</div>
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="text-sm">{value || '\u2014'}</p>
      </div>
    </div>
  );
}

export default function SchoolDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [school, setSchool] = useState<SchoolDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resolvedId, setResolvedId] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setResolvedId(p.id));
  }, [params]);

  const fetchSchool = useCallback(async () => {
    if (!resolvedId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/schools/${resolvedId}`);
      const body = await res.json();
      if (!body.success) throw new Error(body.error || 'Failed to fetch school');
      setSchool(body.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load school');
    } finally {
      setLoading(false);
    }
  }, [resolvedId]);

  useEffect(() => {
    fetchSchool();
  }, [fetchSchool]);

  useEffect(() => {
    if (!resolvedId) return;
    const interval = setInterval(fetchSchool, 30000);
    return () => clearInterval(interval);
  }, [resolvedId, fetchSchool]);

  const handleSuspendToggle = async () => {
    if (!school) return;
    const newStatus = school.status === 'suspended' ? 'active' : 'suspended';
    try {
      const res = await fetch(`/api/admin/schools/${school.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      toast.success(`School ${newStatus === 'suspended' ? 'suspended' : 'activated'} successfully`);
      fetchSchool();
    } catch {
      toast.error('Failed to update school status');
    }
  };

  const handleDelete = async () => {
    if (!school) return;
    if (!window.confirm(`Are you sure you want to delete ${school.name}? This action cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/schools/${school.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete school');
      toast.success('School deleted successfully');
      router.push('/school-management');
    } catch {
      toast.error('Failed to delete school');
    }
  };

  const renderSkeleton = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 animate-pulse rounded-xl bg-muted" />
        <div className="space-y-2">
          <div className="h-6 w-64 animate-pulse rounded bg-muted" />
          <div className="h-4 w-40 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-4 w-32 animate-pulse rounded bg-muted" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="h-3 w-full animate-pulse rounded bg-muted" />
              <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderError = () => (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-4 rounded-full bg-destructive/10 p-4">
        <Loader2 className="h-8 w-8 text-destructive" />
      </div>
      <h3 className="mb-1 text-lg font-semibold">School not found</h3>
      <p className="mb-6 text-sm text-muted-foreground">{error}</p>
      <div className="flex gap-3">
        <Button variant="outline" onClick={fetchSchool}>
          Try Again
        </Button>
        <Button onClick={() => router.push('/school-management')}>
          Back to Schools
        </Button>
      </div>
    </div>
  );

  if (loading) {
    return <div className="space-y-6">{renderSkeleton()}</div>;
  }

  if (error || !school) {
    return renderError();
  }

  const badge = STATUS_BADGE[school.status] ?? STATUS_BADGE.inactive;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/school-management')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          {school.logo ? (
            <img src={school.logo} alt="" className="h-14 w-14 rounded-xl object-cover" />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted">
              <Building2 className="h-7 w-7 text-muted-foreground" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">{school.name}</h1>
              <Badge variant={badge.variant}>{badge.label}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {school.code} &middot; {school.type}{school.board ? ` \u00b7 ${school.board}` : ''}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push(`/school-management/${school.id}/edit`)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
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
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Contact & Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <DetailRow icon={<MapPin className="h-4 w-4" />} label="Address" value={school.address || ''} />
              <div className="grid grid-cols-2 gap-3">
                <DetailRow icon={<></>} label="City" value={school.city || ''} />
                <DetailRow icon={<></>} label="State" value={school.state || ''} />
                <DetailRow icon={<></>} label="District" value={school.district || ''} />
                <DetailRow icon={<></>} label="Postal Code" value={school.postalCode || ''} />
                <DetailRow icon={<></>} label="Country" value={school.country || ''} />
              </div>
              <DetailRow icon={<Phone className="h-4 w-4" />} label="Phone" value={school.phone || ''} />
              <DetailRow icon={<Mail className="h-4 w-4" />} label="Email" value={school.email || ''} />
              <DetailRow icon={<Globe className="h-4 w-4" />} label="Website" value={school.website || ''} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Academic Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <DetailRow icon={<></>} label="Academic Year" value={school.academicYear || ''} />
              <DetailRow icon={<></>} label="Medium" value={school.medium || ''} />
              <DetailRow icon={<></>} label="Education Board" value={school.board || ''} />
              <DetailRow icon={<Clock className="h-4 w-4" />} label="Timezone" value={school.timezone || ''} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                School Admin
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <DetailRow icon={<></>} label="Name" value={school.adminName || ''} />
              <DetailRow icon={<Mail className="h-4 w-4" />} label="Email" value={school.adminEmail || ''} />
              <DetailRow icon={<Phone className="h-4 w-4" />} label="Phone" value={school.adminPhone || ''} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Subscription
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <DetailRow icon={<></>} label="Plan" value={school.subscriptionPlan || ''} />
              <DetailRow icon={<></>} label="Status" value={school.subscriptionStatus || ''} />
              <DetailRow icon={<></>} label="Start Date" value={school.subscriptionStart ? new Date(school.subscriptionStart).toLocaleDateString() : ''} />
              <DetailRow icon={<></>} label="End Date" value={school.subscriptionEnd ? new Date(school.subscriptionEnd).toLocaleDateString() : ''} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg border bg-card p-4 text-center">
                  <Users className="mx-auto mb-1 h-5 w-5 text-muted-foreground" />
                  <p className="text-2xl font-bold">{school.studentsCount ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Students</p>
                </div>
                <div className="rounded-lg border bg-card p-4 text-center">
                  <GraduationCap className="mx-auto mb-1 h-5 w-5 text-muted-foreground" />
                  <p className="text-2xl font-bold">{school.teachersCount ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Teachers</p>
                </div>
                <div className="rounded-lg border bg-card p-4 text-center">
                  <Briefcase className="mx-auto mb-1 h-5 w-5 text-muted-foreground" />
                  <p className="text-2xl font-bold">{school.staffCount ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Staff</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Timestamps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <DetailRow
                icon={<Calendar className="h-4 w-4" />}
                label="Created"
                value={school.createdAt ? new Date(school.createdAt).toLocaleString() : ''}
              />
              <DetailRow
                icon={<Calendar className="h-4 w-4" />}
                label="Last Updated"
                value={school.updatedAt ? new Date(school.updatedAt).toLocaleString() : ''}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
