'use client';

import { useState, useEffect, useCallback } from 'react';
import { Bus, MapPin, Users, Route as RouteIcon, Truck } from 'lucide-react';
import { Card, CardContent, Badge, cn } from '@schoolos/ui';
import { PageHeader } from '@/features/school-admin/components/page-header';
import { toast } from 'sonner';

interface TransportRoute {
  id: string;
  name: string;
  vehicleNo: string;
  driver: string;
  driverPhone: string;
  stops: number;
  students: number;
  distance: string;
  estimatedTime: string;
  status: 'active' | 'delayed' | 'completed';
}

export default function TransportPage() {
  const [routes, setRoutes] = useState<TransportRoute[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/school-admin/transport');
      const json = await res.json();
      if (json.success) {
        setRoutes(json.data.routes || []);
        setStats(json.data.stats || {});
      }
    } catch {
      toast.error('Failed to load transport data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const selected = routes.find((r) => r.id === selectedRoute);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transport Overview"
        description="View school transport routes and live bus tracking"
        breadcrumbs={[{ label: 'Dashboard', href: '/school-admin/dashboard' }, { label: 'Transport' }]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardContent className="p-6"><div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/30"><Bus className="h-5 w-5 text-blue-600 dark:text-blue-400" /></div>
          <div><p className="text-2xl font-bold">{loading ? '—' : stats.totalBuses || 0}</p><p className="text-xs text-muted-foreground">Total Buses</p></div>
        </div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center gap-3">
          <div className="rounded-lg bg-emerald-100 p-3 dark:bg-emerald-900/30"><Truck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" /></div>
          <div><p className="text-2xl font-bold">{loading ? '—' : stats.activeTrips || 0}</p><p className="text-xs text-muted-foreground">Active Trips</p></div>
        </div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center gap-3">
          <div className="rounded-lg bg-amber-100 p-3 dark:bg-amber-900/30"><Users className="h-5 w-5 text-amber-600 dark:text-amber-400" /></div>
          <div><p className="text-2xl font-bold">{loading ? '—' : (stats.studentsUsingBus || 0).toLocaleString()}</p><p className="text-xs text-muted-foreground">Students Using Bus</p></div>
        </div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center gap-3">
          <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900/30"><MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400" /></div>
          <div><p className="text-2xl font-bold">{loading ? '—' : stats.driversAvailable || 0}</p><p className="text-xs text-muted-foreground">Drivers Available</p></div>
        </div></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b">
            <h3 className="font-semibold flex items-center gap-2">
              <RouteIcon className="h-4 w-4" /> Transport Routes
              <Badge variant="secondary" className="ml-2 text-[10px]">{routes.length} routes</Badge>
            </h3>
          </div>
          {loading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-24 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
              ))}
            </div>
          ) : routes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Bus className="h-12 w-12 mb-4" />
              <h3 className="text-lg font-medium">No Routes Configured</h3>
              <p className="text-sm mt-1">Route management is handled by Principal / Vice Principal.</p>
            </div>
          ) : (
            <div className="divide-y">
              {routes.map((route) => (
                <div
                  key={route.id}
                  className={cn(
                    'p-4 cursor-pointer transition-all hover:bg-muted/30',
                    selectedRoute === route.id && 'bg-primary/5',
                  )}
                  onClick={() => setSelectedRoute(route.id)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{route.name}</h4>
                        <Badge
                          variant={route.status === 'active' ? 'success' : route.status === 'delayed' ? 'warning' : 'default'}
                          className="text-[10px] capitalize"
                        >
                          {route.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{route.vehicleNo}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{route.estimatedTime || '—'}</p>
                      <p className="text-xs text-muted-foreground">ETA</p>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Truck className="h-3 w-3" /> {route.driver}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {route.stops} stops</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {route.students} students</span>
                    {route.distance && <span className="flex items-center gap-1"><RouteIcon className="h-3 w-3" /> {route.distance}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <MapPin className="h-4 w-4" /> Live Tracking
          </h3>
          {selected ? (
            <div className="space-y-4">
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-sm font-medium">{selected.name}</p>
                <p className="text-xs text-muted-foreground">Driver: {selected.driver} &middot; Vehicle: {selected.vehicleNo}</p>
                {selected.driverPhone && <p className="text-xs text-muted-foreground">Phone: {selected.driverPhone}</p>}
              </div>
              <div className="flex items-center justify-center rounded-lg border-2 border-dashed p-12 text-muted-foreground">
                <div className="text-center">
                  <MapPin className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm font-medium">Live Bus Tracking</p>
                  <p className="text-xs mt-1">Real-time GPS tracking managed by Transport team</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <Bus className="h-12 w-12 mb-3" />
              <p className="text-sm font-medium">Select a route above</p>
              <p className="text-xs mt-1">Click on a route to view its live tracking details</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
