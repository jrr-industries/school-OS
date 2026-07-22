'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Save, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@schoolos/ui';

interface FormData {
  name: string;
  slug: string;
  type: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  website: string;
  curriculum: string;
  establishedYear: string;
}

export default function EditSchoolPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [resolvedId, setResolvedId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { params.then((p) => setResolvedId(p.id)); }, [params]);

  useEffect(() => {
    if (!resolvedId) return;
    const fetchSchool = async () => {
      try {
        const res = await fetch(`/api/admin/schools/${resolvedId}`);
        const data = await res.json();
        if (!data.success) throw new Error(data.error ?? 'Not found');
        const s = data.data;
        setForm({
          name: s.name || '',
          slug: s.slug || '',
          type: s.type || 'primary',
          email: s.email || '',
          phone: s.phone || '',
          address: s.address || '',
          city: s.city || '',
          state: s.state || '',
          country: s.country || '',
          postalCode: s.postalCode || '',
          website: s.website || '',
          curriculum: s.curriculum || '',
          establishedYear: s.establishedYear ? String(s.establishedYear) : '',
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    fetchSchool();
  }, [resolvedId]);

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => prev ? { ...prev, [field]: value } : prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form || !resolvedId) return;
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/schools/${resolvedId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          establishedYear: form.establishedYear ? parseInt(form.establishedYear) : null,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error ?? 'Failed to update');
      router.push(`/admin/schools/${resolvedId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error && !form) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-4 rounded-full bg-destructive/10 p-4">
          <Loader2 className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold">Failed to load school</h3>
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button variant="outline" onClick={() => router.back()} className="mt-4">Go Back</Button>
      </div>
    );
  }

  if (!form) return null;

  const inputClass = 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit School</h1>
          <p className="text-sm text-muted-foreground">{form.name}</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <Card>
          <CardHeader><CardTitle>School Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">School Name</label>
                <input type="text" value={form.name} onChange={(e) => handleChange('name', e.target.value)} className={inputClass} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Slug</label>
                <input type="text" value={form.slug} onChange={(e) => handleChange('slug', e.target.value)} className={inputClass} required />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <select value={form.type} onChange={(e) => handleChange('type', e.target.value)} className={inputClass}>
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
                <label className="text-sm font-medium">Curriculum</label>
                <input type="text" value={form.curriculum} onChange={(e) => handleChange('curriculum', e.target.value)} className={inputClass} placeholder="e.g. CBSE, IB" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <input type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} className={inputClass} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <input type="tel" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} className={inputClass} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Website</label>
                <input type="url" value={form.website} onChange={(e) => handleChange('website', e.target.value)} className={inputClass} placeholder="https://" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Est. Year</label>
                <input type="number" value={form.establishedYear} onChange={(e) => handleChange('establishedYear', e.target.value)} className={inputClass} placeholder="e.g. 2005" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Address</label>
              <textarea value={form.address} onChange={(e) => handleChange('address', e.target.value)} rows={3} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">City</label>
                <input type="text" value={form.city} onChange={(e) => handleChange('city', e.target.value)} className={inputClass} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">State</label>
                <input type="text" value={form.state} onChange={(e) => handleChange('state', e.target.value)} className={inputClass} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Country</label>
                <input type="text" value={form.country} onChange={(e) => handleChange('country', e.target.value)} className={inputClass} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Postal Code</label>
              <input type="text" value={form.postalCode} onChange={(e) => handleChange('postalCode', e.target.value)} className={inputClass} />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={saving} className="gap-2">
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
          <Link href={`/admin/schools/${resolvedId}`}>
            <Button variant="outline" type="button">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
