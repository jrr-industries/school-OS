'use client';

import { createClientSupabaseClient } from '@schoolos/auth/client';

let client: ReturnType<typeof createClientSupabaseClient> | null = null;

function getClient() {
  if (!client) {
    client = createClientSupabaseClient();
  }
  return client;
}

type Unsubscribe = () => void;

export class SupabaseService {
  static async get<T = any>(table: string, id: string): Promise<T | null> {
    const { data, error } = await getClient()
      .from(table)
      .select('*')
      .eq('id', id)
      .single();
    if (error) return null;
    return data as T;
  }

  static async list<T = any>(table: string, schoolId: string): Promise<T[]> {
    const { data, error } = await getClient()
      .from(table)
      .select('*')
      .eq('school_id', schoolId)
      .order('created_at', { ascending: false });
    if (error) return [];
    return (data ?? []) as T[];
  }

  static async insert<T = any>(table: string, data: Record<string, unknown>): Promise<T | null> {
    const { data: result, error } = await getClient()
      .from(table)
      .insert(data)
      .select()
      .single();
    if (error) return null;
    return result as T;
  }

  static async update<T = any>(table: string, id: string, data: Record<string, unknown>): Promise<T | null> {
    const { data: result, error } = await getClient()
      .from(table)
      .update(data)
      .eq('id', id)
      .select()
      .single();
    if (error) return null;
    return result as T;
  }

  static async delete(table: string, id: string): Promise<boolean> {
    const { error } = await getClient()
      .from(table)
      .delete()
      .eq('id', id);
    return !error;
  }

  static async upsert<T = any>(table: string, data: Record<string, unknown>): Promise<T | null> {
    const { data: result, error } = await getClient()
      .from(table)
      .upsert(data)
      .select()
      .single();
    if (error) return null;
    return result as T;
  }

  static subscribeList<T = any>(
    table: string,
    schoolId: string | undefined,
    callback: (items: T[]) => void,
  ): Unsubscribe {
    if (!schoolId) {
      callback([]);
      return () => {};
    }

    const channel = getClient().channel(`${table}-${schoolId}-list`);
    channel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          filter: `school_id=eq.${schoolId}`,
        },
        () => {
          this.list<T>(table, schoolId).then(callback);
        },
      )
      .subscribe();

    this.list<T>(table, schoolId).then(callback);

    return () => {
      channel.unsubscribe();
    };
  }

  static subscribe<T = any>(
    table: string,
    id: string,
    callback: (data: T | null) => void,
  ): Unsubscribe {
    const channel = getClient().channel(`${table}-${id}`);
    channel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          filter: `id=eq.${id}`,
        },
        () => {
          getClient()
            .from(table)
            .select('*')
            .eq('id', id)
            .single()
            .then(({ data }) => callback(data as T | null));
        },
      )
      .subscribe();

    getClient()
      .from(table)
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => callback(data as T | null));

    return () => {
      channel.unsubscribe();
    };
  }

  static subscribeByField<T = any>(
    table: string,
    schoolId: string | undefined,
    field: string,
    value: string,
    callback: (data: T | null) => void,
  ): Unsubscribe {
    if (!schoolId) {
      callback(null);
      return () => {};
    }

    const channel = getClient().channel(`${table}-${field}-${value}`);
    channel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          filter: `${field}=eq.${value}`,
        },
        () => {
          getClient()
            .from(table)
            .select('*')
            .eq(field, value)
            .single()
            .then(({ data }) => callback(data as T | null));
        },
      )
      .subscribe();

    getClient()
      .from(table)
      .select('*')
      .eq(field, value)
      .single()
      .then(({ data }) => callback(data as T | null));

    return () => {
      channel.unsubscribe();
    };
  }
}
