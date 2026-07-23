'use client';

import { useState } from 'react';
import { X, Loader2, Upload } from 'lucide-react';
import type { CreateAnnouncementPayload, AnnouncementTarget } from '../types';

export function AnnouncementForm({
  onSubmit,
  onClose,
  isSubmitting,
}: {
  onSubmit: (payload: CreateAnnouncementPayload) => void;
  onClose: () => void;
  isSubmitting?: boolean;
}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [target, setTarget] = useState<AnnouncementTarget>('all_schools');
  const [priority, setPriority] = useState('normal');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      content: content.trim() || undefined,
      target,
      priority,
      attachmentUrl: attachmentUrl || undefined,
      attachmentName: attachmentName || undefined,
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const json = await res.json();
      if (json.success) {
        setAttachmentUrl(json.data.url);
        setAttachmentName(json.data.name);
      }
    } catch { /* ignore */ }
    setUploading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-card rounded-xl border shadow-xl w-full max-w-lg mx-4 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">New Announcement</h2>
          <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Announcement title"
              required
              className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Announcement content..."
              rows={4}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Target</label>
              <select
                value={target}
                onChange={(e) => setTarget(e.target.value as AnnouncementTarget)}
                className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="all_schools">All Schools</option>
                <option value="specific_school">Specific School</option>
                <option value="multiple_schools">Multiple Schools</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Attachment (optional)</label>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-input bg-background text-sm cursor-pointer hover:bg-muted transition-colors">
                <Upload className="h-4 w-4" />
                {uploading ? 'Uploading...' : 'Upload File'}
                <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
              </label>
              {attachmentName && (
                <span className="text-xs text-muted-foreground truncate flex-1">{attachmentName}</span>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-input hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || isSubmitting}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />Sending...</span>
              ) : 'Send Announcement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
