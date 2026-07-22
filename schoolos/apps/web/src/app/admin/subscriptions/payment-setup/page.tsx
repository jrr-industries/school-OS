'use client';

import { useState } from 'react';
import {
  CreditCard,
  Save,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  ExternalLink,
  Shield,
  Lock,
  Key,
  Webhook,
  Globe,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '@schoolos/ui';

export default function PaymentSetupPage() {
  const [stripePK, setStripePK] = useState('');
  const [stripeSK, setStripeSK] = useState('');
  const [stripeWH, setStripeWH] = useState('');
  const [showSK, setShowSK] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const res = await fetch('/api/admin/subscriptions/payment-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stripePublishableKey: stripePK,
          stripeSecretKey: stripeSK,
          stripeWebhookSecret: stripeWH,
        }),
      });
      const data = await res.json();
      if (!data.success) { setError(data.error); return; }
      setSaved(true);
    } catch {
      setError('Failed to save configuration');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Payment Setup</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure Stripe payment integration</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <form onSubmit={handleSave} className="lg:col-span-2 space-y-6">
          {error && (
            <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {saved && (
            <div className="flex items-center gap-2 rounded-md bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Payment configuration saved successfully.</span>
            </div>
          )}

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-indigo-500" />
                <CardTitle className="text-lg">Stripe API Keys</CardTitle>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Enter your Stripe credentials to enable payment processing. These are stored securely.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                  Publishable Key
                </label>
                <input
                  type="text"
                  value={stripePK}
                  onChange={(e) => setStripePK(e.target.value)}
                  placeholder="pk_live_..."
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1.5">
                  <Key className="h-3.5 w-3.5 text-muted-foreground" />
                  Secret Key
                </label>
                <div className="relative">
                  <input
                    type={showSK ? 'text' : 'password'}
                    value={stripeSK}
                    onChange={(e) => setStripeSK(e.target.value)}
                    placeholder="sk_live_..."
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSK(!showSK)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showSK ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1.5">
                  <Webhook className="h-3.5 w-3.5 text-muted-foreground" />
                  Webhook Secret
                </label>
                <input
                  type="text"
                  value={stripeWH}
                  onChange={(e) => setStripeWH(e.target.value)}
                  placeholder="whsec_..."
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <p className="text-xs text-muted-foreground">
                  Used to verify Stripe webhook events. Configure your webhook endpoint at{' '}
                  <code className="font-mono text-xs">/api/webhooks/stripe</code>
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Button type="submit" disabled={saving} className="gap-1.5">
                  <Save className="h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Configuration'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-500" />
                <CardTitle className="text-sm">Setup Guide</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <ol className="list-decimal list-inside space-y-2">
                <li>Create a Stripe account at{' '}
                  <a href="https://stripe.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-0.5">
                    stripe.com <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
                <li>Go to Developers &rarr; API Keys</li>
                <li>Copy your Publishable and Secret keys</li>
                <li>Set up a webhook endpoint pointing to your server</li>
                <li>Copy the Webhook Signing Secret</li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-amber-500" />
                <CardTitle className="text-sm">Security Note</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <p>Secret keys are stored as environment variables and are never exposed to the client.</p>
              <p>Always use test keys (sk_test_ / pk_test_) during development.</p>
              <Badge variant="warning" size="sm">Coming in production</Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
