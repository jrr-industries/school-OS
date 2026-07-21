import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@schoolos/ui';
import { ArrowLeft, SearchX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl">
      <Card className="border-dashed">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <SearchX className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl">Route not found</CardTitle>
              <CardDescription>The requested super admin page does not exist.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
            <ArrowLeft className="h-4 w-4" />
            Return to dashboard
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
