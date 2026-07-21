'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { LifeBuoy, Eye, Edit, MoreHorizontal } from 'lucide-react';

interface Article {
  id: number;
  title: string;
  category: string;
  views: number;
  lastUpdated: string;
  status: 'Published' | 'Draft';
}

const mockArticles: Article[] = [
  { id: 1, title: 'Getting Started with SchoolOS', category: 'Getting Started', views: 3420, lastUpdated: '2026-07-15', status: 'Published' },
  { id: 2, title: 'How to Create and Manage Classes', category: 'Getting Started', views: 2150, lastUpdated: '2026-07-14', status: 'Published' },
  { id: 3, title: 'Understanding Your Subscription Plan', category: 'Billing', views: 1870, lastUpdated: '2026-07-12', status: 'Published' },
  { id: 4, title: 'How to Update Payment Method', category: 'Billing', views: 1420, lastUpdated: '2026-07-10', status: 'Published' },
  { id: 5, title: 'Troubleshooting Login Issues', category: 'Technical', views: 2890, lastUpdated: '2026-07-18', status: 'Published' },
  { id: 6, title: 'API Integration Guide', category: 'Technical', views: 980, lastUpdated: '2026-07-08', status: 'Published' },
  { id: 7, title: 'Common Error Codes and Solutions', category: 'Technical', views: 1560, lastUpdated: '2026-07-16', status: 'Draft' },
  { id: 8, title: 'How to Export Student Reports', category: 'FAQs', views: 2340, lastUpdated: '2026-07-11', status: 'Published' },
  { id: 9, title: 'Data Privacy and Security FAQs', category: 'FAQs', views: 1120, lastUpdated: '2026-07-09', status: 'Published' },
  { id: 10, title: 'Platform Requirements and Compatibility', category: 'Getting Started', views: 1890, lastUpdated: '2026-07-17', status: 'Published' },
];

const categoryColors: Record<string, string> = {
  'Getting Started': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
  Billing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  Technical: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  FAQs: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
};

export default function KnowledgeBasePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Knowledge Base</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage help articles and documentation</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <LifeBuoy className="h-5 w-5 text-primary" />
            Articles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Title</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Category</th>
                  <th className="text-right py-3 px-2 font-medium text-muted-foreground">Views</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Last Updated</th>
                  <th className="text-right py-3 px-2 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockArticles.map((article) => (
                  <tr key={article.id} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-3 px-2 font-medium">{article.title}</td>
                    <td className="py-3 px-2">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryColors[article.category]}`}>
                        {article.category}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right text-muted-foreground">{article.views.toLocaleString()}</td>
                    <td className="py-3 px-2">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        article.status === 'Published'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                      }`}>
                        {article.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-xs text-muted-foreground">{article.lastUpdated}</td>
                    <td className="py-3 px-2 text-right">
                      <button className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="View">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Edit">
                        <Edit className="h-4 w-4" />
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
