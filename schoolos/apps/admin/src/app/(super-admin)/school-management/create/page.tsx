'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, School } from 'lucide-react';
import { SupabaseRealtime } from '@/lib/supabase-realtime';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Button,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  cn,
} from '@schoolos/ui';

const SCHOOL_TYPES = ['Government', 'Government Aided', 'Private', 'International'] as const;
const EDUCATION_BOARDS = ['State Board', 'CBSE', 'ICSE', 'IB', 'IGCSE', 'NCERT'] as const;
const MEDIUM_OPTIONS = ['English', 'Hindi', 'Gujarati', 'Marathi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Bengali', 'Urdu'] as const;
const TIMEZONE_OPTIONS = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Berlin',
  'Europe/Paris',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Australia/Sydney',
  'Pacific/Auckland',
] as const;
const PLAN_OPTIONS = ['Trial', 'Basic', 'Premium', 'Enterprise'] as const;

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
  adminFullName: string;
  adminGmail: string;
  adminMobile: string;
  plan: string;
}

const initialForm: FormData = {
  schoolName: '',
  schoolCode: '',
  schoolLogoUrl: '',
  schoolBannerUrl: '',
  schoolType: '',
  educationBoard: '',
  mediumOfInstruction: '',
  country: '',
  state: '',
  district: '',
  city: '',
  postalCode: '',
  fullAddress: '',
  phoneNumber: '',
  email: '',
  website: '',
  academicYear: '',
  timeZone: 'UTC',
  adminFullName: '',
  adminGmail: '',
  adminMobile: '',
  plan: 'Trial',
};

export default function CreateSchoolPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const updateField = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (!form.schoolName.trim()) errs.schoolName = 'School name is required';
    if (!form.adminFullName.trim()) errs.adminFullName = 'Admin full name is required';
    if (!form.adminGmail.trim()) errs.adminGmail = 'Admin email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.adminGmail)) errs.adminGmail = 'Invalid email format';
    if (!form.adminMobile.trim()) errs.adminMobile = 'Admin mobile is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/schools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || 'Failed to create school');
      }

      toast.success('School created successfully');
      router.push('/school-management');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create school');
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (
    field: keyof FormData,
    label: string,
    required = false,
    props?: Partial<React.ComponentProps<typeof Input>>,
  ) => (
    <div>
      <Input
        label={`${label}${required ? ' *' : ''}`}
        value={form[field]}
        onChange={(e) => updateField(field, e.target.value)}
        error={errors[field]}
        {...props}
      />
    </div>
  );

  const renderSelect = (
    field: keyof FormData,
    label: string,
    options: readonly string[],
    placeholder: string,
    required = false,
  ) => (
    <div className="relative">
      <label className="mb-1 block text-sm font-medium text-foreground">
        {label}
        {required && ' *'}
      </label>
      <Select value={form[field]} onValueChange={(v) => updateField(field, v)}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors[field] && <p className="mt-1 text-sm text-destructive">{errors[field]}</p>}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push('/school-management')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create School</h1>
          <p className="text-sm text-muted-foreground">
            Set up a new school and its admin account
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {renderField('schoolName', 'School Name', true)}
                {renderField('schoolCode', 'School Code', false, { placeholder: 'Auto-generated if empty' })}
                {renderField('schoolLogoUrl', 'School Logo URL', false, { placeholder: 'https://example.com/logo.png' })}
                {renderField('schoolBannerUrl', 'School Banner URL', false, { placeholder: 'https://example.com/banner.png' })}
                {renderSelect('schoolType', 'School Type', SCHOOL_TYPES, 'Select type')}
                {renderSelect('educationBoard', 'Education Board', EDUCATION_BOARDS, 'Select board')}
                {renderSelect('mediumOfInstruction', 'Medium of Instruction', MEDIUM_OPTIONS, 'Select medium')}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {renderField('country', 'Country')}
                {renderField('state', 'State')}
                {renderField('district', 'District')}
                {renderField('city', 'City')}
                {renderField('postalCode', 'Postal Code')}
                <div className="sm:col-span-2 lg:col-span-3">
                  {renderField('fullAddress', 'Full Address', false, { placeholder: 'Street, landmark, etc.' })}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {renderField('phoneNumber', 'Phone Number', false, { type: 'tel', placeholder: '+1 234 567 8900' })}
                {renderField('email', 'Email', false, { type: 'email', placeholder: 'admin@school.edu' })}
                {renderField('website', 'Website', false, { placeholder: 'https://school.edu' })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Academic</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {renderField('academicYear', 'Academic Year', false, { placeholder: '2025-2026' })}
                {renderSelect('timeZone', 'Time Zone', TIMEZONE_OPTIONS, 'Select timezone')}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>School Admin</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {renderField('adminFullName', 'Full Name', true)}
                {renderField('adminGmail', 'Google Gmail', true, { type: 'email', placeholder: 'admin@gmail.com' })}
                {renderField('adminMobile', 'Mobile Number', true, { type: 'tel', placeholder: '+1 234 567 8900' })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {renderSelect('plan', 'Plan', PLAN_OPTIONS, 'Select plan')}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="flex items-center justify-end gap-4">
          <Button variant="outline" onClick={() => router.push('/school-management')}>
            Cancel
          </Button>
          <Button type="submit" isLoading={submitting}>
            {submitting ? 'Creating...' : 'Create School'}
          </Button>
        </div>
      </form>
    </div>
  );
}
