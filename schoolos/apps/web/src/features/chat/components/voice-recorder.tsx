'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, Square, Play, Trash2, Send, Loader2 } from 'lucide-react';

export function VoiceRecorder({
  onSend,
  onCancel,
}: {
  onSend: (blob: Blob, duration: number) => void;
  onCancel: () => void;
}) {
  const [state, setState] = useState<'idle' | 'recording' | 'stopped'>('idle');
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackPos, setPlaybackPos] = useState(0);
  const [uploading, setUploading] = useState(false);

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number>(0);

  const cleanup = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    mediaRecorder.current = null;
    streamRef.current = null;
  }, [audioUrl]);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const context = new AudioContext();
      const source = context.createMediaStreamSource(stream);
      const analyser = context.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const recorder = new MediaRecorder(stream, { mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/webm' });
      mediaRecorder.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
        setAudioUrl(URL.createObjectURL(blob));
        setState('stopped');
        setDuration(0);
        if (timerRef.current) clearInterval(timerRef.current);
        context.close();
      };

      recorder.start();
      setState('recording');

      const startTime = Date.now();
      timerRef.current = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTime) / 1000));
      }, 100);

      drawWaveform();
    } catch {
      setState('idle');
    }
  };

  const drawWaveform = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!analyserRef.current || !ctx || !canvas) return;
      animFrameRef.current = requestAnimationFrame(draw);
      analyserRef.current.getByteTimeDomainData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'hsl(var(--background))';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 128) * (canvas.height / 2);
        ctx.fillStyle = 'hsl(var(--primary))';
        ctx.fillRect(x, canvas.height / 2 - barHeight / 2, barWidth - 1, barHeight);
        x += barWidth;
      }
    };

    draw();
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    if (analyserRef.current) analyserRef.current.disconnect();
    if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
  };

  const handlePlay = () => {
    if (!audioUrl) return;
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    audio.onended = () => { setIsPlaying(false); setPlaybackPos(0); };
    audio.ontimeupdate = () => setPlaybackPos(audio.currentTime);
    audio.play();
    setIsPlaying(true);
  };

  const handleStopPlayback = () => {
    audioRef.current?.pause();
    audioRef.current = null;
    setIsPlaying(false);
  };

  const handleSend = async () => {
    if (chunksRef.current.length === 0) return;
    const blob = new Blob(chunksRef.current, { type: mediaRecorder.current?.mimeType ?? 'audio/webm' });
    setUploading(true);
    onSend(blob, duration);
  };

  const handleCancel = () => {
    cleanup();
    onCancel();
  };

  const formatDuration = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50 border">
      {state === 'idle' && (
        <button onClick={startRecording} className="p-2 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors">
          <Mic className="h-4 w-4" />
        </button>
      )}

      {state === 'recording' && (
        <>
          <button onClick={stopRecording} className="p-2 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors">
            <Square className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
            <span className="text-xs font-mono tabular-nums text-destructive">{formatDuration(duration)}</span>
          </div>
          <canvas ref={canvasRef} width={160} height={40} className="rounded-md" />
        </>
      )}

      {state === 'stopped' && (
        <>
          {isPlaying ? (
            <button onClick={handleStopPlayback} className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              <Square className="h-4 w-4" />
            </button>
          ) : (
            <button onClick={handlePlay} className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              <Play className="h-4 w-4" />
            </button>
          )}
          <span className="text-xs font-mono tabular-nums">{formatDuration(isPlaying ? Math.floor(playbackPos) : duration)}</span>
          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-primary transition-all rounded-full" style={{ width: `${isPlaying ? (playbackPos / duration) * 100 : 0}%` }} />
          </div>

          <button onClick={handleSend} disabled={uploading} className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
          <button onClick={handleCancel} className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <Trash2 className="h-4 w-4" />
          </button>
        </>
      )}
    </div>
  );
}
