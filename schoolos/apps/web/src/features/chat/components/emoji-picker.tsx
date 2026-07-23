'use client';

import { useState } from 'react';
import { Smile } from 'lucide-react';

const EMOJI_CATEGORIES = [
  { name: 'Frequent', emojis: ['❤️', '👍', '😂', '😊', '🎉', '🙏', '😍', '🔥', '✨', '💯'] },
  { name: 'Reactions', emojis: ['👍', '👎', '❤️', '😂', '😮', '😢', '😡', '🎉', '🙏', '💯', '⭐', '👀'] },
  { name: 'Smileys', emojis: ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🥸', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥶', '🥵', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈', '👿', '👹', '👺', '🤡', '💩', '👻', '💀', '☠️', '👽', '👾', '🤖', '🎃', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾'] },
  { name: 'Gestures', emojis: ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🫰', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '🫶', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', '👁️', '👅', '👄'] },
  { name: 'Objects', emojis: ['💼', '📁', '📂', '📅', '📆', '📇', '📋', '📌', '📍', '📎', '✂️', '🔒', '🔓', '🔐', '🔑', '🔨', '🪛', '🔧', '🔩', '🔫', '🛡️', '💎', '📯', '📻', '📱', '💻', '🖥️', '🖨️', '⌨️', '🖱️', '🖲️', '📷', '📸', '📹', '🎥', '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🔊', '🔉', '🔈', '🔇', '🔔', '🔕', '🎵', '🎶', '🎙️', '🎚️', '🎛️', '🎤', '🎧', '📻', '🪕', '🎷', '🎸', '🎹', '🎺', '🎻', '🪘', '🥁', '🪇', '📢', '📣', '🔔', '🎼'] },
];

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

export function EmojiPicker({ onSelect, onClose }: EmojiPickerProps) {
  const [category, setCategory] = useState(0);

  return (
    <div className="absolute bottom-16 left-0 z-50 w-72 sm:w-80 rounded-xl border bg-popover shadow-xl">
      <div className="flex gap-1 p-2 border-b overflow-x-auto">
        {EMOJI_CATEGORIES.map((cat, i) => (
          <button
            key={cat.name}
            onClick={() => setCategory(i)}
            className={`px-2 py-1 text-xs rounded-md whitespace-nowrap transition-colors ${
              category === i ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-8 gap-1 p-3 max-h-48 overflow-y-auto">
        {EMOJI_CATEGORIES[category].emojis.map((emoji) => (
          <button
            key={emoji}
            onClick={() => {
              onSelect(emoji);
              onClose();
            }}
            className="h-8 w-8 flex items-center justify-center text-lg hover:bg-muted rounded-md transition-colors"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ReactionPicker({ onSelect, onClose }: EmojiPickerProps) {
  const quickReactions = ['👍', '❤️', '😂', '😮', '😢', '😡', '🎉', '🙏'];

  return (
    <div className="flex gap-1 p-1.5 rounded-lg border bg-popover shadow-lg">
      {quickReactions.map((emoji) => (
        <button
          key={emoji}
          onClick={() => {
            onSelect(emoji);
            onClose();
          }}
          className="h-8 w-8 flex items-center justify-center text-lg hover:bg-muted rounded-md transition-colors hover:scale-125"
        >
          {emoji}
        </button>
      ))}
      <div className="w-px bg-border mx-0.5" />
      <button
        onClick={() => onClose()}
        className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:bg-muted rounded-md transition-colors"
      >
        <Smile className="h-4 w-4" />
      </button>
    </div>
  );
}
