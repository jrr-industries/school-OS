'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Users } from 'lucide-react';
import { Card, CardContent, Button, Input, Badge } from '@schoolos/ui';
import { toast } from 'sonner';
import { useSchoolAdminAuth } from '@/features/supabase/hooks/use-school-admin-auth';
import { PageHeader } from '@/features/school-admin/components/page-header';

interface StudentRecord {
  id: string;
  name: string;
  className: string;
  status: string;
}

export default function AttendancePage() {
  useSchoolAdminAuth();
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/school-admin/attendance');
      const json = await res.json();
      if (json.success) setStudents(json.data);
    } catch {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const toggleStatus = (id: string) => {
    setStudents((prev) => prev.map((s) =>
      s.id === id ? { ...s, status: s.status === 'present' ? 'absent' : 'present' } : s
    ));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/school-admin/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records: students }),
      });
      const json = await res.json();
      if (json.success) toast.success(`Attendance saved for ${json.count} students`);
      else toast.error(json.error || 'Failed to save');
    } catch {
      toast.error('Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.className.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance"
        description="Mark student attendance"
        actions={
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving ? 'Saving...' : 'Save Attendance'}
          </Button>
        }
      />
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or class..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-4 p-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-12 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Users className="h-12 w-12 mb-4" />
              <h3 className="text-lg font-medium">No Students Found</h3>
              <p className="text-sm mt-1">Add students to start taking attendance.</p>
            </div>
          ) : (
            <div className="divide-y">
              {filtered.map((s) => (
                <div key={s.id} className="flex items-center justify-between px-6 py-3 hover:bg-muted/50 cursor-pointer" onClick={() => toggleStatus(s.id)}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                      {s.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.className}</p>
                    </div>
                  </div>
                  <Badge variant={s.status === 'present' ? 'success' : 'destructive'} className="capitalize">
                    {s.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
