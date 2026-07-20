'use client';

import { useRouter } from 'next/navigation';
import { StudentForm } from '@/features/students/components/student-form';
import { toast } from 'sonner';
import type { CreateStudentInput } from '@schoolos/validation';

export default function NewStudentPage() {
  const router = useRouter();

  const handleSubmit = async (data: CreateStudentInput) => {
    try {
      const response = await fetch('/api/students?schoolId=current-school-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to create student');

      toast.success('Student created successfully');
      router.push('/students');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create student');
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Student</h1>
        <p className="text-muted-foreground">
          Add a new student to the school
        </p>
      </div>

      <StudentForm onSubmit={handleSubmit} />
    </div>
  );
}
