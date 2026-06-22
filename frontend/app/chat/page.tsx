'use client'

import { useState, useRef, useEffect } from 'react'
import { Settings, BookOpen, MoreHorizontal, ArrowUp, MessageSquare, GraduationCap, LogOut, Mail, ChevronUp } from 'lucide-react'
import { getProfile, logout, type UserProfile } from '@/services/authservice'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Joyride, STATUS, type EventData } from 'react-joyride'

// ── Tour steps ───────────────────────────────────────────────────────────────

const TOUR_STEPS = [
  {
    target: '[data-tour="profile"]',
    title: 'Your profile',
    content: 'Access your account settings, re-run this tutorial, and log out from here.',
    placement: 'right' as const,
    skipBeacon: true,
  },
  {
    target: '[data-tour="mood"]',
    title: 'How are you feeling?',
    content: 'Set your mood before each session. Seren uses this to tailor her responses to how you\'re doing right now.',
    placement: 'right' as const,
    skipBeacon: true,
  },
  {
    target: '[data-tour="recent"]',
    title: 'Recent conversations',
    content: 'All your past sessions live here. Click any one to pick up where you left off.',
    placement: 'right' as const,
    skipBeacon: true,
  },
  {
    target: '[data-tour="companion"]',
    title: 'Meet Seren',
    content: 'Seren is your AI companion — she\'s here to listen, reflect, and support you without judgement.',
    placement: 'bottom' as const,
    skipBeacon: true,
  },
  {
    target: '[data-tour="input"]',
    title: 'Start the conversation',
    content: 'Type anything you\'d like to share. You can also tap one of Seren\'s suggestion chips to get started quickly.',
    placement: 'top' as const,
    skipBeacon: true,
  },
]

// ── Static mock data ─────────────────────────────────────────────────────────

const MOODS = ['Calm', 'Anxious', 'Sad', 'Grateful'] as const

const RECENT = [
  { label: 'Today',     items: [{ id: 1, title: 'Today' }] },
  { label: 'Yesterday', items: [{ id: 2, title: 'About work stress' }] },
  { label: 'Mon 16',   items: [{ id: 3, title: 'Sunday reflections' }, { id: 4, title: 'Sleep & anxiety' }] },
]

type Message = {
  id: number
  role: 'ai' | 'user'
  text: string
  time: string
  suggestions?: string[]
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1, role: 'ai',
    text: "Hey, I'm glad you're here. What's on your mind today?",
    time: '9:02 AM',
  },
  {
    id: 2, role: 'user',
    text: "Honestly just feeling a bit overwhelmed lately. Like there's too much happening at once.",
    time: '9:04 AM',
  },
  {
    id: 3, role: 'ai',
    text: "That sounds really heavy. When everything piles up it can be hard to even know where to begin. Is there one thing in particular that's weighing on you most right now?",
    time: '9:05 AM',
    suggestions: ['Work stress', 'My relationships', "I'm not sure", 'Just want to vent'],
  },
]

// ── Helpers ──────────────────────────────────────────────────────────────────

function Avatar({ letter, color }: { letter: string; color: string }) {
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 ${color}`}>
      {letter}
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ChatPage() {
  const [messages, setMessages]     = useState<Message[]>(INITIAL_MESSAGES)
  const [input, setInput]           = useState('')
  const [activeMood, setActiveMood] = useState<string | null>(null)
  const [activeChat, setActiveChat] = useState(1)
  const [profile, setProfile]       = useState<UserProfile | null>(null)
  const [tourActive, setTourActive] = useState(false)
  const bottomRef                   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    getProfile().then(setProfile).catch(() => {})
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function sendMessage(text: string) {
    if (!text.trim()) return
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: text.trim(), time: now }])
    setInput('')
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  function handleTourCallback({ status }: EventData) {
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setTourActive(false)
    }
  }

  return (
    <div className="flex h-screen bg-[#0a0a0d] text-white overflow-hidden">

      {/* ── Joyride ─────────────────────────────────────────────────── */}
      <Joyride
        steps={TOUR_STEPS}
        run={tourActive}
        continuous
        onEvent={handleTourCallback}
        options={{
          zIndex: 10000,
          primaryColor: '#a855f7',
          backgroundColor: '#18181f',
          textColor: '#e2e2e9',
          arrowColor: '#18181f',
          overlayColor: 'rgba(0,0,0,0.6)',
          showProgress: true,
          buttons: ['back', 'primary', 'skip'],
          skipBeacon: true,
        }}
        styles={{
          tooltip: {
            borderRadius: '14px',
            border: '1px solid rgba(255,255,255,0.09)',
            padding: '20px',
            fontSize: '13px',
          },
          tooltipTitle: {
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '6px',
            color: '#ffffff',
          },
          tooltipContent: {
            padding: '0',
            lineHeight: '1.6',
            color: 'rgba(255,255,255,0.65)',
          },
          buttonPrimary: {
            backgroundColor: '#a855f7',
            borderRadius: '8px',
            padding: '7px 14px',
            fontSize: '12px',
            fontWeight: '600',
          },
          buttonBack: {
            color: 'rgba(255,255,255,0.4)',
            fontSize: '12px',
            marginRight: '8px',
          },
          buttonSkip: {
            color: 'rgba(255,255,255,0.3)',
            fontSize: '12px',
          },
          buttonClose: {
            color: 'rgba(255,255,255,0.3)',
          },
          overlay: {
            backgroundColor: 'rgba(0,0,0,0.6)',
          },
        }}
        locale={{
          back: 'Back',
          close: 'Close',
          last: 'Done',
          next: 'Next',
          skip: 'Skip tour',
        }}
      />

      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <aside className="w-56 flex-shrink-0 flex flex-col bg-[#0d0d10] border-r border-white/[0.06]">

        {/* User */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              data-tour="profile"
              className="mx-3 mt-4 mb-3 flex items-center gap-3 rounded-xl px-3 py-2.5 w-[calc(100%-24px)] text-left hover:bg-white/[0.06] transition-colors group outline-none"
            >
              <div className="relative flex-shrink-0">
                <Avatar letter={(profile?.display_name?.[0] ?? '?').toUpperCase()} color="bg-emerald-600" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0d0d10]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold leading-none truncate">{profile?.display_name ?? '—'}</p>
                <p className="text-[11px] text-emerald-400/80 mt-1">• Here with you</p>
              </div>
              <ChevronUp size={13} className="text-white/25 group-hover:text-white/50 transition-colors flex-shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-52">
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem className="text-white/40 cursor-default select-text hover:bg-transparent focus:bg-transparent">
                <Mail size={13} className="flex-shrink-0" />
                <span className="truncate text-[12px]">{profile?.email ?? '—'}</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={() => setTourActive(true)}>
                <GraduationCap size={13} />
                Tutorial
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings size={13} />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-400/80 hover:text-red-400 focus:text-red-400 hover:bg-red-500/10 focus:bg-red-500/10"
              onClick={() => logout()}
            >
              <LogOut size={13} />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Mood */}
        <div data-tour="mood" className="px-4 pb-4">
          <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-2.5">How are you feeling?</p>
          <div className="grid grid-cols-2 gap-1.5">
            {MOODS.map(mood => (
              <button
                key={mood}
                onClick={() => setActiveMood(m => m === mood ? null : mood)}
                className={`py-2 rounded-lg text-[12px] font-medium transition-all duration-200 border ${
                  activeMood === mood
                    ? 'bg-purple-500/20 border-purple-500/50 text-purple-200'
                    : 'bg-white/[0.04] border-white/[0.07] text-white/55 hover:bg-white/[0.08] hover:text-white/80'
                }`}
              >
                {mood}
              </button>
            ))}
          </div>
        </div>

        <div className="mx-4 border-t border-white/[0.06] mb-3" />

        {/* Recent */}
        <div data-tour="recent" className="flex-1 overflow-y-auto px-2 space-y-3 min-h-0">
          <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest px-2">Recent</p>
          {RECENT.map(group => (
            <div key={group.label}>
              {group.label !== 'Today' && (
                <p className="text-[10px] text-white/25 px-2 mb-1">{group.label}</p>
              )}
              {group.items.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveChat(item.id)}
                  className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-left text-[12px] transition-all duration-150 ${
                    activeChat === item.id
                      ? 'bg-white/[0.09] text-white'
                      : 'text-white/45 hover:bg-white/[0.05] hover:text-white/70'
                  }`}
                >
                  <MessageSquare size={13} className="flex-shrink-0 opacity-60" />
                  <span className="truncate font-medium">{item.title}</span>
                </button>
              ))}
            </div>
          ))}
        </div>

      </aside>

      {/* ── Main chat ───────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <header data-tour="companion" className="flex-shrink-0 flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] bg-[#0a0a0d]">
          <div className="flex items-center gap-3">
            <Avatar letter="S" color="bg-[#2a2a35]" />
            <div>
              <p className="text-sm font-semibold leading-none">Seren</p>
              <p className="text-[11px] text-white/35 mt-0.5">Your companion</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-white/35 hover:text-white/70 hover:bg-white/[0.07] transition-all">
              <BookOpen size={15} />
            </button>
            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-white/35 hover:text-white/70 hover:bg-white/[0.07] transition-all">
              <MoreHorizontal size={15} />
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5 min-h-0">
          {messages.map(msg => (
            <div key={msg.id}>
              {msg.role === 'ai' ? (
                /* AI message */
                <div className="flex items-start gap-3 max-w-[75%]">
                  <Avatar letter="S" color="bg-[#2a2a35]" />
                  <div className="space-y-2">
                    <div className="bg-[#18181f] border border-white/[0.07] rounded-2xl rounded-tl-sm px-4 py-3">
                      <p className="text-sm text-white/90 leading-relaxed">{msg.text}</p>
                    </div>
                    <p className="text-[10px] text-white/25 pl-1">{msg.time}</p>
                    {msg.suggestions && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {msg.suggestions.map(s => (
                          <button
                            key={s}
                            onClick={() => sendMessage(s)}
                            className="px-3 py-1.5 rounded-full text-[11px] font-medium bg-white/[0.06] border border-white/[0.10] text-white/60 hover:bg-white/[0.11] hover:text-white/85 hover:border-white/20 transition-all duration-150"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* User message */
                <div className="flex items-end gap-3 max-w-[75%] ml-auto flex-row-reverse">
                  <Avatar letter={(profile?.display_name?.[0] ?? '?').toUpperCase()} color="bg-emerald-600" />
                  <div className="space-y-1">
                    <div className="bg-[#d4f5e5] rounded-2xl rounded-br-sm px-4 py-3">
                      <p className="text-sm text-[#0a2a1a] leading-relaxed">{msg.text}</p>
                    </div>
                    <p className="text-[10px] text-white/25 text-right pr-1">{msg.time}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div data-tour="input" className="flex-shrink-0 px-5 py-4 border-t border-white/[0.06]">
          <div className="flex items-end gap-3 bg-[#18181f] border border-white/[0.09] rounded-2xl px-4 py-3 focus-within:border-white/20 transition-colors">
            <textarea
              rows={1}
              value={input}
              onChange={e => {
                setInput(e.target.value)
                e.target.style.height = 'auto'
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
              }}
              onKeyDown={handleKeyDown}
              placeholder="Share what's on your mind…"
              className="flex-1 bg-transparent resize-none text-sm text-white/80 placeholder:text-white/25 outline-none leading-relaxed max-h-[120px] overflow-y-auto"
              style={{ height: '22px' }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim()}
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 bg-purple-600 hover:bg-purple-500 disabled:opacity-25 disabled:cursor-not-allowed transition-all mb-0.5"
            >
              <ArrowUp size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
