'use client';

import { useState, useEffect } from 'react';
import {
  Save, Upload, Building2, MapPin,
  Sun, Moon, Monitor, Bell, Shield, Palette, Globe2
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@schoolos/ui';
import { toast } from 'sonner';
import { useFirebaseAuth } from '@/features/firebase/hooks/use-firebase-auth';
import { RealtimeService } from '@/features/firebase/services/realtime.service';
import type { SchoolSettings } from '@/features/firebase/types';

export default function SettingsPage() {
  const { schoolId } = useFirebaseAuth();
  const [settings, setSettings] = useState<SchoolSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!schoolId) return;
    const unsub = RealtimeService.subscribe<SchoolSettings>(
      `schools/${schoolId}/settings`, (data) => {
        if (data) setSettings(data);
        setLoading(false);
      },
    );
    return () => unsub();
  }, [schoolId]);

  const handleSave = async () => {
    if (!schoolId || !settings) return;
    setSaving(true);
    try {
      await RealtimeService.update(`schools/${schoolId}/settings`, {
        ...settings,
        updatedAt: new Date().toISOString(),
        updatedBy: schoolId,
      });
      toast.success('Settings saved successfully');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof SchoolSettings, value: unknown) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value as never });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-48 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">School Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your school configuration and preferences</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Changes
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Palette className="h-4 w-4" /> Branding</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">School Logo</label>
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-xl border bg-muted">
                  {settings?.logo ? (
                    <img src={settings.logo} alt="Logo" className="h-full w-full rounded-xl object-cover" />
                  ) : (
                    <Building2 className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <Button variant="outline" size="sm"><Upload className="h-4 w-4 mr-2" />Upload</Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">School Banner</label>
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-40 items-center justify-center rounded-xl border bg-muted">
                  {settings?.banner ? (
                    <img src={settings.banner} alt="Banner" className="h-full w-full rounded-xl object-cover" />
                  ) : (
                    <Palette className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <Button variant="outline" size="sm"><Upload className="h-4 w-4 mr-2" />Upload</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Building2 className="h-4 w-4" /> General Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">School Name</label>
              <Input value={settings?.schoolName || ''} onChange={(e) => updateField('schoolName', e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Board</label>
              <Input value={settings?.board || ''} onChange={(e) => updateField('board', e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">School Type</label>
              <Select value={settings?.schoolType || ''} onValueChange={(v) => updateField('schoolType', v)}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Government School">Government School</SelectItem>
                  <SelectItem value="Government Aided School">Government Aided School</SelectItem>
                  <SelectItem value="Private School">Private School</SelectItem>
                  <SelectItem value="International School">International School</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Principal Name</label>
              <Input value={settings?.principalName || ''} onChange={(e) => updateField('principalName', e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Academic Year</label>
              <Input value={settings?.academicYear || ''} onChange={(e) => updateField('academicYear', e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Contact & Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Address</label>
              <Input value={settings?.address || ''} onChange={(e) => updateField('address', e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input value={settings?.phone || ''} onChange={(e) => updateField('phone', e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" value={settings?.email || ''} onChange={(e) => updateField('email', e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Website</label>
              <Input value={settings?.website || ''} onChange={(e) => updateField('website', e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Globe2 className="h-4 w-4" /> Localization & Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Timezone</label>
              <Select value={settings?.timezone || ''} onValueChange={(v) => updateField('timezone', v)}>
                <SelectTrigger><SelectValue placeholder="Select timezone" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                  <SelectItem value="Asia/Dubai">Asia/Dubai (GST)</SelectItem>
                  <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                  <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Language</label>
              <Select value={settings?.language || ''} onValueChange={(v) => updateField('language', v)}>
                <SelectTrigger><SelectValue placeholder="Select language" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">Hindi</SelectItem>
                  <SelectItem value="gu">Gujarati</SelectItem>
                  <SelectItem value="mr">Marathi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Theme</label>
              <div className="flex gap-2">
                {(['light', 'dark', 'system'] as const).map((t) => (
                  <Button
                    key={t}
                    variant={settings?.theme === t ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateField('theme', t)}
                    className="gap-2 capitalize"
                  >
                    {t === 'light' ? <Sun className="h-4 w-4" /> : t === 'dark' ? <Moon className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
                    {t}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Bell className="h-4 w-4" /> Notification Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { key: 'emailNotifications', label: 'Email Notifications' },
              { key: 'smsNotifications', label: 'SMS Notifications' },
              { key: 'pushNotifications', label: 'Push Notifications' },
              { key: 'attendanceAlerts', label: 'Attendance Alerts' },
              { key: 'feeReminders', label: 'Fee Reminders' },
              { key: 'examNotifications', label: 'Exam Notifications' },
            ].map((n) => (
              <label key={n.key} className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/50">
                <input
                  type="checkbox"
                  checked={(settings?.notificationSettings as Record<string, boolean>)?.[n.key] ?? false}
                  onChange={(e) => updateField('notificationSettings', {
                    ...(settings?.notificationSettings || {}),
                    [n.key]: e.target.checked,
                  })}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium">{n.label}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Shield className="h-4 w-4" /> Feature Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: 'Attendance Settings', value: settings?.attendanceSettings },
              { label: 'Exam Settings', value: settings?.examSettings },
              { label: 'Fee Settings', value: settings?.feeSettings },
              { label: 'Transport Settings', value: settings?.transportSettings },
              { label: 'Library Settings', value: settings?.librarySettings },
            ].map((feature) => (
              <div key={feature.label} className="rounded-lg border p-4">
                <p className="text-sm font-medium">{feature.label}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {feature.value ? 'Configured' : 'Not configured'}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
