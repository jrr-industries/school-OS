'use client';

import { useState } from 'react';
import { Image, File, Link as LinkIcon, X } from 'lucide-react';

interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'file' | 'link';
  url: string;
  name: string;
  thumbnail?: string;
  createdAt: string;
}

interface MediaGalleryProps {
  items: MediaItem[];
  onClose: () => void;
  onImageClick: (url: string, name: string) => void;
}

type TabType = 'images' | 'files' | 'links';

export function MediaGallery({ items, onClose, onImageClick }: MediaGalleryProps) {
  const [tab, setTab] = useState<TabType>('images');

  const images = items.filter((i) => i.type === 'image');
  const files = items.filter((i) => i.type === 'file');
  const links = items.filter((i) => i.type === 'link');

  const tabs: { key: TabType; label: string; icon: typeof Image; count: number }[] = [
    { key: 'images', label: 'Images', icon: Image, count: images.length },
    { key: 'files', label: 'Files', icon: File, count: files.length },
    { key: 'links', label: 'Links', icon: LinkIcon, count: links.length },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm" onClick={onClose}>
      <div className="h-full max-w-2xl mx-auto flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Media Gallery</h2>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex gap-1 p-2 border-b">
          {tabs.map(({ key, label, icon: Icon, count }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors ${
                tab === key ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
              {count > 0 && <span className="text-xs text-muted-foreground">({count})</span>}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {tab === 'images' && (
            images.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Image className="h-12 w-12 mb-2 opacity-50" />
                <p className="text-sm">No images shared</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {images.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => onImageClick(img.url, img.name)}
                    className="aspect-square rounded-lg overflow-hidden border hover:ring-2 hover:ring-primary transition-all"
                  >
                    <img src={img.thumbnail ?? img.url} alt={img.name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )
          )}

          {tab === 'files' && (
            files.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <File className="h-12 w-12 mb-2 opacity-50" />
                <p className="text-sm">No files shared</p>
              </div>
            ) : (
              <div className="space-y-2">
                {files.map((file) => (
                  <a
                    key={file.id}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors"
                  >
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <File className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{new Date(file.createdAt).toLocaleDateString()}</p>
                    </div>
                  </a>
                ))}
              </div>
            )
          )}

          {tab === 'links' && (
            links.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <LinkIcon className="h-12 w-12 mb-2 opacity-50" />
                <p className="text-sm">No links shared</p>
              </div>
            ) : (
              <div className="space-y-2">
                {links.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors"
                  >
                    <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <LinkIcon className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{link.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                    </div>
                  </a>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
