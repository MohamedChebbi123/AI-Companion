import { create } from 'zustand';
import type { Conversation, Message } from '@/services/chatService';

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Record<string, Message[]>;
  isTyping: boolean;
  setConversations: (convs: Conversation[]) => void;
  setActiveConversation: (id: string) => void;
  setMessages: (conversationId: string, msgs: Message[]) => void;
  appendMessage: (conversationId: string, msg: Message) => void;
  setTyping: (typing: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  conversations: [],
  activeConversationId: null,
  messages: {},
  isTyping: false,
  setConversations: (conversations) => set({ conversations }),
  setActiveConversation: (id) => set({ activeConversationId: id }),
  setMessages: (conversationId, msgs) =>
    set((s) => ({ messages: { ...s.messages, [conversationId]: msgs } })),
  appendMessage: (conversationId, msg) =>
    set((s) => ({
      messages: {
        ...s.messages,
        [conversationId]: [...(s.messages[conversationId] ?? []), msg],
      },
    })),
  setTyping: (isTyping) => set({ isTyping }),
}));
