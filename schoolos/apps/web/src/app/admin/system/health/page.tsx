'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@schoolos/ui';
import { CheckCircle2, AlertTriangle, XCircle, Server, Database, HardDrive, Activity, Mail, Loader2, AlertCircle } from 'lucide-react';

interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'down';
  responseTime: string;
  uptime: string;
  icon: typeof Server;
}

const mockServices: ServiceStatus[] = [
  { name: 'API', status: 'operational', responseTime: '45ms', uptime: '99.97%', icon: Server },
  { name: 'Database', status: 'operational', responseTime: '12ms', uptime: '99.99%', icon: Database },
  { name: 'Cache (Redis)', status: 'operational', responseTime: '2ms', uptime: '100%', icon: HardDrive },
  { name: 'Queue (Bull)', status: 'operational', responseTime: '8ms', uptime: '99.95%', icon: Activity },
  { name: 'Storage (S3)', status: 'degraded', responseTime: '230ms', uptime: '98.50%', icon: Database },
  { name: 'Email (SMTP)', status: 'operational', responseTime: '120ms', uptime: '99.80%', icon: Mail },
];

const statusIcon = (status: ServiceStatus['status']) => {
  switch (status) {
    case 'operational': return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
    case 'degraded': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case 'down': return <XCircle className="h-5 w-5 text-red-500" />;
  }
};

const statusText = (status: ServiceStatus['status']) => {
  switch (status) {
    case 'operational': return 'text-emerald-600';
    case 'degraded': return 'text-yellow-600';
    case 'down': return 'text-red-600';
  }
};

export default function SystemHealthPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(r => setTimeout(r, 500));
      setLoading(false);
    } catch {
      setError('Failed to load');
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <AlertCircle className="h-8 w-8 text-red-500" />
      <p className="text-sm text-muted-foreground">{error}</p>
      <button onClick={fetchData} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Retry</button>
    </div>
  );

  const operationalCount = mockServices.filter(s => s.status === 'operational').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">System Health</h1>
        <p className="text-sm text-muted-foreground mt-1">Real-time system status overview</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{operationalCount}/{mockServices.length}</p>
            <p className="text-sm text-muted-foreground">Services Operational</p>
            <p className="text-xs text-emerald-600 mt-1">All systems normal</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">99.87%</p>
            <p className="text-sm text-muted-foreground">Overall Uptime (30d)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">Active Incidents</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockServices.map((service) => {
          const Icon = service.icon;
          return (
            <Card key={service.name}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{service.name}</p>
                      <p className={`text-xs font-medium mt-0.5 ${statusText(service.status)}`}>
                        {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                      </p>
                    </div>
                  </div>
                  {statusIcon(service.status)}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-muted-foreground dark:border-slate-800">
                  <span>Response: <span className="font-medium text-foreground">{service.responseTime}</span></span>
                  <span>Uptime: <span className="font-medium text-foreground">{service.uptime}</span></span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
