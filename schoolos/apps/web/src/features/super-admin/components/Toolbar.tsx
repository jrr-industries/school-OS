'use client';

import { ReactNode } from 'react';
import { Button } from '@schoolos/ui';

export interface ToolbarProps {
  children: ReactNode;
  className?: string;
}

export function Toolbar({ children, className }: ToolbarProps) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className || ''}`}>
      {children}
    </div>
  );
}

export interface ToolbarGroupProps {
  children: ReactNode;
  className?: string;
}

export function ToolbarGroup({ children, className }: ToolbarGroupProps) {
  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      {children}
    </div>
  );
}

export interface ToolbarButtonProps {
  children: ReactNode;
  onClick: () => void;
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  icon?: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export function ToolbarButton({
  children,
  onClick,
  variant = 'default',
  icon,
  disabled,
  loading,
  className,
}: ToolbarButtonProps) {
  const buttonVariant = variant === 'primary' ? 'default' : variant;
  return (
    <Button
      variant={buttonVariant}
      onClick={onClick}
      disabled={disabled || loading}
      className={`gap-2 ${className || ''}`}
    >
      {loading ? (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      ) : icon ? (
        <span>{icon}</span>
      ) : null}
      {children}
    </Button>
  );
}