'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  BookMarked, Plus, Pencil, Trash2, Download, Upload,
  Filter, CheckCircle2, XCircle,
  BookOpen, FlaskConical, BarChart3,
  Globe, Palette,
} from 'lucide-react';
import {
  Card, CardContent, CardHeader, Button, Input, Badge, Modal,
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem, cn,
} from '@schoolos/ui';
import { toast } from 'sonner';
import { useSchoolAdminAuth } from '@/features/supabase/hooks/use-school-admin-auth';
import { PageHeader } from '@/features/school-admin/components/page-header';

interface SubjectGroup {
  id: string;
  name: string;
  code: string | null;
  _count: { subjects: number };
}

interface Subject {
  id: string;
  name: string;
  code: string;
  type: string;
  creditHours: number;
  maxMarks: number;
  passMarks: number;
  isLanguage: boolean;
  isOptional: boolean;
  isActive: boolean;
  department: { id: string; name: string } | null;
  group: { id: string; name: string } | null;
}

const groupIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Languages: Globe,
  Sciences: FlaskConical,
  Commerce: BarChart3,
  Arts: Palette,
  default: BookOpen,
};

const typeBadge: Record<string, string> = {
  theory: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  practical: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  language: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  elective: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  optional: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
  compulsory: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
};

export default function SubjectsPage() {
  useSchoolAdminAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [groups, setGroups] = useState<SubjectGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeGroup, setActiveGroup] = useState('all');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Subject | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  const [form, setForm] = useState({
    name: '', code: '', type: 'theory', groupId: '', departmentId: '',
    creditHours: 0, maxMarks: 100, passMarks: 35, isLanguage: false, isOptional: false,
  });

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/school-admin/subjects');
      const json = await res.json();
      if (json.success) {
        setSubjects(json.data);
        setGroups(json.groups || []);
      }
    } catch {
      toast.error('Failed to load subjects');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const resetForm = () => {
    setForm({ name: '', code: '', type: 'theory', groupId: '', departmentId: '', creditHours: 0, maxMarks: 100, passMarks: 35, isLanguage: false, isOptional: false });
    setEditItem(null);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.code.trim()) { toast.error('Name and code are required'); return; }
    try {
      const res = await fetch('/api/school-admin/subjects', {
        method: editItem ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editItem ? { id: editItem.id, ...form } : form),
      });
      const json = await res.json();
      if (json.success) { toast.success(editItem ? 'Subject updated' : 'Subject created'); resetForm(); fetchData(); }
      else toast.error(json.error || 'Failed');
    } catch { toast.error('Failed to save'); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch('/api/school-admin/subjects', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: deleteId }) });
      const json = await res.json();
      if (json.success) { toast.success('Subject removed'); fetchData(); }
      else toast.error(json.error || 'Failed');
    } catch { toast.error('Failed to delete'); }
    setDeleteId(null);
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) { toast.error('Group name is required'); return; }
    try {
      const res = await fetch('/api/school-admin/subject-groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newGroupName.trim() }),
      });
      const json = await res.json();
      if (json.success) { toast.success('Group created'); setNewGroupName(''); setShowGroupForm(false); fetchData(); }
      else toast.error(json.error || 'Failed');
    } catch { toast.error('Failed to create group'); }
  };

  const filtered = subjects.filter((s) => {
    if (activeGroup !== 'all' && s.group?.name !== activeGroup) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.code.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const allGroups = groups.length > 0 ? groups : [];
  const allSubjects = subjects;

  const CategoryIcon = activeGroup === 'all' ? BookMarked : (groupIcons[activeGroup] || groupIcons.default);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subjects"
        description="Manage subjects, categories, and curriculum"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Upload className="h-4 w-4" /> Import
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" /> Export
            </Button>
            <Button size="sm" onClick={() => { resetForm(); setShowForm(true); }} className="gap-2">
              <Plus className="h-4 w-4" /> Create Subject
            </Button>
          </div>
        }
      />

      <Card>
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-1 overflow-x-auto">
              <button
                onClick={() => setActiveGroup('all')}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors',
                  activeGroup === 'all' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted',
                )}
              >
                <BookMarked className="h-4 w-4" />
                All Subjects
                <Badge variant="secondary" className="ml-1 text-[10px] h-4 px-1">{allSubjects.length}</Badge>
              </button>
              {allGroups.map((g) => {
                const Icon = groupIcons[g.name] || groupIcons.default;
                return (
                  <button
                    key={g.id}
                    onClick={() => setActiveGroup(g.name)}
                    className={cn(
                      'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors',
                      activeGroup === g.name ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted',
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {g.name}
                    <Badge variant="secondary" className="ml-1 text-[10px] h-4 px-1">{g._count.subjects}</Badge>
                  </button>
                );
              })}
              <button
                onClick={() => setShowGroupForm(true)}
                className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted"
              >
                <Plus className="h-3.5 w-3.5" /> Add Group
              </button>
            </div>
            <div className="relative w-48 shrink-0">
              <Filter className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search subjects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 pl-8 text-xs"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-12 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <CategoryIcon className="h-12 w-12 mb-4" />
              <h3 className="text-lg font-medium">
                {activeGroup === 'all' ? 'No Subjects' : `No subjects in ${activeGroup}`}
              </h3>
              <p className="text-sm mt-1">
                {activeGroup === 'all'
                  ? 'Create your first subject to get started.'
                  : 'Add subjects to this category.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50 text-xs font-medium text-muted-foreground">
                    <th className="text-left px-4 py-3">Subject</th>
                    <th className="text-left px-4 py-3">Code</th>
                    <th className="text-left px-4 py-3">Type</th>
                    <th className="text-left px-4 py-3">Category</th>
                    <th className="text-center px-4 py-3">Max Marks</th>
                    <th className="text-center px-4 py-3">Pass Marks</th>
                    <th className="text-center px-4 py-3">Credits</th>
                    <th className="text-center px-4 py-3">Status</th>
                    <th className="text-right px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map((s) => (
                    <tr key={s.id} className="group hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-primary/10 p-1.5">
                            <BookMarked className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{s.name}</p>
                            <p className="text-xs text-muted-foreground">{s.department?.name || '—'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">{s.code}</code>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={cn('text-[10px] font-medium border-0', typeBadge[s.type] || typeBadge.theory)}>
                          {s.type}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-muted-foreground">{s.group?.name || '—'}</span>
                      </td>
                      <td className="px-4 py-3 text-center text-sm">{s.maxMarks}</td>
                      <td className="px-4 py-3 text-center text-sm">{s.passMarks}</td>
                      <td className="px-4 py-3 text-center text-sm">{s.creditHours}</td>
                      <td className="px-4 py-3 text-center">
                        {s.isActive ? (
                          <Badge variant="success" className="text-[10px] gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Active
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="text-[10px] gap-1">
                            <XCircle className="h-3 w-3" /> Inactive
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => { setEditItem(s); setForm({ name: s.name, code: s.code, type: s.type, groupId: s.group?.id || '', departmentId: s.department?.id || '', creditHours: s.creditHours, maxMarks: s.maxMarks, passMarks: s.passMarks, isLanguage: s.isLanguage, isOptional: s.isOptional }); setShowForm(true); }}
                            className="rounded p-1.5 text-muted-foreground hover:bg-muted transition-colors"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(s.id)}
                            className="rounded p-1.5 text-red-500 hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Modal open={showForm} onOpenChange={(open) => { if (!open) resetForm(); }}>
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">{editItem ? 'Edit Subject' : 'Create Subject'}</h3>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Subject Name *</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Mathematics" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Subject Code *</label>
                <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="e.g. MATH" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Type</label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="theory">Theory</SelectItem>
                    <SelectItem value="practical">Practical</SelectItem>
                    <SelectItem value="language">Language</SelectItem>
                    <SelectItem value="elective">Elective</SelectItem>
                    <SelectItem value="optional">Optional</SelectItem>
                    <SelectItem value="compulsory">Compulsory</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Category / Group</label>
                <Select value={form.groupId} onValueChange={(v) => setForm({ ...form, groupId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select group" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {allGroups.map((g) => (
                      <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Credit Hours</label>
                <Input type="number" min={0} value={form.creditHours} onChange={(e) => setForm({ ...form, creditHours: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Maximum Marks</label>
                <Input type="number" min={0} value={form.maxMarks} onChange={(e) => setForm({ ...form, maxMarks: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Passing Marks</label>
                <Input type="number" min={0} value={form.passMarks} onChange={(e) => setForm({ ...form, passMarks: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.isLanguage} onChange={(e) => setForm({ ...form, isLanguage: e.target.checked })} className="rounded border-gray-300" />
                Language Subject
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.isOptional} onChange={(e) => setForm({ ...form, isOptional: e.target.checked })} className="rounded border-gray-300" />
                Optional Subject
              </label>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button variant="outline" onClick={resetForm}>Cancel</Button>
              <Button onClick={handleSubmit}>{editItem ? 'Update Subject' : 'Create Subject'}</Button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal open={!!deleteId} onOpenChange={(open) => { if (!open) setDeleteId(null); }}>
        <div className="p-6">
          <h3 className="text-lg font-semibold">Delete Subject</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Are you sure you want to delete this subject? This action cannot be undone.
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </div>
        </div>
      </Modal>

      <Modal open={showGroupForm} onOpenChange={(open) => { if (!open) { setShowGroupForm(false); setNewGroupName(''); } }}>
        <div className="p-6">
          <h3 className="text-lg font-semibold">Add Subject Category</h3>
          <p className="mt-1 text-sm text-muted-foreground">Create a new group to organize subjects (e.g. Languages, Sciences).</p>
          <div className="mt-4 space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Category Name</label>
            <Input value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} placeholder="e.g. Languages" />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => { setShowGroupForm(false); setNewGroupName(''); }}>Cancel</Button>
            <Button onClick={handleCreateGroup}>Create</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
