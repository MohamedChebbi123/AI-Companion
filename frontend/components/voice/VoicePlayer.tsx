'use client';
import { useAudioPlayback } from '@/hooks/useAudioPlayback';
import { cn } from '@/lib/utils';

export function VoicePlayer({ src }: { src: string }) {
  const { isPlaying, play, stop } = useAudioPlayback();

  return (
    <button
      type="button"
      onClick={() => (isPlaying ? stop() : play(src))}
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
        isPlaying
          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
          : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300'
      )}
    >
      {isPlaying ? '⏸ Playing…' : '▶ Play'}
    </button>
  );
}
