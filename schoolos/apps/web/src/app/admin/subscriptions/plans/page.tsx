'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  AlertCircle,
  Check,
  X,
  CreditCard,
  Users,
  GraduationCap,
  HardDrive,
  Zap,
  Clock,
} from 'lucide-react';
import { Modal } from '@schoolos/ui';

interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  currency: string;
  interval: string;
  maxStudents: number;
  maxTeachers: number;
  maxStorageGB: number;
  features: string[];
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

interface PlanForm {
  name: string;
  slug: string;
  description: string;
  price: string;
  currency: string;
  interval: string;
  maxStudents: string;
  maxTeachers: string;
  maxStorageGB: string;
  features: string;
  isActive: boolean;
}

const emptyForm: PlanForm = {
  name: '',
  slug: '',
  description: '',
  price: '',
  currency: 'USD',
  interval: 'monthly',
  maxStudents: '100',
  maxTeachers: '10',
  maxStorageGB: '1',
  features: '',
  isActive: true,
};

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

const intervalLabels: Record<string, string> = {
  monthly: '/mo',
  yearly: '/yr',
  quarterly: '/qtr',
  weekly: '/wk',
};

export default function SubscriptionPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [form, setForm] = useState<PlanForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/subscriptions/plans');
      const data = await res.json();
      if (!data.success) { setError(data.error); return; }
      setPlans(data.data ?? []);
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPlans(); }, [fetchPlans]);

  function openCreate() {
    setEditingPlan(null);
    setForm(emptyForm);
    setSaveError('');
    setModalOpen(true);
  }

  function openEdit(plan: Plan) {
    setEditingPlan(plan);
    setForm({
      name: plan.name,
      slug: plan.slug,
      description: plan.description || '',
      price: plan.price.toString(),
      currency: plan.currency,
      interval: plan.interval,
      maxStudents: plan.maxStudents.toString(),
      maxTeachers: plan.maxTeachers.toString(),
      maxStorageGB: plan.maxStorageGB.toString(),
      features: Array.isArray(plan.features) ? plan.features.join(', ') : '',
      isActive: plan.isActive,
    });
    setSaveError('');
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    setSaveError('');
    try {
      const body: Record<string, unknown> = {
        name: form.name,
        slug: form.slug,
        description: form.description || null,
        price: parseFloat(form.price),
        currency: form.currency,
        interval: form.interval,
        maxStudents: parseInt(form.maxStudents) || 100,
        maxTeachers: parseInt(form.maxTeachers) || 10,
        maxStorageGB: parseInt(form.maxStorageGB) || 1,
        features: form.features.split(',').map((f) => f.trim()).filter(Boolean),
        isActive: form.isActive,
      };

      let res: Response;
      if (editingPlan) {
        res = await fetch('/api/admin/subscriptions/plans', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingPlan.id, ...body }),
        });
      } else {
        res = await fetch('/api/admin/subscriptions/plans', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      }

      const data = await res.json();
      if (!data.success) { setSaveError(data.error); return; }

      setModalOpen(false);
      fetchPlans();
    } catch {
      setSaveError('Failed to save plan');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/admin/subscriptions/plans?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!data.success) { setError(data.error); return; }
      setDeleteConfirm(null);
      fetchPlans();
    } catch {
      setError('Failed to delete plan');
    }
  }

  function handleChange(field: keyof PlanForm, value: string | boolean) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'name' && !editingPlan) {
        next.slug = (value as string).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }
      return next;
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground">Subscription Plans</h1>
          <p className="text-sm text-muted-foreground mt-1">Platform subscription tiers</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Create Plan
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">Loading plans...</span>
        </div>
      ) : plans.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-card py-20 text-center">
          <CreditCard className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground">No plans yet</h3>
          <p className="text-sm text-muted-foreground mb-4">Create your first subscription plan</p>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Create Plan
          </button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="relative flex flex-col rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md"
            >
              {!plan.isActive && (
                <div className="absolute right-3 top-3 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  Inactive
                </div>
              )}

              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                {plan.description && (
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{plan.description}</p>
                )}

                <div className="mt-4 flex items-baseline gap-0.5">
                  <span className="text-3xl font-bold text-foreground">
                    {formatCurrency(plan.price, plan.currency)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {intervalLabels[plan.interval] || `/${plan.interval}`}
                  </span>
                </div>

                <div className="mt-5 flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    {plan.maxStudents} students
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <GraduationCap className="h-3.5 w-3.5" />
                    {plan.maxTeachers} teachers
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <HardDrive className="h-3.5 w-3.5" />
                    {plan.maxStorageGB}GB
                  </span>
                </div>

                {plan.features.length > 0 && (
                  <div className="mt-4 flex-1 space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Features</p>
                    <ul className="space-y-1">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                          <Zap className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {plan.interval}
                  </div>
                  <div className="flex-1" />
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(plan)}
                      className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                    >
                      <Pencil className="h-3 w-3" />
                      Edit
                    </button>
                    {deleteConfirm === plan.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="inline-flex items-center rounded-md border border-input bg-background p-1.5 text-xs hover:bg-muted"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleDelete(plan.id)}
                          className="inline-flex items-center rounded-md bg-red-600 p-1.5 text-xs text-white hover:bg-red-700"
                        >
                          <Check className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(plan.id)}
                        className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-2.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-950"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={editingPlan ? 'Edit Plan' : 'Create Plan'}
        description={editingPlan ? 'Update the plan details below.' : 'Define a new subscription plan.'}
      >
        <div className="mt-4 space-y-4">
          {saveError && (
            <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{saveError}</span>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g. Pro"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Slug *</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                placeholder="e.g. pro"
                disabled={!!editingPlan}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe the plan..."
              rows={2}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Price *</label>
              <input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => handleChange('price', e.target.value)}
                placeholder="29.00"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Currency</label>
              <select
                value={form.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="INR">INR</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Interval *</label>
              <select
                value={form.interval}
                onChange={(e) => handleChange('interval', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="quarterly">Quarterly</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Max Students</label>
              <input
                type="number"
                value={form.maxStudents}
                onChange={(e) => handleChange('maxStudents', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Max Teachers</label>
              <input
                type="number"
                value={form.maxTeachers}
                onChange={(e) => handleChange('maxTeachers', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Storage (GB)</label>
              <input
                type="number"
                value={form.maxStorageGB}
                onChange={(e) => handleChange('maxStorageGB', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Features (comma-separated)</label>
            <input
              type="text"
              value={form.features}
              onChange={(e) => handleChange('features', e.target.value)}
              placeholder="Up to 500 students, Email support, Gradebook"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => handleChange('isActive', e.target.checked)}
              className="h-4 w-4 rounded border-border"
            />
            Active (available for subscription)
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setModalOpen(false)}
              className="rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !form.name || !form.slug || !form.price}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? 'Saving...' : editingPlan ? 'Update Plan' : 'Create Plan'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
