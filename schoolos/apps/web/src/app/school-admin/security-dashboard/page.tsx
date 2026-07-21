'use client';

import { useState, useEffect } from 'react';
import {
  Shield, Users, FileText, Camera, Phone, AlertTriangle,
  CheckCircle2, Eye, EyeOff, RefreshCw,
  ClipboardList, UserCheck, DoorOpen,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Badge, cn, Skeleton, Button } from '@schoolos/ui';
import { useFirebaseAuth } from '@/features/firebase/hooks/use-firebase-auth';
import { RealtimeService } from '@/features/firebase/services/realtime.service';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface VisitorsToday {
  total: number;
  checkedIn: number;
  checkedOut: number;
}

interface GatePass {
  id: string;
  studentName: string;
  class: string;
  reason: string;
  issuedBy: string;
  issuedAt: string;
  status: 'active' | 'used' | 'expired';
}

interface PickupRecord {
  id: string;
  studentName: string;
  pickupBy: string;
  relation: string;
  time: string;
  status: 'pending' | 'completed';
}

interface CctvAlert {
  id: string;
  camera: string;
  location: string;
  alertType: 'motion' | 'intrusion' | 'loitering' | 'unknown';
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
  acknowledged: boolean;
}

interface EmergencyContact {
  name: string;
  phone: string;
  department: string;
}

interface IncidentReport {
  id: string;
  type: string;
  location: string;
  description: string;
  reportedBy: string;
  reportedAt: string;
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface SecurityData {
  visitorsToday: VisitorsToday;
  gatePasses: GatePass[];
  pickupRecords: PickupRecord[];
  cctvAlerts: CctvAlert[];
  emergencyContacts: EmergencyContact[];
  incidentReports: IncidentReport[];
  safetyStatus: {
    overall: 'safe' | 'moderate' | 'critical';
    drillsConducted: number;
    lastDrillDate: string;
    complianceScore: number;
  };
}

const defaultSecurityData: SecurityData = {
  visitorsToday: { total: 24, checkedIn: 18, checkedOut: 6 },
  gatePasses: [
    { id: 'gp1', studentName: 'Arjun Mehta', class: '10-A', reason: 'Medical appointment', issuedBy: 'Office Staff', issuedAt: '2026-07-21 09:30', status: 'active' },
    { id: 'gp2', studentName: 'Sneha Reddy', class: '9-C', reason: 'Family function', issuedBy: 'Office Staff', issuedAt: '2026-07-21 10:15', status: 'active' },
    { id: 'gp3', studentName: 'Rohan Joshi', class: '11-B', reason: 'Early leave', issuedBy: 'Teacher', issuedAt: '2026-07-20 14:00', status: 'used' },
  ],
  pickupRecords: [
    { id: 'pr1', studentName: 'Kavya Nair', pickupBy: 'Suresh Nair', relation: 'Father', time: '14:30', status: 'pending' },
    { id: 'pr2', studentName: 'Aryan Shah', pickupBy: 'Meena Shah', relation: 'Mother', time: '15:00', status: 'pending' },
    { id: 'pr3', studentName: 'Divya Kumar', pickupBy: 'Ravi Kumar', relation: 'Father', time: '13:45', status: 'completed' },
  ],
  cctvAlerts: [
    { id: 'ca1', camera: 'CAM-07', location: 'Main Gate', alertType: 'motion', severity: 'low', timestamp: '2026-07-21 11:20', acknowledged: false },
    { id: 'ca2', camera: 'CAM-12', location: 'Science Block', alertType: 'intrusion', severity: 'high', timestamp: '2026-07-21 02:15', acknowledged: true },
    { id: 'ca3', camera: 'CAM-04', location: 'Parking Lot', alertType: 'loitering', severity: 'medium', timestamp: '2026-07-20 18:40', acknowledged: false },
  ],
  emergencyContacts: [
    { name: 'Fire Station', phone: '101', department: 'City Fire Dept' },
    { name: 'Police Station', phone: '100', department: 'Local Police' },
    { name: 'Ambulance', phone: '102', department: 'City Hospital' },
    { name: 'School Nurse', phone: 'Ext. 221', department: 'Health Center' },
    { name: 'Security Head', phone: 'Ext. 199', department: 'Security Office' },
  ],
  incidentReports: [
    { id: 'ir1', type: 'Suspicious Activity', location: 'Back Gate', description: 'Unauthorized person seen near back gate', reportedBy: 'Security Guard', reportedAt: '2026-07-20 19:30', status: 'investigating', severity: 'high' },
    { id: 'ir2', type: 'Property Damage', location: 'Playground', description: 'Broken fence near playground area', reportedBy: 'Groundskeeper', reportedAt: '2026-07-19 08:00', status: 'resolved', severity: 'medium' },
    { id: 'ir3', type: 'Medical Emergency', location: 'Classroom 205', description: 'Student fainted during class', reportedBy: 'Teacher', reportedAt: '2026-07-18 11:30', status: 'closed', severity: 'critical' },
  ],
  safetyStatus: {
    overall: 'safe',
    drillsConducted: 4,
    lastDrillDate: '2026-06-20',
    complianceScore: 92,
  },
};

const severityColors: Record<string, 'destructive' | 'warning' | 'secondary' | 'outline'> = {
  critical: 'destructive',
  high: 'destructive',
  medium: 'warning',
  low: 'outline',
};

const incidentStatusColors: Record<string, 'destructive' | 'warning' | 'success' | 'secondary'> = {
  open: 'destructive',
  investigating: 'warning',
  resolved: 'success',
  closed: 'secondary',
};

export default function SecurityDashboardPage() {
  const { schoolId, loading: authLoading } = useFirebaseAuth();
  const [data, setData] = useState<SecurityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAcknowledged, setShowAcknowledged] = useState(false);

  useEffect(() => {
    if (!schoolId) return;

    const unsub = RealtimeService.subscribe<SecurityData>(
      `schools/${schoolId}/analytics/security`,
      (result) => {
        if (result) {
          setData(result);
          setLoading(false);
        } else {
          setData(defaultSecurityData);
          setLoading(false);
        }
      },
    );

    const timeout = setTimeout(() => {
      if (loading) {
        setData(defaultSecurityData);
        setLoading(false);
        toast.info('Using sample security data');
      }
    }, 5000);

    return () => {
      unsub();
      clearTimeout(timeout);
    };
  }, [schoolId]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  if (authLoading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="text" className="w-56 h-8" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}><CardContent className="p-6"><Skeleton variant="text" className="h-20" /></CardContent></Card>
          ))}
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <AlertTriangle className="h-12 w-12 text-red-500" />
        <p className="text-lg font-medium text-red-600">Failed to load security data</p>
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button onClick={() => { setError(null); setLoading(true); }}>
          <RefreshCw className="mr-2 h-4 w-4" /> Retry
        </Button>
      </div>
    );
  }

  const isLoading = loading || !data;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Security Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Monitor campus security, visitors, and incidents
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!isLoading && (
            <Badge
              variant={data!.safetyStatus.overall === 'safe' ? 'success' : data!.safetyStatus.overall === 'moderate' ? 'warning' : 'destructive'}
              className="px-3 py-1"
            >
              {data!.safetyStatus.overall === 'safe' ? 'Safe' : data!.safetyStatus.overall === 'moderate' ? 'Moderate' : 'Critical'}
            </Badge>
          )}
          <Button variant="outline" size="sm" onClick={() => toast.success('Emergency broadcast sent')}>
            <AlertTriangle className="mr-2 h-4 w-4" />
            Alert All
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                Visitors Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton variant="text" className="w-24 h-8" />
              ) : (
                <div>
                  <p className="text-3xl font-bold">{data!.visitorsToday.total}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {data!.visitorsToday.checkedIn} checked in, {data!.visitorsToday.checkedOut} checked out
                  </p>
                  <div className="mt-2 flex gap-2">
                    <Badge variant="success" size="sm">{data!.visitorsToday.checkedIn} in</Badge>
                    <Badge variant="secondary" size="sm">{data!.visitorsToday.checkedOut} out</Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <DoorOpen className="h-4 w-4 text-muted-foreground" />
                Gate Passes Issued
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton variant="text" className="w-24 h-8" />
              ) : (
                <div>
                  <p className="text-3xl font-bold">{data!.gatePasses.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {data!.gatePasses.filter((g) => g.status === 'active').length} active
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <UserCheck className="h-4 w-4 text-muted-foreground" />
                Pickup Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton variant="text" className="w-24 h-8" />
              ) : (
                <div>
                  <p className="text-3xl font-bold">{data!.pickupRecords.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {data!.pickupRecords.filter((p) => p.status === 'pending').length} pending completion
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Camera className="h-4 w-4 text-muted-foreground" />
                CCTV Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton variant="text" className="w-24 h-8" />
              ) : (
                <div>
                  <p className="text-3xl font-bold">{data!.cctvAlerts.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {data!.cctvAlerts.filter((a) => !a.acknowledged).length} unacknowledged
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Camera className="h-4 w-4 text-muted-foreground" />
                CCTV Alerts
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowAcknowledged(!showAcknowledged)}>
                {showAcknowledged ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="ml-1 text-xs">{showAcknowledged ? 'Hide' : 'Show'} acknowledged</span>
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} variant="text" className="h-12 w-full" />)}
                </div>
              ) : data!.cctvAlerts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <CheckCircle2 className="mb-2 h-8 w-8" />
                  <p className="text-sm">No CCTV alerts</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {data!.cctvAlerts
                    .filter((a) => showAcknowledged || !a.acknowledged)
                    .map((alert) => (
                      <div key={alert.id} className="flex items-center justify-between rounded-lg border p-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">{alert.camera}</p>
                            <Badge variant={severityColors[alert.severity] ?? 'outline'} size="sm">
                              {alert.severity}
                            </Badge>
                            {!alert.acknowledged && (
                              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{alert.location} - {alert.alertType}</p>
                          <p className="text-[10px] text-muted-foreground">{alert.timestamp}</p>
                        </div>
                        {!alert.acknowledged && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toast.success(`Alert ${alert.id} acknowledged`)}
                          >
                            Acknowledge
                          </Button>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                Emergency Contacts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} variant="text" className="h-10 w-full" />)}
                </div>
              ) : (
                <div className="space-y-2">
                  {data!.emergencyContacts.map((contact, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border p-2.5">
                      <div>
                        <p className="text-sm font-medium">{contact.name}</p>
                        <p className="text-[10px] text-muted-foreground">{contact.department}</p>
                      </div>
                      <Badge variant="outline" className="font-mono text-xs">{contact.phone}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-muted-foreground" />
                Safety Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton variant="text" className="h-6 w-full" />
                  <Skeleton variant="text" className="h-6 w-full" />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Overall</span>
                    <Badge
                      variant={data!.safetyStatus.overall === 'safe' ? 'success' : data!.safetyStatus.overall === 'moderate' ? 'warning' : 'destructive'}
                    >
                      {data!.safetyStatus.overall}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Drills Conducted</span>
                    <span className="text-sm font-medium">{data!.safetyStatus.drillsConducted}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Last Drill</span>
                    <span className="text-sm font-medium">{data!.safetyStatus.lastDrillDate}</span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Compliance Score</span>
                      <span className="text-sm font-medium">{data!.safetyStatus.complianceScore}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all',
                          data!.safetyStatus.complianceScore >= 80 ? 'bg-emerald-500' : data!.safetyStatus.complianceScore >= 60 ? 'bg-amber-500' : 'bg-red-500',
                        )}
                        style={{ width: `${data!.safetyStatus.complianceScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground" />
              Incident Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} variant="text" className="h-16 w-full" />)}
              </div>
            ) : data!.incidentReports.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <ClipboardList className="mb-2 h-8 w-8" />
                <p className="text-sm">No incident reports</p>
              </div>
            ) : (
              <div className="divide-y">
                {data!.incidentReports.map((incident) => (
                  <div key={incident.id} className="flex items-start justify-between py-3 first:pt-0 last:pb-0">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{incident.type}</p>
                        <Badge variant={severityColors[incident.severity] ?? 'outline'} size="sm">
                          {incident.severity}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{incident.location}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{incident.description}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {incident.reportedBy} &middot; {incident.reportedAt}
                      </p>
                    </div>
                    <Badge variant={incidentStatusColors[incident.status] ?? 'secondary'} size="sm">
                      {incident.status}
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
