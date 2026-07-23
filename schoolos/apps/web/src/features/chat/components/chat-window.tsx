'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Loader2, MessageSquare, ArrowDown } from 'lucide-react';
import { ChatHeader } from './chat-header';
import { ChatInput } from './chat-input';
import { MessageBubble, DateSeparator } from './message-bubble';
import { TypingIndicator } from './typing-indicator';
import { MediaGallery } from './media-gallery';
import { ForwardMessageDialog } from './forward-message';
import { ExportChatButton } from './export-chat';
import { emitNotification, requestNotificationPermission } from './notification-dropdown';
import { useChatStore } from '../store/chat-store';
import type { Conversation, ChatMessage } from '../types';

async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('/api/upload', { method: 'POST', body: formData });
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? 'Upload failed');
  return json.data;
}

export function ChatWindow({
  conversation,
  currentUserId,
  onBack,
  onSendMessage,
  onReact,
  onEdit,
  onDelete,
  onCopy,
  onStar,
  onTogglePin,
  onToggleArchive,
  onToggleMute,
  onDeleteChat,
  onLoadMore,
  hasMore,
  isLoading,
  messages,
  conversations,
}: {
  conversation: Conversation;
  currentUserId: string | undefined;
  onBack: () => void;
  onSendMessage: (content: string, opts?: { replyToId?: string; fileUrl?: string; fileName?: string; fileSize?: number; fileId?: string; messageType?: string }) => void;
  onReact?: (messageId: string, emoji: string) => void;
  onEdit?: (messageId: string, content: string) => void;
  onDelete?: (messageId: string) => void;
  onCopy?: (content: string) => void;
  onStar?: (messageId: string) => void;
  onTogglePin?: () => void;
  onToggleArchive?: () => void;
  onToggleMute?: () => void;
  onDeleteChat?: () => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
  messages: ChatMessage[];
  conversations?: Conversation[];
}) {
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null);
  const [editContent, setEditContent] = useState('');
  const [showMediaGallery, setShowMediaGallery] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [forwardMessage, setForwardMessage] = useState<ChatMessage | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const typingUsers = useChatStore((s) => s.typingUsers[conversation.id] ?? []);
  const onlineUsers = useChatStore((s) => s.onlineUsers);
  const lastMsgRef = useRef(0);

  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  }, []);

  useEffect(() => {
    scrollToBottom(false);
  }, [conversation.id]);

  useEffect(() => {
    if (messages.length > 0) scrollToBottom(false);
  }, [messages.length]);

  useEffect(() => {
    if (messages.length > lastMsgRef.current && lastMsgRef.current > 0 && currentUserId) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg && lastMsg.senderId !== currentUserId) {
        const sender = lastMsg.sender;
        emitNotification({
          title: sender.name ?? 'New message',
          body: lastMsg.content || `Sent a ${lastMsg.messageType}`,
          conversationId: conversation.id,
          senderName: sender.name,
        });
      }
    }
    lastMsgRef.current = messages.length;
  }, [messages.length, currentUserId, conversation.id]);

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const handleScroll = useCallback(() => {
    const el = messagesContainerRef.current;
    if (!el) return;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 150;
    setShowScrollBtn(!isNearBottom);
    if (el.scrollTop < 50 && hasMore && onLoadMore) onLoadMore();
  }, [hasMore, onLoadMore]);

  const handleSend = useCallback((content: string) => {
    if (editingMessage) {
      onEdit?.(editingMessage.id, content);
      setEditingMessage(null);
      setEditContent('');
    } else {
      onSendMessage(content, { replyToId: replyTo?.id });
      setReplyTo(null);
    }
  }, [replyTo, editingMessage, onSendMessage, onEdit]);

  const handleSendFile = useCallback(async (file: File) => {
    try {
      const result = await uploadFile(file);
      onSendMessage('', {
        fileUrl: result.url,
        fileName: result.name,
        fileSize: result.size,
        fileId: result.fileRecordId,
        messageType: result.messageType,
        replyToId: replyTo?.id,
      });
      setReplyTo(null);
    } catch (err) {
      console.error('Upload failed:', err);
    }
  }, [replyTo, onSendMessage]);

  const handleSendVoice = useCallback(async (blob: Blob, _duration: number) => {
    try {
      const file = new File([blob], `voice-${Date.now()}.webm`, { type: blob.type || 'audio/webm' });
      const result = await uploadFile(file);
      onSendMessage('', {
        fileUrl: result.url,
        fileName: result.name,
        fileSize: result.size,
        fileId: result.fileRecordId,
        messageType: 'voice',
      });
    } catch (err) {
      console.error('Voice upload failed:', err);
    }
  }, [onSendMessage]);

  const handleStartEdit = useCallback((message: ChatMessage) => {
    setEditingMessage(message);
    setEditContent(message.content);
    setReplyTo(null);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingMessage(null);
    setEditContent('');
  }, []);

  const handleForwardMessage = useCallback((message: ChatMessage) => {
    setForwardMessage(message);
  }, []);

  const otherParticipant = conversation.participants.find((p) => p.userId !== currentUserId) ?? conversation.participants[0] ?? null;
  const isOnline = otherParticipant ? !!onlineUsers[otherParticipant.userId] : false;
  const typingNames = typingUsers.filter((t) => t.userId !== currentUserId).map((t) => t.userName);

  const mediaItems = messages
    .filter((m) => m.messageType === 'image' || m.fileUrl)
    .map((m) => ({
      id: m.id,
      type: m.messageType === 'image' ? 'image' as const : 'file' as const,
      url: m.fileUrl ?? '',
      name: m.fileName ?? 'File',
      thumbnail: m.fileUrl ?? undefined,
      createdAt: m.createdAt,
    }));

  return (
    <div className="flex-1 flex flex-col">
      <ChatHeader
        participant={otherParticipant}
        isOnline={isOnline}
        isMuted={conversation.isMuted}
        isPinned={conversation.isPinned}
        isArchived={conversation.isArchived}
        onBack={onBack}
        onTogglePin={onTogglePin}
        onToggleArchive={onToggleArchive}
        onToggleMute={onToggleMute}
        onDelete={onDeleteChat}
        onSearch={() => {}}
        onMediaGallery={() => setShowMediaGallery(true)}
        exportButton={
          <ExportChatButton
            conversationName={conversation.title ?? otherParticipant?.user.name ?? 'Chat'}
            messages={messages.map((m) => ({
              id: m.id,
              senderName: m.sender.name,
              content: m.content,
              createdAt: m.createdAt,
              messageType: m.messageType,
            }))}
          />
        }
      />

      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-1 bg-muted/30 relative"
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium">No messages yet</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Send a message to start the conversation
            </p>
          </div>
        ) : (
          <>
            {hasMore && (
              <div className="flex justify-center py-2">
                <button onClick={onLoadMore} className="text-xs text-primary hover:underline">
                  Load older messages
                </button>
              </div>
            )}
            {messages.map((msg, idx) => {
              const isMine = msg.senderId === currentUserId;
              const showAvatar = idx === 0 || messages[idx - 1]?.senderId !== msg.senderId;
              const showDateSeparator = idx === 0 || new Date(msg.createdAt).toDateString() !== new Date(messages[idx - 1].createdAt).toDateString();
              return (
                <div key={msg.id}>
                  {showDateSeparator && <DateSeparator date={msg.createdAt} />}
                  <MessageBubble
                    message={msg}
                    isMine={isMine}
                    showAvatar={showAvatar}
                    onReply={(m) => { setReplyTo(m); setEditingMessage(null); }}
                    onDelete={onDelete ? () => onDelete(msg.id) : undefined}
                    onReact={onReact}
                    onEdit={(m) => handleStartEdit(m)}
                    onForward={handleForwardMessage}
                    onCopy={onCopy ? () => onCopy(msg.content) : undefined}
                    onStar={onStar}
                  />
                </div>
              );
            })}
            <TypingIndicator names={typingNames} />
            <div ref={messagesEndRef} />
          </>
        )}

        {showScrollBtn && (
          <button
            onClick={() => scrollToBottom()}
            className="absolute bottom-4 right-4 p-2 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
          >
            <ArrowDown className="h-4 w-4" />
          </button>
        )}
      </div>

      {editingMessage && (
        <div className="px-4 py-2 border-t bg-muted/50">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-muted-foreground">Editing message</span>
            <button onClick={handleCancelEdit} className="text-xs text-muted-foreground hover:text-foreground">Cancel</button>
          </div>
          <input
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(editContent); }
              if (e.key === 'Escape') handleCancelEdit();
            }}
            className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            autoFocus
          />
        </div>
      )}

      <ChatInput
        onSend={handleSend}
        onSendFile={handleSendFile}
        onSendVoice={handleSendVoice}
        onTyping={() => {}}
        placeholder="Type a message..."
        replyTo={replyTo ? { name: replyTo.sender.name, content: replyTo.content } : null}
        onCancelReply={() => setReplyTo(null)}
      />

      {showMediaGallery && (
        <MediaGallery
          items={mediaItems}
          onClose={() => setShowMediaGallery(false)}
          onImageClick={(url) => window.open(url, '_blank')}
        />
      )}

      {forwardMessage && conversations && (
        <ForwardMessageDialog
          conversations={conversations.filter((c) => c.id !== conversation.id)}
          messageId={forwardMessage.id}
          onClose={() => setForwardMessage(null)}
          onSuccess={() => {}}
        />
      )}
    </div>
  );
}
