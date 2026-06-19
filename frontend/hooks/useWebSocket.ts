'use client';
import { useEffect, useRef, useCallback } from 'react';
import { WS_URL } from '@/lib/constants';
import { parseMessage, serializeMessage, type WsMessage } from '@/lib/wsProtocol';

export function useWebSocket(
  conversationId: string,
  onMessage: (msg: WsMessage) => void
) {
  const ws = useRef<WebSocket | null>(null);

  const send = useCallback((msg: WsMessage) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(serializeMessage(msg));
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    ws.current = new WebSocket(
      `${WS_URL}/ws/${conversationId}?token=${token ?? ''}`
    );
    ws.current.onmessage = (e) => {
      try {
        onMessage(parseMessage(e.data as string));
      } catch {
        // ignore malformed frames
      }
    };
    return () => ws.current?.close();
  }, [conversationId, onMessage]);

  return { send };
}
