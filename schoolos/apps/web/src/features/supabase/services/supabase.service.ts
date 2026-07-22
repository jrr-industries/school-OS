'use client';

import { createClientSupabaseClient } from '@schoolos/auth/client';

let client: ReturnType<typeof createClientSupabaseClient> | null = null;

function getClient() {
  if (!client) {
    try {
      client = createClientSupabaseClient();
    } catch {
      return null;
    }
  }
  return client;
}

type Unsubscribe = () => void;

export class SupabaseService {
  static async get<T = any>(table: string, id: string): Promise<T | null> {
    const c = getClient();
    if (!c) return null;
    const { data, error } = await c.from(table).select('*').eq('id', id).single();
    if (error) return null;
    return data as T;
  }

  static async list<T = any>(table: string, schoolId: string): Promise<T[]> {
    const c = getClient();
    if (!c) return [];
    const { data, error } = await c
      .from(table)
      .select('*')
      .eq('school_id', schoolId)
      .order('created_at', { ascending: false });
    if (error) return [];
    return (data ?? []) as T[];
  }

  static async insert<T = any>(table: string, data: Record<string, unknown>): Promise<T | null> {
    const c = getClient();
    if (!c) return null;
    const { data: result, error } = await c.from(table).insert(data).select().single();
    if (error) return null;
    return result as T;
  }

  static async update<T = any>(table: string, id: string, data: Record<string, unknown>): Promise<T | null> {
    const c = getClient();
    if (!c) return null;
    const { data: result, error } = await c.from(table).update(data).eq('id', id).select().single();
    if (error) return null;
    return result as T;
  }

  static async delete(table: string, id: string): Promise<boolean> {
    const c = getClient();
    if (!c) return false;
    const { error } = await c.from(table).delete().eq('id', id);
    return !error;
  }

  static async upsert<T = any>(table: string, data: Record<string, unknown>): Promise<T | null> {
    const c = getClient();
    if (!c) return null;
    const { data: result, error } = await c.from(table).upsert(data).select().single();
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

    const c = getClient();
    if (!c) {
      callback([]);
      return () => {};
    }

    const channel = c.channel(`${table}-${schoolId}-list`);
    channel
      .on('postgres_changes', { event: '*', schema: 'public', table, filter: `school_id=eq.${schoolId}` }, () => {
        this.list<T>(table, schoolId).then(callback, () => callback([] as T[]));
      })
      .subscribe();

    this.list<T>(table, schoolId).then(callback, () => callback([] as T[]));

    return () => {
      channel.unsubscribe();
    };
  }

  static subscribe<T = any>(table: string, id: string, callback: (data: T | null) => void): Unsubscribe {
    const c = getClient();
    if (!c) {
      callback(null);
      return () => {};
    }

    const channel = c.channel(`${table}-${id}`);
    channel
      .on('postgres_changes', { event: '*', schema: 'public', table, filter: `id=eq.${id}` }, () => {
        c.from(table).select('*').eq('id', id).single().then(({ data }) => callback(data as T | null), () => callback(null));
      })
      .subscribe();

    c.from(table).select('*').eq('id', id).single().then(({ data }) => callback(data as T | null), () => callback(null));

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

    const c = getClient();
    if (!c) {
      callback(null);
      return () => {};
    }

    const channel = c.channel(`${table}-${field}-${value}`);
    channel
      .on('postgres_changes', { event: '*', schema: 'public', table, filter: `${field}=eq.${value}` }, () => {
        c.from(table).select('*').eq(field, value).single().then(({ data }) => callback(data as T | null), () => callback(null));
      })
      .subscribe();

    c.from(table).select('*').eq(field, value).single().then(({ data }) => callback(data as T | null), () => callback(null));

    return () => {
      channel.unsubscribe();
    };
  }
}
