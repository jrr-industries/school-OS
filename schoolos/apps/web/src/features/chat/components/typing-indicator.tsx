'use client';

import { motion } from 'framer-motion';

export function TypingIndicator({ names }: { names: string[] }) {
  if (names.length === 0) return null;

  const text = names.length === 1
    ? `${names[0]} is typing...`
    : names.length === 2
      ? `${names[0]} and ${names[1]} are typing...`
      : `${names[0]} and ${names.length - 1} others are typing...`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="flex items-center gap-2 px-1 py-1"
    >
      <div className="flex gap-0.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground italic">{text}</span>
    </motion.div>
  );
}

export function PresenceIndicator({ isOnline, lastSeen }: { isOnline: boolean; lastSeen?: string }) {
  if (isOnline) {
    return (
      <span className="flex items-center gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
        <span className="text-xs text-green-500 font-medium">Online</span>
      </span>
    );
  }

  if (lastSeen) {
    const d = new Date(lastSeen);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    let text: string;
    if (diffMins < 1) text = 'now';
    else if (diffMins < 60) text = `${diffMins}m ago`;
    else if (diffMins < 1440) text = `${Math.floor(diffMins / 60)}h ago`;
    else text = d.toLocaleDateString();

    return <span className="text-xs text-muted-foreground">Last seen {text}</span>;
  }

  return <span className="text-xs text-muted-foreground">Offline</span>;
}
