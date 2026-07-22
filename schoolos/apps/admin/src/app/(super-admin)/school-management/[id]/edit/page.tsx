'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, Building2 } from 'lucide-react';
import { createClientSupabaseClient } from '@schoolos/auth/client';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@schoolos/ui';

const SCHOOL_TYPES = ['Government', 'Government Aided', 'Private', 'International'] as const;
const EDUCATION_BOARDS = ['State Board', 'CBSE', 'ICSE', 'IB', 'IGCSE', 'NCERT'] as const;
const MEDIUM_OPTIONS = ['English', 'Hindi', 'Gujarati', 'Marathi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Bengali', 'Urdu'] as const;
const TIMEZONE_OPTIONS = [
  'UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
  'Europe/London', 'Europe/Berlin', 'Europe/Paris', 'Asia/Dubai', 'Asia/Kolkata',
  'Asia/Singapore', 'Asia/Tokyo', 'Asia/Shanghai', 'Australia/Sydney', 'Pacific/Auckland',
] as const;

interface FormData {
  schoolName: string;
  schoolCode: string;
  schoolLogoUrl: string;
  schoolBannerUrl: string;
  schoolType: string;
  educationBoard: string;
  mediumOfInstruction: string;
  country: string;
  state: string;
  district: string;
  city: string;
  postalCode: string;
  fullAddress: string;
  phoneNumber: string;
  email: string;
  website: string;
  academicYear: string;
  timeZone: string;
}

export default function EditSchoolPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [resolvedId, setResolvedId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setResolvedId(p.id));
  }, [params]);

  useEffect(() => {
    if (!resolvedId) return;
    const fetchSchool = async () => {
      setLoading(true);
      try {
        const supabase = createClientSupabaseClient();
        const { data, error: fetchError } = await supabase
          .from('School')
          .select('*')
          .eq('id', resolvedId)
          .single();
        if (fetchError) throw new Error(fetchError.message);
        if (!data) throw new Error('School not found');
        setForm({
          schoolName: data.name || '',
          schoolCode: data.code || '',
          schoolLogoUrl: data.logo || '',
          schoolBannerUrl: '',
          schoolType: data.type || '',
          educationBoard: data.board || '',
          mediumOfInstruction: data.medium || '',
          country: data.country || '',
          state: data.state || '',
          district: data.district || '',
          city: data.city || '',
          postalCode: data.postalCode || '',
          fullAddress: data.address || '',
          phoneNumber: data.phone || '',
          email: data.email || '',
          website: data.website || '',
          academicYear: data.academicYear || '',
          timeZone: data.timezone || 'UTC',
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load school');
      } finally {
        setLoading(false);
      }
    };
    fetchSchool();
  }, [resolvedId]);

  const updateField = (field: keyof FormData, value: string) => {
    setForm((prev) => prev ? { ...prev, [field]: value } : prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form || !resolvedId) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/schools/${resolvedId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.schoolName,
          code: form.schoolCode,
          logo: form.schoolLogoUrl,
          type: form.schoolType?.toLowerCase().replace(/\s+/g, '_'),
          board: form.educationBoard,
          medium: form.mediumOfInstruction,
          country: form.country,
          state: form.state,
          district: form.district,
          city: form.city,
          postalCode: form.postalCode,
          address: form.fullAddress,
          phone: form.phoneNumber,
          email: form.email,
          website: form.website,
          academicYear: form.academicYear,
          timezone: form.timeZone,
        }),
      });
      if (!res.ok) throw new Error('Failed to update school');
      toast.success('School updated successfully');
      router.push(`/school-management/${resolvedId}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update school');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-4 rounded-full bg-destructive/10 p-4">
          <Loader2 className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="mb-1 text-lg font-semibold">Failed to load school</h3>
        <p className="mb-6 text-sm text-muted-foreground">{error}</p>
        <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const renderField = (
    field: keyof FormData,
    label: string,
    props?: Partial<React.ComponentProps<typeof Input>>,
  ) => (
    <div>
      <Input
        label={label}
        value={form[field]}
        onChange={(e) => updateField(field, e.target.value)}
        {...props}
      />
    </div>
  );

  const renderSelect = (
    field: keyof FormData,
    label: string,
    options: readonly string[],
    placeholder: string,
  ) => (
    <div className="relative">
      <label className="mb-1 block text-sm font-medium text-foreground">{label}</label>
      <Select value={form[field]} onValueChange={(v) => updateField(field, v)}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit School</h1>
          <p className="text-sm text-muted-foreground">{form.schoolName}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card>
            <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {renderField('schoolName', 'School Name')}
                {renderField('schoolCode', 'School Code')}
                {renderField('schoolLogoUrl', 'School Logo URL', { placeholder: 'https://example.com/logo.png' })}
                {renderField('schoolBannerUrl', 'School Banner URL', { placeholder: 'https://example.com/banner.png' })}
                {renderSelect('schoolType', 'School Type', SCHOOL_TYPES, 'Select type')}
                {renderSelect('educationBoard', 'Education Board', EDUCATION_BOARDS, 'Select board')}
                {renderSelect('mediumOfInstruction', 'Medium of Instruction', MEDIUM_OPTIONS, 'Select medium')}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader><CardTitle>Address</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {renderField('country', 'Country')}
                {renderField('state', 'State')}
                {renderField('district', 'District')}
                {renderField('city', 'City')}
                {renderField('postalCode', 'Postal Code')}
                <div className="sm:col-span-2 lg:col-span-3">
                  {renderField('fullAddress', 'Full Address', { placeholder: 'Street, landmark, etc.' })}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card>
            <CardHeader><CardTitle>Contact</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {renderField('phoneNumber', 'Phone Number', { type: 'tel' })}
                {renderField('email', 'Email', { type: 'email' })}
                {renderField('website', 'Website')}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader><CardTitle>Academic</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {renderField('academicYear', 'Academic Year', { placeholder: '2025-2026' })}
                {renderSelect('timeZone', 'Time Zone', TIMEZONE_OPTIONS, 'Select timezone')}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="flex items-center justify-end gap-4">
          <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" isLoading={submitting}>
            {submitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
