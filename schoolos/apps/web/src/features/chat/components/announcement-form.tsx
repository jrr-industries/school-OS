'use client';

import { useState } from 'react';
import { Loader2, Plus, Globe, Building2 } from 'lucide-react';
import type { AnnouncementTarget, CreateAnnouncementPayload } from '../types';

export function AnnouncementForm({
  onSubmit,
  onClose,
}: {
  onSubmit: (payload: CreateAnnouncementPayload) => Promise<void>;
  onClose: () => void;
}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [target, setTarget] = useState<AnnouncementTarget>('all_schools');
  const [priority, setPriority] = useState('normal');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      await onSubmit({ title: title.trim(), content: content.trim() || undefined, target, priority });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create announcement');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-background rounded-xl shadow-xl w-full max-w-lg p-6 mx-4 border" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold mb-4">New Announcement</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Announcement title"
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              placeholder="Announcement details..."
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Target</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setTarget('all_schools')}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-lg border p-2.5 text-sm transition-colors ${
                    target === 'all_schools'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-input hover:bg-muted'
                  }`}
                >
                  <Globe className="h-4 w-4" />
                  All Schools
                </button>
                <button
                  type="button"
                  onClick={() => setTarget('specific_school')}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-lg border p-2.5 text-sm transition-colors ${
                    target === 'specific_school'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-input hover:bg-muted'
                  }`}
                >
                  <Building2 className="h-4 w-4" />
                  Specific
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !title.trim()}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors gap-2 disabled:opacity-50"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              <Plus className="h-4 w-4" />
              Publish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
