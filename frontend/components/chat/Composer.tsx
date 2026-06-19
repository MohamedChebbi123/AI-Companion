'use client';
import { useState, KeyboardEvent } from 'react';
import { Button, Input } from '@/components/ui';
import { MicButton } from '@/components/voice/MicButton';

interface ComposerProps {
  onSend: (text: string) => void;
  onVoice?: (blob: Blob) => void;
  disabled?: boolean;
}

export function Composer({ onSend, onVoice, disabled }: ComposerProps) {
  const [text, setText] = useState('');

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="flex gap-2 px-4 py-3 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      {onVoice && <MicButton onCapture={onVoice} />}
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKey}
        placeholder="Type a message…"
        disabled={disabled}
        className="flex-1"
      />
      <Button onClick={submit} disabled={disabled || !text.trim()}>
        Send
      </Button>
    </div>
  );
}
