'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, AlertCircle, CheckCircle2, Eye, EyeOff, School } from 'lucide-react';

interface CreateSchoolResult {
  school: { id: string; name: string; slug: string; type: string; status: string };
  admin: { id: string; name: string; email: string };
  credentials: { email: string; password: string };
}

export default function CreateSchoolPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<CreateSchoolResult | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: '',
    slug: '',
    type: 'primary',
    address: '',
    email: '',
    phone: '',
    adminName: '',
    adminEmail: '',
  });

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

          <div className="grid gap-4 sm:grid-cols-2">
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
            onClick={() => { setResult(null); setForm({ name: '', slug: '', type: 'primary', address: '', email: '', phone: '', adminName: '', adminEmail: '' }); }}
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
              <h2 className="font-semibold">School Admin Account</h2>
              <p className="text-xs text-muted-foreground mt-0.5">This person will manage the school on the platform</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
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
              </div>
              <div className="rounded-md bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">
                  The admin will receive a default password: <code className="font-mono font-medium text-foreground">Admin@123</code>.
                  They can change it after first login. This is a development-only behavior.
                </p>
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
              <li>School is created with <strong>Active</strong> status</li>
              <li>Default roles are created (School Admin, Teacher, Staff, Parent, Student)</li>
              <li>School admin account is created with the <strong>School Admin</strong> role</li>
              <li>Admin can log in at <code className="font-mono text-xs">/login</code> with their email and default password</li>
              <li>Admin will be redirected to the School Admin dashboard</li>
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