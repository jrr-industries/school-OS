'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Play, Square } from 'lucide-react';

export function VoiceMessage({ src, duration: propDuration }: { src: string; duration?: number }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [actualDuration, setActualDuration] = useState(propDuration ?? 0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animFrameRef = useRef<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const audio = new Audio(src);
    audioRef.current = audio;
    audio.preload = 'metadata';

    audio.onloadedmetadata = () => {
      if (audio.duration && isFinite(audio.duration)) setActualDuration(audio.duration);
    };

    audio.ontimeupdate = () => setCurrentTime(audio.currentTime);
    audio.onended = () => { setIsPlaying(false); setCurrentTime(0); };

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [src]);

  const drawPlaybackWaveform = useCallback(() => {
    if (!canvasRef.current || !audioRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const duration = audioRef.current.duration || 1;
    const progress = audioRef.current.currentTime / duration;
    const bars = 40;
    const barWidth = canvas.width / bars;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < bars; i++) {
      const height = 4 + Math.random() * 20;
      const isPlayed = i / bars <= progress;
      ctx.fillStyle = isPlayed ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))';
      ctx.fillRect(i * barWidth + 1, canvas.height / 2 - height / 2, barWidth - 2, height);
    }
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const tick = () => {
      drawPlaybackWaveform();
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isPlaying, drawPlaybackWaveform]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (s: number) => {
    if (!isFinite(s)) return '0:00';
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2 min-w-[200px] max-w-[260px]">
      <button onClick={togglePlay} className="p-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors shrink-0">
        {isPlaying ? <Square className="h-3.5 w-3.5 fill-current" /> : <Play className="h-3.5 w-3-5 ml-0.5" />}
      </button>
      <canvas ref={canvasRef} width={140} height={28} className="rounded-sm" />
      <span className="text-[10px] font-mono tabular-nums text-muted-foreground shrink-0">
        {formatTime(isPlaying ? currentTime : actualDuration)}
      </span>
    </div>
  );
}
