'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Save, Loader2, AlertCircle } from 'lucide-react';
import { Button, Input, Card, CardContent, CardHeader, CardTitle, Select } from '@schoolos/ui';
import { PageHeader } from '@/features/school-admin/components/page-header';
import { StaffService } from '@/features/school-admin/services/staff.service';
import type { EmploymentType, EmployeeStatus } from '@/features/school-admin/types';

const DESIGNATIONS = [
  { value: 'principal', label: 'Principal' },
  { value: 'vice_principal', label: 'Vice Principal' },
  { value: 'teacher', label: 'Teacher' },
  { value: 'class_teacher', label: 'Class Teacher' },
  { value: 'hr', label: 'HR' },
  { value: 'accountant', label: 'Accountant' },
  { value: 'receptionist', label: 'Receptionist' },
  { value: 'librarian', label: 'Librarian' },
  { value: 'transport_manager', label: 'Transport Manager' },
  { value: 'hostel_warden', label: 'Hostel Warden' },
  { value: 'inventory_manager', label: 'Inventory Manager' },
  { value: 'office_staff', label: 'Office Staff' },
];

const DEPARTMENTS = [
  { value: 'administration', label: 'Administration' },
  { value: 'science', label: 'Science' },
  { value: 'mathematics', label: 'Mathematics' },
  { value: 'humanities', label: 'Humanities' },
  { value: 'languages', label: 'Languages' },
  { value: 'finance', label: 'Finance' },
  { value: 'human_resources', label: 'Human Resources' },
  { value: 'library', label: 'Library' },
  { value: 'transport', label: 'Transport' },
  { value: 'hostel', label: 'Hostel' },
];

export default function EditStaffPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: 'male' as string,
    dateOfBirth: '',
    qualification: '',
    departmentId: '',
    designationId: '',
    joiningDate: '',
    employmentType: 'full_time' as EmploymentType,
    status: 'active' as EmployeeStatus,
  });

  useEffect(() => {
    if (!params.id) return;
    StaffService.getEmployee(params.id as string)
      .then((emp) => {
        setFormData({
          firstName: emp.firstName,
          lastName: emp.lastName,
          email: emp.email,
          phone: emp.phone,
          gender: emp.gender,
          dateOfBirth: emp.dateOfBirth,
          qualification: emp.qualification,
          departmentId: emp.departmentId || '',
          designationId: emp.designationId || '',
          joiningDate: emp.joiningDate,
          employmentType: emp.employmentType,
          status: emp.status,
        });
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load staff data');
        setLoading(false);
      });
  }, [params.id]);

  const updateField = <K extends keyof typeof formData>(field: K, value: (typeof formData)[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { gender, dateOfBirth, qualification, ...payload } = formData;
      await StaffService.updateEmployee(params.id as string, payload);
      router.push(`/school-admin/staff/${params.id}`);
    } catch {
      setError('Failed to save changes');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error && !formData.firstName) {
    return (
      <div className="space-y-6">
        <PageHeader title="Edit Staff" description="Update staff information" />
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <h3 className="mt-4 text-lg font-medium">Error</h3>
            <p className="mt-2 text-sm text-muted-foreground">{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => router.push('/school-admin/staff')}>Back to Staff</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Staff"
        description="Update staff information"
        breadcrumbs={[
          { label: 'Dashboard', href: '/school-admin/dashboard' },
          { label: 'Staff', href: '/school-admin/staff' },
          { label: `${formData.firstName} ${formData.lastName}`, href: `/school-admin/staff/${params.id}` },
          { label: 'Edit' },
        ]}
      />

      {error && formData.firstName && <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive"><AlertCircle className="h-4 w-4" />{error}</div>}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">First Name</label>
                <Input value={formData.firstName} onChange={(e) => updateField('firstName', e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Last Name</label>
                <Input value={formData.lastName} onChange={(e) => updateField('lastName', e.target.value)} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Gender</label>
                <Select value={formData.gender} onValueChange={(v) => updateField('gender', v)}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date of Birth</label>
                <Input type="date" value={formData.dateOfBirth} onChange={(e) => updateField('dateOfBirth', e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Qualification</label>
              <Input value={formData.qualification} onChange={(e) => updateField('qualification', e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader><CardTitle>Employment Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Designation</label>
                <Select value={formData.designationId} onValueChange={(v) => updateField('designationId', v)}>
                  {DESIGNATIONS.map((d) => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Department</label>
                <Select value={formData.departmentId} onValueChange={(v) => updateField('departmentId', v)}>
                  {DEPARTMENTS.map((d) => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Joining Date</label>
                <Input type="date" value={formData.joiningDate} onChange={(e) => updateField('joiningDate', e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Employment Type</label>
                <Select value={formData.employmentType} onValueChange={(v) => updateField('employmentType', v as EmploymentType)}>
                  <option value="full_time">Full Time</option>
                  <option value="part_time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="temporary">Temporary</option>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={formData.status} onValueChange={(v) => updateField('status', v as EmployeeStatus)}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={saving}>{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}{saving ? 'Saving...' : 'Save Changes'}</Button>
        </div>
      </form>
    </div>
  );
}
