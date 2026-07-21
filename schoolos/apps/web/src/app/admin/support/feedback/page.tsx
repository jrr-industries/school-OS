'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { HeartPulse, Star, Eye, MoreHorizontal } from 'lucide-react';

interface FeedbackItem {
  id: number;
  user: string;
  school: string;
  category: 'Bug Report' | 'Feature Request' | 'General';
  rating: number;
  title: string;
  description: string;
  status: 'Under Review' | 'Planned' | 'Implemented' | 'Declined';
  submittedDate: string;
}

const mockFeedback: FeedbackItem[] = [
  { id: 1, user: 'Sarah Johnson', school: 'Springfield Elementary', category: 'Feature Request', rating: 5, title: 'Bulk grade import from CSV', description: 'It would be very helpful to import grades from a CSV file instead of entering them manually.', status: 'Planned', submittedDate: '2026-07-20' },
  { id: 2, user: 'Michael Torres', school: 'Lincoln High School', category: 'Bug Report', rating: 2, title: 'Grade calculation error in report cards', description: 'The final grade calculation shows incorrect percentages when weighted categories are used.', status: 'Under Review', submittedDate: '2026-07-19' },
  { id: 3, user: 'Emily Davis', school: 'Riverside Academy', category: 'General', rating: 4, title: 'Parent communication portal', description: 'Would love to see a dedicated portal for parents to communicate with teachers directly.', status: 'Planned', submittedDate: '2026-07-18' },
  { id: 4, user: 'David Kim', school: 'Oakwood Preparatory', category: 'Feature Request', rating: 5, title: 'Mobile app for attendance tracking', description: 'A mobile app would make it much easier for teachers to take attendance on the go.', status: 'Under Review', submittedDate: '2026-07-17' },
  { id: 5, user: 'Jessica Lee', school: 'Mountain View Middle', category: 'Bug Report', rating: 1, title: 'App crashes when uploading large files', description: 'The system crashes when trying to upload files larger than 10MB in the assignments section.', status: 'Implemented', submittedDate: '2026-07-16' },
  { id: 6, user: 'Robert Wilson', school: 'Springfield Elementary', category: 'General', rating: 3, title: 'Better onboarding tutorials', description: 'New teachers could benefit from more detailed onboarding tutorials and walkthroughs.', status: 'Declined', submittedDate: '2026-07-15' },
];

const categoryColors: Record<string, string> = {
  'Bug Report': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  'Feature Request': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  General: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
};

const statusColors: Record<string, string> = {
  'Under Review': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  Planned: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  Implemented: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  Declined: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
};

export default function FeedbackPage() {
  const [activeTab, setActiveTab] = useState('All');

  const tabs = ['All', 'Bug Report', 'Feature Request', 'General'];
  const filtered = activeTab === 'All' ? mockFeedback : mockFeedback.filter((f) => f.category === activeTab);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Feedback</h1>
        <p className="text-sm text-muted-foreground mt-1">User-submitted feedback and feature requests</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <HeartPulse className="h-5 w-5 text-primary" />
            All Feedback
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-input bg-background hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">User</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Title</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Category</th>
                  <th className="text-center py-3 px-2 font-medium text-muted-foreground">Rating</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Date</th>
                  <th className="text-right py-3 px-2 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-3 px-2">
                      <div>
                        <p className="font-medium text-xs">{item.user}</p>
                        <p className="text-xs text-muted-foreground">{item.school}</p>
                      </div>
                    </td>
                    <td className="py-3 px-2 max-w-xs">
                      <p className="font-medium truncate">{item.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryColors[item.category]}`}>
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <div className="flex items-center justify-center gap-0.5">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              i < item.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300 dark:text-slate-600'
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[item.status]}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-xs text-muted-foreground">{item.submittedDate}</td>
                    <td className="py-3 px-2 text-right">
                      <button className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="View">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="More">
                        <MoreHorizontal className="h-4 w-4" />
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
