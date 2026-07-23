'use client';

import { useState, useRef } from 'react';
import { Send, Paperclip, Image as ImageIcon } from 'lucide-react';

export function ChatInput({
  onSend,
  onTyping,
  disabled,
  placeholder,
}: {
  onSend: (content: string) => void;
  onTyping?: () => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

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

  return (
    <div className="px-4 py-3 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-end gap-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
            title="Attach file"
          >
            <Paperclip className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
            title="Send image"
          >
            <ImageIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 relative">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (e.target.value && onTyping) {
                onTyping();
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder ?? 'Type a message...'}
            disabled={disabled}
            className="flex h-11 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!input.trim() || disabled}
          className="inline-flex items-center justify-center rounded-xl bg-primary p-2.5 text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 shrink-0"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
