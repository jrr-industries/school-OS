'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Plus, Wrench, Monitor, Wifi, BatteryCharging, Droplets,
  Library, BookOpen, Theater, Trees, Camera,
  CheckCircle2, XCircle, AlertTriangle, RefreshCw, Trash2, Edit,
  ClipboardList,
} from 'lucide-react';
import {
  Card, CardHeader, CardTitle, CardContent, Badge, cn, Skeleton, Button, Modal,
} from '@schoolos/ui';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

type UserRole = 'SUPER_ADMIN' | 'SCHOOL_ADMIN' | 'PRINCIPAL' | 'VICE_PRINCIPAL' | 'TEACHER' | 'STAFF' | 'PARENT' | 'STUDENT';

const ASSET_TYPES = [
  { value: 'lab', label: 'Lab' },
  { value: 'computer-lab', label: 'Computer Lab' },
  { value: 'smart-classroom', label: 'Smart Classroom' },
  { value: 'playground', label: 'Playground' },
  { value: 'library', label: 'Library' },
  { value: 'auditorium', label: 'Auditorium' },
  { value: 'classroom', label: 'Classroom' },
  { value: 'sports-facility', label: 'Sports Facility' },
  { value: 'other', label: 'Other' },
] as const;

const PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const;

interface Asset {
  id: string;
  name: string;
  type: string;
  customType?: string;
  operational: boolean;
  capacity?: number;
  description?: string;
  createdAt: string;
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

interface RequestItem {
  id: string;
  assetId: string;
  assetName: string;
  type: 'repair' | 'refill' | 'new';
  issue: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'approved' | 'completed' | 'rejected';
  requestedBy: string;
  requestedByName: string;
  createdAt: string;
}

interface FacilitiesData {
  assets: Asset[];
  cctv: CctvStatus;
  internet: InternetStatus;
  powerBackup: PowerBackup;
  waterSupply: WaterSupply;
  requests: RequestItem[];
}

const assetIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  lab: Monitor,
  'computer-lab': Monitor,
  'smart-classroom': BookOpen,
  playground: Trees,
  library: Library,
  auditorium: Theater,
  classroom: BookOpen,
  'sports-facility': Trees,
  other: ClipboardList,
};

const assetColorMap: Record<string, string> = {
  lab: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  'computer-lab': 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
  'smart-classroom': 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  playground: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  library: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  auditorium: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
  classroom: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
  'sports-facility': 'bg-lime-100 text-lime-600 dark:bg-lime-900/30 dark:text-lime-400',
  other: 'bg-slate-100 text-slate-600 dark:bg-slate-900/30 dark:text-slate-400',
};

const requestTypeLabels: Record<string, string> = {
  repair: 'Repair',
  refill: 'Refill',
  new: 'New Item',
};

const priorityColors: Record<string, 'destructive' | 'warning' | 'secondary' | 'outline'> = {
  urgent: 'destructive',
  high: 'warning',
  medium: 'secondary',
  low: 'outline',
};

const requestStatusColors: Record<string, 'success' | 'warning' | 'secondary' | 'destructive' | 'default'> = {
  completed: 'success',
  approved: 'warning',
  pending: 'secondary',
  rejected: 'destructive',
};

function StatusDot({ status }: { status: boolean | string }) {
  const isActive = typeof status === 'boolean' ? status : status === 'active' || status === 'up';
  return (
    <span className={cn(
      'inline-block h-2.5 w-2.5 rounded-full ring-2 ring-background',
      isActive ? 'bg-emerald-500' : 'bg-red-500',
    )} />
  );
}

function genId() {
  return Math.random().toString(36).substring(2, 10);
}

export default function FacilitiesPage() {
  const [data, setData] = useState<FacilitiesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [activeTab, setActiveTab] = useState<'assets' | 'requests' | 'monitoring'>('assets');

  const [showAddAsset, setShowAddAsset] = useState(false);
  const [editAsset, setEditAsset] = useState<Asset | null>(null);
  const [showNewRequest, setShowNewRequest] = useState(false);

  const [assetForm, setAssetForm] = useState({ name: '', type: 'lab', customType: '', operational: true, capacity: '', description: '' });
  const [requestForm, setRequestForm] = useState({ assetId: '', type: 'repair' as 'repair' | 'refill' | 'new', issue: '', priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent' });

  const canManageAssets = userRole === 'SCHOOL_ADMIN' || userRole === 'PRINCIPAL' || userRole === 'VICE_PRINCIPAL';
  const canRequest = userRole === 'TEACHER' || userRole === 'STAFF' || userRole === 'SCHOOL_ADMIN' || userRole === 'PRINCIPAL' || userRole === 'VICE_PRINCIPAL';

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/school-admin/facilities');
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch {
      toast.error('Failed to load facilities data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch('/api/auth/session')
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          setUserRole(json.data.role);
          setUserName(json.data.name);
          setUserId(json.data.id);
        }
      })
      .catch(() => {});
    fetchData();
  }, [fetchData]);

  async function saveData(updated: FacilitiesData) {
    const res = await fetch('/api/school-admin/facilities', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
    const json = await res.json();
    if (json.success) {
      setData(updated);
      return true;
    }
    toast.error('Failed to save');
    return false;
  }

  async function handleAddAsset() {
    if (!assetForm.name.trim()) { toast.error('Asset name is required'); return; }
    if (!data) return;
    const newAsset: Asset = {
      id: genId(),
      name: assetForm.name.trim(),
      type: assetForm.type === 'other' && assetForm.customType.trim() ? assetForm.customType.trim() : assetForm.type,
      customType: assetForm.type === 'other' && assetForm.customType.trim() ? assetForm.customType.trim() : undefined,
      operational: assetForm.operational,
      capacity: assetForm.capacity ? Number(assetForm.capacity) : undefined,
      description: assetForm.description.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    const updated = { ...data, assets: [...data.assets, newAsset] };
    if (await saveData(updated)) {
      toast.success('Asset added');
      setShowAddAsset(false);
      setAssetForm({ name: '', type: 'lab', customType: '', operational: true, capacity: '', description: '' });
    }
  }

  async function handleEditAsset() {
    if (!editAsset || !data) return;
    const normalized = {
      ...editAsset,
      type: editAsset.customType || editAsset.type,
      customType: editAsset.customType || undefined,
    };
    const updated = {
      ...data,
      assets: data.assets.map((a) => (a.id === editAsset.id ? normalized : a)),
    };
    if (await saveData(updated)) {
      toast.success('Asset updated');
      setEditAsset(null);
    }
  }

  async function handleDeleteAsset(id: string) {
    if (!data) return;
    const updated = { ...data, assets: data.assets.filter((a) => a.id !== id) };
    if (await saveData(updated)) toast.success('Asset deleted');
  }

  async function handleSubmitRequest() {
    if (!requestForm.assetId || !requestForm.issue.trim()) { toast.error('Select an asset and describe the issue'); return; }
    if (!data) return;
    const asset = data.assets.find((a) => a.id === requestForm.assetId);
    const newReq: RequestItem = {
      id: genId(),
      assetId: requestForm.assetId,
      assetName: asset?.name || 'Unknown',
      type: requestForm.type,
      issue: requestForm.issue.trim(),
      priority: requestForm.priority,
      status: 'pending',
      requestedBy: userId,
      requestedByName: userName,
      createdAt: new Date().toISOString(),
    };
    const updated = { ...data, requests: [newReq, ...data.requests] };
    if (await saveData(updated)) {
      toast.success('Request submitted');
      setShowNewRequest(false);
      setRequestForm({ assetId: '', type: 'repair', issue: '', priority: 'medium' });
    }
  }

  async function handleRequestAction(reqId: string, status: RequestItem['status']) {
    if (!data) return;
    const updated = {
      ...data,
      requests: data.requests.map((r) => (r.id === reqId ? { ...r, status } : r)),
    };
    if (await saveData(updated)) toast.success(`Request ${status}`);
  }

  if (loading && !data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton variant="text" className="h-8 w-48" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}><CardContent className="p-6"><div className="space-y-3"><Skeleton variant="text" className="w-24" /><Skeleton variant="text" className="h-8 w-16" /></div></CardContent></Card>
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <AlertTriangle className="h-12 w-12 text-red-500" />
        <p className="text-lg font-medium text-red-600">Failed to load facilities data</p>
        <Button onClick={fetchData}><RefreshCw className="mr-2 h-4 w-4" /> Retry</Button>
      </div>
    );
  }

  const tabs = [
    { id: 'assets' as const, label: 'Assets', count: data.assets.length, icon: Monitor },
    { id: 'requests' as const, label: 'Requests', count: data.requests.length, icon: Wrench },
    { id: 'monitoring' as const, label: 'Monitoring', icon: Camera },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Facilities</h1>
          <p className="text-sm text-muted-foreground">Manage school assets and submit maintenance requests</p>
        </div>
        <div className="flex items-center gap-2">
          {canManageAssets && (
            <Button size="sm" onClick={() => setShowAddAsset(true)}>
              <Plus className="mr-1 h-4 w-4" /> Add Asset
            </Button>
          )}
          {canRequest && (
            <Button variant="outline" size="sm" onClick={() => setShowNewRequest(true)}>
              <Wrench className="mr-1 h-4 w-4" /> New Request
            </Button>
          )}
        </div>
      </div>

      <div className="flex gap-1 rounded-lg border p-1 bg-muted/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              activeTab === tab.id ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
            {tab.count !== undefined && (
              <Badge variant="secondary" size="sm">{tab.count}</Badge>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'assets' && (
        <>
          {data.assets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <ClipboardList className="mb-2 h-8 w-8" />
              <p className="text-sm">No assets added yet</p>
              {canManageAssets && (
                <Button variant="outline" size="sm" className="mt-3" onClick={() => setShowAddAsset(true)}>
                  <Plus className="mr-1 h-4 w-4" /> Add First Asset
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.assets.map((asset) => {
                const Icon = assetIconMap[asset.type] || ClipboardList;
                const color = assetColorMap[asset.type] || 'bg-slate-100 text-slate-600';
                return (
                  <motion.div key={asset.id} whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                    <Card className="relative overflow-hidden transition-shadow hover:shadow-lg">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              {ASSET_TYPES.find((t) => t.value === asset.type)?.label || asset.type}
                            </p>
                            <p className="font-semibold">{asset.name}</p>
                            <div className="flex items-center gap-2">
                              <StatusDot status={asset.operational} />
                              <span className="text-xs text-muted-foreground">
                                {asset.operational ? 'Operational' : 'Inactive'}
                              </span>
                            </div>
                            {asset.capacity && (
                              <p className="text-xs text-muted-foreground">Capacity: {asset.capacity}</p>
                            )}
                            {asset.description && (
                              <p className="text-xs text-muted-foreground line-clamp-2">{asset.description}</p>
                            )}
                          </div>
                          <div className={cn('rounded-xl p-3', color)}>
                            <Icon className="h-5 w-5" />
                          </div>
                        </div>
                        {canManageAssets && (
                          <div className="mt-3 flex items-center gap-1.5 border-t pt-3">
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => setEditAsset(asset)}>
                              <Edit className="mr-1 h-3 w-3" /> Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-red-500 hover:text-red-600" onClick={() => handleDeleteAsset(asset.id)}>
                              <Trash2 className="mr-1 h-3 w-3" /> Delete
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </>
      )}

      {activeTab === 'requests' && (
        <>
          {data.requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <CheckCircle2 className="mb-2 h-8 w-8" />
              <p className="text-sm">No requests submitted</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.requests.map((req) => (
                <Card key={req.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{req.assetName}</p>
                          <Badge variant={priorityColors[req.priority]} size="sm">{req.priority}</Badge>
                          <Badge variant="outline" size="sm">{requestTypeLabels[req.type]}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{req.issue}</p>
                        <p className="text-xs text-muted-foreground">
                          {req.requestedByName} &middot; {new Date(req.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant={requestStatusColors[req.status]} size="sm" className="capitalize">{req.status}</Badge>
                        {canManageAssets && req.status === 'pending' && (
                          <>
                            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => handleRequestAction(req.id, 'approved')}>Approve</Button>
                            <Button variant="outline" size="sm" className="h-7 text-xs text-red-500" onClick={() => handleRequestAction(req.id, 'rejected')}>Reject</Button>
                          </>
                        )}
                        {canManageAssets && req.status === 'approved' && (
                          <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => handleRequestAction(req.id, 'completed')}>Complete</Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'monitoring' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Camera className="h-4 w-4 text-muted-foreground" /> CCTV Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{data.cctv.activeCameras}</p>
                  <span className="text-sm text-muted-foreground">/ {data.cctv.totalCameras} active</span>
                </div>
                <div className="flex items-center gap-2">
                  <StatusDot status={data.cctv.status === 'active'} />
                  <span className="text-xs capitalize text-muted-foreground">{data.cctv.status}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Wifi className="h-4 w-4 text-muted-foreground" /> Internet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {data.internet.status === 'up' ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <p className="text-lg font-bold capitalize">{data.internet.status}</p>
                </div>
                <p className="text-xs text-muted-foreground">{data.internet.speed} &middot; {data.internet.provider}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <BatteryCharging className="h-4 w-4 text-muted-foreground" /> Power Backup
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <StatusDot status={data.powerBackup.status} />
                  <p className="text-lg font-bold capitalize">{data.powerBackup.status}</p>
                </div>
                <p className="text-xs text-muted-foreground">{data.powerBackup.capacity} (Last tested: {data.powerBackup.lastTested})</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Droplets className="h-4 w-4 text-muted-foreground" /> Water Supply
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <StatusDot status={data.waterSupply.status} />
                  <p className="text-lg font-bold capitalize">{data.waterSupply.status}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-full max-w-[120px] overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${data.waterSupply.tankLevel}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground">{data.waterSupply.tankLevel}%</span>
                </div>
                <p className="text-xs text-muted-foreground">{data.waterSupply.source}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Modal open={showAddAsset} onOpenChange={setShowAddAsset}>
        <Card className="w-full max-w-md">
          <CardHeader><CardTitle>Add Asset</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <input className="mt-1 w-full rounded-md border px-3 py-2 text-sm" placeholder="e.g. Physics Lab A" value={assetForm.name} onChange={(e) => setAssetForm({ ...assetForm, name: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium">Type</label>
              <select className="mt-1 w-full rounded-md border px-3 py-2 text-sm" value={assetForm.type} onChange={(e) => setAssetForm({ ...assetForm, type: e.target.value })}>
                {ASSET_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              {assetForm.type === 'other' && (
                <input className="mt-2 w-full rounded-md border px-3 py-2 text-sm" placeholder="Specify type..." value={assetForm.customType} onChange={(e) => setAssetForm({ ...assetForm, customType: e.target.value })} />
              )}
            </div>
            <div>
              <label className="text-sm font-medium">Capacity (optional)</label>
              <input className="mt-1 w-full rounded-md border px-3 py-2 text-sm" type="number" placeholder="e.g. 40" value={assetForm.capacity} onChange={(e) => setAssetForm({ ...assetForm, capacity: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium">Description (optional)</label>
              <textarea className="mt-1 w-full rounded-md border px-3 py-2 text-sm" rows={3} placeholder="Brief description..." value={assetForm.description} onChange={(e) => setAssetForm({ ...assetForm, description: e.target.value })} />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={assetForm.operational} onChange={(e) => setAssetForm({ ...assetForm, operational: e.target.checked })} />
              Operational
            </label>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddAsset(false)}>Cancel</Button>
              <Button onClick={handleAddAsset}>Add Asset</Button>
            </div>
          </CardContent>
        </Card>
      </Modal>

      <Modal open={!!editAsset} onOpenChange={(v) => !v && setEditAsset(null)}>
        {editAsset && (
          <Card className="w-full max-w-md">
            <CardHeader><CardTitle>Edit Asset</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <input className="mt-1 w-full rounded-md border px-3 py-2 text-sm" value={editAsset.name} onChange={(e) => setEditAsset({ ...editAsset, name: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium">Type</label>
                <select className="mt-1 w-full rounded-md border px-3 py-2 text-sm" value={editAsset.customType ? 'other' : editAsset.type} onChange={(e) => setEditAsset({ ...editAsset, type: e.target.value, customType: e.target.value === 'other' ? editAsset.customType || '' : undefined })}>
                  {ASSET_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
                {editAsset.customType !== undefined && (
                  <input className="mt-2 w-full rounded-md border px-3 py-2 text-sm" placeholder="Specify type..." value={editAsset.customType} onChange={(e) => setEditAsset({ ...editAsset, customType: e.target.value, type: e.target.value })} />
                )}
              </div>
              <div>
                <label className="text-sm font-medium">Capacity (optional)</label>
                <input className="mt-1 w-full rounded-md border px-3 py-2 text-sm" type="number" value={editAsset.capacity ?? ''} onChange={(e) => setEditAsset({ ...editAsset, capacity: e.target.value ? Number(e.target.value) : undefined })} />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea className="mt-1 w-full rounded-md border px-3 py-2 text-sm" rows={3} value={editAsset.description || ''} onChange={(e) => setEditAsset({ ...editAsset, description: e.target.value })} />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editAsset.operational} onChange={(e) => setEditAsset({ ...editAsset, operational: e.target.checked })} />
                Operational
              </label>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditAsset(null)}>Cancel</Button>
                <Button onClick={handleEditAsset}>Save</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </Modal>

      <Modal open={showNewRequest} onOpenChange={setShowNewRequest}>
        <Card className="w-full max-w-md">
          <CardHeader><CardTitle>New Request</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Asset</label>
              <select className="mt-1 w-full rounded-md border px-3 py-2 text-sm" value={requestForm.assetId} onChange={(e) => setRequestForm({ ...requestForm, assetId: e.target.value })}>
                <option value="">Select an asset...</option>
                {data.assets.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Request Type</label>
              <select className="mt-1 w-full rounded-md border px-3 py-2 text-sm" value={requestForm.type} onChange={(e) => setRequestForm({ ...requestForm, type: e.target.value as 'repair' | 'refill' | 'new' })}>
                <option value="repair">Repair</option>
                <option value="refill">Refill</option>
                <option value="new">New Item</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Priority</label>
              <select className="mt-1 w-full rounded-md border px-3 py-2 text-sm" value={requestForm.priority} onChange={(e) => setRequestForm({ ...requestForm, priority: e.target.value as 'low' | 'medium' | 'high' | 'urgent' })}>
                {PRIORITIES.map((p) => <option key={p} value={p} className="capitalize">{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Describe the issue</label>
              <textarea className="mt-1 w-full rounded-md border px-3 py-2 text-sm" rows={3} placeholder="What needs to be done?" value={requestForm.issue} onChange={(e) => setRequestForm({ ...requestForm, issue: e.target.value })} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewRequest(false)}>Cancel</Button>
              <Button onClick={handleSubmitRequest}>Submit Request</Button>
            </div>
          </CardContent>
        </Card>
      </Modal>
    </motion.div>
  );
}
