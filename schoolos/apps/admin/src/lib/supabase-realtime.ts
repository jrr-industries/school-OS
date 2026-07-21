import { createClientSupabaseClient } from '@schoolos/auth';
import type { RealtimeChannel } from '@supabase/supabase-js';

type TableName = 'School' | 'User' | 'Subscription' | 'AuditLog' | 'Notification' | 'Setting' | 'FeatureFlag' | 'Session' | 'ApiKey' | 'Student' | 'Employee' | 'Parent';

interface RealtimeConfig {
  table: TableName;
  filter?: string;
  event?: '*' | 'INSERT' | 'UPDATE' | 'DELETE';
}

export class SupabaseRealtime {
  private static channels: Map<string, RealtimeChannel> = new Map();

  static subscribe(
    config: RealtimeConfig,
    callback: (payload: Record<string, unknown>) => void,
  ): () => void {
    const channelKey = `${config.table}:${config.event || '*'}:${config.filter || 'all'}`;

    if (this.channels.has(channelKey)) {
      const existing = this.channels.get(channelKey)!;
      existing.unsubscribe();
      this.channels.delete(channelKey);
    }

    const supabase = createClientSupabaseClient();
    const channel = supabase
      .channel(channelKey)
      .on(
        'postgres_changes',
        {
          event: config.event || '*',
          schema: 'public',
          table: config.table,
          ...(config.filter ? { filter: config.filter } : {}),
        },
        (payload) => {
          callback(payload as unknown as Record<string, unknown>);
        },
      )
      .subscribe();

    this.channels.set(channelKey, channel);

    return () => {
      const ch = this.channels.get(channelKey);
      if (ch) {
        ch.unsubscribe();
        this.channels.delete(channelKey);
      }
    };
  }

  static async getAggregateCount(table: TableName, filter?: Record<string, unknown>): Promise<number> {
    const supabase = createClientSupabaseClient();
    let query = supabase.from(table).select('*', { count: 'exact', head: true });
    if (filter) {
      for (const [key, value] of Object.entries(filter)) {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      }
    }
    const { count, error } = await query;
    if (error) throw new Error(error.message);
    return count ?? 0;
  }

  static async getAggregateSum(table: TableName, column: string, filter?: Record<string, unknown>): Promise<number> {
    const supabase = createClientSupabaseClient();
    let query = supabase.from(table).select(`${column}::sum`, { count: 'exact', head: false });
    if (filter) {
      for (const [key, value] of Object.entries(filter)) {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      }
    }
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) return 0;
    const row = data[0] as unknown as Record<string, unknown>;
    return (row[`${column}_sum`] as number) ?? 0;
  }

  static async getCountByGroup(table: TableName, groupColumn: string): Promise<Record<string, number>> {
    const supabase = createClientSupabaseClient();
    const { data, error } = await supabase
      .from(table)
      .select(groupColumn, { count: 'exact' });
    if (error) throw new Error(error.message);
    if (!data) return {};
    const counts: Record<string, number> = {};
    for (const row of data) {
      const r = row as unknown as Record<string, unknown>;
      const key = String(r[groupColumn] ?? 'unknown');
      counts[key] = (counts[key] || 0) + 1;
    }
    return counts;
  }

  static async getRecentRows<T>(table: TableName, limit = 10, orderColumn = 'createdAt', filter?: Record<string, unknown>): Promise<T[]> {
    const supabase = createClientSupabaseClient();
    let query = supabase
      .from(table)
      .select('*')
      .order(orderColumn, { ascending: false })
      .limit(limit);
    if (filter) {
      for (const [key, value] of Object.entries(filter)) {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      }
    }
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return (data ?? []) as T[];
  }

  static async getPaginated<T>(
    table: TableName,
    page = 1,
    limit = 10,
    orderColumn = 'createdAt',
    ascending = false,
    filter?: Record<string, unknown>,
  ): Promise<{ data: T[]; total: number; page: number; limit: number }> {
    const supabase = createClientSupabaseClient();
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from(table)
      .select('*', { count: 'exact' })
      .order(orderColumn, { ascending })
      .range(from, to);

    if (filter) {
      for (const [key, value] of Object.entries(filter)) {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      }
    }

    const { data, count, error } = await query;
    if (error) throw new Error(error.message);
    return {
      data: (data ?? []) as T[],
      total: count ?? 0,
      page,
      limit,
    };
  }
}
