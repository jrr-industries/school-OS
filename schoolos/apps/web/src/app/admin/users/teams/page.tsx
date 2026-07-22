'use client';

import { Card, CardContent } from '@schoolos/ui';
import { Box, Users } from 'lucide-react';

interface Team {
  id: string;
  name: string;
  description: string;
  members: number;
  leads: string;
}

const mockTeams: Team[] = [
  { id: '1', name: 'Platform Engineering', description: 'Responsible for core platform development and infrastructure', members: 12, leads: 'David Chen' },
  { id: '2', name: 'Customer Success', description: 'Handles onboarding, training, and customer satisfaction', members: 8, leads: 'Sarah Miller' },
  { id: '3', name: 'Content Team', description: 'Creates educational content and curriculum materials', members: 15, leads: 'Emily Davis' },
  { id: '4', name: 'Quality Assurance', description: 'Ensures platform quality through testing and monitoring', members: 6, leads: 'Michael Brown' },
  { id: '5', name: 'Data & Analytics', description: 'Manages data pipelines, reporting, and business intelligence', members: 4, leads: 'Jessica Martinez' },
  { id: '6', name: 'Security & Compliance', description: 'Oversees platform security, audits, and regulatory compliance', members: 5, leads: 'Robert Wilson' },
  { id: '7', name: 'Sales & Marketing', description: 'Drives platform growth and market presence', members: 10, leads: 'Amanda Garcia' },
  { id: '8', name: 'Human Resources', description: 'Manages hiring, onboarding, and employee relations', members: 3, leads: 'Lisa Anderson' },
];

const teamColors = [
  'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
];

export default function TeamsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Teams</h1>
        <p className="text-sm text-muted-foreground mt-1">Organize users into teams</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {mockTeams.map((team, index) => (
          <Card key={team.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className={`rounded-lg p-2.5 ${teamColors[index % teamColors.length]}`}>
                  <Box className="h-5 w-5" />
                </div>
                <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                  {team.members} {team.members === 1 ? 'member' : 'members'}
                </span>
              </div>
              <p className="mt-4 text-base font-semibold">{team.name}</p>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{team.description}</p>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                <span>Lead: {team.leads}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
