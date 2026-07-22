import { NextResponse } from 'next/server';
import { prisma } from '@schoolos/database';
import { getDevSession } from '@/lib/dev-session';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { success: false, error: 'Only available in development mode' },
      { status: 403 },
    );
  }

  try {
    const session = await getDevSession();
    if (!session || session.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const { id } = await params;

    const sub = await prisma.subscription.findUnique({
      where: { id },
      include: {
        school: { select: { name: true } },
        plan: { select: { name: true, price: true, currency: true, interval: true } },
      },
    });

    if (!sub) {
      return new NextResponse('Invoice not found', { status: 404 });
    }

    const amount = Number(sub.plan.price);
    const currency = sub.plan.currency;
    const invoiceStatus =
      sub.status === 'active' ? 'Paid' :
      sub.status === 'past_due' ? 'Overdue' :
      sub.status === 'cancelled' ? 'Cancelled' :
      'Pending';

    const formatCurrency = (n: number, c: string) =>
      new Intl.NumberFormat('en-US', { style: 'currency', currency: c }).format(n);

    const formatDate = (d: Date | null | undefined) =>
      d ? d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';

    const invoiceNumber = `INV-${sub.createdAt.getFullYear()}-${id.slice(0, 8).toUpperCase()}`;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Invoice ${invoiceNumber}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #18181b; line-height: 1.5; padding: 40px;
  }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
  .brand h1 { font-size: 24px; font-weight: 700; color: #09090b; }
  .brand p { font-size: 13px; color: #71717a; }
  .invoice-info { text-align: right; }
  .invoice-info h2 { font-size: 28px; font-weight: 300; color: #18181b; }
  .invoice-info p { font-size: 13px; color: #71717a; }
  .divider { border: none; border-top: 2px solid #e4e4e7; margin-bottom: 24px; }
  .details { display: flex; justify-content: space-between; margin-bottom: 32px; }
  .details h3 { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #71717a; margin-bottom: 6px; }
  .details p { font-size: 14px; color: #18181b; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
  th { text-align: left; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #71717a; padding: 10px 12px; border-bottom: 1px solid #e4e4e7; }
  td { padding: 12px; font-size: 14px; border-bottom: 1px solid #f4f4f5; }
  td:last-child, th:last-child { text-align: right; }
  .total-row td { font-weight: 700; font-size: 16px; border-bottom: none; padding-top: 16px; }
  .total-row td:last-child { font-size: 20px; }
  .status-badge {
    display: inline-block; padding: 2px 10px; border-radius: 999px;
    font-size: 11px; font-weight: 600; border: 1px solid;
  }
  .status-paid { background: #ecfdf5; color: #059669; border-color: #a7f3d0; }
  .status-pending { background: #fffbeb; color: #d97706; border-color: #fde68a; }
  .status-overdue { background: #fef2f2; color: #dc2626; border-color: #fecaca; }
  .status-cancelled { background: #f4f4f5; color: #71717a; border-color: #d4d4d8; }
  .footer { margin-top: 48px; font-size: 12px; color: #a1a1aa; text-align: center; border-top: 1px solid #e4e4e7; padding-top: 16px; }
  @media print {
    body { padding: 20px; }
    @page { margin: 15mm; }
  }
</style>
</head>
<body>
  <div class="header">
    <div class="brand">
      <h1>SchoolOS</h1>
      <p>Education Management Platform</p>
    </div>
    <div class="invoice-info">
      <h2>Invoice</h2>
      <p>${invoiceNumber}</p>
    </div>
  </div>
  <hr class="divider" />
  <div class="details">
    <div>
      <h3>Bill To</h3>
      <p>${sub.school.name}</p>
    </div>
    <div>
      <h3>Invoice Date</h3>
      <p>${formatDate(sub.createdAt)}</p>
    </div>
    <div>
      <h3>Due Date</h3>
      <p>${formatDate(sub.endsAt)}</p>
    </div>
    <div>
      <h3>Status</h3>
      <p><span class="status-badge status-${sub.status === 'active' ? 'paid' : sub.status === 'past_due' ? 'overdue' : sub.status === 'cancelled' ? 'cancelled' : 'pending'}">${invoiceStatus}</span></p>
    </div>
  </div>
  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th>Plan</th>
        <th>Interval</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>${sub.plan.name} Subscription</td>
        <td>${sub.plan.name}</td>
        <td style="text-transform: capitalize">${sub.plan.interval}</td>
        <td>${formatCurrency(amount, currency)}</td>
      </tr>
    </tbody>
  </table>
  <table>
    <tr class="total-row">
      <td colspan="3">Total</td>
      <td>${formatCurrency(amount, currency)}</td>
    </tr>
  </table>
  <div class="footer">
    <p>SchoolOS — Education Management Platform</p>
    <p>For questions regarding this invoice, please contact support@schoolos.dev</p>
  </div>
  <script>window.onload = function() { window.print(); }</script>
</body>
</html>`;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[Invoice Download Error]', error);
    }
    return new NextResponse('Failed to generate invoice', { status: 500 });
  }
}
