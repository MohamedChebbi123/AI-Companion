'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Send, Loader2, Trash2, User, Bot } from 'lucide-react'
import Aurora from '@/components/Aurora'
import { listConversations, createConversation, deleteConversation, getMessages, type Conversation } from '@/services/conversationservice'
import { listMyPersonas, type Persona } from '@/services/personaservice'
import { sendMessage } from '@/services/aiservice'

type LocalMessage = {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatPage() {
  const router = useRouter()

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [personas, setPersonas] = useState<Persona[]>([])
  const [activeConv, setActiveConv] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<LocalMessage[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [loadingConvs, setLoadingConvs] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [showPersonaPicker, setShowPersonaPicker] = useState(false)

  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    Promise.all([listConversations(), listMyPersonas()])
      .then(([convs, pers]) => {
        setConversations(convs)
        setPersonas(pers)
      })
      .catch(() => {})
      .finally(() => setLoadingConvs(false))
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleNewChat = async (personaId?: string) => {
    const persona = personas.find(p => p.id === personaId)
    const conv = await createConversation({
      persona_id: personaId,
      title: persona ? `Chat with ${persona.name}` : 'New chat',
    })
    setConversations(prev => [conv, ...prev])
    setActiveConv(conv)
    setMessages([])
    setShowPersonaPicker(false)
  }

  const handleSelectConv = async (conv: Conversation) => {
    setActiveConv(conv)
    setMessages([])
    try {
      const history = await getMessages(conv.id)
      setMessages(history.map(m => ({ role: m.role, content: m.content })))
    } catch {
      // silently ignore — chat still works without history
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await deleteConversation(id)
      setConversations(prev => prev.filter(c => c.id !== id))
      if (activeConv?.id === id) {
        setActiveConv(null)
        setMessages([])
      }
    } catch {
      // silently ignore
    } finally {
      setDeletingId(null)
    }
  }

  const handleSend = async () => {
    if (!input.trim() || !activeConv || sending) return
    const text = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setSending(true)
    try {
      const result = await sendMessage(activeConv.id, text)
      setMessages(prev => [...prev, { role: 'assistant', content: result.reply }])
      if (result.title) {
        setConversations(prev =>
          prev.map(c => c.id === activeConv.id ? { ...c, title: result.title! } : c)
        )
        setActiveConv(prev => prev ? { ...prev, title: result.title! } : prev)
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong. Please try again.' }])
    } finally {
      setSending(false)
    }
  }

  const activePersona = personas.find(p => p.id === activeConv?.persona_id)

  return (
    <div className="relative h-screen bg-background text-foreground flex overflow-hidden">
      <div className="fixed inset-0 pointer-events-none" aria-hidden>
        <Aurora colorStops={['#0f0f1a', '#1a0a2e', '#0d1a2e']} blend={0.3} amplitude={0.6} speed={0.3} />
      </div>

      {/* Sidebar */}
      <aside className="relative z-10 w-64 flex-shrink-0 border-r border-white/[0.07] flex flex-col">
        <div className="p-4 border-b border-white/[0.07] flex items-center justify-between">
          <h1 className="text-sm font-semibold">Chats</h1>
          <div className="flex items-center gap-1">
            <button
              onClick={() => router.push('/personas')}
              className="text-xs text-white/40 hover:text-purple-400 transition-colors px-2 py-1 rounded-lg hover:bg-purple-500/10"
            >
              Personas
            </button>
            <div className="relative">
              <button
                onClick={() => setShowPersonaPicker(v => !v)}
                className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 hover:bg-purple-500/30 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>

              {showPersonaPicker && (
                <div className="absolute right-0 top-9 w-52 glass rounded-xl border border-white/[0.09] py-1.5 z-20 shadow-xl">
                  <button
                    onClick={() => handleNewChat(undefined)}
                    className="w-full px-3 py-2 text-left text-sm text-white/70 hover:bg-white/[0.06] hover:text-white transition-colors"
                  >
                    No persona
                  </button>
                  {personas.length > 0 && (
                    <>
                      <div className="h-px bg-white/[0.07] my-1" />
                      {personas.map(p => (
                        <button
                          key={p.id}
                          onClick={() => handleNewChat(p.id)}
                          className="w-full px-3 py-2 text-left text-sm text-white/70 hover:bg-white/[0.06] hover:text-white transition-colors flex items-center gap-2"
                        >
                          <div className="w-5 h-5 rounded-md overflow-hidden bg-gradient-to-br from-purple-500/40 to-pink-500/40 flex items-center justify-center text-xs flex-shrink-0">
                            {p.avatar_url
                              ? <img src={p.avatar_url} alt={p.name} className="w-full h-full object-cover" />
                              : p.name[0]
                            }
                          </div>
                          <span className="truncate">{p.name}</span>
                        </button>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {loadingConvs ? (
            <div className="flex items-center gap-2 text-white/30 text-xs px-4 py-3">
              <Loader2 className="w-3 h-3 animate-spin" /> Loading…
            </div>
          ) : conversations.length === 0 ? (
            <p className="text-xs text-white/25 px-4 py-3">No chats yet. Hit + to start.</p>
          ) : (
            conversations.map(conv => (
              <div
                key={conv.id}
                onClick={() => handleSelectConv(conv)}
                className={`group flex items-center gap-2 px-3 py-2.5 mx-2 rounded-xl cursor-pointer transition-all ${
                  activeConv?.id === conv.id
                    ? 'bg-purple-500/15 border border-purple-500/25'
                    : 'hover:bg-white/[0.05] border border-transparent'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate text-white/80">{conv.title ?? 'Untitled'}</p>
                  <p className="text-xs text-white/30 truncate">
                    {new Date(conv.updated_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); setConfirmDeleteId(conv.id) }}
                  disabled={deletingId === conv.id}
                  className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-lg flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-40 flex-shrink-0"
                >
                  {deletingId === conv.id
                    ? <Loader2 className="w-3 h-3 animate-spin" />
                    : <Trash2 className="w-3 h-3" />
                  }
                </button>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* Main chat area */}
      <main className="relative z-10 flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/[0.07] flex items-center gap-3 flex-shrink-0">
          {activePersona ? (
            <>
              <div className="w-8 h-8 rounded-xl overflow-hidden bg-gradient-to-br from-purple-500/40 to-pink-500/40 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                {activePersona.avatar_url
                  ? <img src={activePersona.avatar_url} alt={activePersona.name} className="w-full h-full object-cover" />
                  : activePersona.name[0]
                }
              </div>
              <div>
                <p className="text-sm font-medium">{activePersona.name}</p>
                <p className="text-xs text-white/35 capitalize">{activePersona.speechstyle.tone} · {activePersona.emotional_baseline}</p>
              </div>
            </>
          ) : activeConv ? (
            <p className="text-sm font-medium text-white/60">{activeConv.title ?? 'New chat'}</p>
          ) : (
            <p className="text-sm text-white/30">Select or start a conversation</p>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {!activeConv ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 flex items-center justify-center">
                <Bot className="w-7 h-7 text-purple-400" />
              </div>
              <div>
                <p className="text-base font-medium text-white/70">Start a conversation</p>
                <p className="text-sm text-white/35 mt-1">Hit the + button to create a new chat</p>
              </div>
            </div>
          ) : messages.length === 0 && !sending ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-sm text-white/25">
                {activePersona ? `Say hello to ${activePersona.name}…` : 'Type a message to begin…'}
              </p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user'
                    ? 'bg-white/[0.08] border border-white/[0.09]'
                    : 'bg-gradient-to-br from-purple-500/30 to-pink-500/30 border border-purple-500/20'
                }`}>
                  {msg.role === 'user'
                    ? <User className="w-3.5 h-3.5 text-white/50" />
                    : activePersona?.avatar_url
                      ? <img src={activePersona.avatar_url} alt="" className="w-full h-full object-cover rounded-xl" />
                      : <Bot className="w-3.5 h-3.5 text-purple-300" />
                  }
                </div>
                <div className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-purple-500/20 border border-purple-500/25 text-white/90 rounded-tr-sm'
                    : 'bg-white/[0.05] border border-white/[0.08] text-white/80 rounded-tl-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))
          )}

          {sending && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Bot className="w-3.5 h-3.5 text-purple-300" />
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white/[0.05] border border-white/[0.08] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-6 py-4 border-t border-white/[0.07] flex-shrink-0">
          <div className="flex items-end gap-3">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder={activeConv ? 'Type a message… (Enter to send)' : 'Select a conversation first'}
              disabled={!activeConv || sending}
              rows={1}
              className="flex-1 bg-white/[0.05] border border-white/[0.09] rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-purple-500/40 transition-colors resize-none disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ maxHeight: '120px', overflowY: 'auto' }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || !activeConv || sending}
              className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
            >
              {sending
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <Send className="w-4 h-4" />
              }
            </button>
          </div>
        </div>
      </main>

      {/* Delete confirmation modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setConfirmDeleteId(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative glass w-full max-w-sm p-6 rounded-2xl border border-white/[0.09] space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/25 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-4 h-4 text-red-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Delete conversation?</p>
                <p className="text-xs text-white/45 mt-1">This will permanently delete all messages. This cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.09] text-sm text-white/60 hover:bg-white/[0.09] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => { handleDelete(confirmDeleteId); setConfirmDeleteId(null) }}
                disabled={deletingId === confirmDeleteId}
                className="flex-1 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-sm text-red-300 hover:bg-red-500/30 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {deletingId === confirmDeleteId
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  : <Trash2 className="w-3.5 h-3.5" />
                }
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
