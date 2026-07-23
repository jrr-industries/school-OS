'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Image as ImageIcon, Smile, Mic, X, Loader2 } from 'lucide-react';
import { EmojiPicker } from './emoji-picker';

export function ChatInput({
  onSend,
  onSendFile,
  onTyping,
  disabled,
  placeholder,
  replyTo,
  onCancelReply,
}: {
  onSend: (content: string) => void;
  onSendFile?: (file: File) => void;
  onTyping?: () => void;
  disabled?: boolean;
  placeholder?: string;
  replyTo?: { name: string; content: string } | null;
  onCancelReply?: () => void;
}) {
  const [input, setInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [replyTo]);

  const handleSubmit = () => {
    const content = input.trim();
    if (!content) return;
    onSend(content);
    setInput('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setInput((prev) => prev + emoji);
    inputRef.current?.focus();
    setShowEmoji(false);
    onTyping?.();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onSendFile) return;
    setUploading(true);
    try { onSendFile(file); }
    finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  const acceptTypes = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.txt,.csv,.mp4,.webm,.mp3,.wav,.ogg,.mov,.avi';

  return (
    <div className="px-4 py-3 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {replyTo && (
        <div className="flex items-center gap-2 mb-2 px-3 py-1.5 rounded-lg bg-muted/50 border">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground">Replying to {replyTo.name}</p>
            <p className="text-xs text-muted-foreground/70 truncate">{replyTo.content}</p>
          </div>
          <button onClick={onCancelReply} className="p-1 text-muted-foreground hover:text-foreground rounded hover:bg-muted transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex items-end gap-2">
        <div className="flex items-center gap-1 relative">
          <button
            type="button"
            onClick={() => { setShowEmoji(!showEmoji); }}
            className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
            title="Emoji"
          >
            <Smile className="h-5 w-5" />
          </button>
          {showEmoji && <EmojiPicker onSelect={handleEmojiSelect} onClose={() => setShowEmoji(false)} />}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || disabled}
            className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
            title="Attach file"
          >
            {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Paperclip className="h-5 w-5" />}
          </button>

          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            disabled={uploading || disabled}
            className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
            title="Send image"
          >
            <ImageIcon className="h-5 w-5" />
          </button>
        </div>

        <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelect} accept={acceptTypes} />
        <input ref={imageInputRef} type="file" className="hidden" onChange={handleFileSelect} accept="image/*" />

        <div className="flex-1 relative">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (e.target.value && onTyping) onTyping();
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder ?? 'Type a message...'}
            disabled={disabled || uploading}
            className="flex h-11 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={(!input.trim() && !uploading) || disabled || uploading}
          className="inline-flex items-center justify-center rounded-xl bg-primary p-2.5 text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 shrink-0"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
