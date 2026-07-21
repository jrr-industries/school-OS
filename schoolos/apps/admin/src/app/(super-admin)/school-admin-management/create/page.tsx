'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClientSupabaseClient } from '@schoolos/auth'
import { SupabaseRealtime } from '@/lib/supabase-realtime'
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
} from '@schoolos/ui'
import { ArrowLeft, Loader2, Building2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

interface School {
  id: string
  name: string
}

interface FormData {
  name: string
  email: string
  phone: string
  schoolId: string
  status: string
}

interface FormErrors {
  name?: string
  email?: string
  phone?: string
  schoolId?: string
}

export default function CreateSchoolAdminPage() {
  const router = useRouter()
  const supabase = createClientSupabaseClient()

  const [schools, setSchools] = useState<School[]>([])
  const [loadingSchools, setLoadingSchools] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    schoolId: '',
    status: 'active',
  })

  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const { data, error } = await supabase
          .from('School')
          .select('id, name')
          .order('name')
        if (error) throw error
        setSchools(data ?? [])
      } catch {
        toast.error('Failed to load schools')
      } finally {
        setLoadingSchools(false)
      }
    }
    fetchSchools()
  }, [supabase])

  const validate = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Mobile number is required'
    }

    if (!formData.schoolId) {
      newErrors.schoolId = 'Please select a school'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    try {
      const { data, error } = await supabase
        .from('User')
        .insert({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          schoolId: formData.schoolId,
          role: 'school_admin',
          status: formData.status,
        })
        .select()
        .single()

      if (error) throw error

      toast.success('School admin created successfully')
      router.push('/school-admin-management')
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to create school admin',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create School Admin</h1>
          <p className="text-sm text-muted-foreground">
            Add a new administrator to manage a school
          </p>
        </div>
      </div>

      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader>
          <CardTitle>School Admin Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Full Name"
              placeholder="Enter full name"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              error={errors.name}
              required
            />

            <Input
              label="Google Gmail"
              type="email"
              placeholder="Enter Gmail address"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              error={errors.email}
              required
            />

            <Input
              label="Mobile Number"
              type="tel"
              placeholder="Enter mobile number"
              value={formData.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              error={errors.phone}
              required
            />

            <div className="space-y-1">
              <label className="block text-sm font-medium text-foreground">
                School <span className="text-destructive">*</span>
              </label>
              <Select
                value={formData.schoolId}
                onValueChange={(v) => updateField('schoolId', v)}
              >
                <SelectTrigger
                  className={cn(errors.schoolId && 'border-destructive')}
                >
                  <SelectValue
                    placeholder={
                      loadingSchools ? 'Loading schools...' : 'Select a school'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {schools.length === 0 && !loadingSchools && (
                    <div className="flex items-center gap-2 px-2 py-4 text-sm text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      No schools available
                    </div>
                  )}
                  {schools.map((school) => (
                    <SelectItem key={school.id} value={school.id}>
                      {school.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.schoolId && (
                <p className="mt-1 text-sm text-destructive">{errors.schoolId}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-foreground">
                Status
              </label>
              <Select
                value={formData.status}
                onValueChange={(v) => updateField('status', v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={submitting}>
                {submitting ? 'Creating...' : 'Create School Admin'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
