// ============================================================
// Temporary Development Authentication - Login Page
// This will be replaced with Supabase Auth / JWT in production
// ============================================================

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@schoolos/ui';
import { Eye, EyeOff, School, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <DevLoginPage />
    </Suspense>
  );
}

function DevLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (searchParams.get('error') === 'access_denied') {
      setError('Access denied. You do not have permission to access that page.');
      fetch('/api/auth/dev-logout', { method: 'POST' }).catch(() => {});
    }
  }, [searchParams]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/dev-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.error ?? 'Login failed');
        setIsLoading(false);
        return;
      }

      const redirectTo = result.data?.user?.role === 'SCHOOL_ADMIN'
        ? '/school-admin/dashboard'
        : '/admin/dashboard';
      router.push(redirectTo);
    } catch {
      setError('Network error. Please try again.');
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4 dark:from-slate-950 dark:to-slate-900">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <School className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to SchoolOS</CardTitle>
          <CardDescription>
            Sign in to your admin account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
                <button
                  type="button"
                  onClick={() => { setError(''); }}
                  className="ml-auto shrink-0 text-destructive/70 hover:text-destructive"
                  title="Dismiss"
                >
                  &times;
                </button>
              </div>
            )}

            <Input
              label="Email"
              type="email"
              placeholder="admin@schoolos.dev"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer select-none">
                Remember me
              </label>
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex-col border-t px-6 py-4">
          <div className="mb-3 grid w-full grid-cols-3 gap-2">
            {([
              { slug: 'super_admin', label: 'Super Admin', icon: '🛡️' },
              { slug: 'school_admin', label: 'School Admin', icon: '🏫' },
              { slug: 'teacher', label: 'Teacher', icon: '👨‍🏫' },
              { slug: 'staff', label: 'Staff', icon: '👔' },
              { slug: 'parent', label: 'Parent', icon: '👪' },
              { slug: 'student', label: 'Student', icon: '🎓' },
            ] as const).map((r) => (
              <button
                key={r.slug}
                type="button"
                disabled={isLoading}
                onClick={async () => {
                  setIsLoading(true);
                  setError('');
                  try {
                    const res = await fetch('/api/auth/dev-quick-login', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ roleSlug: r.slug }),
                    });
                    const result = await res.json();
                    if (!result.success) {
                      setError(result.error ?? 'Quick login failed');
                      setIsLoading(false);
                      return;
                    }
                    router.push(result.data.redirect);
                  } catch {
                    setError('Quick login failed');
                    setIsLoading(false);
                  }
                }}
                className="flex flex-col items-center gap-1 rounded-md border border-dashed border-muted-foreground/30 p-2 text-xs hover:border-primary hover:bg-primary/5 transition-colors disabled:opacity-50"
              >
                <span className="text-base">{r.icon}</span>
                <span className="font-medium">{r.label}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Dev Mode &middot; Click a role to instantly log in
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
