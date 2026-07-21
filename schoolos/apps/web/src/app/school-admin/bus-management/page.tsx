'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  Bus, Route, Users, Fuel, Wrench, Clock, MapPin,
  AlertTriangle, CheckCircle, XCircle, ArrowUpRight, ArrowDownRight,
  Gauge, Percent,
} from 'lucide-react';
import {
  Card, CardHeader, CardTitle, CardContent, Badge, Button, cn,
} from '@schoolos/ui';
import { useFirebaseAuth } from '@/features/firebase/hooks/use-firebase-auth';
import { RealtimeService } from '@/features/firebase/services/realtime.service';
import { PageHeader } from '@/features/school-admin/components/page-header';

const SAMPLE_DATA = {
  totalBuses: 8,
  activeBuses: 6,
  inactiveBuses: 2,
  routes: 12,
  drivers: 8,
  conductors: 8,
  studentsAssigned: 680,
  totalStudents: 1240,
  fuelCost: 42500,
  maintenanceCost: 18300,
  monthlyFuelCost: 42500,
  monthlyMaintenanceCost: 18300,
  buses: [
    { id: 'BUS-001', number: 'KA-01-1234', route: 'Route A - North', driver: 'Suresh Kumar', conductor: 'Ramesh', status: 'active', capacity: 52, assigned: 48, gps: 'online', location: 'Sector 5, Main Road', lastUpdated: '2 min ago', late: false },
    { id: 'BUS-002', number: 'KA-01-5678', route: 'Route B - South', driver: 'Mahesh Reddy', conductor: 'Venkat', status: 'active', capacity: 52, assigned: 50, gps: 'online', location: 'City Center Stop', lastUpdated: '1 min ago', late: false },
    { id: 'BUS-003', number: 'KA-01-9012', route: 'Route C - East', driver: 'Prakash Rao', conductor: 'Anil', status: 'active', capacity: 40, assigned: 35, gps: 'online', location: 'East Gate', lastUpdated: '3 min ago', late: true },
    { id: 'BUS-004', number: 'KA-01-3456', route: 'Route D - West', driver: 'Ganesh', conductor: 'Sunil', status: 'active', capacity: 52, assigned: 44, gps: 'offline', location: 'Depot', lastUpdated: '15 min ago', late: false },
    { id: 'BUS-005', number: 'KA-01-7890', route: 'Route E - Central', driver: 'Dinesh', conductor: 'Mohan', status: 'inactive', capacity: 40, assigned: 0, gps: 'offline', location: 'Workshop', lastUpdated: '1 day ago', late: false },
    { id: 'BUS-006', number: 'KA-01-2345', route: 'Route F - Ring Road', driver: 'Harish', conductor: 'Kiran', status: 'active', capacity: 52, assigned: 46, gps: 'online', location: 'Ring Road Junction', lastUpdated: '2 min ago', late: false },
    { id: 'BUS-007', number: 'KA-01-6789', route: 'Route G - Industrial', driver: 'Jagdish', conductor: 'Ravi', status: 'active', capacity: 40, assigned: 38, gps: 'online', location: 'Industrial Area', lastUpdated: '4 min ago', late: true },
    { id: 'BUS-008', number: 'KA-01-0123', route: 'Route H - Village Road', driver: 'Karthik', conductor: 'Sridhar', status: 'inactive', capacity: 32, assigned: 0, gps: 'offline', location: 'Garage', lastUpdated: '2 days ago', late: false },
  ],
  lateBuses: [
    { id: 'BUS-003', number: 'KA-01-9012', route: 'Route C - East', delay: '12 min', reason: 'Traffic congestion' },
    { id: 'BUS-007', number: 'KA-01-6789', route: 'Route G - Industrial', delay: '8 min', reason: 'Road construction' },
  ],
  capacityUtilization: [
    { route: 'Route A', capacity: 52, assigned: 48 },
    { route: 'Route B', capacity: 52, assigned: 50 },
    { route: 'Route C', capacity: 40, assigned: 35 },
    { route: 'Route D', capacity: 52, assigned: 44 },
    { route: 'Route E', capacity: 40, assigned: 0 },
    { route: 'Route F', capacity: 52, assigned: 46 },
    { route: 'Route G', capacity: 40, assigned: 38 },
    { route: 'Route H', capacity: 32, assigned: 0 },
  ],
  routeEfficiency: [
    { route: 'Route A - North', efficiency: 92, onTime: 48, total: 52 },
    { route: 'Route B - South', efficiency: 96, onTime: 50, total: 52 },
    { route: 'Route C - East', efficiency: 78, onTime: 31, total: 40 },
    { route: 'Route D - West', efficiency: 88, onTime: 46, total: 52 },
    { route: 'Route F - Ring Road', efficiency: 90, onTime: 47, total: 52 },
    { route: 'Route G - Industrial', efficiency: 82, onTime: 33, total: 40 },
  ],
  lastUpdated: new Date().toISOString(),
};

function StatCard({ title, value, icon: Icon, color, trend, loading }: {
  title: string; value: string; icon: React.ComponentType<{ className?: string }>; color: string; trend?: { value: number; positive: boolean }; loading?: boolean;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className={cn('rounded-lg p-2.5', color)}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground">{title}</p>
              {loading ? (
                <div className="mt-1 h-6 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              ) : (
                <p className="text-lg font-bold">{value}</p>
              )}
              {trend && (
                <div className={cn('flex items-center gap-0.5 text-xs font-medium', trend.positive ? 'text-emerald-600' : 'text-red-600')}>
                  {trend.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {trend.value}%
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-popover p-3 shadow-md text-xs">
      <p className="mb-1 font-medium text-foreground">{label}</p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-muted-foreground">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span>{entry.name}: <span className="font-medium text-foreground">{entry.value}</span></span>
        </div>
      ))}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-56 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
        ))}
      </div>
      <div className="h-[300px] animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
    </div>
  );
}

export default function BusManagementPage() {
  const { schoolId, loading: authLoading } = useFirebaseAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!schoolId) return;
    const unsub = RealtimeService.subscribe<any>(`schools/${schoolId}/analytics/transport`, (fbData) => {
      if (fbData) {
        setData(fbData);
      } else {
        setData(SAMPLE_DATA);
        toast.info('Using sample transport data. Connect Firebase for live data.');
      }
      setLoading(false);
    });
    return () => unsub();
  }, [schoolId]);

  useEffect(() => {
    if (!schoolId) return;
    const timeout = setTimeout(() => {
      if (loading) {
        setData(SAMPLE_DATA);
        setLoading(false);
        toast.info('Using sample transport data. Connect Firebase for live data.');
      }
    }, 5000);
    return () => clearTimeout(timeout);
  }, [schoolId, loading]);

  if (authLoading || loading) return <LoadingSkeleton />;
  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Bus Management" description="School bus fleet and route management" />
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <AlertTriangle className="h-12 w-12 mb-4" />
            <h3 className="text-lg font-medium">Error loading data</h3>
            <p className="text-sm">{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => { setData(SAMPLE_DATA); setError(null); toast.info('Using sample data'); }}>
              Use Sample Data
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = data || SAMPLE_DATA;
  const buses = stats.buses || SAMPLE_DATA.buses;
  const lateBuses = stats.lateBuses || SAMPLE_DATA.lateBuses;
  const capacityUtilization = stats.capacityUtilization || SAMPLE_DATA.capacityUtilization;
  const routeEfficiency = stats.routeEfficiency || SAMPLE_DATA.routeEfficiency;

  const onlineCount = buses.filter((b: any) => b.gps === 'online').length;
  const activeCount = buses.filter((b: any) => b.status === 'active').length;
  const utilizationRate = stats.studentsAssigned && capacityUtilization.length > 0
    ? Math.round((capacityUtilization.filter((r: any) => r.capacity > 0).reduce((s: number, r: any) => s + (r.assigned / r.capacity), 0) / capacityUtilization.filter((r: any) => r.capacity > 0).length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bus Management"
        description="School bus fleet and route management"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Buses" value={String(stats.totalBuses)} icon={Bus} color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" />
        <StatCard title="Active Buses" value={`${activeCount} / ${stats.totalBuses}`} icon={CheckCircle} trend={{ value: 100 * activeCount / stats.totalBuses - 50, positive: true }} color="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" />
        <StatCard title="Routes" value={String(stats.routes)} icon={Route} color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" />
        <StatCard title="Students Assigned" value={`${stats.studentsAssigned} / ${stats.totalStudents}`} icon={Users} color="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Drivers" value={String(stats.drivers)} icon={Users} color="bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400" />
        <StatCard title="Conductors" value={String(stats.conductors)} icon={Users} color="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" />
        <StatCard title="GPS Online" value={`${onlineCount} / ${buses.length}`} icon={MapPin} color="bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400" />
        <StatCard title="Utilization" value={`${utilizationRate}%`} icon={Percent} color="bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Fuel Cost (Monthly)" value={`₹${(stats.monthlyFuelCost || stats.fuelCost).toLocaleString()}`} icon={Fuel} color="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" />
        <StatCard title="Maintenance Cost" value={`₹${(stats.monthlyMaintenanceCost || stats.maintenanceCost).toLocaleString()}`} icon={Wrench} color="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Bus className="h-4 w-4 text-muted-foreground" />
              Bus Tracking & Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th className="pb-2 font-medium">Bus</th>
                    <th className="pb-2 font-medium">Route</th>
                    <th className="pb-2 font-medium">Driver</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 font-medium">GPS</th>
                    <th className="pb-2 font-medium">Capacity</th>
                    <th className="pb-2 font-medium">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {buses.map((bus: any) => (
                    <tr key={bus.id} className="border-b last:border-0">
                      <td className="py-2.5 pr-4">
                        <div>
                          <p className="font-medium">{bus.id}</p>
                          <p className="text-[10px] text-muted-foreground">{bus.number}</p>
                        </div>
                      </td>
                      <td className="py-2.5 pr-4 text-muted-foreground">{bus.route}</td>
                      <td className="py-2.5 pr-4">
                        <p className="font-medium">{bus.driver}</p>
                        <p className="text-[10px] text-muted-foreground">Cond: {bus.conductor}</p>
                      </td>
                      <td className="py-2.5 pr-4">
                        <Badge variant={bus.status === 'active' ? 'success' : 'secondary'} size="sm">
                          {bus.status}
                        </Badge>
                        {bus.late && <Badge variant="destructive" size="sm" className="ml-1">Late</Badge>}
                      </td>
                      <td className="py-2.5 pr-4">
                        <div className="flex items-center gap-1">
                          {bus.gps === 'online' ? (
                            <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                          ) : (
                            <XCircle className="h-3.5 w-3.5 text-red-500" />
                          )}
                          <span className="text-xs">{bus.gps}</span>
                        </div>
                      </td>
                      <td className="py-2.5 pr-4">
                        <div className="flex items-center gap-1.5">
                          <div className="h-2 w-16 rounded-full bg-slate-200 dark:bg-slate-700">
                            <div className={cn(
                              'h-2 rounded-full',
                              bus.capacity > 0 && bus.assigned / bus.capacity > 0.85 ? 'bg-red-500' :
                              bus.capacity > 0 && bus.assigned / bus.capacity > 0.6 ? 'bg-amber-500' : 'bg-emerald-500',
                            )} style={{ width: `${bus.capacity > 0 ? (bus.assigned / bus.capacity) * 100 : 0}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground">{bus.capacity > 0 ? `${Math.round(bus.assigned / bus.capacity * 100)}%` : 'N/A'}</span>
                        </div>
                      </td>
                      <td className="py-2.5 text-xs text-muted-foreground">{bus.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Late Buses
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lateBuses.length > 0 ? (
                <div className="space-y-3">
                  {lateBuses.map((bus: any, i: number) => (
                    <div key={i} className="flex items-start gap-3 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 p-3">
                      <AlertTriangle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{bus.id} - {bus.number}</p>
                          <Badge variant="destructive" size="sm">{bus.delay}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{bus.route}</p>
                        <p className="text-xs text-red-600">{bus.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <CheckCircle className="h-8 w-8 mb-2 text-emerald-500" />
                  <p className="text-sm">All buses on time</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Gauge className="h-4 w-4 text-muted-foreground" />
                Route Efficiency
              </CardTitle>
            </CardHeader>
            <CardContent>
              {routeEfficiency.length > 0 ? (
                <div className="space-y-3">
                  {routeEfficiency.map((route: any, i: number) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-medium">{route.route}</p>
                          <span className={cn(
                            'text-xs font-medium',
                            route.efficiency >= 90 ? 'text-emerald-600' : route.efficiency >= 80 ? 'text-amber-600' : 'text-red-600',
                          )}>{route.efficiency}%</span>
                        </div>
                        <div className="mt-1 h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                          <div className={cn(
                            'h-1.5 rounded-full',
                            route.efficiency >= 90 ? 'bg-emerald-500' : route.efficiency >= 80 ? 'bg-amber-500' : 'bg-red-500',
                          )} style={{ width: `${route.efficiency}%` }} />
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">On-time: {route.onTime}/{route.total} trips</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <Gauge className="h-8 w-8 mb-2" />
                  <p className="text-sm">No route efficiency data</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                Bus Capacity vs Utilization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={capacityUtilization.filter((r: any) => r.capacity > 0)} margin={{ top: 5, right: 10, left: -20, bottom: 0 }} barCategoryGap="20%">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                    <XAxis dataKey="route" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} className="text-muted-foreground" />
                    <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} className="text-muted-foreground" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="capacity" name="Capacity" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="assigned" name="Assigned" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Fuel className="h-4 w-4 text-muted-foreground" />
                Cost Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Fuel className="h-4 w-4 text-orange-500" />
                      <p className="text-xs text-muted-foreground">Fuel Cost</p>
                    </div>
                    <p className="text-xl font-bold">₹{(stats.monthlyFuelCost || stats.fuelCost).toLocaleString()}</p>
                    <p className="text-xs text-emerald-600 flex items-center gap-0.5 mt-1">
                      <ArrowDownRight className="h-3 w-3" /> 5% vs last month
                    </p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Wrench className="h-4 w-4 text-red-500" />
                      <p className="text-xs text-muted-foreground">Maintenance</p>
                    </div>
                    <p className="text-xl font-bold">₹{(stats.monthlyMaintenanceCost || stats.maintenanceCost).toLocaleString()}</p>
                    <p className="text-xs text-red-600 flex items-center gap-0.5 mt-1">
                      <ArrowUpRight className="h-3 w-3" /> 8% vs last month
                    </p>
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-xs text-muted-foreground mb-1">Total Monthly Operating Cost</p>
                  <p className="text-2xl font-bold">₹{((stats.monthlyFuelCost || stats.fuelCost) + (stats.monthlyMaintenanceCost || stats.maintenanceCost)).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
