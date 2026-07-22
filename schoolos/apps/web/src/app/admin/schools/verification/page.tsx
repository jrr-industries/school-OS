'use client';

import { useState, useEffect, useCallback } from 'react';
import { Check, X, Building2, Mail, Calendar, Loader2, ShieldCheck, Clock } from 'lucide-react';
import { Card, CardContent, Button, Badge } from '@schoolos/ui';

interface PendingSchool {
  id: string;
  name: string;
  slug: string;
  type: string;
  email: string | null;
  phone: string | null;
  status: string;
  createdAt: string;
}

export default function VerificationPage() {
  const [schools, setSchools] = useState<PendingSchool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchSchools = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/schools?limit=100');
      const data = await res.json();
      if (!data.success) {
        setError(data.error ?? 'Failed to load schools');
        return;
      }
      setSchools((data.data ?? []).filter((s: PendingSchool) => s.status === 'trial'));
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSchools(); }, [fetchSchools]);

  const handleApprove = async (school: PendingSchool) => {
    setProcessingId(school.id);
    try {
      const res = await fetch(`/api/admin/schools/${school.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'active' }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setSchools((prev) => prev.filter((s) => s.id !== school.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (school: PendingSchool) => {
    setProcessingId(school.id);
    try {
      const res = await fetch(`/api/admin/schools/${school.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'inactive' }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setSchools((prev) => prev.filter((s) => s.id !== school.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">School Verification</h1>
          <p className="text-sm text-muted-foreground mt-1">Verify pending school registrations</p>
        </div>
        {!loading && (
          <Badge variant="info" className="gap-1">
            <Clock className="h-3 w-3" />
            {schools.length} pending
          </Badge>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          <X className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">Loading schools...</span>
        </div>
      ) : schools.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ShieldCheck className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-semibold">No pending verifications</h3>
          <p className="text-sm text-muted-foreground">All schools have been verified</p>
        </div>
      ) : (
        <div className="space-y-4">
          {schools.map((school) => (
            <Card key={school.id}>
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-3 flex-1">
                    <div>
                      <h3 className="font-semibold text-base">{school.name}</h3>
                      <p className="text-xs text-muted-foreground">{school.slug}</p>
                    </div>
                    <div className="grid gap-2 text-sm sm:grid-cols-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Building2 className="h-4 w-4 shrink-0" />
                        <span className="capitalize">{school.type.replace(/_/g, ' ')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4 shrink-0" />
                        <span>{school.email || '—'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4 shrink-0" />
                        <span>Registered {new Date(school.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      onClick={() => handleApprove(school)}
                      disabled={processingId === school.id}
                      className="gap-1.5"
                    >
                      <Check className="h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleReject(school)}
                      disabled={processingId === school.id}
                      className="gap-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      <X className="h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
