import { School } from 'lucide-react';

export default function SchoolAdminLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <School className="h-10 w-10 animate-pulse text-primary" />
        <div className="h-4 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-bounce rounded-full bg-primary" style={{ animationDelay: '0ms' }} />
          <div className="h-2 w-2 animate-bounce rounded-full bg-primary" style={{ animationDelay: '150ms' }} />
          <div className="h-2 w-2 animate-bounce rounded-full bg-primary" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
