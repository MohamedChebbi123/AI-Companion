export type WsMessageType = 'chat' | 'typing' | 'voice' | 'error';

export interface WsMessage {
  type: WsMessageType;
  payload: unknown;
}

export function parseMessage(raw: string): WsMessage {
  return JSON.parse(raw) as WsMessage;
}

export function serializeMessage(msg: WsMessage): string {
  return JSON.stringify(msg);
}
