'use client';

import { RefreshCw, AlertCircle, FileText, Plus, Search, Filter } from 'lucide-react';
import { Button } from '@schoolos/ui';

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'primary' | 'secondary' | 'outline';
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ icon: Icon = FileText, title, description, action, secondaryAction, className }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-12 rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 ${className || ''}`}>
      <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        <Icon className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-medium text-foreground">{title}</h3>
      {description && <p className="mt-1 text-sm text-muted-foreground max-w-sm">{description}</p>}
      {(action || secondaryAction) && (
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          {action && (
            <Button variant={action.variant || 'primary'} onClick={action.onClick} className="gap-2">
              <Plus className="h-4 w-4" aria-hidden="true" />
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="outline" onClick={secondaryAction.onClick} className="gap-2">
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}