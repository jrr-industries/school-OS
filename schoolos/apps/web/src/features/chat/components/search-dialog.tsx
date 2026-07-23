'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, MessageSquare, X, ArrowUp, ArrowDown, Loader2 } from 'lucide-react';
import type { ChatMessage, Conversation } from '../types';

interface SearchResult {
  type: 'conversation' | 'message';
  id: string;
  title?: string;
  content?: string;
  conversationId?: string;
  conversationTitle?: string;
  senderName?: string;
  createdAt: string;
  url?: string;
}

export function SearchDialog({
  onClose,
  onSearchConversations,
  onSearchMessages,
  onSelectConversation,
  onJumpToMessage,
}: {
  onClose: () => void;
  onSearchConversations: (query: string) => Promise<Conversation[]>;
  onSearchMessages: (query: string, conversationId?: string) => Promise<ChatMessage[]>;
  onSelectConversation: (id: string) => void;
  onJumpToMessage: (conversationId: string, messageId: string) => void;
}) {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<'conversations' | 'messages'>('messages');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        if (tab === 'conversations') {
          const convs = await onSearchConversations(query);
          setResults(convs.map((c) => ({
            type: 'conversation' as const,
            id: c.id,
            title: c.title ?? c.participants[0]?.user.name ?? 'Unknown',
            content: c.messages[0]?.content,
            createdAt: c.updatedAt,
          })));
        } else {
          const msgs = await onSearchMessages(query);
          setResults(msgs.map((m) => ({
            type: 'message' as const,
            id: m.id,
            content: m.content,
            conversationId: m.conversationId,
            conversationTitle: m.conversation?.title ?? 'Conversation',
            senderName: m.sender.name,
            createdAt: m.createdAt,
          })));
        }
      } catch { setResults([]); }
      setLoading(false);
      setSelectedIndex(0);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, tab, onSearchConversations, onSearchMessages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex((i) => Math.min(i + 1, results.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex((i) => Math.max(i - 1, 0)); }
    if (e.key === 'Enter' && results[selectedIndex]) {
      const r = results[selectedIndex];
      if (r.type === 'conversation') onSelectConversation(r.id);
      else if (r.type === 'message' && r.conversationId) onJumpToMessage(r.conversationId, r.id);
      onClose();
    }
    if (e.key === 'Escape') onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-[15vh]" onClick={onClose}>
      <div className="bg-card rounded-xl border shadow-xl w-full max-w-lg mx-4 max-h-[70vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 p-4 border-b">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search messages..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex gap-1 p-2 border-b">
          <button
            onClick={() => setTab('messages')}
            className={`px-3 py-1.5 text-xs rounded-md transition-colors ${tab === 'messages' ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted'}`}
          >
            Messages
          </button>
          <button
            onClick={() => setTab('conversations')}
            className={`px-3 py-1.5 text-xs rounded-md transition-colors ${tab === 'conversations' ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted'}`}
          >
            Conversations
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {results.length > 0 ? (
            results.map((r, i) => (
              <button
                key={`${r.type}-${r.id}`}
                onClick={() => {
                  if (r.type === 'conversation') onSelectConversation(r.id);
                  else if (r.conversationId) onJumpToMessage(r.conversationId, r.id);
                  onClose();
                }}
                className={`flex items-start gap-3 w-full px-4 py-3 text-left hover:bg-muted transition-colors ${i === selectedIndex ? 'bg-muted' : ''}`}
              >
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  {r.type === 'conversation' ? (
                    <MessageSquare className="h-4 w-4 text-primary" />
                  ) : (
                    <span className="text-xs font-medium text-primary">{r.senderName?.charAt(0) ?? '?'}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium truncate">
                      {r.type === 'conversation' ? r.title : r.senderName}
                    </p>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {r.type === 'message' && r.conversationTitle && (
                    <p className="text-[11px] text-muted-foreground/70 truncate">
                      in {r.conversationTitle}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {r.content}
                  </p>
                </div>
              </button>
            ))
          ) : query.trim() && !loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="h-8 w-8 text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">No results for &quot;{query}&quot;</p>
            </div>
          ) : !query.trim() ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="h-8 w-8 text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">Type to search messages</p>
              <p className="text-xs text-muted-foreground/70 mt-1">Search across all your conversations</p>
            </div>
          ) : null}
        </div>

        <div className="px-4 py-2 border-t text-[10px] text-muted-foreground flex items-center gap-3">
          <span><kbd className="px-1 py-0.5 rounded bg-muted border">↑↓</kbd> Navigate</span>
          <span><kbd className="px-1 py-0.5 rounded bg-muted border">↵</kbd> Open</span>
          <span><kbd className="px-1 py-0.5 rounded bg-muted border">Esc</kbd> Close</span>
        </div>
      </div>
    </div>
  );
}
