'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';

interface Payment {
  id: string;
  transactionId: string;
  school: string;
  method: string;
  amount: string;
  date: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
}

const payments: Payment[] = [
  { id: '1', transactionId: 'PAY-10001', school: 'Lincoln High School', method: 'Visa ending in 4242', amount: '$299.00', date: '2024-05-18', status: 'completed' },
  { id: '2', transactionId: 'PAY-10002', school: 'Springfield Elementary', method: 'ACH - Bank of America', amount: '$99.00', date: '2024-05-17', status: 'completed' },
  { id: '3', transactionId: 'PAY-10003', school: 'Riverside Academy', method: 'PayPal', amount: '$99.00', date: '2024-05-16', status: 'completed' },
  { id: '4', transactionId: 'PAY-10004', school: 'Westside Academy', method: 'Mastercard ending in 8888', amount: '$29.00', date: '2024-05-15', status: 'pending' },
  { id: '5', transactionId: 'PAY-10005', school: 'Bright Future School', method: 'ACH - Wells Fargo', amount: '$297.00', date: '2024-05-14', status: 'failed' },
  { id: '6', transactionId: 'PAY-10006', school: 'Harmony Institute', method: 'Visa ending in 1234', amount: '$299.00', date: '2024-05-12', status: 'completed' },
  { id: '7', transactionId: 'PAY-10007', school: 'Oakwood Preparatory', method: 'PayPal', amount: '$29.00', date: '2024-05-10', status: 'refunded' },
  { id: '8', transactionId: 'PAY-10008', school: 'Mountain View Middle', method: 'Discover ending in 5678', amount: '$29.00', date: '2024-05-08', status: 'completed' },
];

const statusStyles: Record<string, string> = {
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  refunded: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
};

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Payments</h1>
        <p className="text-sm text-muted-foreground mt-1">Payment transaction history</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payments ({payments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="text-left font-medium py-3 px-4">Transaction ID</th>
                  <th className="text-left font-medium py-3 px-4">School</th>
                  <th className="text-left font-medium py-3 px-4">Method</th>
                  <th className="text-left font-medium py-3 px-4">Amount</th>
                  <th className="text-left font-medium py-3 px-4">Date</th>
                  <th className="text-right font-medium py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <td className="py-3 px-4 font-mono text-xs">{payment.transactionId}</td>
                    <td className="py-3 px-4">
                      <strong>{payment.school}</strong>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{payment.method}</td>
                    <td className="py-3 px-4 font-medium">{payment.amount}</td>
                    <td className="py-3 px-4 text-muted-foreground">{payment.date}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[payment.status]}`}>
                        {payment.status}
                      </span>
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
