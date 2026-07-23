'use client';

import { useState } from 'react';
import { ArrowLeft, MoreVertical, Phone, Video, Pin, Archive, Bell, BellOff, Trash2, Search, Image as ImageIcon, Info } from 'lucide-react';
import type { Participant } from '../types';

export function ChatHeader({
  participant,
  isOnline,
  isMuted,
  isPinned,
  isArchived,
  onBack,
  onTogglePin,
  onToggleArchive,
  onToggleMute,
  onDelete,
  onSearch,
  onMediaGallery,
}: {
  participant: Participant | null;
  isOnline: boolean;
  isMuted?: boolean;
  isPinned?: boolean;
  isArchived?: boolean;
  onBack: () => void;
  onTogglePin?: () => void;
  onToggleArchive?: () => void;
  onToggleMute?: () => void;
  onDelete?: () => void;
  onSearch?: () => void;
  onMediaGallery?: () => void;
}) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <button onClick={onBack} className="p-1 -ml-1 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors lg:hidden">
        <ArrowLeft className="h-5 w-5" />
      </button>

      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary shrink-0">
        {participant?.user.name?.charAt(0).toUpperCase() ?? '?'}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{participant?.user.name ?? 'Unknown'}</p>
        <p className="text-xs text-muted-foreground">
          {isOnline ? (
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              Online
            </span>
          ) : (
            'Offline'
          )}
        </p>
      </div>

      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
        >
          <MoreVertical className="h-5 w-5" />
        </button>

        {showMenu && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
            <div className="absolute right-0 top-full mt-1 z-50 min-w-[180px] rounded-lg border bg-popover shadow-lg py-1">
              {onSearch && (
                <button onClick={() => { onSearch(); setShowMenu(false); }} className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted transition-colors">
                  <Search className="h-4 w-4" /> Search
                </button>
              )}
              {onMediaGallery && (
                <button onClick={() => { onMediaGallery(); setShowMenu(false); }} className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted transition-colors">
                  <ImageIcon className="h-4 w-4" /> Media Gallery
                </button>
              )}
              {onTogglePin && (
                <button onClick={() => { onTogglePin(); setShowMenu(false); }} className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted transition-colors">
                  <Pin className="h-4 w-4" /> {isPinned ? 'Unpin' : 'Pin'}
                </button>
              )}
              {onToggleArchive && (
                <button onClick={() => { onToggleArchive(); setShowMenu(false); }} className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted transition-colors">
                  <Archive className="h-4 w-4" /> {isArchived ? 'Unarchive' : 'Archive'}
                </button>
              )}
              {onToggleMute && (
                <button onClick={() => { onToggleMute(); setShowMenu(false); }} className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted transition-colors">
                  {isMuted ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                  {isMuted ? 'Unmute' : 'Mute'}
                </button>
              )}
              {onDelete && (
                <button onClick={() => { onDelete(); setShowMenu(false); }} className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-destructive/10 text-destructive transition-colors">
                  <Trash2 className="h-4 w-4" /> Delete
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
