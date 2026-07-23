type TableName = 'School' | 'User' | 'Subscription' | 'AuditLog' | 'Notification' | 'Setting' | 'FeatureFlag' | 'Session' | 'ApiKey' | 'Student' | 'Employee' | 'Parent';

interface RealtimeConfig {
  table: TableName;
  filter?: string;
  event?: '*' | 'INSERT' | 'UPDATE' | 'DELETE';
}

const ADMIN_API = '/api/admin';

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${ADMIN_API}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const body = await res.json();
  if (!res.ok || !body.success) {
    throw new Error(body.error || `API request failed: ${res.status}`);
  }
  return body.data as T;
}

export class SupabaseRealtime {
  private static channels: Map<string, { unsubscribe: () => void }> = new Map();

  static subscribe(
    config: RealtimeConfig,
    _callback: (payload: Record<string, unknown>) => void,
  ): () => void {
    const channelKey = `${config.table}:${config.event || '*'}:${config.filter || 'all'}`;
    return () => {
      this.channels.delete(channelKey);
    };
  }

  static async getAggregateCount(table: TableName, filter?: Record<string, unknown>): Promise<number> {
    try {
      const data = await fetchApi<Record<string, number>>('/dashboard');
      const key = `total${table}s` as keyof typeof data;
      return data[key] ?? 0;
    } catch {
      return 0;
    }
  }

  static async getAggregateSum(_table: TableName, _column: string, _filter?: Record<string, unknown>): Promise<number> {
    return 0;
  }

  static async getCountByGroup(table: TableName, groupColumn: string): Promise<Record<string, number>> {
    try {
      const data = await fetchApi<{ schoolsByStatus: { status: string; count: number }[] }>('/dashboard');
      if (table === 'School' && groupColumn === 'status') {
        const result: Record<string, number> = {};
        for (const item of data.schoolsByStatus) {
          result[item.status] = item.count;
        }
        return result;
      }
      return {};
    } catch {
      return {};
    }
  }

  static async getRecentRows<T>(table: TableName, _limit = 5, _orderColumn = 'createdAt'): Promise<T[]> {
    try {
      const data = await fetchApi<{ recentSchools: T[] }>('/dashboard');
      if (table === 'School') {
        return data.recentSchools as T[];
      }
      return [];
    } catch {
      return [];
    }
  }

  static async getPaginated<T>(
    table: TableName,
    page = 1,
    limit = 10,
    _orderColumn = 'createdAt',
    _ascending = false,
    filter?: Record<string, unknown>,
  ): Promise<{ data: T[]; total: number; page: number; limit: number }> {
    if (table === 'School') {
      const search = filter?.name ? String(filter.name) : '';
      const status = filter?.status ? String(filter.status) : '';
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(search && { search }),
        ...(status && { status }),
      });
      try {
        const res = await fetch(`${ADMIN_API}/schools?${params}`);
        const body = await res.json();
        if (body.success) {
          return {
            data: body.data as T[],
            total: body.meta.total,
            page: body.meta.page,
            limit: body.meta.limit,
          };
        }
        throw new Error(body.error || 'Failed to fetch');
      } catch (err) {
        throw err;
      }
    }
    return { data: [], total: 0, page, limit };
  }
}
