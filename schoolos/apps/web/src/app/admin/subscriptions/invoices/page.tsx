'use client';

import { Download } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';

interface Invoice {
  id: string;
  invoiceId: string;
  school: string;
  plan: string;
  amount: string;
  date: string;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
}

const invoices: Invoice[] = [
  { id: '1', invoiceId: 'INV-2024-001', school: 'Lincoln High School', plan: 'Enterprise', amount: '$299.00', date: '2024-05-01', status: 'paid' },
  { id: '2', invoiceId: 'INV-2024-002', school: 'Springfield Elementary', plan: 'Pro', amount: '$99.00', date: '2024-05-01', status: 'paid' },
  { id: '3', invoiceId: 'INV-2024-003', school: 'Riverside Academy', plan: 'Pro', amount: '$99.00', date: '2024-05-01', status: 'pending' },
  { id: '4', invoiceId: 'INV-2024-004', school: 'Westside Academy', plan: 'Basic', amount: '$29.00', date: '2024-05-01', status: 'overdue' },
  { id: '5', invoiceId: 'INV-2024-005', school: 'Bright Future School', plan: 'Pro', amount: '$297.00', date: '2024-04-01', status: 'paid' },
  { id: '6', invoiceId: 'INV-2024-006', school: 'Harmony Institute', plan: 'Enterprise', amount: '$299.00', date: '2024-04-01', status: 'cancelled' },
  { id: '7', invoiceId: 'INV-2024-007', school: 'Oakwood Preparatory', plan: 'Basic', amount: '$29.00', date: '2024-05-15', status: 'pending' },
  { id: '8', invoiceId: 'INV-2024-008', school: 'Mountain View Middle', plan: 'Basic', amount: '$29.00', date: '2024-03-01', status: 'overdue' },
];

const statusStyles: Record<string, string> = {
  paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  overdue: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  cancelled: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
};

export default function InvoicesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Invoices</h1>
        <p className="text-sm text-muted-foreground mt-1">All platform invoices</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Invoices ({invoices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="text-left font-medium py-3 px-4">Invoice ID</th>
                  <th className="text-left font-medium py-3 px-4">School</th>
                  <th className="text-left font-medium py-3 px-4">Plan</th>
                  <th className="text-left font-medium py-3 px-4">Amount</th>
                  <th className="text-left font-medium py-3 px-4">Date</th>
                  <th className="text-left font-medium py-3 px-4">Status</th>
                  <th className="text-right font-medium py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <td className="py-3 px-4 font-mono text-xs">{inv.invoiceId}</td>
                    <td className="py-3 px-4">
                      <strong>{inv.school}</strong>
                    </td>
                    <td className="py-3 px-4">{inv.plan}</td>
                    <td className="py-3 px-4 font-medium">{inv.amount}</td>
                    <td className="py-3 px-4 text-muted-foreground">{inv.date}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[inv.status]}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent"
                        aria-label="Download invoice"
                      >
                        <Download className="h-3.5 w-3.5" />
                        PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
