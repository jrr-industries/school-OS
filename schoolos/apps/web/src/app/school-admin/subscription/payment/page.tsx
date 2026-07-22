'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Crown, CheckCircle2, XCircle, HardDrive, Users,
  CreditCard, Shield, Loader2,
  Building2, Smartphone, Wallet,
  Check,
} from 'lucide-react';
import { Card, CardContent, Button, Input, cn } from '@schoolos/ui';
import { toast } from 'sonner';
import { PageHeader } from '@/features/school-admin/components/page-header';

interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number | string;
  currency: string;
  interval: string;
  maxStudents: number;
  maxTeachers: number;
  maxStorageGB: number;
  features: string[];
}

const planHeaderBg: Record<string, string> = {
  free: 'bg-slate-50 dark:bg-slate-900',
  basic: 'bg-blue-50 dark:bg-blue-950',
  standard: 'bg-emerald-50 dark:bg-emerald-950',
  premium: 'bg-purple-50 dark:bg-purple-950',
  enterprise: 'bg-amber-50 dark:bg-amber-950',
};

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit/Debit Card', icon: CreditCard, description: 'Visa, Mastercard, RuPay' },
  { id: 'upi', label: 'UPI', icon: Smartphone, description: 'Google Pay, PhonePe, Paytm' },
  { id: 'netbanking', label: 'Net Banking', icon: Building2, description: 'All major banks' },
  { id: 'wallet', label: 'Wallet', icon: Wallet, description: 'Paytm, Amazon Pay, Mobikwik' },
] as const;

export default function SubscriptionPaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get('planId');

  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  useEffect(() => {
    if (!planId) {
      toast.error('No plan selected');
      router.push('/school-admin/subscription');
      return;
    }
    fetchPlan();
  }, [planId]);

  const fetchPlan = async () => {
    try {
      const res = await fetch(`/api/school-admin/subscription`);
      const json = await res.json();
      if (json.success) {
        const found = json.data.plans.find((p: Plan) => p.id === planId);
        if (found) setPlan(found);
        else toast.error('Plan not found');
      }
    } catch {
      toast.error('Failed to load plan');
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async () => {
    if (!plan) return;
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 2000));
    try {
      const res = await fetch('/api/school-admin/subscription', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan.id,
          paymentMethod,
          paymentReference: `TXN${Date.now()}`,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Payment successful! Plan activated.');
        router.push('/school-admin/subscription');
      } else {
        toast.error(json.error || 'Payment failed');
      }
    } catch {
      toast.error('Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Payment" description="Complete your subscription payment" />
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3 space-y-4">
            <div className="h-64 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
          </div>
          <div className="lg:col-span-2">
            <div className="h-80 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="space-y-6">
        <PageHeader title="Payment" description="Complete your subscription payment" />
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <XCircle className="h-12 w-12 mb-3" />
            <h2 className="text-lg font-semibold">Plan Not Found</h2>
            <Button variant="link" onClick={() => router.push('/school-admin/subscription')}>
              Back to plans
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const price = typeof plan.price === 'string' ? parseFloat(plan.price) : plan.price;
  const features = (plan.features as string[]) || [];
  const currencySymbol = plan.currency === 'INR' ? '₹' : '$';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Complete Payment"
        description="Review your plan and make payment"
        breadcrumbs={[
          { label: 'Subscription', href: '/school-admin/subscription' },
          { label: 'Payment' },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="h-4 w-4" /> Payment Method
              </h3>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={cn(
                        'flex items-center gap-3 rounded-lg border p-3 text-left transition-all',
                        paymentMethod === method.id
                          ? 'border-primary ring-2 ring-primary/20 bg-primary/5'
                          : 'hover:border-muted-foreground/50',
                      )}
                    >
                      <Icon className={cn(
                        'h-5 w-5 shrink-0',
                        paymentMethod === method.id ? 'text-primary' : 'text-muted-foreground',
                      )} />
                      <div>
                        <p className="text-sm font-medium">{method.label}</p>
                        <p className="text-[10px] text-muted-foreground">{method.description}</p>
                      </div>
                      {paymentMethod === method.id && (
                        <Check className="h-4 w-4 text-primary ml-auto shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Card Number</label>
                    <Input
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())}
                      maxLength={19}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Cardholder Name</label>
                    <Input
                      placeholder="John Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Expiry Date</label>
                      <Input
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, '');
                          if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2, 4);
                          setCardExpiry(val);
                        }}
                        maxLength={5}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">CVV</label>
                      <Input
                        type="password"
                        placeholder="***"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        maxLength={3}
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">UPI ID</label>
                  <Input placeholder="example@upi" />
                  <p className="text-xs text-muted-foreground">Enter your UPI ID to receive payment request</p>
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Bank</label>
                  <select className="w-full rounded-lg border bg-background px-3 py-2 text-sm">
                    <option>State Bank of India</option>
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>
                    <option>Kotak Mahindra</option>
                    <option>Yes Bank</option>
                  </select>
                </div>
              )}

              {paymentMethod === 'wallet' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Wallet</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Paytm', 'PhonePe', 'Amazon Pay'].map((w) => (
                      <button key={w} className="rounded-lg border p-3 text-sm font-medium hover:bg-muted transition-colors">
                        {w}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className={cn('p-6 text-center', planHeaderBg[plan.slug] || 'bg-muted')}>
              <Crown className={cn(
                'h-8 w-8 mx-auto mb-2',
                plan.slug === 'free' ? 'text-slate-500' :
                plan.slug === 'basic' ? 'text-blue-500' :
                plan.slug === 'standard' ? 'text-emerald-500' :
                plan.slug === 'premium' ? 'text-purple-500' : 'text-amber-500',
              )} />
              <h3 className="font-bold">{plan.name}</h3>
              <div className="mt-1">
                <span className="text-2xl font-bold">{currencySymbol}{price.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground">/{plan.interval}</span>
              </div>
            </div>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Plan Price</span>
                <span className="font-medium">{currencySymbol}{price.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">GST (18%)</span>
                <span className="font-medium">{currencySymbol}{(price * 0.18).toLocaleString()}</span>
              </div>
              <div className="border-t pt-3 flex items-center justify-between">
                <span className="font-semibold">Total</span>
                <span className="text-lg font-bold">{currencySymbol}{(price * 1.18).toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Plan Includes</h4>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>Up to {plan.maxStudents.toLocaleString()} Students</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>Up to {plan.maxTeachers.toLocaleString()} Teachers</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <HardDrive className="h-4 w-4 text-muted-foreground" />
                <span>{plan.maxStorageGB} GB Storage</span>
              </div>
              {features.slice(0, 4).map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>{f}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Button
            className="w-full h-12 text-base gap-2"
            onClick={handlePay}
            disabled={processing}
          >
            {processing ? (
              <><Loader2 className="h-5 w-5 animate-spin" /> Processing...</>
            ) : (
              <><Shield className="h-5 w-5" /> Pay {currencySymbol}{(price * 1.18).toLocaleString()}</>
            )}
          </Button>

          <p className="text-center text-[10px] text-muted-foreground">
            Your payment is secured with 256-bit SSL encryption
          </p>
        </div>
      </div>
    </div>
  );
}
