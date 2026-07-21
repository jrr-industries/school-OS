export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface NavSection {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: NavItem[];
}

export interface Permission {
  resource: string;
  actions: string[];
}

export interface UserRole {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface SuperAdminUser {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN';
  permissions: string[];
}

export interface PageConfig {
  title: string;
  description: string;
  breadcrumbs: BreadcrumbItem[];
  permissions?: string[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface ToolbarAction {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  disabled?: boolean;
}

export interface FilterOption {
  key: string;
  label: string;
  type: 'select' | 'multiselect' | 'date' | 'daterange' | 'text' | 'number';
  options?: { value: string; label: string }[];
  placeholder?: string;
}

export interface ColumnDef<T> {
  key: string;
  header: string;
  width?: string;
  render?: (row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  selection?: {
    selected: string[];
    onChange: (selected: string[]) => void;
  };
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
  };
}

export interface PageState {
  loading: boolean;
  error: Error | null;
  data: unknown;
}

export type ViewMode = 'table' | 'grid' | 'list';