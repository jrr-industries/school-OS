import Link from 'next/link';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import { Button } from '@schoolos/ui';

export default function SchoolAdminNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <div className="rounded-full bg-muted p-4">
        <FileQuestion className="h-10 w-10 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-semibold">Page Not Found</h2>
      <p className="max-w-md text-center text-sm text-muted-foreground">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/school-admin/dashboard">
        <Button className="gap-2 mt-2">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Button>
      </Link>
    </div>
  );
}
