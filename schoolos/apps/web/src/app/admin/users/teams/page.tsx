'use client';

import { Card, CardContent } from '@schoolos/ui';
import { Box, Users } from 'lucide-react';

interface Team {
  id: string;
  name: string;
  description: string;
  members: number;
}

const mockTeams: Team[] = [
  { id: '1', name: 'Platform Engineering', description: 'Responsible for core platform development and infrastructure', members: 12 },
  { id: '2', name: 'Customer Success', description: 'Handles onboarding, training, and customer satisfaction', members: 8 },
  { id: '3', name: 'Content Team', description: 'Creates educational content and curriculum materials', members: 15 },
  { id: '4', name: 'Quality Assurance', description: 'Ensures platform quality through testing and monitoring', members: 6 },
  { id: '5', name: 'Data & Analytics', description: 'Manages data pipelines, reporting, and business intelligence', members: 4 },
  { id: '6', name: 'Security & Compliance', description: 'Oversees platform security, audits, and regulatory compliance', members: 5 },
];

export default function TeamsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Teams</h1>
        <p className="text-sm text-muted-foreground mt-1">Organize users into teams</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockTeams.map((team) => (
          <Card key={team.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Box className="h-5 w-5 text-primary" />
                </div>
              </div>
              <p className="mt-4 text-base font-semibold">{team.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{team.description}</p>
              <div className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{team.members} members</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
