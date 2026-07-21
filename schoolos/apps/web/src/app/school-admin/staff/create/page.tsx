'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft, ChevronRight, Save, User, Shield, FileText, Check, Loader2, AlertCircle
} from 'lucide-react';
import { Button, Input, Card, CardContent, CardHeader, CardTitle, Select, cn } from '@schoolos/ui';
import { PageHeader } from '@/features/school-admin/components/page-header';

const STEPS = [
  { id: 'personal', label: 'Personal Info', icon: User },
  { id: 'employment', label: 'Employment Details', icon: Shield },
  { id: 'account', label: 'Account Setup', icon: FileText },
  { id: 'review', label: 'Review & Submit', icon: Check },
];

interface DesignationOption {
  id: string;
  title: string;
  slug: string;
}

interface DepartmentOption {
  id: string;
  name: string;
}

export default function CreateStaffPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [designations, setDesignations] = useState<DesignationOption[]>([]);
  const [departments, setDepartments] = useState<DepartmentOption[]>([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    qualification: '',
    employeeId: '',
    departmentId: '',
    designationId: '',
    joiningDate: '',
    employmentType: 'full_time',
    status: 'active',
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [desRes, depRes] = await Promise.all([
          fetch('/api/school-admin/designations'),
          fetch('/api/school-admin/departments'),
        ]);
        const desData = await desRes.json();
        const depData = await depRes.json();
        if (desData.success) setDesignations(desData.data);
        if (depData.success) setDepartments(depData.data);
      } catch {
        setError('Failed to load form data');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/school-admin/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error ?? 'Failed to create staff');
        setSubmitting(false);
        return;
      }
      router.push('/school-admin/staff');
    } catch {
      setError('Network error. Please try again.');
      setSubmitting(false);
    }
  };

  const canProceed = () => {
    if (currentStep === 0) return formData.firstName && formData.lastName && formData.email && formData.phone;
    if (currentStep === 1) return formData.designationId && formData.departmentId;
    if (currentStep === 2) return true;
    return true;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">Loading form...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add New Staff"
        description="Create a new staff member"
        breadcrumbs={[
          { label: 'Dashboard', href: '/school-admin/dashboard' },
          { label: 'Staff', href: '/school-admin/staff' },
          { label: 'Add New' },
        ]}
      />

      <div className="flex items-center justify-between border-b pb-4">
        {STEPS.map((step, index) => {
          const StepIcon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          return (
            <div key={step.id} className="flex items-center gap-2">
              <div className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors',
                isActive && 'bg-primary text-primary-foreground',
                isCompleted && 'bg-emerald-500 text-white',
                !isActive && !isCompleted && 'bg-muted text-muted-foreground',
              )}>
                {isCompleted ? <Check className="h-4 w-4" /> : <StepIcon className="h-4 w-4" />}
              </div>
              <span className={cn(
                'text-sm hidden sm:inline',
                isActive && 'font-medium text-foreground',
                !isActive && 'text-muted-foreground',
              )}>
                {step.label}
              </span>
              {index < STEPS.length - 1 && (
                <div className={cn(
                  'hidden sm:block mx-2 h-px w-12',
                  index < currentStep ? 'bg-emerald-500' : 'bg-border',
                )} />
              )}
            </div>
          );
        })}
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{STEPS[currentStep].label}</CardTitle>
        </CardHeader>
        <CardContent>
          {currentStep === 0 && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name *</label>
                  <Input value={formData.firstName} onChange={(e) => updateField('firstName', e.target.value)} placeholder="Enter first name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name *</label>
                  <Input value={formData.lastName} onChange={(e) => updateField('lastName', e.target.value)} placeholder="Enter last name" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email *</label>
                  <Input type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} placeholder="email@school.edu" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone *</label>
                  <Input value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} placeholder="Enter phone number" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Gender</label>
                  <Select value={formData.gender} onValueChange={(v) => updateField('gender', v)}>
                    <option value="">Select gender</option>
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
                <Input value={formData.qualification} onChange={(e) => updateField('qualification', e.target.value)} placeholder="e.g., M.Sc, B.Ed" />
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Employee ID</label>
                  <Input value={formData.employeeId} onChange={(e) => updateField('employeeId', e.target.value)} placeholder="Auto-generated if empty" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Employment Type</label>
                  <Select value={formData.employmentType} onValueChange={(v) => updateField('employmentType', v)}>
                    <option value="full_time">Full Time</option>
                    <option value="part_time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="temporary">Temporary</option>
                    <option value="intern">Intern</option>
                    <option value="volunteer">Volunteer</option>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Designation *</label>
                  <Select value={formData.designationId} onValueChange={(v) => updateField('designationId', v)}>
                    <option value="">Select designation</option>
                    {designations.map((d) => (
                      <option key={d.id} value={d.id}>{d.title}</option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Department *</label>
                  <Select value={formData.departmentId} onValueChange={(v) => updateField('departmentId', v)}>
                    <option value="">Select department</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
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
                  <label className="text-sm font-medium">Status</label>
                  <Select value={formData.status} onValueChange={(v) => updateField('status', v)}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="rounded-lg border bg-muted/50 p-4">
                <h4 className="text-sm font-medium mb-2">Account & Permissions</h4>
                <p className="text-xs text-muted-foreground mb-3">
                  A user account will be created for this staff member. They can log in with their email
                  and the default password below.
                </p>
                <div className="rounded-md bg-amber-50 dark:bg-amber-950/20 p-3">
                  <p className="text-xs text-amber-800 dark:text-amber-200">
                    Default password: <code className="font-mono font-medium">Admin@123</code>
                  </p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                    Permissions are assigned based on designation. Customize later from the staff profile.
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Review Staff Details</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="text-sm font-medium">{formData.firstName} {formData.lastName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{formData.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium">{formData.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Designation</p>
                  <p className="text-sm font-medium">{designations.find((d) => d.id === formData.designationId)?.title || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Department</p>
                  <p className="text-sm font-medium">{departments.find((d) => d.id === formData.departmentId)?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Joining Date</p>
                  <p className="text-sm font-medium">{formData.joiningDate || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={currentStep === 0 ? () => router.back() : handleBack}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          {currentStep === 0 ? 'Cancel' : 'Back'}
        </Button>
        <Button onClick={currentStep === STEPS.length - 1 ? handleSubmit : handleNext} disabled={!canProceed() || submitting}>
          {currentStep === STEPS.length - 1 ? (
            <>{submitting ? 'Creating...' : 'Create Staff'} <Save className="ml-2 h-4 w-4" /></>
          ) : (
            <>Next <ChevronRight className="ml-2 h-4 w-4" /></>
          )}
        </Button>
      </div>
    </div>
  );
}