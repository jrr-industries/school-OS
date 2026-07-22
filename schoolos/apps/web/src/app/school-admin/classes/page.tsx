'use client';

import { useState, useEffect, useCallback } from 'react';
import { BookOpen, Plus, Users, Pencil, Trash2, DoorOpen } from 'lucide-react';
import { Card, CardContent, Button, Input } from '@schoolos/ui';
import { toast } from 'sonner';
import { useSchoolAdminAuth } from '@/features/supabase/hooks/use-school-admin-auth';
import { PageHeader } from '@/features/school-admin/components/page-header';

interface ClassItem {
  id: string;
  name: string;
  code: string | null;
  description: string | null;
  maxCapacity: number;
  _count: { students: number; sections: number };
}

export default function ClassesPage() {
  useSchoolAdminAuth();
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<ClassItem | null>(null);
  const [form, setForm] = useState({ name: '', code: '', description: '', maxCapacity: '40' });

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/school-admin/classes');
      const json = await res.json();
      if (json.success) setClasses(json.data);
    } catch {
      toast.error('Failed to load classes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const resetForm = () => {
    setForm({ name: '', code: '', description: '', maxCapacity: '40' });
    setEditItem(null);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) { toast.error('Class name is required'); return; }
    try {
      const res = await fetch('/api/school-admin/classes', {
        method: editItem ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editItem ? { id: editItem.id, ...form } : form),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(editItem ? 'Class updated' : 'Class created');
        resetForm();
        fetchData();
      } else {
        toast.error(json.error || 'Failed');
      }
    } catch {
      toast.error('Failed to save');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch('/api/school-admin/classes', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (json.success) { toast.success('Class removed'); fetchData(); }
      else toast.error(json.error || 'Failed');
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Classes"
        description="Manage classes and sections"
        actions={
          <Button onClick={() => { resetForm(); setShowForm(!showForm); }} className="gap-2">
            <Plus className="h-4 w-4" /> {showForm ? 'Cancel' : 'Add Class'}
          </Button>
        }
      />
      {showForm && (
        <Card className="border-primary/20">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold">{editItem ? 'Edit Class' : 'New Class'}</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><label className="text-sm font-medium">Name *</label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Class 10" /></div>
              <div className="space-y-2"><label className="text-sm font-medium">Code</label><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="e.g. 10" /></div>
              <div className="space-y-2"><label className="text-sm font-medium">Description</label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" /></div>
              <div className="space-y-2"><label className="text-sm font-medium">Max Capacity</label><Input type="number" value={form.maxCapacity} onChange={(e) => setForm({ ...form, maxCapacity: e.target.value })} /></div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={resetForm}>Cancel</Button>
              <Button onClick={handleSubmit}>{editItem ? 'Update' : 'Create'}</Button>
            </div>
          </CardContent>
        </Card>
      )}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-28 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />)}
        </div>
      ) : classes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <BookOpen className="h-12 w-12 mb-4" />
          <h3 className="text-lg font-medium">No Classes</h3>
          <p className="text-sm mt-1">Create your first class to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((c) => (
            <Card key={c.id} className="transition-all hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2.5"><BookOpen className="h-5 w-5 text-primary" /></div>
                    <div>
                      <h3 className="font-semibold">{c.name}</h3>
                      {c.code && <p className="text-xs text-muted-foreground">Code: {c.code}</p>}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => { setEditItem(c); setForm({ name: c.name, code: c.code || '', description: c.description || '', maxCapacity: String(c.maxCapacity) }); setShowForm(true); }} className="rounded p-1.5 text-muted-foreground hover:bg-muted"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(c.id)} className="rounded p-1.5 text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5"><Users className="h-4 w-4 text-muted-foreground" /><span>{c._count.students} / {c.maxCapacity} students</span></div>
                  <div className="flex items-center gap-1.5"><DoorOpen className="h-4 w-4 text-muted-foreground" /><span>{c._count.sections} sections</span></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
