'use client';

import { useState, useCallback } from 'react';
import { X, Search, Send, MessageSquare } from 'lucide-react';
import { forwardMessageAction } from '../actions/chat-actions';
import type { Conversation } from '../types';

export function ForwardMessageDialog({
  conversations,
  messageId,
  onClose,
  onSuccess,
}: {
  conversations: Conversation[];
  messageId: string;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [forwarding, setForwarding] = useState(false);

  const filtered = query
    ? conversations.filter((c) => {
        const name = c.title ?? c.participants.map((p) => p.user.name).join(', ');
        return name.toLowerCase().includes(query.toLowerCase());
      })
    : conversations;

  const handleForward = useCallback(async () => {
    if (!selectedId) return;
    setForwarding(true);
    try {
      await forwardMessageAction(messageId, selectedId);
      onSuccess?.();
      onClose();
    } catch {
    } finally {
      setForwarding(false);
    }
  }, [selectedId, messageId, onClose, onSuccess]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="w-full max-w-md rounded-xl border bg-popover shadow-lg p-4 max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm">Forward message</h3>
          <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="relative mb-3">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full h-9 rounded-lg border border-input bg-background pl-8 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            autoFocus
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-1">
          {filtered.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">No conversations found</p>
          ) : (
            filtered.map((c) => {
              const name = c.title ?? c.participants.map((p) => p.user.name).join(', ');
              const isSelected = selectedId === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors ${
                    isSelected ? 'bg-primary/10 ring-1 ring-primary' : 'hover:bg-muted'
                  }`}
                >
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <MessageSquare className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{name}</p>
                    {c.lastMessage && (
                      <p className="text-xs text-muted-foreground truncate">{c.lastMessage.content}</p>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t">
          <button onClick={onClose} className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            Cancel
          </button>
          <button
            onClick={handleForward}
            disabled={!selectedId || forwarding}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Send className="h-3.5 w-3.5" />
            {forwarding ? 'Forwarding...' : 'Forward'}
          </button>
        </div>
      </div>
    </div>
  );
}
