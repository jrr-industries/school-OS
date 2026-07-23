'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Loader2, MessageSquare, AlertCircle } from 'lucide-react';
import { useMessages, useSendMessage, useMarkAsRead } from '../hooks/use-chat-messages';
import { useChatRealtime } from '../hooks/use-chat-realtime';
import { useTypingIndicator } from '../hooks/use-chat-typing';
import { ChatHeader } from './chat-header';
import { ChatInput } from './chat-input';
import { MessageBubble, DateSeparator } from './message-bubble';
import { TypingIndicator } from './typing-indicator';
import type { Conversation, ChatMessage } from '../types';

export function ChatWindow({
  conversation,
  currentUserId,
  onBack,
  isOnline,
}: {
  conversation: Conversation;
  currentUserId: string | undefined;
  onBack: () => void;
  isOnline: boolean;
}) {
  const { data: messages, isLoading, error } = useMessages(conversation.id);
  const sendMessage = useSendMessage();
  const markAsRead = useMarkAsRead();
  const { typingUsers, startTyping } = useTypingIndicator(conversation.id, currentUserId);
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [initialScrollDone, setInitialScrollDone] = useState(false);

  useChatRealtime(conversation.id);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (messages && messages.length > 0 && !initialScrollDone) {
      scrollToBottom();
      setInitialScrollDone(true);
    }
  }, [messages, initialScrollDone, scrollToBottom]);

  useEffect(() => {
    setInitialScrollDone(false);
    markAsRead.mutate(conversation.id);
    setReplyTo(null);
  }, [conversation.id]);

  const handleSend = useCallback((content: string) => {
    sendMessage.mutate(
      {
        conversationId: conversation.id,
        content,
        replyToId: replyTo?.id,
      },
      {
        onSuccess: () => {
          setReplyTo(null);
          setTimeout(scrollToBottom, 100);
        },
      },
    );
  }, [conversation.id, replyTo, sendMessage, scrollToBottom]);

  const handleReply = useCallback((message: ChatMessage) => {
    setReplyTo(message);
  }, []);

  const getOtherParticipant = () => {
    const other = conversation.participants.find((p) => p.userId !== currentUserId);
    return other ?? conversation.participants[0] ?? null;
  };

  const participant = getOtherParticipant();
  const typingNames = typingUsers
    .filter((t) => t.userId !== currentUserId)
    .map((t) => t.userName);

  return (
    <div className="flex-1 flex flex-col">
      <ChatHeader
        participant={participant}
        isOnline={isOnline}
        onBack={onBack}
      />

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1 bg-muted/30">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <p className="text-sm text-muted-foreground">{error instanceof Error ? error.message : 'Failed to load messages'}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-sm text-primary hover:underline"
            >
              Retry
            </button>
          </div>
        ) : !messages || messages.length === 0 ? (
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
                    onReply={handleReply}
                  />
                </div>
              );
            })}

            <TypingIndicator names={typingNames} />
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {replyTo && (
        <div className="px-4 py-2 border-t bg-muted/50 flex items-center gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground">
              Replying to {replyTo.sender.name}
            </p>
            <p className="text-xs text-muted-foreground/70 truncate">{replyTo.content}</p>
          </div>
          <button
            onClick={() => setReplyTo(null)}
            className="p-1 text-muted-foreground hover:text-foreground rounded hover:bg-muted transition-colors"
          >
            <span className="text-lg leading-none">&times;</span>
          </button>
        </div>
      )}

      <ChatInput
        onSend={handleSend}
        onTyping={startTyping}
        disabled={sendMessage.isPending}
        placeholder={sendMessage.isPending ? 'Sending...' : 'Type a message...'}
      />
    </div>
  );
}
