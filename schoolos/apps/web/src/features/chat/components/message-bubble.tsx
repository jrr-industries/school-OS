'use client';

import { cn } from '@schoolos/ui';
import { Check, CheckCheck, FileText, Image, File, Trash2, Reply, Download } from 'lucide-react';
import type { ChatMessage } from '../types';

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'now';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffMins < 1440) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString();
}

function isToday(date: Date) {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

function isYesterday(date: Date) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date.toDateString() === yesterday.toDateString();
}

function formatDateSeparator(iso: string) {
  const d = new Date(iso);
  if (isToday(d)) return 'Today';
  if (isYesterday(d)) return 'Yesterday';
  return d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function getFileIcon(messageType: string) {
  switch (messageType) {
    case 'image': return Image;
    case 'pdf': return FileText;
    default: return File;
  }
}

export function DateSeparator({ date }: { date: string }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex-1 h-px bg-border" />
      <span className="text-xs font-medium text-muted-foreground shrink-0">
        {formatDateSeparator(date)}
      </span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

export function MessageBubble({
  message,
  isMine,
  showAvatar,
  onReply,
  onDelete,
}: {
  message: ChatMessage;
  isMine: boolean;
  showAvatar: boolean;
  onReply?: (message: ChatMessage) => void;
  onDelete?: (messageId: string) => void;
}) {
  if (message.deletedAt) {
    return (
      <div className={cn('flex items-end gap-2', isMine ? 'justify-end' : 'justify-start')}>
        <div className={cn(
          'max-w-[70%] px-3 py-2 rounded-lg italic',
          isMine ? 'bg-muted/50 rounded-br-sm' : 'bg-muted/30 rounded-bl-sm'
        )}>
          <p className="text-xs text-muted-foreground">
            {isMine ? 'You deleted this message' : 'This message was deleted'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex items-end gap-2 group', isMine ? 'justify-end' : 'justify-start')}>
      {!isMine && (
        <div className={cn(
          'h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary shrink-0',
          showAvatar ? 'opacity-100' : 'opacity-0'
        )}>
          {message.sender.name?.charAt(0).toUpperCase() ?? '?'}
        </div>
      )}

      <div className={cn(
        'max-w-[75%] sm:max-w-[65%] relative',
        isMine ? 'items-end' : 'items-start'
      )}>
        {message.replyTo && (
          <div className={cn(
            'mb-1 px-3 py-1.5 rounded-t-lg border-l-2 text-xs',
            isMine ? 'bg-primary/5 border-primary/30' : 'bg-muted/50 border-muted-foreground/30'
          )}>
            <p className="font-medium text-[11px] text-muted-foreground">
              Replying to {message.replyTo.sender.name}
            </p>
            <p className="truncate text-muted-foreground/70 mt-0.5">
              {message.replyTo.content}
            </p>
          </div>
        )}

        <div className={cn(
          'px-3 py-2 text-sm shadow-sm',
          isMine
            ? 'bg-primary text-primary-foreground rounded-lg rounded-br-sm'
            : 'bg-card text-card-foreground border border-border rounded-lg rounded-bl-sm'
        )}>
          {message.messageType === 'image' && message.fileUrl && (
            <div className="mb-2">
              <img
                src={message.fileUrl}
                alt={message.fileName ?? 'Image'}
                className="max-w-full rounded-lg max-h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                loading="lazy"
              />
            </div>
          )}

          {message.messageType !== 'text' && message.messageType !== 'image' && message.fileUrl && (
            <a
              href={message.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'flex items-center gap-2 p-2 rounded-lg mb-1',
                isMine ? 'bg-primary-foreground/10 hover:bg-primary-foreground/20' : 'bg-muted hover:bg-muted/80'
              )}
            >
              {(() => {
                const Icon = getFileIcon(message.messageType);
                return <Icon className="h-5 w-5 shrink-0" />;
              })()}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{message.fileName ?? 'File'}</p>
                {message.fileSize && (
                  <p className="text-[10px] opacity-70">
                    {message.fileSize > 1024 * 1024
                      ? `${(message.fileSize / (1024 * 1024)).toFixed(1)} MB`
                      : `${Math.round(message.fileSize / 1024)} KB`}
                  </p>
                )}
              </div>
              <Download className="h-4 w-4 shrink-0 opacity-70" />
            </a>
          )}

          {message.content && (
            <p className="leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
          )}

          <div className={cn(
            'flex items-center justify-end gap-1 text-[10px] mt-0.5',
            isMine ? 'text-primary-foreground/70' : 'text-muted-foreground'
          )}>
            {message.editedAt && <span className="text-[10px]">edited</span>}
            <span>{formatTime(message.createdAt)}</span>
            {isMine && (
              message.readReceipts.length > 0
                ? <CheckCheck className="h-3 w-3" />
                : <Check className="h-3 w-3" />
            )}
          </div>
        </div>

        <div className={cn(
          'absolute top-0 hidden group-hover:flex gap-0.5',
          isMine ? 'left-0 -translate-x-full -ml-1' : 'right-0 translate-x-full mr-1'
        )}>
          {onReply && (
            <button
              onClick={() => onReply(message)}
              className="p-1 rounded-md bg-background border border-border shadow-sm hover:bg-muted transition-colors"
              title="Reply"
            >
              <Reply className="h-3 w-3" />
            </button>
          )}
          {isMine && onDelete && (
            <button
              onClick={() => onDelete(message.id)}
              className="p-1 rounded-md bg-background border border-border shadow-sm hover:bg-destructive/10 hover:text-destructive transition-colors"
              title="Delete"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
