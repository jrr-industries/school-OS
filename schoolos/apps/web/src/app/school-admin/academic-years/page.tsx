'use client';

import { useState, useEffect } from 'react';
import { CalendarDays, Plus, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, Button, Input, Badge, cn } from '@schoolos/ui';
import { toast } from 'sonner';
import { useSchoolAdminAuth } from '@/features/supabase/hooks/use-school-admin-auth';
import { SupabaseService } from '@/features/supabase/services/supabase.service';

interface AcademicYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  status: 'active' | 'inactive';
  createdAt: string;
}

export default function AcademicYearsPage() {
  const { schoolId } = useSchoolAdminAuth();
  const [years, setYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', startDate: '', endDate: '' });

  useEffect(() => {
    if (!schoolId) return;
    const unsub = SupabaseService.subscribeList<AcademicYear>(
      'academicYears', schoolId, (items) => {
        setYears(items);
        setLoading(false);
      },
    );
    return () => unsub();
  }, [schoolId]);

  const handleSubmit = async () => {
    if (!schoolId || !form.name.trim()) {
      toast.error('Year name is required');
      return;
    }
    try {
      await SupabaseService.insert('academicYears', {
        ...form, school_id: schoolId, isCurrent: years.length === 0, status: 'active', createdAt: new Date().toISOString(),
      });
      toast.success('Academic year created');
      setForm({ name: '', startDate: '', endDate: '' });
      setShowForm(false);
    } catch {
      toast.error('Failed to create academic year');
    }
  };

  const setCurrent = async (id: string) => {
    try {
      for (const y of years) {
        if (y.isCurrent) {
          await SupabaseService.update('academicYears', y.id, { isCurrent: false });
        }
      }
      await SupabaseService.update('academicYears', id, { isCurrent: true });
      toast.success('Current year updated');
    } catch {
      toast.error('Failed to update');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Academic Years</h1>
          <p className="text-sm text-muted-foreground">Manage academic years and terms</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="h-4 w-4" /> Add Year
        </Button>
      </div>

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
                        <Badge variant={year.status === 'active' ? 'default' : 'secondary'} className="text-[10px] capitalize">
                          {year.status}
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
                {!year.isCurrent && year.status === 'active' && (
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
