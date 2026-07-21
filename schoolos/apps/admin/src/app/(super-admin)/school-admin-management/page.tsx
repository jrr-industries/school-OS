'use client'

import { useState, useEffect, useCallback } from 'react'
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
import {
  Search,
  Plus,
  Eye,
  Ban,
  CheckCircle,
  RefreshCw,
  AlertCircle,
  Loader2,
  UserX,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

interface SchoolAdminUser {
  id: string
  name: string
  email: string
  phone: string | null
  schoolId: string | null
  status: string
  lastLogin: string | null
  createdAt: string
  role: string
  school: { id: string; name: string } | null
}

interface School {
  id: string
  name: string
}

const PAGE_SIZE = 10

const STATUS_VARIANTS: Record<string, 'success' | 'secondary' | 'destructive' | 'outline'> = {
  active: 'success',
  inactive: 'secondary',
  suspended: 'destructive',
}

export default function SchoolAdminManagementPage() {
  const router = useRouter()
  const supabase = createClientSupabaseClient()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [schoolFilter, setSchoolFilter] = useState('')
  const [schools, setSchools] = useState<School[]>([])

  const [admins, setAdmins] = useState<SchoolAdminUser[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchSchools = useCallback(async () => {
    const { data } = await supabase.from('School').select('id, name').order('name')
    if (data) setSchools(data)
  }, [supabase])

  const fetchAdmins = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      let query = supabase
        .from('User')
        .select('*, school:schoolId(id, name)', { count: 'exact' })
        .eq('role', 'school_admin')
        .order('createdAt', { ascending: false })
        .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)

      if (statusFilter) query = query.eq('status', statusFilter)
      if (schoolFilter) query = query.eq('schoolId', schoolFilter)
      if (search) {
        query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`)
      }

      const { data, count, error: fetchError } = await query
      if (fetchError) throw fetchError
      setAdmins((data ?? []) as unknown as SchoolAdminUser[])
      setTotal(count ?? 0)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load school admins')
    } finally {
      setLoading(false)
    }
  }, [supabase, page, search, statusFilter, schoolFilter])

  useEffect(() => { fetchSchools() }, [fetchSchools])

  useEffect(() => { fetchAdmins() }, [fetchAdmins])

  useEffect(() => {
    const unsubscribe = SupabaseRealtime.subscribe(
      { table: 'User', event: '*', filter: 'role=eq.school_admin' },
      () => { fetchAdmins() },
    )
    return unsubscribe
  }, [fetchAdmins])

  const handleSuspendToggle = async (admin: SchoolAdminUser) => {
    setActionLoading(admin.id)
    try {
      const newStatus = admin.status === 'suspended' ? 'active' : 'suspended'
      const { error: updateError } = await supabase
        .from('User')
        .update({ status: newStatus })
        .eq('id', admin.id)
      if (updateError) throw updateError
      toast.success(`School admin ${newStatus === 'suspended' ? 'suspended' : 'activated'} successfully`)
      fetchAdmins()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update status')
    } finally {
      setActionLoading(null)
    }
  }

  const handleResetAccess = async (admin: SchoolAdminUser) => {
    setActionLoading(admin.id)
    try {
      const { error: resetError } = await supabase
        .from('User')
        .update({ lastLogin: null })
        .eq('id', admin.id)
      if (resetError) throw resetError
      toast.success('Access reset successfully')
      fetchAdmins()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to reset access')
    } finally {
      setActionLoading(null)
    }
  }

  const resetFilters = () => {
    setSearch('')
    setStatusFilter('')
    setSchoolFilter('')
    setPage(1)
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">School Admin Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage school administrators across all schools
          </p>
        </div>
        <Link href="/school-admin-management/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create School Admin
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1) }}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select value={schoolFilter} onValueChange={(v) => { setSchoolFilter(v); setPage(1) }}>
              <SelectTrigger>
                <SelectValue placeholder="All Schools" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Schools</SelectItem>
                {schools.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={resetFilters}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive">
          <CardContent className="flex flex-col items-start gap-3 pt-6 sm:flex-row sm:items-center">
            <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
            <div className="flex-1">
              <p className="text-sm font-medium text-destructive">Error loading school admins</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
            <Button variant="outline" size="sm" onClick={fetchAdmins}>
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-3 p-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-12 animate-pulse rounded-md bg-muted"
                />
              ))}
            </div>
          ) : admins.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <UserX className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-1 text-lg font-semibold">No school admins found</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                {search || statusFilter || schoolFilter
                  ? 'Try adjusting your search or filter criteria'
                  : 'Get started by creating your first school administrator'}
              </p>
              {!search && !statusFilter && !schoolFilter && (
                <Link href="/school-admin-management/create">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create School Admin
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="h-10 px-4 text-left font-medium text-muted-foreground">Name</th>
                      <th className="h-10 px-4 text-left font-medium text-muted-foreground">Email</th>
                      <th className="h-10 px-4 text-left font-medium text-muted-foreground">Phone</th>
                      <th className="h-10 px-4 text-left font-medium text-muted-foreground">School</th>
                      <th className="h-10 px-4 text-left font-medium text-muted-foreground">Status</th>
                      <th className="h-10 px-4 text-left font-medium text-muted-foreground">Last Login</th>
                      <th className="h-10 px-4 text-left font-medium text-muted-foreground">Created</th>
                      <th className="h-10 px-4 text-left font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence mode="popLayout">
                      {admins.map((admin, index) => (
                        <motion.tr
                          key={admin.id}
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className="border-b transition-colors hover:bg-muted/50"
                        >
                          <td className="p-4 font-medium">{admin.name}</td>
                          <td className="p-4">{admin.email}</td>
                          <td className="p-4">{admin.phone || '\u2014'}</td>
                          <td className="p-4">{admin.school?.name || '\u2014'}</td>
                          <td className="p-4">
                            <Badge variant={STATUS_VARIANTS[admin.status] || 'outline'}>
                              {admin.status}
                            </Badge>
                          </td>
                          <td className="p-4 text-muted-foreground">
                            {admin.lastLogin
                              ? new Date(admin.lastLogin).toLocaleDateString()
                              : 'Never'}
                          </td>
                          <td className="p-4 text-muted-foreground">
                            {new Date(admin.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => router.push(`/school-admin-management/${admin.id}`)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleSuspendToggle(admin)}
                                disabled={actionLoading === admin.id}
                              >
                                {actionLoading === admin.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : admin.status === 'suspended' ? (
                                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                                ) : (
                                  <Ban className="h-4 w-4 text-amber-500" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleResetAccess(admin)}
                                disabled={actionLoading === admin.id}
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex flex-col items-center justify-between gap-4 border-t px-4 py-3 sm:flex-row">
                  <p className="text-sm text-muted-foreground">
                    Showing {(page - 1) * PAGE_SIZE + 1}
                    {'\u2013'}
                    {Math.min(page * PAGE_SIZE, total)} of {total}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {(() => {
                        const pages: (number | string)[] = []
                        if (totalPages <= 7) {
                          for (let i = 1; i <= totalPages; i++) pages.push(i)
                        } else {
                          pages.push(1)
                          if (page > 3) pages.push('...')
                          for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
                            pages.push(i)
                          }
                          if (page < totalPages - 2) pages.push('...')
                          pages.push(totalPages)
                        }
                        return pages.map((p, i) =>
                          typeof p === 'string' ? (
                            <span key={`ellipsis-${i}`} className="px-1 text-sm text-muted-foreground">
                              ...
                            </span>
                          ) : (
                            <Button
                              key={p}
                              variant={p === page ? 'default' : 'outline'}
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => setPage(p as number)}
                            >
                              {p}
                            </Button>
                          ),
                        )
                      })()}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
