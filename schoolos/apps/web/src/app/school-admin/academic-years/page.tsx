'use client';

import { useState, useEffect, useCallback } from 'react';
import { CalendarDays, Plus, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, Button, Input, Badge, cn } from '@schoolos/ui';
import { toast } from 'sonner';
import { useSchoolAdminAuth } from '@/features/supabase/hooks/use-school-admin-auth';
import { PageHeader } from '@/features/school-admin/components/page-header';

interface AcademicYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  isActive: boolean;
}

export default function AcademicYearsPage() {
  const { schoolId } = useSchoolAdminAuth();
  const [years, setYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', startDate: '', endDate: '' });

  const fetchYears = useCallback(async () => {
    if (!schoolId) return;
    try {
      const res = await fetch('/api/school-admin/academic-years');
      const json = await res.json();
      if (json.success) {
        setYears(json.data);
      }
    } catch {
      toast.error('Failed to load academic years');
    } finally {
      setLoading(false);
    }
  }, [schoolId]);

  useEffect(() => {
    fetchYears();
  }, [fetchYears]);

  const handleSubmit = async () => {
    if (!schoolId || !form.name.trim()) {
      toast.error('Year name is required');
      return;
    }
    try {
      const res = await fetch('/api/school-admin/academic-years', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, schoolId }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Academic year created');
        setForm({ name: '', startDate: '', endDate: '' });
        setShowForm(false);
        fetchYears();
      } else {
        toast.error(json.error || 'Failed to create');
      }
    } catch {
      toast.error('Failed to create academic year');
    }
  };

  const setCurrent = async (id: string) => {
    try {
      const res = await fetch('/api/school-admin/academic-years', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isCurrent: true }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Current year updated');
        fetchYears();
      } else {
        toast.error(json.error || 'Failed to update');
      }
    } catch {
      toast.error('Failed to update');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Academic Years"
        description="Manage academic years and batch-wise student enrollment"
        breadcrumbs={[
          { label: 'Dashboard', href: '/school-admin/dashboard' },
          { label: 'Academic Years' },
        ]}
        actions={
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus className="h-4 w-4" /> Add Year
          </Button>
        }
      />

      {showForm && (
        <Card className="border-primary/20">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold">New Academic Year</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name *</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. 2025-2026" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">End Date</label>
                <Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button onClick={handleSubmit}>Create</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-36 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
          ))}
        </div>
      ) : years.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <CalendarDays className="h-12 w-12 mb-4" />
          <h3 className="text-lg font-medium">No Academic Years</h3>
          <p className="text-sm mt-1">Create your first academic year.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {years.map((year) => (
            <Card key={year.id} className={cn('transition-all hover:shadow-md', year.isCurrent && 'border-primary/50 ring-1 ring-primary/20')}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn('rounded-lg p-2.5', year.isCurrent ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                      <CalendarDays className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{year.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {year.isCurrent && <Badge className="text-[10px]">Current</Badge>}
                        <Badge variant={year.isActive ? 'success' : 'secondary'} className="text-[10px] capitalize">
                          {year.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg border p-2 text-center">
                    <p className="text-[10px] text-muted-foreground">Start</p>
                    <p className="text-xs font-medium">{year.startDate ? new Date(year.startDate).toLocaleDateString() : '-'}</p>
                  </div>
                  <div className="rounded-lg border p-2 text-center">
                    <p className="text-[10px] text-muted-foreground">End</p>
                    <p className="text-xs font-medium">{year.endDate ? new Date(year.endDate).toLocaleDateString() : '-'}</p>
                  </div>
                </div>
                {!year.isCurrent && year.isActive && (
                  <Button variant="outline" size="sm" className="w-full mt-4 gap-2" onClick={() => setCurrent(year.id)}>
                    <CheckCircle2 className="h-4 w-4" /> Set as Current
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
