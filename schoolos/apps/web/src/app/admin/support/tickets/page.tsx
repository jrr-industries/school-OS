'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { Headphones, Eye, MoreHorizontal } from 'lucide-react';

interface Ticket {
  id: string;
  school: string;
  subject: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  assignedTo: string;
  lastUpdated: string;
}

const mockTickets: Ticket[] = [
  { id: 'TKT-001', school: 'Springfield Elementary', subject: 'Unable to access grade portal', priority: 'High', status: 'Open', assignedTo: 'Alice Chen', lastUpdated: '2026-07-21 09:30' },
  { id: 'TKT-002', school: 'Lincoln High School', subject: 'Billing discrepancy on invoice #INV-2026', priority: 'Critical', status: 'In Progress', assignedTo: 'Bob Smith', lastUpdated: '2026-07-21 08:15' },
  { id: 'TKT-003', school: 'Riverside Academy', subject: 'New teacher account creation failed', priority: 'Medium', status: 'Open', assignedTo: 'Unassigned', lastUpdated: '2026-07-20 16:45' },
  { id: 'TKT-004', school: 'Oakwood Preparatory', subject: 'Feature request: bulk student import', priority: 'Low', status: 'Resolved', assignedTo: 'Alice Chen', lastUpdated: '2026-07-19 14:20' },
  { id: 'TKT-005', school: 'Mountain View Middle', subject: 'System outage affecting grade submissions', priority: 'Critical', status: 'In Progress', assignedTo: 'Bob Smith', lastUpdated: '2026-07-21 07:00' },
  { id: 'TKT-006', school: 'Springfield Elementary', subject: 'Password reset not working', priority: 'Medium', status: 'Closed', assignedTo: 'Carol Davis', lastUpdated: '2026-07-18 11:30' },
];

const priorityColors: Record<string, string> = {
  Low: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
  Medium: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  High: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  Critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const statusColors: Record<string, string> = {
  Open: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  Resolved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  Closed: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
};

export default function TicketsPage() {
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const totalPages = Math.ceil(mockTickets.length / pageSize);
  const paginated = mockTickets.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Support Tickets</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage platform support requests</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Headphones className="h-5 w-5 text-primary" />
            All Tickets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">ID</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">School</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Subject</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Priority</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Assigned To</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Last Updated</th>
                  <th className="text-right py-3 px-2 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((ticket) => (
                  <tr key={ticket.id} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-3 px-2 font-mono text-xs font-medium">{ticket.id}</td>
                    <td className="py-3 px-2">{ticket.school}</td>
                    <td className="py-3 px-2 max-w-xs truncate">{ticket.subject}</td>
                    <td className="py-3 px-2">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityColors[ticket.priority]}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[ticket.status]}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-muted-foreground">{ticket.assignedTo}</td>
                    <td className="py-3 px-2 text-xs text-muted-foreground">{ticket.lastUpdated}</td>
                    <td className="py-3 px-2 text-right">
                      <button className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="View ticket">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="More actions">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-muted-foreground">
              Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, mockTickets.length)} of {mockTickets.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="rounded-md border border-input px-3 py-1.5 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                    page === p
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-input hover:bg-slate-50 dark:hover:bg-slate-900'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="rounded-md border border-input px-3 py-1.5 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
