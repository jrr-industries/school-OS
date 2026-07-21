import {
  Activity,
  ActivitySquare,
  AlertCircle,
  ArrowUpRight,
  ArchiveRestore,
  BadgeCheck,
  BarChart3,
  Bell,
  BookOpen,
  Boxes,
  Building2,
  Cable,
  CalendarClock,
  CheckCircle2,
  ChartColumn,
  CircleGauge,
  Code2,
  CreditCard,
  Database,
  FileClock,
  FileSearch,
  FileText,
  Fingerprint,
  Flag,
  Gauge,
  Globe,
  Globe2,
  HardDrive,
  HeartPulse,
  Inbox,
  KeyRound,
  Landmark,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Mail,
  MailCheck,
  MailOpen,
  Megaphone,
  MessageCircle,
  MessageSquare,
  MessageSquareText,
  MonitorSmartphone,
  MoonStar,
  Network,
  RadioTower,
  Receipt,
  RotateCw,
  School,
  ScrollText,
  Server,
  ServerCog,
  Settings2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldHalf,
  Sliders,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  SquareAsterisk,
  Store as StoreIcon,
  TimerReset,
  Ticket,
  User,
  UserCheck,
  UserPlus,
  Users,
  UsersRound,
  WalletCards,
  Webhook,
  Workflow,
  School as SchoolIcon,
  LucideIcon,
} from 'lucide-react';
import type { SuperAdminNavSection, SuperAdminPageConfig, SuperAdminPageKind } from './types';

interface PageSeed {
  label: string;
  slug: string;
  icon: LucideIcon;
  kind: SuperAdminPageKind;
  permission?: string;
  searchable?: boolean;
  filters?: string[];
  primaryAction?: string;
}

interface SectionSeed {
  label: string;
  icon: LucideIcon;
  basePath?: string;
  permission?: string;
  items: PageSeed[];
}

const seedSections: SectionSeed[] = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    basePath: '/dashboard',
    items: [
      {
        label: 'Dashboard',
        slug: '',
        icon: LayoutDashboard,
        kind: 'dashboard',
        searchable: true,
        filters: ['Time range', 'School', 'Region'],
        primaryAction: 'Customize dashboard',
      },
    ],
  },
  {
    label: 'School Management',
    icon: Building2,
    basePath: '/school-management',
    items: [
      { label: 'All Schools', slug: 'all-schools', icon: StoreIcon, kind: 'collection', permission: 'school:read', searchable: true, filters: ['Verification', 'Subscription', 'Region', 'Status'], primaryAction: 'Create school' },
      { label: 'Create School', slug: 'create-school', icon: Building2, kind: 'create', permission: 'school:create', primaryAction: 'Save draft' },
      { label: 'School Verification', slug: 'school-verification', icon: BadgeCheck, kind: 'approval', permission: 'school:verify', searchable: true, filters: ['Pending', 'Submitted', 'Approved', 'Rejected'], primaryAction: 'Review queue' },
      { label: 'Suspended Schools', slug: 'suspended-schools', icon: ShieldAlert, kind: 'collection', permission: 'school:update', searchable: true, filters: ['Reason', 'Duration', 'Owner'], primaryAction: 'Review suspension' },
      { label: 'Deleted Schools', slug: 'deleted-schools', icon: ArchiveRestore, kind: 'collection', permission: 'school:delete', searchable: true, filters: ['Deleted by', 'Date', 'Restore eligibility'], primaryAction: 'Restore selected' },
      { label: 'School Activity', slug: 'school-activity', icon: Activity, kind: 'operations', permission: 'school:read', searchable: true, filters: ['Today', 'Week', 'Month', 'Event type'], primaryAction: 'Open timeline' },
    ],
  },
  {
    label: 'Subscription Management',
    icon: CreditCard,
    basePath: '/subscription-management',
    items: [
      { label: 'Plans', slug: 'plans', icon: WalletCards, kind: 'settings', permission: 'subscription:manage', searchable: true, filters: ['Billing cycle', 'Tier', 'Status'], primaryAction: 'Create plan' },
      { label: 'Active Subscriptions', slug: 'active-subscriptions', icon: CheckCircle2, kind: 'collection', permission: 'subscription:read', searchable: true, filters: ['Plan', 'Renewal', 'Region', 'Status'], primaryAction: 'Manage subscriptions' },
      { label: 'Trial Schools', slug: 'trial-schools', icon: TimerReset, kind: 'collection', permission: 'subscription:read', searchable: true, filters: ['Trial stage', 'Days left', 'Owner'], primaryAction: 'Convert trials' },
      { label: 'Expiring Soon', slug: 'expiring-soon', icon: AlertCircle, kind: 'report', permission: 'subscription:read', searchable: true, filters: ['7 days', '14 days', '30 days'], primaryAction: 'Send reminders' },
      { label: 'Billing', slug: 'billing', icon: Landmark, kind: 'settings', permission: 'billing:manage', primaryAction: 'Sync billing settings' },
      { label: 'Invoices', slug: 'invoices', icon: Receipt, kind: 'collection', permission: 'billing:read', searchable: true, filters: ['Paid', 'Outstanding', 'Overdue', 'Refunded'], primaryAction: 'Generate invoice' },
      { label: 'Payments', slug: 'payments', icon: WalletCards, kind: 'collection', permission: 'billing:read', searchable: true, filters: ['Method', 'Status', 'Gateway', 'Date'], primaryAction: 'Export payments' },
    ],
  },
  {
    label: 'Platform Users',
    icon: UsersRound,
    basePath: '/platform-users',
    items: [
      { label: 'Users', slug: 'users', icon: Users, kind: 'collection', permission: 'users:read', searchable: true, filters: ['Role', 'Status', 'Team', 'Last active'], primaryAction: 'Invite user' },
      { label: 'Invite User', slug: 'invite-user', icon: UserPlus, kind: 'create', permission: 'users:create', primaryAction: 'Send invite' },
      { label: 'Roles', slug: 'roles', icon: ShieldCheck, kind: 'settings', permission: 'roles:manage', searchable: true, filters: ['Scope', 'Status'], primaryAction: 'Create role' },
      { label: 'Permissions', slug: 'permissions', icon: KeyRound, kind: 'security', permission: 'roles:manage', searchable: true, filters: ['Module', 'Action', 'Risk'], primaryAction: 'Review matrix' },
      { label: 'Teams', slug: 'teams', icon: Workflow, kind: 'settings', permission: 'users:manage', searchable: true, filters: ['Department', 'Ownership', 'Status'], primaryAction: 'Create team' },
    ],
  },
  {
    label: 'Feature Management',
    icon: Sparkles,
    basePath: '/feature-management',
    items: [
      { label: 'Feature Flags', slug: 'feature-flags', icon: Flag, kind: 'settings', permission: 'features:manage', searchable: true, filters: ['Audience', 'Rollout', 'Status'], primaryAction: 'Create flag' },
      { label: 'Modules', slug: 'modules', icon: Boxes, kind: 'settings', permission: 'features:manage', searchable: true, filters: ['Enabled', 'Beta', 'Owner'], primaryAction: 'Manage modules' },
      { label: 'License Management', slug: 'license-management', icon: SquareAsterisk, kind: 'security', permission: 'licenses:manage', searchable: true, filters: ['Plan', 'Status', 'Expiration'], primaryAction: 'Assign license' },
    ],
  },
  {
    label: 'Communication',
    icon: Megaphone,
    basePath: '/communication',
    items: [
      { label: 'Announcements', slug: 'announcements', icon: MessageSquareText, kind: 'report', permission: 'communication:manage', searchable: true, filters: ['Channel', 'Audience', 'Status'], primaryAction: 'Publish announcement' },
      { label: 'Notifications', slug: 'notifications', icon: Bell, kind: 'operations', permission: 'communication:manage', searchable: true, filters: ['Channel', 'Severity', 'Delivery'], primaryAction: 'Send notification' },
      { label: 'Email Campaigns', slug: 'email-campaigns', icon: MailOpen, kind: 'report', permission: 'communication:send', searchable: true, filters: ['Open rate', 'Segment', 'Status'], primaryAction: 'Create campaign' },
      { label: 'SMS', slug: 'sms', icon: Smartphone, kind: 'operations', permission: 'communication:send', searchable: true, filters: ['Gateway', 'Status', 'Region'], primaryAction: 'Compose SMS' },
      { label: 'Push Notifications', slug: 'push-notifications', icon: RadioTower, kind: 'operations', permission: 'communication:send', searchable: true, filters: ['Platform', 'Delivery', 'Audience'], primaryAction: 'Send push' },
    ],
  },
  {
    label: 'Support',
    icon: LifeBuoy,
    basePath: '/support',
    items: [
      { label: 'Tickets', slug: 'tickets', icon: Ticket, kind: 'collection', permission: 'support:read', searchable: true, filters: ['Priority', 'Status', 'Assignee', 'Category'], primaryAction: 'Open ticket' },
      { label: 'Knowledge Base', slug: 'knowledge-base', icon: BookOpen, kind: 'settings', permission: 'support:manage', searchable: true, filters: ['Article type', 'Visibility', 'Owner'], primaryAction: 'Create article' },
      { label: 'Live Chat', slug: 'live-chat', icon: MessageCircle, kind: 'operations', permission: 'support:manage', searchable: true, filters: ['Agent', 'Queue', 'Status'], primaryAction: 'Open inbox' },
      { label: 'Feedback', slug: 'feedback', icon: MessageSquare, kind: 'collection', permission: 'support:read', searchable: true, filters: ['Rating', 'Product area', 'Sentiment'], primaryAction: 'Review feedback' },
    ],
  },
  {
    label: 'Analytics',
    icon: BarChart3,
    basePath: '/analytics',
    items: [
      { label: 'Platform Analytics', slug: 'platform-analytics', icon: ChartColumn, kind: 'report', permission: 'analytics:read', searchable: true, filters: ['Time range', 'Tenant', 'Channel'], primaryAction: 'Export report' },
      { label: 'Revenue', slug: 'revenue', icon: ArrowUpRight, kind: 'report', permission: 'analytics:read', searchable: true, filters: ['Month', 'Quarter', 'Year'], primaryAction: 'Download revenue' },
      { label: 'Schools', slug: 'schools', icon: SchoolIcon, kind: 'report', permission: 'analytics:read', searchable: true, filters: ['Region', 'Type', 'Growth'], primaryAction: 'Compare schools' },
      { label: 'Users', slug: 'users', icon: Users, kind: 'report', permission: 'analytics:read', searchable: true, filters: ['Role', 'Activity', 'Retention'], primaryAction: 'Segment users' },
      { label: 'API Usage', slug: 'api-usage', icon: Network, kind: 'report', permission: 'analytics:read', searchable: true, filters: ['Endpoint', 'Status', 'Method'], primaryAction: 'Inspect usage' },
      { label: 'Storage', slug: 'storage', icon: HardDrive, kind: 'report', permission: 'analytics:read', searchable: true, filters: ['Bucket', 'Type', 'Age'], primaryAction: 'Review storage' },
    ],
  },
  {
    label: 'Audit & Compliance',
    icon: ScrollText,
    basePath: '/audit-compliance',
    items: [
      { label: 'Audit Logs', slug: 'audit-logs', icon: FileText, kind: 'operations', permission: 'audit:read', searchable: true, filters: ['Actor', 'Action', 'Object', 'Outcome'], primaryAction: 'Export logs' },
      { label: 'Login History', slug: 'login-history', icon: FileClock, kind: 'operations', permission: 'audit:read', searchable: true, filters: ['Success', 'Failure', 'MFA', 'Location'], primaryAction: 'Review logins' },
      { label: 'Activity Timeline', slug: 'activity-timeline', icon: ActivitySquare, kind: 'operations', permission: 'audit:read', searchable: true, filters: ['Period', 'Module', 'Actor'], primaryAction: 'Open timeline' },
      { label: 'Security Events', slug: 'security-events', icon: ShieldAlert, kind: 'security', permission: 'security:read', searchable: true, filters: ['Severity', 'Status', 'Source'], primaryAction: 'Review events' },
    ],
  },
  {
    label: 'System',
    icon: Server,
    basePath: '/system',
    items: [
      { label: 'Health', slug: 'health', icon: HeartPulse, kind: 'operations', permission: 'system:manage', searchable: true, filters: ['Service', 'Region', 'Status'], primaryAction: 'Run health check' },
      { label: 'Monitoring', slug: 'monitoring', icon: Gauge, kind: 'operations', permission: 'system:manage', searchable: true, filters: ['Uptime', 'Latency', 'Error rate'], primaryAction: 'Open monitor' },
      { label: 'Background Jobs', slug: 'background-jobs', icon: TimerReset, kind: 'operations', permission: 'system:manage', searchable: true, filters: ['Queue', 'Status', 'Priority'], primaryAction: 'Retry jobs' },
      { label: 'Queue Monitor', slug: 'queue-monitor', icon: Inbox, kind: 'operations', permission: 'system:manage', searchable: true, filters: ['Queue', 'Throughput', 'State'], primaryAction: 'Inspect queue' },
      { label: 'Storage', slug: 'storage', icon: Database, kind: 'operations', permission: 'system:manage', searchable: true, filters: ['Volume', 'Bucket', 'Age'], primaryAction: 'Review storage' },
      { label: 'Database', slug: 'database', icon: Database, kind: 'operations', permission: 'system:manage', searchable: true, filters: ['Pool', 'Latency', 'Replica'], primaryAction: 'Open database' },
      { label: 'Cache', slug: 'cache', icon: RotateCw, kind: 'operations', permission: 'system:manage', searchable: true, filters: ['Hit rate', 'Namespace', 'Status'], primaryAction: 'Purge cache' },
      { label: 'Logs', slug: 'logs', icon: FileSearch, kind: 'operations', permission: 'system:logs', searchable: true, filters: ['Level', 'Service', 'Date'], primaryAction: 'Stream logs' },
      { label: 'Backup', slug: 'backup', icon: ShieldCheck, kind: 'security', permission: 'system:backup', searchable: true, filters: ['Target', 'Status', 'Retention'], primaryAction: 'Run backup' },
    ],
  },
  {
    label: 'Security',
    icon: Shield,
    basePath: '/security',
    items: [
      { label: 'Sessions', slug: 'sessions', icon: Fingerprint, kind: 'security', permission: 'security:manage', searchable: true, filters: ['Active', 'Expired', 'Geo'], primaryAction: 'Revoke sessions' },
      { label: 'MFA', slug: 'mfa', icon: ShieldHalf, kind: 'security', permission: 'security:manage', searchable: true, filters: ['Enabled', 'Required', 'Method'], primaryAction: 'Enforce MFA' },
      { label: 'API Keys', slug: 'api-keys', icon: KeyRound, kind: 'security', permission: 'security:manage', searchable: true, filters: ['Active', 'Rotated', 'Scope'], primaryAction: 'Create key' },
      { label: 'Webhooks', slug: 'webhooks', icon: Webhook, kind: 'developer', permission: 'security:manage', searchable: true, filters: ['Endpoint', 'Status', 'Signature'], primaryAction: 'Register webhook' },
      { label: 'IP Allowlist', slug: 'ip-allowlist', icon: Globe2, kind: 'security', permission: 'security:manage', searchable: true, filters: ['Allowed', 'Blocked', 'Region'], primaryAction: 'Add IP' },
      { label: 'Rate Limits', slug: 'rate-limits', icon: SlidersHorizontal, kind: 'security', permission: 'security:manage', searchable: true, filters: ['Route', 'Window', 'Threshold'], primaryAction: 'Tune limits' },
    ],
  },
  {
    label: 'Integrations',
    icon: Cable,
    basePath: '/integrations',
    items: [
      { label: 'Payment Gateways', slug: 'payment-gateways', icon: CreditCard, kind: 'settings', permission: 'integrations:manage', searchable: true, filters: ['Provider', 'Live', 'Region'], primaryAction: 'Connect gateway' },
      { label: 'Email Providers', slug: 'email-providers', icon: Mail, kind: 'settings', permission: 'integrations:manage', searchable: true, filters: ['Primary', 'Backup', 'Status'], primaryAction: 'Configure email' },
      { label: 'SMS Providers', slug: 'sms-providers', icon: Smartphone, kind: 'settings', permission: 'integrations:manage', searchable: true, filters: ['Active', 'Fallback', 'Country'], primaryAction: 'Configure SMS' },
      { label: 'WhatsApp', slug: 'whatsapp', icon: MessageCircle, kind: 'settings', permission: 'integrations:manage', searchable: true, filters: ['Number', 'Template', 'Status'], primaryAction: 'Connect WhatsApp' },
      { label: 'Google Workspace', slug: 'google-workspace', icon: Globe, kind: 'settings', permission: 'integrations:manage', searchable: true, filters: ['Domain', 'Sync', 'Status'], primaryAction: 'Authorize Google' },
      { label: 'Microsoft 365', slug: 'microsoft-365', icon: MonitorSmartphone, kind: 'settings', permission: 'integrations:manage', searchable: true, filters: ['Tenant', 'Sync', 'Status'], primaryAction: 'Authorize Microsoft' },
      { label: 'Supabase', slug: 'supabase', icon: Database, kind: 'settings', permission: 'integrations:manage', searchable: true, filters: ['Project', 'Environment', 'Status'], primaryAction: 'Link Supabase' },
    ],
  },
  {
    label: 'Platform Settings',
    icon: Settings2,
    basePath: '/platform-settings',
    items: [
      { label: 'General', slug: 'general', icon: Sliders, kind: 'settings', permission: 'settings:manage', primaryAction: 'Save settings' },
      { label: 'Branding', slug: 'branding', icon: Sparkles, kind: 'settings', permission: 'settings:manage', primaryAction: 'Update branding' },
      { label: 'Email', slug: 'email', icon: MailCheck, kind: 'settings', permission: 'settings:manage', searchable: true, filters: ['Template', 'Sender', 'Status'], primaryAction: 'Save email config' },
      { label: 'SMS', slug: 'sms', icon: Smartphone, kind: 'settings', permission: 'settings:manage', searchable: true, filters: ['Provider', 'Template', 'Status'], primaryAction: 'Save SMS config' },
      { label: 'Notifications', slug: 'notifications', icon: Bell, kind: 'settings', permission: 'settings:manage', primaryAction: 'Save notifications' },
      { label: 'Storage', slug: 'storage', icon: HardDrive, kind: 'settings', permission: 'settings:manage', searchable: true, filters: ['Bucket', 'Retention', 'Region'], primaryAction: 'Save storage config' },
      { label: 'Localization', slug: 'localization', icon: Globe2, kind: 'settings', permission: 'settings:manage', searchable: true, filters: ['Locale', 'Timezone', 'Currency'], primaryAction: 'Save locale' },
      { label: 'Maintenance Mode', slug: 'maintenance-mode', icon: MoonStar, kind: 'operations', permission: 'settings:manage', primaryAction: 'Toggle maintenance' },
      { label: 'Environment', slug: 'environment', icon: CircleGauge, kind: 'settings', permission: 'settings:manage', searchable: true, filters: ['Development', 'Staging', 'Production'], primaryAction: 'Review environment' },
    ],
  },
  {
    label: 'Developer',
    icon: Code2,
    basePath: '/developer',
    items: [
      { label: 'API Explorer', slug: 'api-explorer', icon: FileSearch, kind: 'developer', permission: 'developer:manage', searchable: true, filters: ['Method', 'Version', 'Status'], primaryAction: 'Send request' },
      { label: 'Webhooks', slug: 'webhooks', icon: Webhook, kind: 'developer', permission: 'developer:manage', searchable: true, filters: ['Endpoint', 'Event', 'Status'], primaryAction: 'Create webhook' },
      { label: 'Environment', slug: 'environment', icon: CircleGauge, kind: 'settings', permission: 'developer:manage', searchable: true, filters: ['Key', 'Scope', 'Secret'], primaryAction: 'Sync variables' },
      { label: 'Cron Jobs', slug: 'cron-jobs', icon: CalendarClock, kind: 'developer', permission: 'developer:manage', searchable: true, filters: ['Schedule', 'State', 'Owner'], primaryAction: 'Run cron' },
      { label: 'Cache Manager', slug: 'cache-manager', icon: RotateCw, kind: 'developer', permission: 'developer:manage', searchable: true, filters: ['Namespace', 'TTL', 'State'], primaryAction: 'Clear cache' },
      { label: 'System Information', slug: 'system-information', icon: ServerCog, kind: 'operations', permission: 'developer:manage', searchable: true, filters: ['Runtime', 'Build', 'Region'], primaryAction: 'Inspect system' },
    ],
  },
  {
    label: 'Account',
    icon: User,
    basePath: '/account',
    items: [
      { label: 'My Profile', slug: 'my-profile', icon: UserCheck, kind: 'settings', permission: 'profile:read', primaryAction: 'Save profile' },
      { label: 'Preferences', slug: 'preferences', icon: SlidersHorizontal, kind: 'settings', permission: 'profile:update', primaryAction: 'Save preferences' },
      { label: 'Security', slug: 'security', icon: Fingerprint, kind: 'security', permission: 'security:self', searchable: true, filters: ['Session', 'MFA', 'Device'], primaryAction: 'Review security' },
      { label: 'Logout', slug: 'logout', icon: LogOut, kind: 'logout', permission: 'auth:logout', primaryAction: 'Sign out now' },
    ],
  },
];

function buildPath(basePath: string | undefined, slug: string) {
  if (!basePath) return '/';
  if (!slug) return basePath;
  return `${basePath}/${slug}`;
}

function buildDescription(sectionLabel: string, itemLabel: string, kind: SuperAdminPageKind) {
  const focusByKind: Record<SuperAdminPageKind, string> = {
    dashboard: 'This overview combines portfolio health, operational trends, and high-priority actions into one command center.',
    collection: 'This workspace is structured for filtering, review, and bulk operations once live data is connected.',
    create: 'This intake flow is ready for validation rules, review steps, and downstream publishing.',
    approval: 'This review queue is designed for verification, escalation, and audit-ready approval workflows.',
    report: 'This analytics view is prepared for drill-down, segmentation, and export-friendly reporting.',
    operations: 'This operational view is ready for live telemetry, queue inspection, and incident triage.',
    settings: 'This configuration area is ready for structured forms, scoped updates, and guarded saves.',
    security: 'This security workspace is prepared for risk review, hardening, and access control management.',
    developer: 'This developer workspace is built for APIs, automations, and integration diagnostics.',
    logout: 'This action leaves the portal after a final confirmation step.',
  };

  return `${itemLabel} in ${sectionLabel}. ${focusByKind[kind]}`;
}

function buildSectionItems(section: SectionSeed): SuperAdminPageConfig[] {
  return section.items.map((item) => {
    const path = buildPath(section.basePath, item.slug);

    return {
      ...item,
      path,
      sectionLabel: section.label,
      sectionPath: section.basePath,
      description: buildDescription(section.label, item.label, item.kind),
      breadcrumbs: [
        { label: 'Super Admin', href: '/dashboard' },
        ...(section.basePath && section.label !== 'Dashboard'
          ? [{ label: section.label, href: section.basePath }]
          : []),
        { label: item.label },
      ],
    };
  });
}

export const superAdminSections: SuperAdminNavSection[] = seedSections.map((section) => ({
  label: section.label,
  icon: section.icon,
  basePath: section.basePath,
  permission: section.permission,
  items: section.items.map((item) => ({
    label: item.label,
    path: buildPath(section.basePath, item.slug),
    icon: item.icon,
    permission: item.permission,
    kind: item.kind,
    searchable: item.searchable,
    filters: item.filters,
    primaryAction: item.primaryAction,
  })),
}));

export const superAdminPages = seedSections.flatMap(buildSectionItems);

export const superAdminPageMap = new Map(superAdminPages.map((page) => [page.path, page]));

export function getSuperAdminPage(pathname: string) {
  return superAdminPageMap.get(pathname);
}

export function getSuperAdminSectionPath(pathname: string) {
  return superAdminSections.find((section) => section.items.some((item) => pathname === item.path))?.basePath;
}
