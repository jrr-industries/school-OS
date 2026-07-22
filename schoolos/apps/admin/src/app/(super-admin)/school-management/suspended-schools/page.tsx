'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Search,
  ShieldCheck,
  Eye,
  Building2,
  Loader2,
  School,
  ShieldOff,
} from 'lucide-react';
import { SupabaseRealtime } from '@/lib/supabase-realtime';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Button,
  Input,
} from '@schoolos/ui';

interface SchoolRecord {
  id: string;
  name: string;
  code: string;
  logo?: string;
  type: string;
  city?: string;
  state?: string;
  status: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

const ITEMS_PER_PAGE = 10;

export default function SuspendedSchoolsPage() {
  const router = useRouter();
  const [schools, setSchools] = useState<SchoolRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));

  const fetchSchools = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const filters: Record<string, unknown> = { status: 'suspended' };
      if (search.trim()) filters.name = search.trim();
      const result = await SupabaseRealtime.getPaginated<SchoolRecord>(
        'School', page, ITEMS_PER_PAGE, 'updatedAt', false, filters,
      );
      setSchools(result.data);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch suspended schools');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchSchools(); }, [fetchSchools]);
  useEffect(() => { setPage(1); }, [search]);

  const handleActivate = async (school: SchoolRecord) => {
    if (!window.confirm(`Activate ${school.name}? This will restore their access.`)) return;
    setProcessingId(school.id);
    try {
      const res = await fetch(`/api/admin/schools/${school.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'active' }),
      });
      if (!res.ok) throw new Error('Failed to activate school');
      toast.success(`${school.name} activated successfully`);
      fetchSchools();
    } catch {
      toast.error('Failed to activate school');
    } finally {
      setProcessingId(null);
    }
  };

  const renderSkeleton = () => (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-lg border p-4">
          <div className="h-10 w-10 animate-pulse rounded-lg bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-48 animate-pulse rounded bg-muted" />
            <div className="h-3 w-32 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-8 w-24 animate-pulse rounded bg-muted" />
        </div>
      ))}
    </div>
  );

  const renderEmpty = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <ShieldCheck className="mb-4 h-12 w-12 text-muted-foreground" />
      <h3 className="mb-1 text-lg font-semibold">No suspended schools</h3>
      <p className="text-sm text-muted-foreground">
        {search ? 'No schools match your search' : 'There are no suspended schools at this time'}
      </p>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Suspended Schools</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Review and manage schools that have been suspended
            </p>
          </div>
          {!loading && <Badge variant="destructive">{total} suspended</Badge>}
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search schools..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {loading ? renderSkeleton() : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 rounded-full bg-destructive/10 p-4">
                <Loader2 className="h-8 w-8 text-destructive" />
              </div>
              <h3 className="mb-1 text-lg font-semibold">Something went wrong</h3>
              <p className="mb-6 text-sm text-muted-foreground">{error}</p>
              <Button variant="outline" onClick={fetchSchools}>Try Again</Button>
            </div>
          ) : schools.length === 0 ? renderEmpty() : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">School</th>
                      <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Type</th>
                      <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Location</th>
                      <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Status</th>
                      <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Last Updated</th>
                      <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schools.map((school, index) => (
                      <motion.tr
                        key={school.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="border-b transition-colors hover:bg-muted/50"
                      >
                        <td className="p-2 align-middle">
                          <div className="flex items-center gap-3">
                            {school.logo ? (
                              <img src={school.logo} alt="" className="h-10 w-10 rounded-lg object-cover" />
                            ) : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                <Building2 className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium">{school.name}</p>
                              <p className="text-xs text-muted-foreground">{school.code}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-2 align-middle text-muted-foreground">{school.type}</td>
                        <td className="p-2 align-middle text-muted-foreground">
                          {[school.city, school.state].filter(Boolean).join(', ') || '—'}
                        </td>
                        <td className="p-2 align-middle">
                          <Badge variant="destructive">Suspended</Badge>
                        </td>
                        <td className="p-2 align-middle text-muted-foreground">
                          {new Date(school.updatedAt).toLocaleDateString()}
                        </td>
                        <td className="p-2 align-middle">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" onClick={() => router.push(`/school-management/${school.id}`)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost" size="icon"
                              onClick={() => handleActivate(school)}
                              disabled={processingId === school.id}
                              className="text-emerald-500 hover:text-emerald-600"
                            >
                              <ShieldCheck className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, total)} of {total} schools
                </p>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                    .map((p, idx, arr) => {
                      const showEllipsis = idx > 0 && p - arr[idx - 1] > 1;
                      return (
                        <span key={p} className="flex items-center gap-1">
                          {showEllipsis && <span className="px-1 text-muted-foreground">...</span>}
                          <Button variant={p === page ? 'default' : 'outline'} size="sm" className="h-8 w-8 p-0" onClick={() => setPage(p)}>{p}</Button>
                        </span>
                      );
                    })}
                  <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
