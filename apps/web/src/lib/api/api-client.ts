/**
 * API Client with caching, deduplication, and stale-while-revalidate support.
 * This is a future-ready implementation for when the backend API is ready.
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  staleAt: number;
}

interface FetchOptions extends RequestInit {
  /** Cache time-to-live in milliseconds (default: 5 minutes) */
  ttl?: number;
  /** Stale time in milliseconds - data is considered stale after this but still usable (default: 30 seconds) */
  staleThreshold?: number;
  /** Tags for cache invalidation */
  tags?: string[];
}

class ApiClient {
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private pendingRequests: Map<string, Promise<unknown>> = new Map();
  private baseUrl: string;

  constructor(baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api') {
    this.baseUrl = baseUrl;
  }

  /**
   * Fetch data with caching and deduplication.
   * Returns cached data immediately if available, refreshes in background if stale.
   */
  async fetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { ttl = 5 * 60 * 1000, staleThreshold = 30 * 1000, tags, ...fetchOptions } = options;
    const cacheKey = `${endpoint}${JSON.stringify(fetchOptions)}`;

    // Check cache
    const cached = this.cache.get(cacheKey) as CacheEntry<T> | undefined;
    const now = Date.now();

    if (cached) {
      // If cache is still fresh, return immediately
      if (now < cached.staleAt) {
        return cached.data;
      }

      // If cache is stale but still within TTL, return stale data and refresh
      if (now < cached.timestamp + ttl) {
        // Trigger background refresh
        this.fetchAndCache<T>(endpoint, cacheKey, fetchOptions);
        return cached.data;
      }

      // Cache expired, remove it
      this.cache.delete(cacheKey);
    }

    // Check if there's already a pending request for this endpoint
    const pending = this.pendingRequests.get(cacheKey);
    if (pending) {
      return pending as Promise<T>;
    }

    // Make the request
    return this.fetchAndCache<T>(endpoint, cacheKey, fetchOptions);
  }

  private async fetchAndCache<T>(
    endpoint: string,
    cacheKey: string,
    fetchOptions: RequestInit,
  ): Promise<T> {
    const promise = (async () => {
      try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          headers: {
            'Content-Type': 'application/json',
            ...fetchOptions.headers,
          },
          ...fetchOptions,
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Cache the result
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now(),
          staleAt: Date.now() + 30 * 1000, // 30 seconds before considered stale
        });

        return data as T;
      } finally {
        this.pendingRequests.delete(cacheKey);
      }
    })();

    this.pendingRequests.set(cacheKey, promise);
    return promise;
  }

  /**
   * Invalidate cache entries by tags or endpoint
   */
  invalidate(tagOrEndpoint: string): void {
    // Simple invalidation - delete by exact key prefix
    for (const key of this.cache.keys()) {
      if (key.startsWith(tagOrEndpoint)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear entire cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Prefetch data and add to cache without waiting
   */
  prefetch<T>(endpoint: string, options: FetchOptions = {}): void {
    this.fetch<T>(endpoint, { ...options, ttl: options.ttl || 5 * 60 * 1000 });
  }
}

export const apiClient = new ApiClient();
