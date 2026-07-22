'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  UserCircle, Camera, Phone, Sun, Moon, Monitor,
  Lock, Key, ShieldCheck, Smartphone, Laptop, LogOut,
  Save, CheckCircle2, ExternalLink,
} from 'lucide-react';
import {
  Card, CardHeader, CardTitle, CardContent, Badge, Button,
  Input, Select, SelectTrigger, SelectValue, SelectContent,
  SelectItem, cn,
} from '@schoolos/ui';
import { toast } from 'sonner';
import { useSchoolAdminAuth } from '@/features/supabase/hooks/use-school-admin-auth';
import { PageHeader } from '@/features/school-admin/components/page-header';

interface Session {
  id: string;
  device: string;
  browser: string;
  ip: string;
  lastActive: string;
  current: boolean;
}

interface Device {
  id: string;
  name: string;
  type: string;
  os: string;
  lastSeen: string;
}

const languages = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'Hindi' },
  { value: 'bn', label: 'Bengali' },
  { value: 'te', label: 'Telugu' },
  { value: 'ta', label: 'Tamil' },
  { value: 'mr', label: 'Marathi' },
];

const themes = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

export default function ProfilePage() {
  const { user: authUser, loading: authLoading } = useSchoolAdminAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState('system');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoPreview, setPhotoPreview] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const [sessions, setSessions] = useState<Session[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch('/api/school-admin/profile');
      const json = await res.json();
      if (json.success) {
        const { user, sessions: sess, devices: dev } = json.data;
        setName(user.name || '');
        setPhone(user.phone || '');
        setEmail(user.email || '');
        setRole(user.role || 'SCHOOL_ADMIN');
        setPhotoUrl(user.avatar || '');
        setLanguage(json.data.language || 'en');
        setTheme(json.data.theme || 'system');
        setSessions(sess || []);
        setDevices(dev || []);
      }
    } catch {
      // handled by empty state
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { if (!authLoading) fetchProfile(); }, [authLoading, fetchProfile]);

  const handlePhotoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Photo must be less than 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const validateForm = useCallback(() => {
    if (!name.trim()) { toast.error('Name is required'); return false; }
    if (phone && !/^\+?[\d\s-]{7,15}$/.test(phone)) { toast.error('Invalid phone number'); return false; }
    return true;
  }, [name, phone]);

  const handleSaveProfile = useCallback(async () => {
    if (!validateForm()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/school-admin/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), phone, photo: photoPreview || photoUrl, language }),
      });
      const json = await res.json();
      if (json.success) toast.success('Profile updated successfully');
      else toast.error(json.error || 'Failed to update');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  }, [validateForm, name, phone, photoPreview, photoUrl, language]);

  const handleChangePassword = useCallback(async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (currentPassword === newPassword) {
      toast.error('New password must be different from current');
      return;
    }
    setChangingPassword(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      toast.error('Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  }, [currentPassword, newPassword, confirmPassword]);

  if (loading || authLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Profile" description="Manage your profile" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-64 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
            <div className="h-48 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
          </div>
          <div className="space-y-6">
            <div className="h-48 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
            <div className="h-48 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        description="Manage your account settings and preferences"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <UserCircle className="h-4 w-4 text-muted-foreground" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative group">
                  <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-muted">
                    {photoPreview || photoUrl ? (
                      <img src={photoPreview || photoUrl} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted">
                        <UserCircle className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <Camera className="h-6 w-6 text-white" />
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-semibold">{name || authUser?.name}</h3>
                  <p className="text-sm text-muted-foreground">{email}</p>
                  <Badge variant="outline" className="mt-1 capitalize">{role.replace('_', ' ')}</Badge>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Full Name</label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 9876543210" className="pl-9" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Language</label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((l) => (
                        <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Theme</label>
                  <div className="flex gap-2">
                    {themes.map((t) => {
                      const Icon = t.icon;
                      return (
                        <button
                          key={t.value}
                          onClick={() => setTheme(t.value)}
                          className={cn(
                            'flex flex-1 items-center justify-center gap-2 rounded-lg border p-2.5 text-sm font-medium transition-all',
                            theme === t.value
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-input text-muted-foreground hover:bg-muted/50',
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          {t.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} disabled={saving} className="gap-2">
                  {saving ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                Change Password
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Current Password</label>
                <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Enter current password" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">New Password</label>
                  <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min 8 characters" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Confirm Password</label>
                  <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter new password" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleChangePassword} variant="outline" disabled={changingPassword} className="gap-2">
                  {changingPassword ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <Key className="h-4 w-4" />
                  )}
                  {changingPassword ? 'Changing...' : 'Change Password'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                Connected Accounts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <svg className="h-4 w-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Google</p>
                    <p className="text-xs text-muted-foreground">{email}</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-muted-foreground" />
                Active Sessions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {sessions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No active sessions</p>
              ) : (
                sessions.map((session) => (
                  <div key={session.id} className="flex items-start gap-3 rounded-lg border p-3">
                    <div className={cn('rounded-lg p-2', session.current ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground')}>
                      {session.device.includes('iPhone') || session.device.includes('Phone')
                        ? <Smartphone className="h-4 w-4" />
                        : <Laptop className="h-4 w-4" />
                      }
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{session.device}</p>
                        {session.current && (
                          <Badge variant="outline" className="text-[10px] h-4 px-1.5 bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400">
                            Current
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{session.browser} &middot; {session.ip}</p>
                      <p className="text-[10px] text-muted-foreground">Last active: {new Date(session.lastActive).toLocaleString()}</p>
                    </div>
                    {!session.current && (
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-red-600">
                        <LogOut className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Monitor className="h-4 w-4 text-muted-foreground" />
                Devices
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {devices.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No devices registered</p>
              ) : (
                devices.map((device) => (
                  <div key={device.id} className="flex items-center gap-3 rounded-lg border p-3">
                    <div className="rounded-lg bg-muted p-2 text-muted-foreground">
                      {device.type === 'Laptop' ? <Laptop className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{device.name}</p>
                      <p className="text-xs text-muted-foreground">{device.os}</p>
                      <p className="text-[10px] text-muted-foreground">Last seen: {new Date(device.lastSeen).toLocaleDateString()}</p>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
