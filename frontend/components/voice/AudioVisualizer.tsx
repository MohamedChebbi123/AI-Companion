'use client';
import { useEffect, useRef } from 'react';

export function AudioVisualizer({ stream }: { stream: MediaStream | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (!stream || !canvasRef.current) return;
    const ctx = new AudioContext();
    const analyser = ctx.createAnalyser();
    ctx.createMediaStreamSource(stream).connect(analyser);
    analyser.fftSize = 64;
    const data = new Uint8Array(analyser.frequencyBinCount);
    const canvas = canvasRef.current;

    const draw = () => {
      animRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(data);
      const c = canvas.getContext('2d')!;
      c.clearRect(0, 0, canvas.width, canvas.height);
      const barW = canvas.width / data.length;
      data.forEach((v, i) => {
        const h = (v / 255) * canvas.height;
        c.fillStyle = '#6366f1';
        c.fillRect(i * barW, canvas.height - h, barW - 1, h);
      });
    };
    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      ctx.close();
    };
  }, [stream]);

  return <canvas ref={canvasRef} width={120} height={40} className="rounded" />;
}
