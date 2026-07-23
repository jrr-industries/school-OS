'use client';

import { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { getUrlPreviewAction } from '../actions/url-preview-action';

const URL_REGEX = /(https?:\/\/[^\s<]+[^\s<.,;:!?)">\]])/i;

export function extractUrls(text: string): string[] {
  const matches = text.match(URL_REGEX);
  return matches ? [matches[1]] : [];
}

function normalizeUrl(url: string): string {
  try {
    const u = new URL(url);
    return u.href;
  } catch {
    return url;
  }
}

export function UrlPreviewInline({ url }: { url: string }) {
  const [preview, setPreview] = useState<{ title: string | null; description: string | null; image: string | null; domain: string } | null | 'loading'>('loading');

  useEffect(() => {
    let cancelled = false;
    getUrlPreviewAction(url).then((p) => {
      if (!cancelled) setPreview(p);
    });
    return () => { cancelled = true; };
  }, [url]);

  if (preview === 'loading') {
    return (
      <div className="mt-1 rounded-lg border bg-muted/30 animate-pulse p-3">
        <div className="h-3 w-3/4 bg-muted rounded mb-2" />
        <div className="h-2 w-full bg-muted rounded" />
      </div>
    );
  }

  if (!preview) return null;

  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      className="mt-1 flex items-start gap-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors overflow-hidden"
    >
      {preview.image && (
        <div className="w-16 h-16 shrink-0 bg-muted flex items-center justify-center overflow-hidden">
          <img src={preview.image} alt="" className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        </div>
      )}
      <div className="flex-1 min-w-0 py-2 pr-3">
        <p className="text-xs font-medium truncate">{preview.title ?? url}</p>
        {preview.description && <p className="text-[10px] text-muted-foreground line-clamp-2 mt-0.5">{preview.description}</p>}
        <div className="flex items-center gap-1 mt-1">
          <ExternalLink className="h-2.5 w-2.5 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground truncate">{preview.domain}</span>
        </div>
      </div>
    </a>
  );
}

export function formatMessageWithUrls(content: string) {
  const parts = content.split(URL_REGEX);
  return parts.map((part, i) => {
    if (URL_REGEX.test(part)) {
      const url = normalizeUrl(part);
      return (
        <a key={i} href={url} target="_blank" rel="noopener noreferrer"
          className="text-primary underline underline-offset-2 hover:text-primary/80"
        >
          {part.length > 50 ? part.slice(0, 47) + '...' : part}
        </a>
      );
    }
    return part;
  });
}
