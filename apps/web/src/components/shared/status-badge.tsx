import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

type StatusType = 'active' | 'inactive' | 'pending' | 'draft' | 'archived';

const statusConfig: Record<StatusType, { variant: 'success' | 'destructive' | 'warning' | 'info' | 'secondary'; label: string }> = {
  active: { variant: 'success', label: 'Active' },
  inactive: { variant: 'destructive', label: 'Inactive' },
  pending: { variant: 'warning', label: 'Pending' },
  draft: { variant: 'info', label: 'Draft' },
  archived: { variant: 'secondary', label: 'Archived' },
};

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} className={cn('rounded-lg', className)}>
      <span className={cn(
        'mr-1.5 inline-block size-1.5 rounded-full',
        status === 'active' && 'bg-success',
        status === 'inactive' && 'bg-destructive',
        status === 'pending' && 'bg-warning',
        status === 'draft' && 'bg-info',
        status === 'archived' && 'bg-muted-foreground',
      )} />
      {config.label}
    </Badge>
  );
}
