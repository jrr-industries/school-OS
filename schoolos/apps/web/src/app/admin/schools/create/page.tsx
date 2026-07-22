'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, AlertCircle, CheckCircle2, Eye, EyeOff, School, CreditCard, Loader2 } from 'lucide-react';

interface CreateSchoolResult {
  school: { id: string; name: string; slug: string; type: string; status: string };
  admin: { id: string; name: string; email: string };
  credentials: { email: string; password: string };
  plan: { id: string; name: string; price: number; currency: string; interval: string };
}

interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  currency: string;
  interval: string;
  isActive: boolean;
}

export default function CreateSchoolPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<CreateSchoolResult | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    slug: '',
    type: 'primary',
    address: '',
    email: '',
    phone: '',
    adminName: '',
    adminEmail: '',
    adminPassword: '',
    requireVerification: false,
    planId: '',
  });

  useEffect(() => {
    fetch('/api/admin/subscriptions/plans')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const active = (data.data ?? []).filter((p: Plan) => p.isActive);
          setPlans(active);
          if (active.length > 0) {
            setForm((prev) => ({ ...prev, planId: active[0].id }));
          }
        }
      })
      .catch(() => {})
      .finally(() => setPlansLoading(false));
  }, []);

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === 'name' && !form.slug) {
      setForm((prev) => ({ ...prev, slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/schools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error ?? 'Failed to create school');
        setIsLoading(false);
        return;
      }

      setResult(data.data);
    } catch {
      setError('Network error. Please try again.');
      setIsLoading(false);
    }
  }

  if (result) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">School Created Successfully</h1>
          <p className="text-sm text-muted-foreground mt-1">The school and admin account have been created</p>
        </div>

        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900 dark:bg-emerald-950/30">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            <div>
              <h3 className="font-semibold text-emerald-800 dark:text-emerald-300">School Created</h3>
              <p className="text-sm text-emerald-600 dark:text-emerald-400">Save these credentials - they won&apos;t be shown again</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-3">
              <h4 className="font-medium text-sm">School Details</h4>
              <div className="space-y-1 text-sm">
                <p><span className="text-muted-foreground">Name:</span> <span className="font-medium">{result.school.name}</span></p>
                <p><span className="text-muted-foreground">Slug:</span> <span className="font-medium">{result.school.slug}</span></p>
                <p><span className="text-muted-foreground">Type:</span> <span className="font-medium capitalize">{result.school.type}</span></p>
                <p><span className="text-muted-foreground">Status:</span> <span className="font-medium capitalize">{result.school.status}</span></p>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Subscription Plan</h4>
              <div className="space-y-1 text-sm">
                <p><span className="text-muted-foreground">Plan:</span> <span className="font-medium">{result.plan.name}</span></p>
                <p>
                  <span className="text-muted-foreground">Price:</span>{' '}
                  <span className="font-medium">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: result.plan.currency }).format(result.plan.price)}
                  </span>
                </p>
                <p><span className="text-muted-foreground">Billing:</span> <span className="font-medium capitalize">{result.plan.interval}</span></p>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-sm">School Admin Credentials</h4>
              <div className="space-y-1 text-sm">
                <p><span className="text-muted-foreground">Name:</span> <span className="font-medium">{result.admin.name}</span></p>
                <p><span className="text-muted-foreground">Email:</span> <span className="font-medium">{result.credentials.email}</span></p>
                <p>
                  <span className="text-muted-foreground">Password:</span>{' '}
                  <span className="font-mono font-medium">
                    {showPassword ? result.credentials.password : '••••••••'}
                  </span>
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="ml-2 inline-flex text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/admin/schools')}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <School className="h-4 w-4" />
            View All Schools
          </button>
          <button
            onClick={() => { setResult(null); setForm({ name: '', slug: '', type: 'primary', address: '', email: '', phone: '', adminName: '', adminEmail: '', adminPassword: '', requireVerification: false, planId: plans[0]?.id || '' }); }}
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            Create Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Create School</h1>
        <p className="text-sm text-muted-foreground mt-1">Register a new school and create its admin account</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          {error && (
            <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="rounded-lg border bg-card">
            <div className="border-b px-6 py-4">
              <h2 className="font-semibold">School Details</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">School Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Springfield Elementary"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">School Slug *</label>
                  <input
                    type="text"
                    placeholder="e.g. springfield-elementary"
                    value={form.slug}
                    onChange={(e) => handleChange('slug', e.target.value)}
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <p className="text-xs text-muted-foreground">Used in URLs: schoolos.com/schools/<strong>{form.slug || 'slug'}</strong></p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">School Type *</label>
                  <select
                    value={form.type}
                    onChange={(e) => handleChange('type', e.target.value)}
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="primary">Primary</option>
                    <option value="secondary">Secondary</option>
                    <option value="higher_secondary">Higher Secondary</option>
                    <option value="k12">K-12</option>
                    <option value="preschool">Preschool</option>
                    <option value="vocational">Vocational</option>
                    <option value="special_education">Special Education</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Contact Email</label>
                  <input
                    type="email"
                    placeholder="admin@school.edu"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={form.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-amber-200/50 bg-amber-50/50 p-3 dark:border-amber-800/30 dark:bg-amber-950/20">
                <input
                  type="checkbox"
                  id="requireVerification"
                  checked={form.requireVerification}
                  onChange={(e) => setForm((prev) => ({ ...prev, requireVerification: e.target.checked }))}
                  className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="requireVerification" className="text-sm font-medium text-amber-700 dark:text-amber-400">
                  Require verification before activation
                </label>
                <p className="text-xs text-amber-600/70 dark:text-amber-500/70 ml-auto">
                  School will start in trial status
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Address</label>
                <textarea
                  placeholder="Enter school address"
                  rows={3}
                  value={form.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card">
            <div className="border-b px-6 py-4">
              <h2 className="font-semibold flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                Subscription Plan
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">Select a plan for this school</p>
            </div>
            <div className="p-6">
              {plansLoading ? (
                <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading plans...
                </div>
              ) : plans.length === 0 ? (
                <div className="rounded-md bg-amber-50 p-3 text-sm text-amber-700 dark:bg-amber-950/20 dark:text-amber-400">
                  No active plans available. Create a plan first in{' '}
                  <a href="/admin/subscriptions/plans" className="font-medium underline">Subscription Plans</a>.
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-3">
                  {plans.map((plan) => {
                    const selected = form.planId === plan.id;
                    return (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, planId: plan.id }))}
                        className={`relative rounded-lg border p-4 text-left transition-all ${
                          selected
                            ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary'
                            : 'border-input bg-background hover:border-primary/50 hover:bg-accent/50'
                        }`}
                      >
                        {selected && (
                          <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                            <CheckCircle2 className="h-3 w-3 text-white" />
                          </div>
                        )}
                        <p className="font-semibold text-sm">{plan.name}</p>
                        <p className="mt-1 font-mono text-lg font-bold">
                          {new Intl.NumberFormat('en-US', { style: 'currency', currency: plan.currency }).format(plan.price)}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">{plan.interval}</p>
                        {plan.description && (
                          <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">{plan.description}</p>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg border bg-card">
            <div className="border-b px-6 py-4">
              <h2 className="font-semibold">School Admin Account</h2>
              <p className="text-xs text-muted-foreground mt-0.5">This person will manage the school on the platform</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Admin Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. John Smith"
                    value={form.adminName}
                    onChange={(e) => handleChange('adminName', e.target.value)}
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Admin Email *</label>
                  <input
                    type="email"
                    placeholder="admin@school.edu"
                    value={form.adminEmail}
                    onChange={(e) => handleChange('adminEmail', e.target.value)}
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Admin Password *</label>
                  <input
                    type="text"
                    placeholder="Set a password"
                    value={form.adminPassword}
                    onChange={(e) => handleChange('adminPassword', e.target.value)}
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              {isLoading ? 'Creating...' : 'Create School & Admin'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/schools')}
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2.5 text-sm font-medium hover:bg-accent"
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="space-y-4">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold mb-2">What happens next?</h3>
            <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
              <li>School is created with <strong>{form.requireVerification ? 'Trial' : 'Active'}</strong> status</li>
              <li>Selected plan is assigned to the school as a subscription</li>
              <li>Default roles are created (School Admin, Teacher, Staff, Parent, Student)</li>
              <li>School admin account is created with the <strong>School Admin</strong> role</li>
              <li>Admin can log in at <code className="font-mono text-xs">/login</code> with their email and default password</li>
              <li>Admin will be redirected to the School Admin dashboard</li>
              {form.requireVerification && (
                <li className="text-amber-600 dark:text-amber-400 font-medium">School requires admin approval before going active</li>
              )}
            </ol>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold mb-2">Dev Auth Note</h3>
            <p className="text-sm text-muted-foreground">
              In development mode, all users authenticate with password <code className="font-mono">Admin@123</code>.
              Production will use Supabase Auth with proper password hashing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}