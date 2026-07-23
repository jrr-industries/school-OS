'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, Download, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageViewerProps {
  src: string;
  alt: string;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export function ImageViewer({ src, alt, onClose, onNext, onPrev, hasNext, hasPrev }: ImageViewerProps) {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === '+' || e.key === '=') setScale((s) => Math.min(s + 0.25, 3));
    if (e.key === '-') setScale((s) => Math.max(s - 0.25, 0.25));
    if (e.key === 'ArrowRight' && onNext) onNext();
    if (e.key === 'ArrowLeft' && onPrev) onPrev();
  }, [onClose, onNext, onPrev]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  const handleDownload = async () => {
    try {
      const res = await fetch(src);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = alt;
      a.click();
      URL.revokeObjectURL(url);
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center" onClick={onClose}>
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button onClick={handleDownload} className="p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
          <Download className="h-5 w-5" />
        </button>
        <button onClick={() => setRotation((r) => (r + 90) % 360)} className="p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
          <RotateCw className="h-5 w-5" />
        </button>
        <button onClick={() => setScale((s) => Math.min(s + 0.25, 3))} className="p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
          <ZoomIn className="h-5 w-5" />
        </button>
        <button onClick={() => setScale((s) => Math.max(s - 0.25, 0.25))} className="p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
          <ZoomOut className="h-5 w-5" />
        </button>
        <div className="w-px h-6 bg-white/20" />
        <button onClick={onClose} className="p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-sm">
        {Math.round(scale * 100)}% | {rotation}°
      </div>

      {hasPrev && (
        <button onClick={(e) => { e.stopPropagation(); onPrev?.(); }} className="absolute left-4 p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
          <ChevronLeft className="h-8 w-8" />
        </button>
      )}
      {hasNext && (
        <button onClick={(e) => { e.stopPropagation(); onNext?.(); }} className="absolute right-4 p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
          <ChevronRight className="h-8 w-8" />
        </button>
      )}

      <div onClick={(e) => e.stopPropagation()} className="max-w-[90vw] max-h-[90vh] flex items-center justify-center">
        <img
          src={src}
          alt={alt}
          style={{ transform: `scale(${scale}) rotate(${rotation}deg)`, transition: 'transform 0.2s ease' }}
          className="max-w-full max-h-full object-contain rounded-lg"
        />
      </div>
    </div>
  );
}
