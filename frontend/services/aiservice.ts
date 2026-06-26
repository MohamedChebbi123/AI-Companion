import { getAccessToken, refreshTokens } from './authservice'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

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

export async function sendMessage(conversationId: string, message: string): Promise<string> {
  const res = await authFetch(`${BASE_URL}/ai/chat/${conversationId}`, {
    method: 'POST',
    body: JSON.stringify({ message }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Failed to get response' }))
    throw new Error(err.detail ?? 'Failed to get response')
  }
  const data: { reply: string } = await res.json()
  return data.reply
}
