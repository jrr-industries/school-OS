'use client';

import { useState, useEffect, useCallback } from 'react';
import { Building2, Plus, Users, Pencil, Trash2, BookOpen } from 'lucide-react';
import { Card, CardContent, Button, Input } from '@schoolos/ui';
import { toast } from 'sonner';
import { useSchoolAdminAuth } from '@/features/supabase/hooks/use-school-admin-auth';
import { PageHeader } from '@/features/school-admin/components/page-header';

interface Department {
  id: string;
  name: string;
  code: string | null;
  description: string | null;
  _count?: { subjects: number; employees: number };
}

export default function DepartmentsPage() {
  const { schoolId } = useSchoolAdminAuth();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editDept, setEditDept] = useState<Department | null>(null);
  const [form, setForm] = useState({ name: '', code: '', description: '' });

  const fetchDepartments = useCallback(async () => {
    try {
      const res = await fetch('/api/school-admin/departments');
      const json = await res.json();
      if (json.success) {
        setDepartments(json.data);
      }
    } catch {
      toast.error('Failed to load departments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!schoolId) return;
    fetchDepartments();
  }, [schoolId, fetchDepartments]);

  const resetForm = () => {
    setForm({ name: '', code: '', description: '' });
    setEditDept(null);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    if (!schoolId || !form.name.trim()) {
      toast.error('Department name is required');
      return;
    }
    try {
      const res = await fetch('/api/school-admin/departments', {
        method: editDept ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editDept ? { id: editDept.id, ...form } : { ...form, schoolId }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(editDept ? 'Department updated' : 'Department created');
        resetForm();
        fetchDepartments();
      } else {
        toast.error(json.error || 'Failed to save');
      }
    } catch {
      toast.error('Failed to save department');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch('/api/school-admin/departments', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Department deactivated');
        fetchDepartments();
      } else {
        toast.error(json.error || 'Failed to deactivate');
      }
    } catch {
      toast.error('Failed to deactivate department');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Academics"
        description="Manage academic departments, subjects, and assignments"
        breadcrumbs={[
          { label: 'Dashboard', href: '/school-admin/dashboard' },
          { label: 'Academics' },
        ]}
        actions={
          <Button onClick={() => { resetForm(); setShowForm(!showForm); }} className="gap-2">
            <Plus className="h-4 w-4" /> {showForm ? 'Cancel' : 'Add Department'}
          </Button>
        }
      />

      {showForm && (
        <Card className="border-primary/20">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold">{editDept ? 'Edit Department' : 'New Department'}</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name *</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Science" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Code</label>
                <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="e.g. SCI" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={resetForm}>Cancel</Button>
              <Button onClick={handleSubmit}>{editDept ? 'Update' : 'Create'}</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
          ))}
        </div>
      ) : departments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Building2 className="h-12 w-12 mb-4" />
          <h3 className="text-lg font-medium">No Departments</h3>
          <p className="text-sm mt-1">Create your first department to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((dept) => (
            <Card key={dept.id} className="transition-all hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2.5">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{dept.name}</h3>
                      {dept.code && <p className="text-xs text-muted-foreground">{dept.code}</p>}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => { setEditDept(dept); setForm({ name: dept.name, code: dept.code || '', description: dept.description || '' }); setShowForm(true); }}
                      className="rounded p-1.5 text-muted-foreground hover:bg-muted"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(dept.id)}
                      className="rounded p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{(dept as any)._count?.employees ?? 0} members</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span>{(dept as any)._count?.subjects ?? 0} subjects</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
