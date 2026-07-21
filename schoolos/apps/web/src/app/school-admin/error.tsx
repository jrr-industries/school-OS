'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@schoolos/ui';

export default function SchoolAdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <div className="rounded-full bg-destructive/10 p-4">
        <AlertTriangle className="h-10 w-10 text-destructive" />
      </div>
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <p className="max-w-md text-center text-sm text-muted-foreground">
        An unexpected error occurred. Please try again or contact support if the problem persists.
      </p>
      {error.digest && (
        <p className="text-xs text-muted-foreground">Error ID: {error.digest}</p>
      )}
      <Button onClick={reset} className="gap-2 mt-2">
        <RefreshCw className="h-4 w-4" /> Try Again
      </Button>
    </div>
  );
}
