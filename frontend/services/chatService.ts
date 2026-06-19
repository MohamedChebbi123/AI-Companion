import { api } from './apiClient';

export interface Conversation {
  id: string;
  title: string;
  created_at: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export const chatService = {
  listConversations:  ()                        => api.get<Conversation[]>('/conversations'),
  getConversation:    (id: string)              => api.get<Conversation>(`/conversations/${id}`),
  createConversation: (title: string)           => api.post<Conversation>('/conversations', { title }),
  getMessages:        (conversationId: string)  => api.get<Message[]>(`/conversations/${conversationId}/messages`),
};
