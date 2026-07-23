const BASE_URL = '/api/admin';

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const body = await res.json();
  if (!res.ok || !body.success) {
    throw new Error(body.error || `API request failed: ${res.status}`);
  }
  return body.data as T;
}

export interface DashboardData {
  totalSchools: number;
  activeSchools: number;
  trialSchools: number;
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  totalParents: number;
  totalStaff: number;
  activeSubscriptions: number;
  revenue: number;
  schoolsByStatus: { status: string; count: number }[];
  recentSchools: { id: string; name: string; type: string; status: string; createdAt: string }[];
  planDistribution: Record<string, number>;
  expiringSoon: number;
}

export async function getDashboardData(): Promise<DashboardData> {
  return fetchApi<DashboardData>('/dashboard');
}
