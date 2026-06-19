'use client';
import { useRef, useState, useCallback } from 'react';

export function useAudioCapture() {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const start = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);
    chunks.current = [];
    mediaRecorder.current.ondataavailable = (e) => chunks.current.push(e.data);
    mediaRecorder.current.start();
    setIsRecording(true);
  }, []);

  const stop = useCallback((): Promise<Blob> => {
    return new Promise((resolve) => {
      if (!mediaRecorder.current) return;
      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks.current, { type: 'audio/webm' });
        mediaRecorder.current?.stream.getTracks().forEach((t) => t.stop());
        resolve(blob);
      };
      mediaRecorder.current.stop();
      setIsRecording(false);
    });
  }, []);

  return { isRecording, start, stop };
}
