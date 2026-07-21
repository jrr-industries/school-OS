'use client';

import { useState, useEffect } from 'react';
import { SupabaseService } from '../services/supabase.service';

export function useSchoolList<T = any>(
  table: string,
  schoolId: string | undefined,
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!schoolId) {
      setLoading(false);
      setData([]);
      return;
    }

    setLoading(true);
    setError(null);

    const unsub = SupabaseService.subscribeList<T>(table, schoolId, (items) => {
      setData(items);
      setLoading(false);
    });

    return () => {
      unsub();
    };
  }, [table, schoolId]);

  return { data, loading, error };
}
