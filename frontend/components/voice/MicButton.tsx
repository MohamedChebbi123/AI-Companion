'use client';
import { useAudioCapture } from '@/hooks/useAudioCapture';
import { cn } from '@/lib/utils';

export function MicButton({ onCapture }: { onCapture: (blob: Blob) => void }) {
  const { isRecording, start, stop } = useAudioCapture();

  const handleClick = async () => {
    if (isRecording) {
      const blob = await stop();
      onCapture(blob);
    } else {
      await start();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      title={isRecording ? 'Stop recording' : 'Start recording'}
      className={cn(
        'w-10 h-10 rounded-full flex items-center justify-center transition-colors shrink-0',
        isRecording
          ? 'bg-red-500 text-white animate-pulse'
          : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300'
      )}
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 14a3 3 0 003-3V5a3 3 0 00-6 0v6a3 3 0 003 3zm-1 1.93V18H9v2h6v-2h-2v-2.07A5.001 5.001 0 0017 11h-2a3 3 0 01-6 0H7a5 5 0 005 4.93z" />
      </svg>
    </button>
  );
}
