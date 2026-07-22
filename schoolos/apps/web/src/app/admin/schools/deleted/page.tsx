'use client';

import { useState, useEffect, useCallback } from 'react';
import { Trash2, RotateCcw, Eye, Loader2, ArchiveRestore } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '@schoolos/ui';
import Link from 'next/link';

interface DeletedSchool {
  id: string;
  name: string;
  slug: string;
  status: string;
  email: string | null;
  deletedAt: string;
}

export default function DeletedSchoolsPage() {
  const [schools, setSchools] = useState<DeletedSchool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchSchools = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/schools/deleted');
      const data = await res.json();
      if (!data.success) {
        setError(data.error ?? 'Failed to load');
        return;
      }
      setSchools(data.data ?? []);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSchools(); }, [fetchSchools]);

  const handleRestore = async (school: DeletedSchool) => {
    setProcessingId(school.id);
    try {
      const res = await fetch(`/api/admin/schools/${school.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'trial', deletedAt: null }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setSchools((prev) => prev.filter((s) => s.id !== school.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to restore');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Deleted Schools</h1>
          <p className="text-sm text-muted-foreground mt-1">Schools that have been removed from the platform</p>
        </div>
        {!loading && <Badge variant="secondary">{schools.length} deleted</Badge>}
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          <Trash2 className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">Loading...</span>
        </div>
      ) : schools.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ArchiveRestore className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-semibold">No deleted schools</h3>
          <p className="text-sm text-muted-foreground">The recycle bin is empty</p>
        </div>
      ) : (
        <Card>
          <CardHeader><CardTitle className="text-lg">Deleted Schools ({schools.length})</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left font-medium py-3 px-4">School</th>
                    <th className="text-left font-medium py-3 px-4">Deleted Date</th>
                    <th className="text-right font-medium py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {schools.map((school) => (
                    <tr key={school.id} className="border-b last:border-0">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Trash2 className="h-4 w-4 text-red-500 shrink-0" />
                          <div>
                            <strong>{school.name}</strong>
                            <p className="text-xs text-muted-foreground">{school.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {school.deletedAt ? new Date(school.deletedAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/admin/schools/${school.id}`}
                            className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </Link>
                          <Button
                            size="sm"
                            onClick={() => handleRestore(school)}
                            disabled={processingId === school.id}
                            className="gap-1.5"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                            Restore
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
