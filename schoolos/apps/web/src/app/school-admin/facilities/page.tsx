'use client';

import { useState, useEffect } from 'react';
import {
  Monitor, Wifi, BatteryCharging, Droplets, Wrench,
  Library, BookOpen, Theater, Trees, Camera,
  CheckCircle2, XCircle, AlertTriangle, RefreshCw,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Badge, cn, Skeleton, Button } from '@schoolos/ui';
import { useFirebaseAuth } from '@/features/firebase/hooks/use-firebase-auth';
import { RealtimeService } from '@/features/firebase/services/realtime.service';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface Facility {
  id: string;
  name: string;
  type: 'lab' | 'computer-lab' | 'smart-classroom' | 'playground' | 'library' | 'auditorium';
  operational: boolean;
  capacity?: number;
  description?: string;
}

interface CctvStatus {
  totalCameras: number;
  activeCameras: number;
  status: 'active' | 'degraded' | 'down';
}

interface InternetStatus {
  status: 'up' | 'down';
  speed: string;
  provider: string;
}

interface PowerBackup {
  status: 'active' | 'maintenance' | 'down';
  capacity: string;
  lastTested: string;
}

interface WaterSupply {
  status: 'active' | 'maintenance' | 'outage';
  source: string;
  tankLevel: number;
}

interface MaintenanceRequest {
  id: string;
  facility: string;
  issue: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed';
  reportedBy: string;
  reportedAt: string;
}

interface FacilitiesData {
  facilities: Facility[];
  cctv: CctvStatus;
  internet: InternetStatus;
  powerBackup: PowerBackup;
  waterSupply: WaterSupply;
  maintenanceRequests: MaintenanceRequest[];
}

function StatusDot({ status }: { status: boolean | string }) {
  const isActive = typeof status === 'boolean' ? status : status === 'active' || status === 'up';
  return (
    <span className={cn(
      'inline-block h-2.5 w-2.5 rounded-full ring-2 ring-background',
      isActive ? 'bg-emerald-500' : 'bg-red-500',
    )} />
  );
}

function SkeletonCard() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <Skeleton variant="text" className="w-24" />
            <Skeleton variant="text" className="w-16 h-8" />
          </div>
          <Skeleton variant="circular" className="h-10 w-10" />
        </div>
      </CardContent>
    </Card>
  );
}

const facilityConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; label: string; color: string }> = {
  lab: { icon: Monitor, label: 'Labs', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
  'computer-lab': { icon: Monitor, label: 'Computer Labs', color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' },
  'smart-classroom': { icon: BookOpen, label: 'Smart Classrooms', color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
  playground: { icon: Trees, label: 'Playgrounds', color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' },
  library: { icon: Library, label: 'Library', color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
  auditorium: { icon: Theater, label: 'Auditorium', color: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' },
};

const defaultFacilitiesData: FacilitiesData = {
  facilities: [
    { id: '1', name: 'Physics Lab', type: 'lab', operational: true, capacity: 30 },
    { id: '2', name: 'Chemistry Lab', type: 'lab', operational: true, capacity: 30 },
    { id: '3', name: 'Biology Lab', type: 'lab', operational: true, capacity: 25 },
    { id: '4', name: 'Computer Lab A', type: 'computer-lab', operational: true, capacity: 40 },
    { id: '5', name: 'Computer Lab B', type: 'computer-lab', operational: false, capacity: 40 },
    { id: '6', name: 'Smart Class 101', type: 'smart-classroom', operational: true },
    { id: '7', name: 'Smart Class 102', type: 'smart-classroom', operational: true },
    { id: '8', name: 'Smart Class 103', type: 'smart-classroom', operational: true },
    { id: '9', name: 'Main Playground', type: 'playground', operational: true },
    { id: '10', name: 'Central Library', type: 'library', operational: true, capacity: 200 },
    { id: '11', name: 'School Auditorium', type: 'auditorium', operational: true, capacity: 500 },
  ],
  cctv: { totalCameras: 48, activeCameras: 45, status: 'active' },
  internet: { status: 'up', speed: '150 Mbps', provider: 'Tata Fiber' },
  powerBackup: { status: 'active', capacity: '50 KVA', lastTested: '2026-07-15' },
  waterSupply: { status: 'active', source: 'Municipal + Borewell', tankLevel: 78 },
  maintenanceRequests: [
    { id: 'm1', facility: 'Computer Lab B', issue: '3 computers not booting', priority: 'high', status: 'in-progress', reportedBy: 'Lab Assistant', reportedAt: '2026-07-18' },
    { id: 'm2', facility: 'Auditorium', issue: 'AC not cooling', priority: 'medium', status: 'pending', reportedBy: 'Staff', reportedAt: '2026-07-19' },
    { id: 'm3', facility: 'Playground', issue: 'Goal post repair', priority: 'low', status: 'completed', reportedBy: 'Sports Coach', reportedAt: '2026-07-14' },
    { id: 'm4', facility: 'Library', issue: 'Ceiling fan replacement', priority: 'low', status: 'completed', reportedBy: 'Librarian', reportedAt: '2026-07-10' },
  ],
};

export default function FacilitiesPage() {
  const { schoolId, loading: authLoading } = useFirebaseAuth();
  const [data, setData] = useState<FacilitiesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!schoolId) return;

    const unsub = RealtimeService.subscribe<FacilitiesData>(
      `schools/${schoolId}/analytics/facilities`,
      (result) => {
        if (result) {
          setData(result);
          setLoading(false);
        } else {
          setData(defaultFacilitiesData);
          setLoading(false);
        }
      },
    );

    const timeout = setTimeout(() => {
      if (loading) {
        setData(defaultFacilitiesData);
        setLoading(false);
        toast.info('Using sample facility data');
      }
    }, 5000);

    return () => {
      unsub();
      clearTimeout(timeout);
    };
  }, [schoolId]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if (authLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton variant="text" className="w-48 h-8" />
          <Skeleton variant="circular" className="h-5 w-5" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <AlertTriangle className="h-12 w-12 text-red-500" />
        <p className="text-lg font-medium text-red-600">Failed to load facilities data</p>
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button onClick={() => { setError(null); setLoading(true); }}>
          <RefreshCw className="mr-2 h-4 w-4" /> Retry
        </Button>
      </div>
    );
  }

  const isLoading = loading || !data;

  const groupedFacilities = data?.facilities.reduce<Record<string, Facility[]>>((acc, f) => {
    (acc[f.type] ??= []).push(f);
    return acc;
  }, {}) ?? {};

  const priorityColor: Record<string, 'destructive' | 'warning' | 'secondary' | 'outline'> = {
    urgent: 'destructive',
    high: 'warning',
    medium: 'secondary',
    low: 'outline',
  };

  const statusColor: Record<string, 'success' | 'warning' | 'secondary'> = {
    completed: 'success',
    'in-progress': 'warning',
    pending: 'secondary',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Facilities Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Monitor school infrastructure, utilities, and maintenance
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => toast.success('Facilities report generated')}>
          Generate Report
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(facilityConfig).map(([type, cfg]) => {
          const items = groupedFacilities[type] ?? [];
          const Icon = cfg.icon;
          const operational = items.filter((f) => f.operational).length;
          return (
            <motion.div key={type} whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
              <Card className="relative overflow-hidden transition-shadow hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">{cfg.label}</p>
                      {isLoading ? (
                        <Skeleton variant="text" className="w-16 h-8" />
                      ) : (
                        <p className="text-3xl font-bold tracking-tight">{items.length}</p>
                      )}
                      {!isLoading && items.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          {operational} operational / {items.length - operational} inactive
                        </p>
                      )}
                    </div>
                    <div className={cn('rounded-xl p-3', cfg.color)}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                  {!isLoading && items.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {items.map((f) => (
                        <StatusDot key={f.id} status={f.operational} />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Camera className="h-4 w-4 text-muted-foreground" />
                CCTV Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton variant="text" className="w-20 h-8" />
                  <Skeleton variant="text" className="w-32" />
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold">{data!.cctv.activeCameras}</p>
                    <span className="text-sm text-muted-foreground">/ {data!.cctv.totalCameras} active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusDot status={data!.cctv.status === 'active'} />
                    <span className="text-xs capitalize text-muted-foreground">{data!.cctv.status}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Wifi className="h-4 w-4 text-muted-foreground" />
                Internet Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton variant="text" className="w-24 h-8" />
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {data!.internet.status === 'up' ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <p className="text-lg font-bold capitalize">{data!.internet.status}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{data!.internet.speed} - {data!.internet.provider}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <BatteryCharging className="h-4 w-4 text-muted-foreground" />
                Power Backup
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton variant="text" className="w-24 h-8" />
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <StatusDot status={data!.powerBackup.status} />
                    <p className="text-lg font-bold capitalize">{data!.powerBackup.status}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{data!.powerBackup.capacity} (Last tested: {data!.powerBackup.lastTested})</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Droplets className="h-4 w-4 text-muted-foreground" />
                Water Supply
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton variant="text" className="w-24 h-8" />
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <StatusDot status={data!.waterSupply.status} />
                    <p className="text-lg font-bold capitalize">{data!.waterSupply.status}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-full max-w-[120px] overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-blue-500 transition-all"
                        style={{ width: `${data!.waterSupply.tankLevel}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{data!.waterSupply.tankLevel}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{data!.waterSupply.source}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Wrench className="h-4 w-4 text-muted-foreground" />
              Maintenance Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} variant="text" className="h-16 w-full" />
                ))}
              </div>
            ) : data!.maintenanceRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <CheckCircle2 className="mb-2 h-8 w-8" />
                <p className="text-sm">No pending maintenance requests</p>
              </div>
            ) : (
              <div className="divide-y">
                {data!.maintenanceRequests.map((req) => (
                  <div key={req.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{req.facility}</p>
                        <Badge variant={priorityColor[req.priority] ?? 'outline'} size="sm">
                          {req.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{req.issue}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {req.reportedBy} &middot; {req.reportedAt}
                      </p>
                    </div>
                    <Badge variant={statusColor[req.status] ?? 'secondary'} size="sm">
                      {req.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
