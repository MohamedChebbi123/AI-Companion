import { getAccessToken, refreshTokens } from './authservice'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

export interface Conversation {
  id: string
  user_id: string
  persona_id: string | null
  persona_version: number | null
  title: string | null
  created_at: string
  updated_at: string
}

export interface CreateConversationPayload {
  persona_id?: string
  title?: string
}

async function authFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const token = getAccessToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(init.headers as Record<string, string> ?? {}),
  }

  let res = await fetch(input, { ...init, headers })

  if (res.status === 401) {
    const tokens = await refreshTokens()
    res = await fetch(input, {
      ...init,
      headers: { ...headers, Authorization: `Bearer ${tokens.access_token}` },
    })
  }

  return res
}

export async function listConversations(): Promise<Conversation[]> {
  const res = await authFetch(`${BASE_URL}/conversations`)
  if (!res.ok) throw new Error('Failed to load conversations')
  return res.json()
}

export async function createConversation(payload: CreateConversationPayload = {}): Promise<Conversation> {
  const res = await authFetch(`${BASE_URL}/conversations`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Failed to create conversation')
  return res.json()
}

export async function deleteConversation(id: string): Promise<void> {
  const res = await authFetch(`${BASE_URL}/conversations/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete conversation')
}

export interface Message {
  id: string
  conversation_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  const res = await authFetch(`${BASE_URL}/conversations/${conversationId}/messages`)
  if (!res.ok) throw new Error('Failed to load messages')
  return res.json()
}
