'use client';

import { useState, useEffect } from 'react';
import { RealtimeService } from '../services/realtime.service';

export function useRealtimeValue<T>(path: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!path) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = RealtimeService.subscribe<T>(path, (value) => {
      setData(value);
      setLoading(false);
    });

    return () => {
      unsubscribe();
      setLoading(false);
    };
  }, [path]);

  return { data, loading, error };
}

export function useRealtimeList<T>(path: string | null) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!path) {
      setLoading(false);
      setData([]);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = RealtimeService.subscribeList<T>(path, (items) => {
      setData(items);
      setLoading(false);
    });

    return () => {
      unsubscribe();
      setLoading(false);
    };
  }, [path]);

  return { data, loading, error };
}

export function useSchoolData<T>(schoolId: string | null, subPath?: string) {
  const path = schoolId ? (subPath ? `schools/${schoolId}/${subPath}` : `schools/${schoolId}`) : null;
  return useRealtimeValue<T>(path);
}

export function useSchoolList<T>(schoolId: string | null, subPath: string) {
  const path = schoolId ? `schools/${schoolId}/${subPath}` : null;
  return useRealtimeList<T>(path);
}
