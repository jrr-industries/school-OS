'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { UserPlus, Send } from 'lucide-react';

export default function InviteUserPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Invite User</h1>
        <p className="text-sm text-muted-foreground mt-1">Send an invitation to join the platform</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Invitation Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email Address</label>
            <input
              type="email"
              placeholder="colleague@school.edu"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Role</label>
            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <option value="">Select a role...</option>
              <option value="school_admin">School Admin</option>
              <option value="teacher">Teacher</option>
              <option value="parent">Parent</option>
              <option value="support_agent">Support Agent</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Message (optional)</label>
            <textarea
              rows={4}
              placeholder="Add a personal message to the invitation..."
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="flex justify-end pt-2">
            <button className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors gap-2">
              <Send className="h-4 w-4" />
              Send Invite
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
