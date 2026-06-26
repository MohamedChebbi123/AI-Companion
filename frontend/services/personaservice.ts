import { getAccessToken, refreshTokens } from './authservice'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

export interface SpeechStyle {
  tone: string
  formality: string
  verbosity: string
  vocabulary: string
}

export interface Persona {
  id: string
  owner_id: string
  name: string
  avatar_url: string | null
  backstory: string
  core_traits: string[]
  values: string[]
  boundaries: string[]
  speechstyle: SpeechStyle
  emotional_baseline: string
  is_public: boolean
  created_at: string
  updated_at: string
}

export interface CreatePersonaPayload {
  name: string
  backstory: string
  core_traits: string[]
  values: string[]
  boundaries: string[]
  speechstyle: SpeechStyle
  emotional_baseline: string
  is_public: boolean
}

export type UpdatePersonaPayload = Partial<CreatePersonaPayload>

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

export async function createPersona(data: CreatePersonaPayload): Promise<Persona> {
  const res = await authFetch(`${BASE_URL}/personas`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Failed to create persona' }))
    throw new Error(err.detail ?? 'Failed to create persona')
  }
  return res.json()
}

export async function listMyPersonas(): Promise<Persona[]> {
  const res = await authFetch(`${BASE_URL}/personas/me`)
  if (!res.ok) throw new Error('Failed to load personas')
  return res.json()
}

export async function listPublicPersonas(): Promise<Persona[]> {
  const res = await authFetch(`${BASE_URL}/personas/public`)
  if (!res.ok) throw new Error('Failed to load public personas')
  return res.json()
}

export async function getPersona(id: string): Promise<Persona> {
  const res = await authFetch(`${BASE_URL}/personas/${id}`)
  if (!res.ok) throw new Error('Persona not found')
  return res.json()
}

export async function updatePersona(id: string, data: UpdatePersonaPayload): Promise<Persona> {
  const res = await authFetch(`${BASE_URL}/personas/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Failed to update persona' }))
    throw new Error(err.detail ?? 'Failed to update persona')
  }
  return res.json()
}

export async function deletePersona(id: string): Promise<void> {
  const res = await authFetch(`${BASE_URL}/personas/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete persona')
}

export async function generatePersona(description: string, is_public: boolean): Promise<Persona> {
  const res = await authFetch(`${BASE_URL}/personas/generate`, {
    method: 'POST',
    body: JSON.stringify({ description, is_public }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Generation failed' }))
    throw new Error(err.detail ?? 'Generation failed')
  }
  return res.json()
}

export async function deletePersonaAvatar(id: string): Promise<Persona> {
  const res = await authFetch(`${BASE_URL}/personas/${id}/avatar`, { method: 'DELETE' })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Failed to remove avatar' }))
    throw new Error(err.detail ?? 'Failed to remove avatar')
  }
  return res.json()
}

export async function uploadPersonaAvatar(id: string, file: File): Promise<Persona> {
  const token = getAccessToken()
  const form = new FormData()
  form.append('file', file)

  let res = await fetch(`${BASE_URL}/personas/${id}/avatar`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  })

  if (res.status === 401) {
    const tokens = await refreshTokens()
    res = await fetch(`${BASE_URL}/personas/${id}/avatar`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokens.access_token}` },
      body: form,
    })
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Upload failed' }))
    throw new Error(err.detail ?? 'Upload failed')
  }
  return res.json()
}
