'use client';
import { useRef, useState, useCallback } from 'react';

export function useAudioPlayback() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);

  const play = useCallback((src: string) => {
    audio.current?.pause();
    audio.current = new Audio(src);
    audio.current.onended = () => setIsPlaying(false);
    audio.current.play();
    setIsPlaying(true);
  }, []);

  const stop = useCallback(() => {
    audio.current?.pause();
    setIsPlaying(false);
  }, []);

  return { isPlaying, play, stop };
}
