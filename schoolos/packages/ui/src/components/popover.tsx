'use client';

import { forwardRef, createContext, useContext, useState, useCallback, useRef, useEffect, cloneElement, isValidElement } from 'react';
import { cn } from '../lib/utils';

interface PopoverContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const PopoverContext = createContext<PopoverContextValue | null>(null);

function usePopoverContext() {
  const context = useContext(PopoverContext);
  if (!context) {
    throw new Error('Popover components must be used within a Popover provider');
  }
  return context;
}

interface PopoverProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export const Popover = ({ open: controlledOpen, defaultOpen = false, onOpenChange, children }: PopoverProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [isControlled, onOpenChange],
  );

  return (
    <PopoverContext.Provider value={{ open, setOpen }}>
      {children}
    </PopoverContext.Provider>
  );
};

Popover.displayName = 'Popover';

interface PopoverTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const PopoverTrigger = forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  ({ className, children, asChild, ...props }, ref) => {
    const { open, setOpen } = usePopoverContext();

    if (asChild && isValidElement(children)) {
      const childProps = children.props as Record<string, unknown>;
      return cloneElement(children, {
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          (childProps.onClick as ((e: React.MouseEvent<HTMLElement>) => void) | undefined)?.(e);
          setOpen(!open);
        },
        'aria-haspopup': 'dialog' as const,
        'aria-expanded': open,
      } as Record<string, unknown>);
    }

    return (
      <button
        ref={ref}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn('inline-flex items-center justify-center whitespace-nowrap', className)}
        onClick={() => setOpen(!open)}
        {...props}
      >
        {children}
      </button>
    );
  },
);

PopoverTrigger.displayName = 'PopoverTrigger';

interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'bottom' | 'left' | 'right';
  sideOffset?: number;
}

export const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ className, children, align = 'center', side, sideOffset = 4, ...props }, ref) => {
    const { open, setOpen } = usePopoverContext();
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!open) return;

      const handleClickOutside = (event: MouseEvent) => {
        if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
          setOpen(false);
        }
      };

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }, [open, setOpen]);

    if (!open) return null;

    return (
      <div
        ref={(node) => {
          contentRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        className={cn(
          'z-50 min-w-[8rem] overflow-hidden rounded-md border border-input bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

PopoverContent.displayName = 'PopoverContent';
