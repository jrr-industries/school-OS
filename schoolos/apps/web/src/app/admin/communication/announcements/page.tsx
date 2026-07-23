'use client';

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useAnnouncementsRealtime } from '@/features/chat/hooks/use-chat-realtime';
import { AnnouncementList } from '@/features/chat/components/announcement-list';
import { AnnouncementForm } from '@/features/chat/components/announcement-form';
import type { Announcement, CreateAnnouncementPayload } from '@/features/chat/types';

async function fetchAnnouncements(): Promise<Announcement[]> {
  const res = await fetch('/api/admin/announcements');
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? 'Failed to fetch announcements');
  return json.data;
}

export default function AnnouncementsPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const { data: announcements, isLoading, error } = useQuery({
    queryKey: ['announcements'],
    queryFn: fetchAnnouncements,
  });

  useAnnouncementsRealtime();

  const createMutation = useMutation({
    mutationFn: async (payload: CreateAnnouncementPayload) => {
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error ?? 'Failed to create announcement');
      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });

  const handleCreate = useCallback(async (payload: CreateAnnouncementPayload) => {
    await createMutation.mutateAsync(payload);
  }, [createMutation]);

  const handleRetry = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['announcements'] });
  }, [queryClient]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Announcements</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create and manage platform-wide announcements
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Announcement
        </button>
      </div>

      <AnnouncementList
        announcements={announcements ?? []}
        loading={isLoading}
        error={error instanceof Error ? error.message : null}
        onRetry={handleRetry}
      />

      {showForm && (
        <AnnouncementForm
          onSubmit={handleCreate}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
