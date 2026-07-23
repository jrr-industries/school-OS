'use client';

import { useState } from 'react';
import { Download, Loader2, FileJson, FileSpreadsheet } from 'lucide-react';

export function ExportChatButton({
  conversationName,
  messages,
}: {
  conversationName: string;
  messages: { id: string; senderName: string; content: string; createdAt: string; messageType: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  const sanitizeName = (name: string) => name.replace(/[^a-zA-Z0-9-_]/g, '_').slice(0, 40);

  const exportJson = () => {
    setExporting(true);
    const data = {
      conversation: conversationName,
      exportedAt: new Date().toISOString(),
      messageCount: messages.length,
      messages: messages.map((m) => ({
        sender: m.senderName,
        content: m.content,
        type: m.messageType,
        timestamp: m.createdAt,
      })),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    downloadBlob(blob, `${sanitizeName(conversationName)}-chat.json`);
    setExporting(false);
    setOpen(false);
  };

  const exportCsv = () => {
    setExporting(true);
    const header = 'Sender,Message,Type,Timestamp\n';
    const rows = messages.map((m) => {
      const content = `"${m.content.replace(/"/g, '""')}"`;
      return `${m.senderName},${content},${m.messageType},${m.createdAt}`;
    }).join('\n');
    const blob = new Blob(['\ufeff' + header + rows], { type: 'text/csv;charset=utf-8' });
    downloadBlob(blob, `${sanitizeName(conversationName)}-chat.csv`);
    setExporting(false);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1 text-xs text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors"
        title="Export chat"
      >
        {exporting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
        Export
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-50 min-w-[140px] rounded-lg border bg-popover shadow-lg py-1">
            <button onClick={exportJson} className="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-muted transition-colors">
              <FileJson className="h-3.5 w-3.5" /> Export as JSON
            </button>
            <button onClick={exportCsv} className="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-muted transition-colors">
              <FileSpreadsheet className="h-3.5 w-3.5" /> Export as CSV
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
