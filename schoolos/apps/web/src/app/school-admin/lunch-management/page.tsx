'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import {
  UtensilsCrossed, Users, IndianRupee, ClipboardList,
  AlertTriangle, Truck, Trash2, Apple, Calendar, ChefHat,
  ShoppingCart, ArrowUpRight, ArrowDownRight, CheckCircle2,
} from 'lucide-react';
import {
  Card, CardHeader, CardTitle, CardContent, Badge, Button, cn,
} from '@schoolos/ui';
import { useSchoolAdminAuth } from '@/features/supabase/hooks/use-school-admin-auth';
import { SupabaseService } from '@/features/supabase/services/supabase.service';
import { PageHeader } from '@/features/school-admin/components/page-header';

const PIE_COLORS_WASTE = ['#84cc16', '#f59e0b', '#ef4444'];

const SAMPLE_DATA = {
  todayMenu: {
    date: new Date().toISOString().split('T')[0],
    breakfast: 'Poha, Banana, Milk',
    lunch: 'Rice, Dal, Mixed Vegetables, Roti, Salad, Pickle',
    snacks: 'Samosa, Tea',
    specialMeal: null,
  },
  weeklyMenu: [
    { day: 'Monday', breakfast: 'Aloo Paratha, Curd', lunch: 'Rice, Rajma, Raita, Roti, Salad', snacks: 'Fruit Bowl' },
    { day: 'Tuesday', breakfast: 'Upma, Coconut Chutney', lunch: 'Rice, Chole, Jeera Aloo, Roti, Salad', snacks: 'Biscuits, Tea' },
    { day: 'Wednesday', breakfast: 'Idli, Sambar, Chutney', lunch: 'Rice, Dal Tadka, Paneer, Roti, Salad', snacks: 'Pasta' },
    { day: 'Thursday', breakfast: 'Puri Bhaji', lunch: 'Rice, Kadhi, Bhindi, Roti, Salad', snacks: 'Popcorn, Milk' },
    { day: 'Friday', breakfast: 'Dosa, Chutney', lunch: 'Rice, Fish Curry / Soya, Aloo Gobi, Roti, Salad', snacks: 'Ice Cream' },
  ],
  studentsUsingLunch: 890,
  totalStudents: 1240,
  mealCostPerStudent: 35,
  kitchenStaff: 14,
  specialMeals: [
    { date: '2026-07-25', meal: 'Festival Special - Biryani, Ice Cream', reason: 'School Anniversary' },
    { date: '2026-08-15', meal: 'Independence Day Special', reason: 'Independence Day Celebration' },
  ],
  inventory: [
    { item: 'Rice', stock: 120, threshold: 50, unit: 'kg', status: 'ok' },
    { item: 'Wheat Flour', stock: 85, threshold: 40, unit: 'kg', status: 'ok' },
    { item: 'Dal (Pulses)', stock: 30, threshold: 25, unit: 'kg', status: 'low' },
    { item: 'Cooking Oil', stock: 15, threshold: 20, unit: 'l', status: 'critical' },
    { item: 'Sugar', stock: 40, threshold: 15, unit: 'kg', status: 'ok' },
    { item: 'Milk', stock: 50, threshold: 30, unit: 'l', status: 'ok' },
    { item: 'Vegetables', stock: 20, threshold: 25, unit: 'kg', status: 'low' },
    { item: 'Spices', stock: 8, threshold: 5, unit: 'kg', status: 'ok' },
  ],
  suppliers: [
    { name: 'Fresh Foods Pvt Ltd', item: 'Vegetables, Fruits', contact: 'Ramesh - 9876543210', status: 'active' },
    { name: 'Dairy Best', item: 'Milk, Curd, Paneer', contact: 'Suresh - 9876543211', status: 'active' },
    { name: 'Grain Mart', item: 'Rice, Wheat, Dal', contact: 'Anil - 9876543212', status: 'active' },
    { name: 'Spice World', item: 'Spices, Oil', contact: 'Deepak - 9876543213', status: 'inactive' },
  ],
  foodWaste: {
    percentage: 8.2,
    breakfastWaste: 5.1,
    lunchWaste: 9.8,
    snacksWaste: 6.3,
    trend: { value: 1.2, positive: true },
  },
  nutritionReport: {
    averageCalories: 685,
    protein: 22,
    carbohydrates: 85,
    fats: 18,
    fiber: 12,
    rating: 'Good',
  },
  wasteDistribution: [
    { name: 'Breakfast', value: 5.1 },
    { name: 'Lunch', value: 9.8 },
    { name: 'Snacks', value: 6.3 },
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
          <span>{entry.name}: <span className="font-medium text-foreground">{entry.value}{entry.unit || ''}</span></span>
        </div>
      ))}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-64 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
        ))}
      </div>
      <div className="h-40 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-[260px] animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
        ))}
      </div>
    </div>
  );
}

export default function LunchManagementPage() {
  const { schoolId, loading: authLoading } = useSchoolAdminAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!schoolId) return;
    const unsub = SupabaseService.subscribeByField<any>('analytics', schoolId, 'type', 'lunch', (fbData) => {
      if (fbData) {
        setData(fbData);
      } else {
        setData(SAMPLE_DATA);
        toast.info('Using sample lunch data. Connect Supabase for live data.');
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
        toast.info('Using sample lunch data. Connect Supabase for live data.');
      }
    }, 5000);
    return () => clearTimeout(timeout);
  }, [schoolId, loading]);

  if (authLoading || loading) return <LoadingSkeleton />;
  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Lunch Management" description="School cafeteria and meal management" />
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
  const today = stats.todayMenu || SAMPLE_DATA.todayMenu;
  const weeklyMenu = stats.weeklyMenu || SAMPLE_DATA.weeklyMenu;
  const inventory = stats.inventory || SAMPLE_DATA.inventory;
  const suppliers = stats.suppliers || SAMPLE_DATA.suppliers;
  const specialMeals = stats.specialMeals || SAMPLE_DATA.specialMeals;
  const waste = stats.foodWaste || SAMPLE_DATA.foodWaste;
  const nutrition = stats.nutritionReport || SAMPLE_DATA.nutritionReport;
  const wasteDist = stats.wasteDistribution || SAMPLE_DATA.wasteDistribution;

  const lowStockItems = inventory.filter((i: any) => i.status === 'low' || i.status === 'critical');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lunch Management"
        description="School cafeteria and meal management"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Students Using Lunch" value={`${stats.studentsUsingLunch} / ${stats.totalStudents}`} icon={Users} color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" />
        <StatCard title="Meal Cost/Student" value={`₹${stats.mealCostPerStudent}`} icon={IndianRupee} color="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" />
        <StatCard title="Kitchen Staff" value={String(stats.kitchenStaff)} icon={ChefHat} color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" />
        <StatCard title="Food Waste" value={`${waste.percentage}%`} icon={Trash2} trend={{ value: waste.trend?.value || 1.2, positive: waste.trend?.positive || false }} color="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-primary/30 bg-primary/5 dark:bg-primary/10">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <UtensilsCrossed className="h-4 w-4 text-primary" />
              Today&apos;s Menu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: 'Breakfast', value: today.breakfast, icon: Apple, color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' },
                { label: 'Lunch', value: today.lunch, icon: UtensilsCrossed, color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
                { label: 'Snacks', value: today.snacks, icon: ClipboardList, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
              ].map((meal) => (
                <div key={meal.label} className="flex items-start gap-3 rounded-lg border bg-background p-4">
                  <div className={cn('rounded-lg p-2 shrink-0', meal.color)}>
                    <meal.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">{meal.label}</p>
                    <p className="text-sm font-medium mt-0.5">{meal.value}</p>
                  </div>
                </div>
              ))}
            </div>
            {today.specialMeal && (
              <div className="mt-3 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-3 flex items-center gap-2">
                <Badge variant="warning">Special</Badge>
                <p className="text-sm">{today.specialMeal}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Weekly Menu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs text-muted-foreground">
                      <th className="pb-2 pr-3 font-medium">Day</th>
                      <th className="pb-2 pr-3 font-medium">Breakfast</th>
                      <th className="pb-2 pr-3 font-medium">Lunch</th>
                      <th className="pb-2 font-medium">Snacks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weeklyMenu.map((day: any) => (
                      <tr key={day.day} className="border-b last:border-0">
                        <td className="py-2 pr-3">
                          <span className={cn(
                            'font-medium',
                            day.day === 'Monday' ? 'text-blue-600' : day.day === 'Friday' ? 'text-emerald-600' : '',
                          )}>{day.day}</span>
                        </td>
                        <td className="py-2 pr-3 text-xs text-muted-foreground">{day.breakfast}</td>
                        <td className="py-2 pr-3 text-xs text-muted-foreground">{day.lunch}</td>
                        <td className="py-2 text-xs text-muted-foreground">{day.snacks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Apple className="h-4 w-4 text-muted-foreground" />
                Nutrition Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Daily Nutrition Summary</h4>
                  <Badge variant={nutrition.rating === 'Good' ? 'success' : 'warning'}>{nutrition.rating}</Badge>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { label: 'Calories', value: nutrition.averageCalories, unit: 'kcal', color: 'text-orange-600' },
                    { label: 'Protein', value: nutrition.protein, unit: 'g', color: 'text-red-600' },
                    { label: 'Carbs', value: nutrition.carbohydrates, unit: 'g', color: 'text-blue-600' },
                    { label: 'Fats', value: nutrition.fats, unit: 'g', color: 'text-amber-600' },
                    { label: 'Fiber', value: nutrition.fiber, unit: 'g', color: 'text-emerald-600' },
                  ].map((item) => (
                    <div key={item.label} className="rounded-lg border p-2 text-center">
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className={cn('text-sm font-bold', item.color)}>{item.value}</p>
                      <p className="text-[10px] text-muted-foreground">{item.unit}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground mb-2">Special Meals</p>
                  {specialMeals.length > 0 ? (
                    <div className="space-y-2">
                      {specialMeals.map((m: any, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                          <Badge variant="warning" size="sm">{new Date(m.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</Badge>
                          <span className="text-muted-foreground">{m.meal}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">No special meals scheduled</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                Inventory Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lowStockItems.length > 0 && (
                <div className="mb-3 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 p-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
                  <p className="text-xs text-red-600">{lowStockItems.length} item(s) need restocking</p>
                </div>
              )}
              <div className="space-y-2">
                {inventory.map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border p-2.5">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{item.item}</p>
                      <p className="text-xs text-muted-foreground">{item.stock} {item.unit} (Threshold: {item.threshold} {item.unit})</p>
                    </div>
                    <Badge variant={item.status === 'critical' ? 'destructive' : item.status === 'low' ? 'warning' : 'success'} size="sm">
                      {item.status === 'critical' ? 'Critical' : item.status === 'low' ? 'Low' : 'In Stock'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Truck className="h-4 w-4 text-muted-foreground" />
                Suppliers
              </CardTitle>
            </CardHeader>
            <CardContent>
              {suppliers.length > 0 ? (
                <div className="space-y-3">
                  {suppliers.map((sup: any, i: number) => (
                    <div key={i} className="flex items-start gap-3 rounded-lg border p-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                        <Truck className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{sup.name}</p>
                          <Badge variant={sup.status === 'active' ? 'success' : 'secondary'} size="sm">{sup.status}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{sup.item}</p>
                        <p className="text-xs text-muted-foreground">{sup.contact}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <Truck className="h-8 w-8 mb-2" />
                  <p className="text-sm">No suppliers configured</p>
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
                <Trash2 className="h-4 w-4 text-muted-foreground" />
                Food Waste Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-2xl font-bold">{waste.percentage}%</p>
                  <p className="text-xs text-muted-foreground">Total food waste</p>
                </div>
                <div className={cn(
                  'flex items-center gap-1 text-xs font-medium',
                  waste.trend?.positive ? 'text-red-600' : 'text-emerald-600',
                )}>
                  {waste.trend?.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {waste.trend?.value}% from last month
                </div>
              </div>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={wasteDist} cx="50%" cy="50%" outerRadius={80} paddingAngle={3} dataKey="value" nameKey="name">
                      {wasteDist.map((_: any, i: number) => (
                        <Cell key={i} fill={PIE_COLORS_WASTE[i % PIE_COLORS_WASTE.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} formatter={(value: any) => [`${value}%`, 'Waste']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-2">
                {wasteDist.map((entry: any, i: number) => (
                  <div key={entry.name} className="flex items-center gap-1.5 text-xs">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS_WASTE[i % PIE_COLORS_WASTE.length] }} />
                    <span className="text-muted-foreground">{entry.name}</span>
                    <span className="font-medium">{entry.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
                Cost & Usage Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Meal Cost per Student</p>
                  <p className="text-xl font-bold">₹{stats.mealCostPerStudent}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Daily Total Cost</p>
                  <p className="text-xl font-bold">₹{(stats.studentsUsingLunch * stats.mealCostPerStudent).toLocaleString()}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Participation Rate</p>
                  <p className="text-xl font-bold">{Math.round(stats.studentsUsingLunch / stats.totalStudents * 100)}%</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Kitchen Staff</p>
                  <p className="text-xl font-bold">{stats.kitchenStaff}</p>
                </div>
              </div>
              <div className="rounded-lg border p-3 bg-emerald-50/50 dark:bg-emerald-950/20">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                    {stats.studentsUsingLunch} out of {stats.totalStudents} students ({(stats.studentsUsingLunch / stats.totalStudents * 100).toFixed(0)}%) are using the lunch program today
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
