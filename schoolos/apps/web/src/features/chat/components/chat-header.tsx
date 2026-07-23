'use client';

import { ArrowLeft, Phone, MoreVertical, Info } from 'lucide-react';
import type { Participant } from '../types';

export function ChatHeader({
  participant,
  isOnline,
  onBack,
}: {
  participant: Participant | null;
  isOnline: boolean;
  onBack: () => void;
}) {
  if (!participant) return null;

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <button
        onClick={onBack}
        className="lg:hidden p-1 -ml-1 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>

      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-base font-medium text-primary shrink-0 relative">
        {participant.user.name?.charAt(0).toUpperCase() ?? '?'}
        <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">{participant.user.name}</p>
        <p className="text-xs text-muted-foreground">
          {participant.user.isSuperAdmin ? 'Super Admin' : 'School Admin'}
          {isOnline && <span className="ml-2 text-green-500 font-medium">Online</span>}
        </p>
      </div>

      <div className="flex items-center gap-1">
        <button className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors">
          <Phone className="h-4 w-4" />
        </button>
        <button className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors">
          <Info className="h-4 w-4" />
        </button>
        <button className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors">
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
