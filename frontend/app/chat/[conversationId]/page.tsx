'use client';
import { useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Sidebar } from '@/components/chat/Sidebar';
import { MessageList } from '@/components/chat/MessageList';
import { Composer } from '@/components/chat/Composer';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useChatStore } from '@/store/chatStore';
import { chatService } from '@/services/chatService';
import type { WsMessage } from '@/lib/wsProtocol';
import type { Message } from '@/services/chatService';

export default function ConversationPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { setMessages, setConversations, appendMessage, setTyping } =
    useChatStore();

  useEffect(() => {
    chatService.listConversations().then(setConversations).catch(() => {});
    chatService
      .getMessages(conversationId)
      .then((msgs) => setMessages(conversationId, msgs))
      .catch(() => {});
  }, [conversationId, setConversations, setMessages]);

  const onMessage = useCallback(
    (msg: WsMessage) => {
      if (msg.type === 'chat') {
        appendMessage(conversationId, msg.payload as Message);
        setTyping(false);
      } else if (msg.type === 'typing') {
        setTyping(true);
      }
    },
    [conversationId, appendMessage, setTyping]
  );

  const { send } = useWebSocket(conversationId, onMessage);

  const handleSend = (text: string) => {
    send({ type: 'chat', payload: { content: text } });
  };

  const handleVoice = (blob: Blob) => {
    // TODO: upload blob then send voice message
    console.log('voice blob', blob.size);
  };

  return (
    <div className="flex h-screen">
      <Sidebar activeId={conversationId} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <MessageList conversationId={conversationId} />
        <Composer onSend={handleSend} onVoice={handleVoice} />
      </div>
    </div>
  );
}
