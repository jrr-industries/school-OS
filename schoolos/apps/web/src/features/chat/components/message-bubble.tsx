'use client';

import { useState } from 'react';
import { cn } from '@schoolos/ui';
import { Check, CheckCheck, FileText, Image, File, Trash2, Reply, Download, Video, Music, Table, Archive, Forward, Copy, Edit3, Star, MoreHorizontal, Pin, Smile, ExternalLink } from 'lucide-react';
import { ReactionPicker } from './emoji-picker';
import { ImageViewer } from './image-viewer';
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

function isToday(date: Date) { return date.toDateString() === new Date().toDateString(); }
function isYesterday(date: Date) {
  const y = new Date(); y.setDate(y.getDate() - 1);
  return date.toDateString() === y.toDateString();
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
    case 'video': return Video;
    case 'audio':
    case 'voice': return Music;
    case 'excel':
    case 'word':
    case 'powerpoint': return Table;
    case 'zip': return Archive;
    default: return File;
  }
}

function formatFileSize(bytes: number) {
  if (bytes > 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

export function DateSeparator({ date }: { date: string }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex-1 h-px bg-border" />
      <span className="text-xs font-medium text-muted-foreground shrink-0">{formatDateSeparator(date)}</span>
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
  onReact,
  onEdit,
  onForward,
  onCopy,
  onStar,
  onPin,
}: {
  message: ChatMessage;
  isMine: boolean;
  showAvatar: boolean;
  onReply?: (message: ChatMessage) => void;
  onDelete?: (messageId: string) => void;
  onReact?: (messageId: string, emoji: string) => void;
  onEdit?: (message: ChatMessage) => void;
  onForward?: (message: ChatMessage) => void;
  onCopy?: (content: string) => void;
  onStar?: (messageId: string) => void;
  onPin?: (messageId: string) => void;
}) {
  const [showActions, setShowActions] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [imageViewer, setImageViewer] = useState<{ src: string; name: string } | null>(null);

  if (message.deletedAt) {
    return (
      <div className={cn('flex items-end gap-2', isMine ? 'justify-end' : 'justify-start')}>
        <div className={cn('max-w-[70%] px-3 py-2 rounded-lg italic', isMine ? 'bg-muted/50 rounded-br-sm' : 'bg-muted/30 rounded-bl-sm')}>
          <p className="text-xs text-muted-foreground">{isMine ? 'You deleted this message' : 'This message was deleted'}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={cn('flex items-end gap-2 group', isMine ? 'justify-end' : 'justify-start')}>
        {!isMine && (
          <div className={cn(
            'h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary shrink-0',
            showAvatar ? 'opacity-100' : 'opacity-0'
          )}>
            {message.sender.name?.charAt(0).toUpperCase() ?? '?'}
          </div>
        )}

        <div className={cn('max-w-[75%] sm:max-w-[65%] relative', isMine ? 'items-end' : 'items-start')}>
          {message.replyTo && (
            <div className={cn(
              'mb-1 px-3 py-1.5 rounded-t-lg border-l-2 text-xs',
              isMine ? 'bg-primary/5 border-primary/30' : 'bg-muted/50 border-muted-foreground/30'
            )}>
              <p className="font-medium text-[11px] text-muted-foreground">Replying to {message.replyTo.sender.name}</p>
              <p className="truncate text-muted-foreground/70 mt-0.5">{message.replyTo.content}</p>
            </div>
          )}

          {message.isForwarded && (
            <div className="flex items-center gap-1 mb-0.5 px-1">
              <Forward className="h-3 w-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground font-medium">Forwarded</span>
            </div>
          )}

          <div className={cn(
            'px-3 py-2 text-sm shadow-sm relative',
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
                  onClick={() => setImageViewer({ src: message.fileUrl!, name: message.fileName ?? 'Image' })}
                />
              </div>
            )}

            {message.messageType === 'video' && message.fileUrl && (
              <div className="mb-2">
                <video src={message.fileUrl} controls className="max-w-full rounded-lg max-h-64" preload="metadata">
                  <p>Your browser doesn't support video playback.</p>
                </video>
              </div>
            )}

            {(message.messageType === 'audio' || message.messageType === 'voice') && message.fileUrl && (
              <div className="mb-2">
                <audio src={message.fileUrl} controls className="w-full" preload="metadata">
                  <p>Your browser doesn't support audio playback.</p>
                </audio>
              </div>
            )}

            {!['text', 'image', 'video', 'audio', 'voice'].includes(message.messageType) && message.fileUrl && (
              <a href={message.fileUrl} target="_blank" rel="noopener noreferrer"
                className={cn(
                  'flex items-center gap-2 p-2 rounded-lg mb-1',
                  isMine ? 'bg-primary-foreground/10 hover:bg-primary-foreground/20' : 'bg-muted hover:bg-muted/80'
                )}>
                {(() => { const Icon = getFileIcon(message.messageType); return <Icon className="h-5 w-5 shrink-0" />; })()}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{message.fileName ?? 'File'}</p>
                  {message.fileSize && <p className="text-[10px] opacity-70">{formatFileSize(message.fileSize)}</p>}
                </div>
                <Download className="h-4 w-4 shrink-0 opacity-70" />
              </a>
            )}

            {message.content && (
              <p className="leading-relaxed whitespace-pre-wrap break-words">
                {message.isEdited && <span className="text-[10px] opacity-60 mr-1">edited</span>}
                {message.content}
              </p>
            )}

            <div className={cn(
              'flex items-center justify-end gap-1 text-[10px] mt-1',
              isMine ? 'text-primary-foreground/70' : 'text-muted-foreground'
            )}>
              <span>{formatTime(message.createdAt)}</span>
              {isMine && (
                message.messageStatus === 'seen' ? <CheckCheck className="h-3 w-3 text-blue-400" />
                : message.messageStatus === 'delivered' ? <CheckCheck className="h-3 w-3" />
                : message.messageStatus === 'failed' ? <span className="text-destructive">Failed</span>
                : message.messageStatus === 'sending' ? <span className="text-xs opacity-50">Sending...</span>
                : <Check className="h-3 w-3" />
              )}
            </div>

            {message.reactions.length > 0 && (
              <div className={cn('flex flex-wrap gap-0.5 mt-1', isMine ? 'justify-end' : 'justify-start')}>
                {message.reactions.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => onReact?.(message.id, r.emoji)}
                    className="text-xs bg-background/50 rounded-full px-1.5 py-0.5 border hover:bg-background/80 transition-colors"
                  >
                    {r.emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className={cn(
            'absolute top-0 hidden group-hover:flex gap-0.5',
            isMine ? 'left-0 -translate-x-full -ml-1' : 'right-0 translate-x-full mr-1'
          )}>
            <div className="relative">
              <button
                onClick={() => { setShowReactions(!showReactions); setShowActions(false); }}
                className="p-1 rounded-md bg-background border border-border shadow-sm hover:bg-muted transition-colors"
                title="React"
              >
                <Smile className="h-3 w-3" />
              </button>
              {showReactions && (
                <div className={cn('absolute z-50 top-0', isMine ? 'right-0' : 'left-0')}>
                  <ReactionPicker
                    onSelect={(emoji) => { onReact?.(message.id, emoji); setShowReactions(false); }}
                    onClose={() => setShowReactions(false)}
                  />
                </div>
              )}
            </div>
            {onReply && (
              <button onClick={() => onReply(message)} className="p-1 rounded-md bg-background border border-border shadow-sm hover:bg-muted transition-colors" title="Reply">
                <Reply className="h-3 w-3" />
              </button>
            )}
            <div className="relative">
              <button
                onClick={() => { setShowActions(!showActions); setShowReactions(false); }}
                className="p-1 rounded-md bg-background border border-border shadow-sm hover:bg-muted transition-colors"
                title="More"
              >
                <MoreHorizontal className="h-3 w-3" />
              </button>
              {showActions && (
                <div className={cn(
                  'absolute z-50 top-full mt-1 min-w-[140px] rounded-lg border bg-popover shadow-lg py-1',
                  isMine ? 'right-0' : 'left-0'
                )}>
                  {onCopy && <button onClick={() => { onCopy(message.content); setShowActions(false); }} className="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-muted transition-colors"><Copy className="h-3 w-3" />Copy</button>}
                  {onForward && <button onClick={() => { onForward(message); setShowActions(false); }} className="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-muted transition-colors"><Forward className="h-3 w-3" />Forward</button>}
                  {isMine && onEdit && <button onClick={() => { onEdit(message); setShowActions(false); }} className="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-muted transition-colors"><Edit3 className="h-3 w-3" />Edit</button>}
                  {onStar && <button onClick={() => { onStar(message.id); setShowActions(false); }} className="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-muted transition-colors"><Star className="h-3 w-3" />Star</button>}
                  {onPin && <button onClick={() => { onPin(message.id); setShowActions(false); }} className="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-muted transition-colors"><Pin className="h-3 w-3" />Pin</button>}
                  {isMine && onDelete && <button onClick={() => { onDelete(message.id); setShowActions(false); }} className="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-destructive/10 text-destructive transition-colors"><Trash2 className="h-3 w-3" />Delete</button>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {imageViewer && (
        <ImageViewer
          src={imageViewer.src}
          alt={imageViewer.name}
          onClose={() => setImageViewer(null)}
        />
      )}
    </>
  );
}
