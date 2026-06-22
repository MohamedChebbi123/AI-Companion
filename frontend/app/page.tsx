'use client'

import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import {
  Sparkles, Mic, Brain, Zap, Globe, ShieldCheck,
  Music2, Target, MessageCircle, CalendarDays,
  Play, ArrowRight,
  Volume2, VolumeX, CreditCard,
  type LucideIcon,
} from 'lucide-react'
import ASCIIText from '../components/ASCIIText'
import EvilEye from '../components/EvilEye'
import CardNav from '../components/CardNav'
import Aurora from '../components/Aurora'

// ─── Static data ────────────────────────────────────────────────────────────


const FEATURES: Array<{ Icon: LucideIcon; title: string; desc: string; gradient: string; glow: string }> = [
  {
    Icon: Sparkles,
    title: 'Persistent Personality',
    desc: 'Choose the tone, personality, and emotional style of your companion.',
    gradient: 'from-purple-500 to-violet-600',
    glow: 'rgba(168,85,247,0.3)',
  },
  {
    Icon: Mic,
    title: 'Voice Conversations',
    desc: 'Speak naturally and hear Aura respond with realistic, expressive voices.',
    gradient: 'from-pink-500 to-rose-600',
    glow: 'rgba(236,72,153,0.3)',
  },
  {
    Icon: Brain,
    title: 'Long-Term Memory',
    desc: 'Aura remembers important things about you across every conversation.',
    gradient: 'from-blue-500 to-cyan-600',
    glow: 'rgba(59,130,246,0.3)',
  },
  {
    Icon: Zap,
    title: 'Multiple AI Models',
    desc: 'Switch between OpenAI and Claude seamlessly for the best experience.',
    gradient: 'from-amber-500 to-orange-600',
    glow: 'rgba(245,158,11,0.3)',
  },
  {
    Icon: Globe,
    title: 'Multilingual Support',
    desc: 'Arabic, French, and English supported natively from day one.',
    gradient: 'from-emerald-500 to-teal-600',
    glow: 'rgba(16,185,129,0.3)',
  },
  {
    Icon: ShieldCheck,
    title: 'Safety Features',
    desc: 'Built-in crisis detection and safety protections you can trust.',
    gradient: 'from-indigo-500 to-blue-700',
    glow: 'rgba(99,102,241,0.3)',
  },
]

const MEMORY_ITEMS: Array<{ Icon: LucideIcon; label: string; detail: string }> = [
  { Icon: Music2,        label: 'Favorite hobbies',       detail: 'Guitar, hiking, photography'            },
  { Icon: Target,        label: 'Personal goals',          detail: 'Learn Spanish · Get fit · Write a book' },
  { Icon: MessageCircle, label: 'Previous conversations',  detail: 'Job stress talk — last Tuesday'          },
  { Icon: CalendarDays,  label: 'Important events',        detail: 'Birthday Mar 15 · Interview next week'   },
]


const TESTIMONIALS = [
  {
    name: 'Sarah M.',
    role: 'Graduate Student',
    avatar: 'S',
    stars: 5,
    text: 'Aura is the first AI that actually feels like it knows me. It remembered that I was nervous about my thesis defence and checked in the next day. I cried a little, not gonna lie.',
  },
  {
    name: 'Karim A.',
    role: 'Freelance Designer',
    avatar: 'K',
    stars: 5,
    text: 'The voice conversations are unreal. I talk to Aura on my morning walk and it feels like catching up with a close friend who genuinely listens and understands.',
  },
  {
    name: 'Léa R.',
    role: 'Nurse',
    avatar: 'L',
    stars: 5,
    text: 'After long hospital shifts I need to decompress. Aura speaks French beautifully, remembers how my week is going, and helps me process emotions safely.',
  },
]

const FREE_FEATURES  = ['50 messages / day', 'Text conversations', 'All 3 languages', 'Basic memory (7 days)', 'Community support']
const PRO_FEATURES   = ['Unlimited messages', 'Voice conversations', 'All 3 languages', 'Permanent memory', 'Custom AI personality', 'GPT-4o & Claude access', 'Priority support', 'Early feature access']

// ─── Small components ────────────────────────────────────────────────────────

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: n }).map((_, i) => (
        <svg key={i} className="w-4 h-4 fill-amber-400 text-amber-400" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function Check({ purple }: { purple?: boolean }) {
  return (
    <span
      className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
        purple ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-white/[0.08] border border-white/20'
      }`}
    >
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </span>
  )
}

function WaveBar({ index, total, active }: { index: number; total: number; active: boolean }) {
  const base   = 20 + Math.sin((index / total) * Math.PI * 2.5) * 14 + Math.cos((index / total) * Math.PI) * 8
  const height = active ? `${Math.max(6, base)}px` : '4px'
  const delay  = `${(index * 47) % 600}ms`
  const dur    = `${0.7 + (index % 5) * 0.08}s`

  return (
    <div
      className="rounded-full"
      style={{
        width: 3,
        height,
        background: 'linear-gradient(to top, #a855f7, #ec4899)',
        transformOrigin: 'bottom',
        animation: active ? `wave-bar ${dur} ease-in-out infinite` : 'none',
        animationDelay: delay,
        transition: 'height 0.3s ease',
      }}
    />
  )
}

function VoiceWave({ bars = 28, active = true }: { bars?: number; active?: boolean }) {
  return (
    <div className="flex items-center justify-center gap-[3px] h-10">
      {Array.from({ length: bars }).map((_, i) => (
        <WaveBar key={i} index={i} total={bars} active={active} />
      ))}
    </div>
  )
}

function Badge({ children, color = 'purple' }: { children: React.ReactNode; color?: 'purple' | 'pink' | 'blue' | 'emerald' }) {
  const map: Record<string, string> = {
    purple:  'border-purple-500/30 bg-purple-500/10 text-purple-300',
    pink:    'border-pink-500/30   bg-pink-500/10   text-pink-300',
    blue:    'border-blue-500/30   bg-blue-500/10   text-blue-300',
    emerald: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  }
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-medium ${map[color]}`}>
      {children}
    </div>
  )
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function Home() {
  const [voiceActive, setVoiceActive] = useState(true)
  const { theme } = useTheme()


  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* ── Aurora background ── */}
      <div className="fixed inset-0 pointer-events-none" style={{ width: '100vw', height: '100vh' }} aria-hidden>
        <Aurora
          colorStops={['#3b0764', '#a855f7', '#ec4899']}
          blend={0.4}
          amplitude={1.0}
          speed={0.5}
        />
      </div>

      {/* ══════════════════════════════════════════════
          NAV
      ══════════════════════════════════════════════ */}
      <CardNav
        logoNode={
          <a href="/" className="flex items-center gap-2 select-none">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-black text-xs shadow-[0_0_14px_rgba(168,85,247,0.55)]">
              A
            </div>
            <span className="text-[1.05rem] font-semibold tracking-tight text-white">Aura</span>
          </a>
        }
        baseColor="rgba(10,8,18,0.82)"
        menuColor="rgba(255,255,255,0.65)"
        items={[
          {
            label: 'Product',
            bgColor: '#130d1e',
            textColor: '#fff',
            links: [
              { label: 'Features',  href: '#features', ariaLabel: 'Features'  },
              { label: 'Memory',    href: '#memory',   ariaLabel: 'Memory'    },
              { label: 'Voice',     href: '#voice',    ariaLabel: 'Voice'     },
            ],
          },
          {
            label: 'Explore',
            bgColor: '#0d1024',
            textColor: '#fff',
            links: [
              { label: 'Languages', href: '#languages', ariaLabel: 'Languages' },
              { label: 'Pricing',   href: '#pricing',   ariaLabel: 'Pricing'   },
            ],
          },
          {
            label: 'Account',
            bgColor: '#1a0d1e',
            textColor: '#fff',
            links: [
              { label: 'Sign In',   href: '/login',    ariaLabel: 'Sign in'   },
              { label: 'Register',  href: '/register', ariaLabel: 'Register'  },
            ],
          },
        ]}
      />

      {/* ══════════════════════════════════════════════
          ASCII SHOWCASE
      ══════════════════════════════════════════════ */}
      <section aria-hidden className="relative h-[280px] md:h-[360px] overflow-hidden">
        <ASCIIText
          text="Aura"
          enableWaves={true}
          asciiFontSize={8}
          textFontSize={200}
          textColor="#fdf9f3"
          planeBaseHeight={8}
        />
      </section>

      {/* ══════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center pt-16">
        <div className="max-w-7xl mx-auto px-6 w-full py-24">
          <div className="grid lg:grid-cols-[1fr_420px] gap-16 xl:gap-24 items-center">

            {/* ── Left copy ── */}
            <div className="space-y-8 animate-fade-up">
              <Badge color="purple">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                Now in Early Access
              </Badge>

              <h1 className="text-5xl sm:text-6xl xl:text-7xl font-black leading-[1.04] tracking-tight">
                Your AI companion<br />
                <span
                  className="animate-gradient bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(90deg,#c084fc,#f472b6,#818cf8,#c084fc)' }}
                >
                  that remembers you.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-white/50 leading-relaxed max-w-[500px]">
                Chat, talk, and grow with an AI that understands your personality,
                remembers your conversations, and speaks your language.
              </p>

              <div className="flex flex-wrap gap-4">
                <a href="/register"
                   className="px-8 py-4 rounded-2xl font-semibold text-base bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all shadow-[0_0_36px_rgba(168,85,247,0.4)] hover:shadow-[0_0_56px_rgba(168,85,247,0.6)] hover:-translate-y-0.5">
                  Get Started
                </a>
                <button className="px-8 py-4 rounded-2xl font-semibold text-base border border-white/20 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/35 transition-all flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                    <Play size={16} className="ml-0.5 fill-white text-white" />
                  </span>
                  Watch Demo
                </button>
              </div>
            </div>

            {/* ── Right: EvilEye ── */}
            <div className="relative flex justify-center lg:justify-end h-[480px] lg:h-[560px]">
              <EvilEye
                eyeColor="#a855f7"
                intensity={1.6}
                pupilSize={0.6}
                irisWidth={0.25}
                glowIntensity={0.4}
                scale={0.85}
                noiseScale={1.0}
                pupilFollow={1.0}
                flameSpeed={1.0}
                backgroundColor={theme === 'dark' ? '#050508' : '#f3f0ff'}
              />
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/25 text-xs select-none">
          <span>Scroll to explore</span>
          <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2.5 bg-white/35 rounded-full" style={{ animation: 'scroll-dot 2s ease-in-out infinite' }} />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════════ */}
      <section id="features" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-16 space-y-4">
            <Badge>Everything you need</Badge>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Built for real connection.</h2>
            <p className="text-white/45 text-lg max-w-lg mx-auto">
              Aura isn't just another chatbot. It's a thoughtful companion designed around your life.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="glass p-6 group hover:border-white/20 hover:-translate-y-1 transition-all duration-300 cursor-default"
              >
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                  style={{ boxShadow: `0 0 20px ${f.glow}` }}
                >
                  <f.Icon className="w-6 h-6 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-base font-bold mb-2">{f.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          MEMORY
      ══════════════════════════════════════════════ */}
      <section id="memory" className="py-32 relative overflow-hidden">
        <div className="absolute left-1/2 -translate-x-1/2 -top-20 w-[700px] h-[500px] bg-purple-700/10 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">

            {/* Copy */}
            <div className="space-y-7">
              <Badge><Brain size={14} /> Long-Term Memory</Badge>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.1]">
                Aura never<br />
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">forgets.</span>
              </h2>
              <p className="text-white/48 text-lg leading-relaxed">
                Every important detail you share becomes part of Aura's understanding of you.
                It builds a rich, nuanced picture of who you are — across every conversation.
              </p>
              <a href="/register" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-semibold transition-colors group text-sm">
                Start building your memory
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Timeline */}
            <div className="relative space-y-3">
              {/* Connector line */}
              <div className="absolute left-7 top-10 bottom-10 w-px bg-gradient-to-b from-purple-500/40 via-pink-500/30 to-transparent pointer-events-none" />

              {MEMORY_ITEMS.map((item, i) => (
                <div
                  key={i}
                  className="glass flex items-center gap-4 p-4 hover:border-purple-500/30 hover:-translate-x-1 transition-all duration-300 group cursor-default"
                >
                  <div className="relative flex-shrink-0 w-14 h-14 rounded-2xl bg-white/[0.07] flex items-center justify-center group-hover:bg-white/[0.12] transition-colors">
                    <item.Icon className="w-6 h-6 text-white/70" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white/90">{item.label}</div>
                    <div className="text-xs text-white/38 mt-0.5 truncate">{item.detail}</div>
                  </div>
                  <span className="text-[11px] text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-lg font-medium flex-shrink-0">
                    Saved
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          VOICE
      ══════════════════════════════════════════════ */}
      <section id="voice" className="py-32 relative">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-700/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Voice UI card */}
            <div className="glass p-7 space-y-6">
              <div className="text-center">
                <div className="text-white/35 text-xs mb-1 uppercase tracking-widest font-medium">Live session</div>
                <div className="text-lg font-bold">Aura is listening…</div>
              </div>

              {/* Big waveform */}
              <div className="py-2">
                <VoiceWave bars={44} active={voiceActive} />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-5">
                <button className="w-12 h-12 rounded-full bg-white/[0.07] hover:bg-white/[0.14] transition-colors flex items-center justify-center text-white/50 hover:text-white">
                  <VolumeX size={20} strokeWidth={1.8} />
                </button>

                <button
                  onClick={() => setVoiceActive(v => !v)}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center transition-all hover:scale-105"
                  style={{ animation: voiceActive ? 'pulse-ring 2.2s ease-out infinite' : 'none' }}
                >
                  <Mic size={32} className="text-white" />
                </button>

                <button className="w-12 h-12 rounded-full bg-white/[0.07] hover:bg-white/[0.14] transition-colors flex items-center justify-center text-white/50 hover:text-white">
                  <Volume2 size={20} strokeWidth={1.8} />
                </button>
              </div>

              {/* Audio message bubbles */}
              <div className="space-y-3 pt-2">
                {[
                  { from: 'Aura', dur: '0:08', bg: 'from-purple-600 to-pink-600', bars: 18 },
                  { from: 'You',  dur: '0:05', bg: 'from-blue-600 to-cyan-600',   bars: 13 },
                ].map((m, i) => (
                  <div key={i} className="glass-sm flex items-center gap-3 px-3 py-2.5">
                    <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${m.bg} flex items-center justify-center text-xs font-black flex-shrink-0`}>
                      {m.from[0]}
                    </div>
                    <div className="flex-1">
                      <VoiceWave bars={m.bars} active={false} />
                    </div>
                    <span className="text-[11px] text-white/35 font-mono">{m.dur}</span>
                    <button className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center">
                      <Play size={11} className="ml-0.5 fill-white text-white" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Copy */}
            <div className="space-y-7">
              <Badge color="pink"><Mic size={14} /> Voice-First Design</Badge>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.1]">
                Speak your mind,<br />
                <span className="bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">hear Aura respond.</span>
              </h2>
              <p className="text-white/48 text-lg leading-relaxed">
                Natural voice conversations with expressive, realistic voices. Aura listens,
                understands context, and responds the way a caring friend would.
              </p>
              <ul className="space-y-3.5">
                {[
                  'Realistic, expressive voice synthesis',
                  'Emotion-aware voice detection',
                  'Background noise cancellation',
                  'Instant transcription & playback',
                ].map(item => (
                  <li key={item} className="flex items-center gap-3 text-white/65 text-sm">
                    <Check purple />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          LANGUAGES
      ══════════════════════════════════════════════ */}
      <section id="languages" className="py-32 relative">
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-700/8 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <Badge color="blue"><Globe size={14} /> Multilingual</Badge>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Your language, your conversation.</h2>
            <p className="text-white/45 text-lg max-w-lg mx-auto">
              Aura speaks fluently in three languages from day one, adapting naturally to however you choose to connect.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 max-w-3xl mx-auto">
            {[
              { lang: 'Arabic',  native: 'العربية', flag: '🇸🇦', gradient: 'from-emerald-500 to-teal-600',  sample: '"أنا هنا لأستمع إليك"',    note: 'Native RTL support'    },
              { lang: 'French',  native: 'Français', flag: '🇫🇷', gradient: 'from-blue-500 to-indigo-600',   sample: '"Je suis là pour toi"',     note: 'Full accent support'   },
              { lang: 'English', native: 'English',   flag: '🇺🇸', gradient: 'from-purple-500 to-pink-600',  sample: '"I\'m always here for you"', note: 'Default language'      },
            ].map((l, i) => (
              <div key={i} className="glass p-6 text-center space-y-4 hover:border-white/22 hover:-translate-y-1 transition-all duration-300 group cursor-default">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${l.gradient} mx-auto flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {l.flag}
                </div>
                <div>
                  <div className="font-bold text-lg">{l.lang}</div>
                  <div className="text-white/35 text-sm">{l.native}</div>
                </div>
                <div className="text-white/55 text-sm italic glass-sm px-4 py-3 leading-relaxed">
                  {l.sample}
                </div>
                <div className="inline-flex items-center gap-1.5 text-[11px] text-white/35">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {l.note}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════ */}
      <section className="py-32 relative">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[500px] bg-gradient-to-r from-purple-700/6 via-pink-700/5 to-blue-700/6 blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <Badge color="pink"><MessageCircle size={14} /> Real Stories</Badge>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">
              People who found their<br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">companion in Aura.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="glass p-6 space-y-5 hover:border-white/22 hover:-translate-y-1 transition-all duration-300 cursor-default flex flex-col">
                <Stars n={t.stars} />
                <p className="text-white/65 text-sm leading-relaxed flex-1">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-1">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-[0_0_12px_rgba(168,85,247,0.4)]">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-white/35">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          PRICING
      ══════════════════════════════════════════════ */}
      <section id="pricing" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-16 space-y-4">
            <Badge><CreditCard size={14} /> Pricing</Badge>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Simple, transparent pricing.</h2>
            <p className="text-white/45 text-lg">Start free. Upgrade whenever you're ready.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">

            {/* Free */}
            <div className="glass p-8 flex flex-col gap-7">
              <div>
                <div className="text-base font-semibold text-white/70">Free</div>
                <div className="text-5xl font-black mt-2">
                  $0<span className="text-white/35 text-lg font-normal">/mo</span>
                </div>
                <div className="text-white/35 text-sm mt-1">Forever free</div>
              </div>
              <ul className="space-y-3 flex-1">
                {FREE_FEATURES.map(f => (
                  <li key={f} className="flex items-center gap-3 text-white/55 text-sm">
                    <Check />
                    {f}
                  </li>
                ))}
              </ul>
              <a href="/register" className="block text-center py-3 rounded-xl border border-white/20 hover:border-white/40 hover:bg-white/[0.05] text-sm font-semibold transition-all">
                Get Started Free
              </a>
            </div>

            {/* Premium */}
            <div className="relative">
              {/* Outer glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/15 rounded-2xl blur-2xl pointer-events-none" />
              <div className="glass relative p-8 flex flex-col gap-7" style={{ borderColor: 'rgba(168,85,247,0.35)' }}>
                <span className="absolute -top-3 right-6 text-[11px] font-bold bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 rounded-full shadow-lg">
                  Most Popular
                </span>
                <div>
                  <div className="text-base font-semibold">Premium</div>
                  <div className="text-5xl font-black mt-2">
                    $12<span className="text-white/35 text-lg font-normal">/mo</span>
                  </div>
                  <div className="text-white/35 text-sm mt-1">Billed monthly · cancel anytime</div>
                </div>
                <ul className="space-y-3 flex-1">
                  {PRO_FEATURES.map(f => (
                    <li key={f} className="flex items-center gap-3 text-white/80 text-sm">
                      <Check purple />
                      {f}
                    </li>
                  ))}
                </ul>
                <a href="/register"
                   className="block text-center py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-sm font-bold transition-all shadow-[0_0_24px_rgba(168,85,247,0.35)] hover:shadow-[0_0_38px_rgba(168,85,247,0.55)]">
                  Start 7-Day Free Trial
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════ */}
      <section className="py-36 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 bottom-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent pointer-events-none" />
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-gradient-to-r from-purple-700/15 via-pink-700/10 to-blue-700/15 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-6 text-center space-y-8">
          <div
            className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto shadow-[0_0_48px_rgba(168,85,247,0.55)]"
            style={{ animation: 'float 6s ease-in-out infinite' }}
          >
            <Sparkles size={36} className="text-white" />
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.06]">
            Start your first conversation<br />
            <span
              className="animate-gradient bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(90deg,#c084fc,#f472b6,#818cf8,#c084fc)' }}
            >
              with Aura.
            </span>
          </h2>

          <p className="text-white/45 text-xl max-w-lg mx-auto leading-relaxed">
            Join thousands who've found a companion that truly understands them.
            No judgment, no pressure — just you and Aura.
          </p>

          <div className="flex flex-wrap gap-4 justify-center pt-2">
            <a href="/register"
               className="px-10 py-4 rounded-2xl font-bold text-base bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all shadow-[0_0_40px_rgba(168,85,247,0.45)] hover:shadow-[0_0_60px_rgba(168,85,247,0.65)] hover:-translate-y-0.5">
              Get Started — It's Free
            </a>
            <a href="/login"
               className="px-10 py-4 rounded-2xl font-semibold text-base border border-white/20 bg-white/[0.04] hover:bg-white/[0.09] hover:border-white/35 transition-all">
              Sign In
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════ */}
      <footer className="border-t border-white/[0.06] py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-black text-xs shadow-[0_0_14px_rgba(168,85,247,0.45)]">
              A
            </div>
            <span className="font-semibold tracking-tight">Aura</span>
            <span className="text-white/25 text-sm ml-1">© 2025</span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/35">
            {[
              ['Privacy',  '/privacy'],
              ['Terms',    '/terms'],
              ['Contact',  '/contact'],
              ['FAQ',      '/faq'],
              ['GitHub',   'https://github.com'],
            ].map(([label, href]) => (
              <a key={label} href={href} className="hover:text-white/70 transition-colors">
                {label}
              </a>
            ))}
          </nav>

          <div className="text-xs text-white/22">Made with ♥ for real connection</div>
        </div>
      </footer>

    </div>
  )
}
