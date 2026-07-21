import Link from 'next/link';
import { Activity, ArrowRight, BadgeCheck, Check, CircleAlert, Layers3, ListChecks, RefreshCcw, Search, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Separator, Skeleton } from '@schoolos/ui';
import type { SuperAdminPageConfig } from '../types';

interface PageScaffoldProps {
  page: SuperAdminPageConfig;
}

const toolbarVariants = ['default', 'outline', 'secondary', 'ghost'] as const;

function buildToolbarLabels(page: SuperAdminPageConfig) {
  switch (page.kind) {
    case 'dashboard':
      return [page.primaryAction ?? 'Customize dashboard', 'Refresh', 'Export'];
    case 'create':
      return [page.primaryAction ?? 'Save draft', 'Publish', 'Preview'];
    case 'approval':
      return [page.primaryAction ?? 'Review queue', 'Approve selected', 'Escalate'];
    case 'report':
      return [page.primaryAction ?? 'Export report', 'Schedule', 'Share'];
    case 'operations':
      return [page.primaryAction ?? 'Open timeline', 'Refresh', 'Download'];
    case 'settings':
      return [page.primaryAction ?? 'Save changes', 'Reset', 'Audit changes'];
    case 'security':
      return [page.primaryAction ?? 'Review security', 'Rotate', 'Export'];
    case 'developer':
      return [page.primaryAction ?? 'Open console', 'Run', 'Copy request'];
    case 'logout':
      return [page.primaryAction ?? 'Sign out now'];
    case 'collection':
    default:
      return [page.primaryAction ?? 'Create new', 'Export', 'Refresh'];
  }
}

function MetricCard({ label, value, helper, tone }: { label: string; value: string; helper: string; tone: 'blue' | 'emerald' | 'amber' | 'slate' }) {
  const toneClasses = {
    blue: 'border-blue-200 bg-blue-50/80 text-blue-700 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-200',
    emerald: 'border-emerald-200 bg-emerald-50/80 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200',
    amber: 'border-amber-200 bg-amber-50/80 text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200',
    slate: 'border-border bg-muted/40 text-foreground',
  } as const;

  return (
    <Card className={toneClasses[tone]}>
      <CardHeader className="space-y-2 pb-2">
        <CardDescription className="text-current/70">{label}</CardDescription>
        <CardTitle className="text-2xl font-semibold">{value}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 text-sm text-current/70">{helper}</CardContent>
    </Card>
  );
}

function PlaceholderTable() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <div className="grid grid-cols-4 gap-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          <span>Name</span>
          <span>Status</span>
          <span>Owner</span>
          <span className="text-right">Updated</span>
        </div>
      </div>
      <div className="space-y-0 divide-y divide-border">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="grid grid-cols-4 gap-4 px-4 py-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>
            <div className="flex items-start">
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-28" />
            <div className="flex justify-end">
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChecklistCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <ListChecks className="h-4 w-4 text-primary" />
          Readiness checklist
        </CardTitle>
        <CardDescription>Reusable guardrails for future CRUD wiring.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {[
          'Validation rules attached',
          'Role restrictions checked',
          'Audit log event mapped',
          'Empty state and bulk actions defined',
        ].map((item) => (
          <div key={item} className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-600" />
            <span>{item}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function EmptyPlaceholder({ page }: { page: SuperAdminPageConfig }) {
  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <CircleAlert className="h-4 w-4 text-amber-500" />
          No live records yet
        </CardTitle>
        <CardDescription>
          This screen is scaffolded for production data. Connect the data source and this area will become the primary workspace for {page.label.toLowerCase()}.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-3">
        <Button variant="default" className="gap-2">
          <Sparkles className="h-4 w-4" />
          {page.primaryAction ?? 'Create new'}
        </Button>
        <Button variant="outline" className="gap-2">
          <RefreshCcw className="h-4 w-4" />
          Refresh
        </Button>
      </CardContent>
    </Card>
  );
}

export function PageScaffold({ page }: PageScaffoldProps) {
  const toolbarLabels = buildToolbarLabels(page);
  const searchable = page.searchable ?? (page.kind !== 'settings' && page.kind !== 'logout');
  const filters = page.filters ?? (searchable ? ['Status', 'Owner', 'Date'] : []);

  const metrics =
    page.kind === 'dashboard' || page.kind === 'report'
      ? [
          { label: 'Active items', value: '128', helper: 'Live rows and monitored objects.', tone: 'blue' as const },
          { label: 'Open actions', value: '24', helper: 'Ready for review or processing.', tone: 'emerald' as const },
          { label: 'Alerts', value: '6', helper: 'Items requiring immediate attention.', tone: 'amber' as const },
          { label: 'SLA health', value: '99.4%', helper: 'Sustained portal availability.', tone: 'slate' as const },
        ]
      : [
          { label: 'Scoped records', value: '48', helper: 'Seeded placeholders for future data.', tone: 'blue' as const },
          { label: 'Pending review', value: '11', helper: 'Items awaiting an action.', tone: 'emerald' as const },
          { label: 'Needs attention', value: '3', helper: 'Exceptions and escalations.', tone: 'amber' as const },
          { label: 'Last sync', value: '2m ago', helper: 'The page is ready for live refreshes.', tone: 'slate' as const },
        ];

  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          {page.breadcrumbs.map((crumb, index) => (
            <div key={crumb.label} className="flex items-center gap-2">
              {index > 0 && <ArrowRight className="h-3.5 w-3.5" />}
              {crumb.href ? (
                <Link href={crumb.href} className="transition-colors hover:text-foreground">
                  {crumb.label}
                </Link>
              ) : (
                <span className="font-medium text-foreground">{crumb.label}</span>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 shadow-sm lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="info" className="gap-1.5 px-3 py-1 text-xs">
                <page.icon className="h-3.5 w-3.5" />
                {page.sectionLabel}
              </Badge>
              <Badge variant="outline" className="px-3 py-1 text-xs">
                {page.kind.replace('-', ' ')} workspace
              </Badge>
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{page.label}</h1>
              <p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">{page.description}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {toolbarLabels.map((label, index) => (
              <Button key={label} variant={toolbarVariants[index % toolbarVariants.length]} className="gap-2">
                {index === 0 ? <Zap className="h-4 w-4" /> : index === 1 ? <RefreshCcw className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                {label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {searchable && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Search and filters</CardTitle>
            <CardDescription>Prepared for fast triage, filtering, and future data fetches.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder={`Search ${page.label.toLowerCase()}...`} className="pl-10" />
              </div>
              <Button variant="outline" className="gap-2 lg:w-auto">
                <Layers3 className="h-4 w-4" />
                Search
              </Button>
            </div>
            {filters.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {filters.map((filter) => (
                  <div key={filter} className="space-y-2">
                    <label className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{filter}</label>
                    <div className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-muted-foreground">Filter by {filter.toLowerCase()}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.8fr)]">
        <div className="space-y-6">
          {(page.kind === 'dashboard' || page.kind === 'report') && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Overview panel
                </CardTitle>
                <CardDescription>Swap this placeholder with charts, graphs, and live summaries.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-6">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Trend canvas</span>
                      <span>Ready</span>
                    </div>
                    <div className="mt-4 space-y-3">
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-5/6" />
                      <Skeleton className="h-3 w-2/3" />
                      <Skeleton className="h-28 w-full rounded-2xl" />
                    </div>
                  </div>
                  <ChecklistCard />
                </div>
              </CardContent>
            </Card>
          )}

          {page.kind === 'collection' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Layers3 className="h-4 w-4 text-primary" />
                  Data table shell
                </CardTitle>
                <CardDescription>Designed for server-side pagination, row actions, and bulk operations.</CardDescription>
              </CardHeader>
              <CardContent>
                <PlaceholderTable />
              </CardContent>
            </Card>
          )}

          {page.kind === 'create' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Form blueprint
                </CardTitle>
                <CardDescription>Structure this page around validated sections and save states.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 lg:grid-cols-2">
                {['Core details', 'Access controls', 'Visibility', 'Automation'].map((section) => (
                  <div key={section} className="rounded-2xl border border-border bg-background p-4">
                    <p className="text-sm font-medium">{section}</p>
                    <p className="mt-1 text-sm text-muted-foreground">Placeholder inputs and helper copy will live here.</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {page.kind === 'approval' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <BadgeCheck className="h-4 w-4 text-primary" />
                  Review queue
                </CardTitle>
                <CardDescription>Ready for triage, escalation, and compliance tracking.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 lg:grid-cols-2">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="rounded-2xl border border-border bg-background p-4">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-32" />
                      <Badge variant="warning">Pending</Badge>
                    </div>
                    <Skeleton className="mt-3 h-3 w-full" />
                    <Skeleton className="mt-2 h-3 w-5/6" />
                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm">Review</Button>
                      <Button variant="ghost" size="sm">Escalate</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {page.kind === 'operations' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Activity className="h-4 w-4 text-primary" />
                  Operations timeline
                </CardTitle>
                <CardDescription>Use this surface for incidents, queues, and process telemetry.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {['Queued', 'Processed', 'Escalated', 'Resolved'].map((label) => (
                  <div key={label} className="flex items-center gap-3 rounded-2xl border border-border bg-background p-4">
                    <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{label}</p>
                      <p className="text-sm text-muted-foreground">Placeholder operational event stream entry.</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {page.kind === 'settings' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Settings2Icon />
                  Settings workspace
                </CardTitle>
                <CardDescription>Organized for configuration fields, toggles, and audit-friendly saves.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 lg:grid-cols-2">
                {['General', 'Notifications', 'Security', 'Advanced'].map((section) => (
                  <div key={section} className="rounded-2xl border border-border bg-background p-4">
                    <p className="text-sm font-medium">{section}</p>
                    <p className="mt-1 text-sm text-muted-foreground">Place form fields, toggles, and save actions here.</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {page.kind === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Security controls
                </CardTitle>
                <CardDescription>Prepared for risks, revocations, approvals, and exception handling.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {['High risk session', 'New API key', 'Sensitive permission change'].map((item) => (
                  <div key={item} className="flex items-center justify-between rounded-2xl border border-border bg-background p-4">
                    <div>
                      <p className="text-sm font-medium">{item}</p>
                      <p className="text-sm text-muted-foreground">Review, approve, or revoke as needed.</p>
                    </div>
                    <Badge variant="destructive">Review</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {page.kind === 'developer' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Code2Icon />
                  Developer console
                </CardTitle>
                <CardDescription>Use this area for endpoints, requests, and operational debugging.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 lg:grid-cols-2">
                {['Request builder', 'Webhook delivery', 'Cron execution', 'Cache inspection'].map((item) => (
                  <div key={item} className="rounded-2xl border border-border bg-background p-4">
                    <p className="text-sm font-medium">{item}</p>
                    <p className="mt-1 text-sm text-muted-foreground">Place JSON payloads, logs, and results here.</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {page.kind === 'logout' && (
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Confirm sign out
                </CardTitle>
                <CardDescription>Logout is scaffolded as a dedicated page so the sidebar keeps a complete route footprint.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Button variant="default" className="gap-2">
                  <LogOutIcon />
                  Sign out now
                </Button>
                <Button variant="outline">Cancel</Button>
              </CardContent>
            </Card>
          )}

          <EmptyPlaceholder page={page} />
        </div>

        <div className="space-y-6">
          <ChecklistCard />
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CircleAlert className="h-4 w-4 text-primary" />
                Deployment notes
              </CardTitle>
              <CardDescription>Every page is scaffolded for CRUD, filters, and route-level state later.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>Connect the page to a data hook or server action when the business model is ready.</p>
              <p>Replace the placeholder blocks with tables, charts, or forms without changing the shell.</p>
              <Separator />
              <div className="flex items-center gap-2 text-foreground">
                <Zap className="h-4 w-4 text-primary" />
                Production-ready route and shell wiring is already in place.
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

function Settings2Icon({ className }: { className?: string }) {
  return <Layers3 className={className ?? 'h-4 w-4'} />;
}

function Code2Icon({ className }: { className?: string }) {
  return <Sparkles className={className ?? 'h-4 w-4'} />;
}

function LogOutIcon() {
  return <ArrowRight className="h-4 w-4" />;
}
