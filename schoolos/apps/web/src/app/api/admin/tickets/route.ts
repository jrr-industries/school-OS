import { NextResponse } from 'next/server';
import { getDevSession } from '@/lib/dev-session';

const MOCK_TICKETS = [
  { id: '1', subject: 'Login issue', description: 'Unable to login to the dashboard', status: 'open', priority: 'high', createdBy: 'John Doe', createdAt: '2026-07-20T10:00:00Z' },
  { id: '2', subject: 'Billing inquiry', description: 'Need clarification on invoice #1234', status: 'in_progress', priority: 'medium', createdBy: 'Jane Smith', createdAt: '2026-07-19T14:30:00Z' },
  { id: '3', subject: 'Feature request', description: 'Would like to add custom roles', status: 'closed', priority: 'low', createdBy: 'Bob Johnson', createdAt: '2026-07-18T09:15:00Z' },
  { id: '4', subject: 'Data export', description: 'Need to export student data for analysis', status: 'open', priority: 'medium', createdBy: 'Alice Williams', createdAt: '2026-07-17T16:45:00Z' },
  { id: '5', subject: 'Integration problem', description: 'API integration failing with 503 errors', status: 'in_progress', priority: 'high', createdBy: 'Charlie Brown', createdAt: '2026-07-16T11:20:00Z' },
];

export async function GET(request: Request) {
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

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') ?? '1');
    const limit = parseInt(url.searchParams.get('limit') ?? '10');
    const search = url.searchParams.get('search') ?? '';
    const status = url.searchParams.get('status') ?? '';

    let filtered = [...MOCK_TICKETS];
    if (status) {
      filtered = filtered.filter((t) => t.status === status);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.subject.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.createdBy.toLowerCase().includes(q),
      );
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);

    return NextResponse.json({
      success: true,
      data,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch tickets';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
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

    const body = await request.json();
    const { subject, description, priority } = body;

    if (!subject || !description) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: subject, description' },
        { status: 400 },
      );
    }

    const newTicket = {
      id: String(Date.now()),
      subject,
      description,
      status: 'open',
      priority: priority ?? 'medium',
      createdBy: session.name,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, data: newTicket });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to create ticket';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
