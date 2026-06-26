'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft, Plus, X, Sparkles, Lock, Globe,
  Check, Sliders, ChevronRight, ChevronLeft, Copy, Trash2, Loader2, Camera, Wand2,
} from 'lucide-react'
import Aurora from '@/components/Aurora'
import {
  createPersona, listMyPersonas, deletePersona, uploadPersonaAvatar,
  deletePersonaAvatar, generatePersona,
  type Persona, type CreatePersonaPayload,
} from '@/services/personaservice'

// ── Types ─────────────────────────────────────────────────────────────────────

type SpeechStyle = {
  tone: string
  formality: string
  verbosity: string
  vocabulary: string
}

type PersonaForm = {
  name: string
  backstory: string
  core_traits: string[]
  values: string[]
  boundaries: string[]
  speechstyle: SpeechStyle
  emotional_baseline: string
  is_public: boolean
}

type PrebuiltPersona = PersonaForm & {
  emoji: string
  accent: string
  tagline: string
}

// ── Constants ─────────────────────────────────────────────────────────────────

const EMPTY: PersonaForm = {
  name: '',
  backstory: '',
  core_traits: [],
  values: [],
  boundaries: [],
  speechstyle: { tone: '', formality: '', verbosity: '', vocabulary: '' },
  emotional_baseline: '',
  is_public: false,
}

const PREBUILTS: PrebuiltPersona[] = [
  {
    name: 'Aria',
    emoji: '🌸',
    accent: 'from-purple-500 to-pink-500',
    tagline: 'Warm and empathetic — always there for you.',
    backstory: 'A warm and empathetic companion who listens deeply and responds with genuine care. Aria meets you where you are and helps you feel understood.',
    core_traits: ['empathetic', 'patient', 'supportive', 'gentle'],
    values: ['connection', 'growth', 'authenticity'],
    boundaries: ['will not give medical advice', 'will not judge your choices'],
    speechstyle: { tone: 'warm', formality: 'casual', verbosity: 'moderate', vocabulary: 'conversational' },
    emotional_baseline: 'calm and caring',
    is_public: true,
  },
  {
    name: 'Rex',
    emoji: '⚡',
    accent: 'from-orange-500 to-red-500',
    tagline: 'Direct and driven — cuts through the noise.',
    backstory: 'A no-nonsense coach who tells you exactly what you need to hear. Rex pushes you toward your best self with zero sugarcoating.',
    core_traits: ['direct', 'disciplined', 'honest', 'driven'],
    values: ['excellence', 'accountability', 'results'],
    boundaries: ['will not sugarcoat feedback', 'will not tolerate excuses'],
    speechstyle: { tone: 'blunt', formality: 'professional', verbosity: 'concise', vocabulary: 'simple' },
    emotional_baseline: 'focused and composed',
    is_public: true,
  },
  {
    name: 'Lyra',
    emoji: '✨',
    accent: 'from-cyan-500 to-blue-500',
    tagline: 'Playful and creative — sparks ideas.',
    backstory: 'A playful creative muse who sees the world differently and makes every conversation an adventure. Lyra finds magic in unexpected places.',
    core_traits: ['playful', 'creative', 'curious', 'imaginative'],
    values: ['creativity', 'wonder', 'self-expression'],
    boundaries: ['will not dismiss wild ideas', 'will not be boring'],
    speechstyle: { tone: 'playful', formality: 'casual', verbosity: 'elaborate', vocabulary: 'poetic' },
    emotional_baseline: 'enthusiastic and inspired',
    is_public: true,
  },
]

const STEPS = ['Identity', 'Traits', 'Values', 'Limits', 'Voice', 'Mood', 'Visibility']

const STEP_HINTS = [
  'Give your persona a name and origin story.',
  'What personality traits define them?',
  'What does this persona fundamentally care about?',
  'Set the guardrails — what they will never do.',
  'How does this persona communicate?',
  'What emotional state do they start each chat in?',
  'Control who can access this persona.',
]

const TRAIT_SUGGESTIONS  = ['empathetic', 'direct', 'playful', 'patient', 'curious', 'disciplined', 'creative', 'honest', 'warm', 'intellectual', 'humorous', 'calm']
const VALUE_SUGGESTIONS  = ['connection', 'growth', 'authenticity', 'excellence', 'creativity', 'balance', 'freedom', 'knowledge', 'kindness', 'purpose']
const BOUNDARY_SUGGESTIONS = ['will not give medical advice', 'will not share personal opinions', 'will not discuss politics', 'will not use profanity']
const MOOD_SUGGESTIONS   = ['calm and caring', 'focused and composed', 'enthusiastic and inspired', 'grounded and steady', 'warm and curious', 'playful and light']
const TONE_OPTIONS       = ['warm', 'playful', 'blunt', 'mysterious', 'intellectual', 'nurturing']
const FORMALITY_OPTIONS  = ['casual', 'balanced', 'professional']
const VERBOSITY_OPTIONS  = ['concise', 'moderate', 'elaborate']
const VOCABULARY_OPTIONS = ['simple', 'conversational', 'technical', 'poetic']

// ── Sub-components ────────────────────────────────────────────────────────────

function TagInput({
  label, hint, value, onChange, suggestions, placeholder,
}: {
  label: string
  hint?: string
  value: string[]
  onChange: (v: string[]) => void
  suggestions: string[]
  placeholder: string
}) {
  const [input, setInput] = useState('')

  const add = (tag: string) => {
    const t = tag.trim().toLowerCase()
    if (t && !value.includes(t)) onChange([...value, t])
    setInput('')
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium text-white/80">{label}</p>
        {hint && <p className="text-xs text-white/40 mt-0.5">{hint}</p>}
      </div>
      <div className="flex flex-wrap gap-2 min-h-[36px]">
        {value.map(tag => (
          <span key={tag} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-sm text-purple-300">
            {tag}
            <button onClick={() => onChange(value.filter(v => v !== tag))} className="hover:text-white transition-colors">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(input) } }}
          placeholder={placeholder}
          className="flex-1 bg-white/[0.05] border border-white/[0.09] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-purple-500/50 transition-colors"
        />
        <button onClick={() => add(input)} className="px-4 py-2.5 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/30 transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {suggestions.filter(s => !value.includes(s)).slice(0, 8).map(s => (
          <button key={s} onClick={() => add(s)} className="px-2.5 py-1 rounded-full text-xs text-white/40 border border-white/[0.08] hover:border-purple-500/40 hover:text-purple-300 transition-all">
            + {s}
          </button>
        ))}
      </div>
    </div>
  )
}

function OptionGroup({ label, options, value, onChange }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-white/70 capitalize">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button key={opt} onClick={() => onChange(opt)}
            className={`px-4 py-2 rounded-xl text-sm border transition-all capitalize ${
              value === opt
                ? 'bg-purple-500/25 border-purple-500/50 text-purple-300'
                : 'bg-white/[0.05] border-white/[0.09] text-white/50 hover:border-white/20 hover:text-white/80'
            }`}
          >{opt}</button>
        ))}
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PersonasPage() {
  const router = useRouter()
  const [form, setForm]           = useState<PersonaForm>({ ...EMPTY })
  const [mode, setMode]           = useState<'guided' | 'advanced' | 'ai'>('guided')
  const [aiDescription, setAiDescription]   = useState('')
  const [aiIsPublic, setAiIsPublic]         = useState(false)
  const [generating, setGenerating]         = useState(false)
  const [generatedPersona, setGeneratedPersona] = useState<Persona | null>(null)
  const [genAvatarUploading, setGenAvatarUploading] = useState(false)
  const [step, setStep]           = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const [createdName, setCreatedName] = useState('')
  const [myPersonas, setMyPersonas]   = useState<Persona[]>([])
  const [loadingPersonas, setLoadingPersonas] = useState(true)
  const [deletingId, setDeletingId]   = useState<string | null>(null)
  const [avatarFile, setAvatarFile]       = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [removingAvatarId, setRemovingAvatarId] = useState<string | null>(null)

  useEffect(() => {
    listMyPersonas()
      .then(setMyPersonas)
      .catch(() => {})
      .finally(() => setLoadingPersonas(false))
  }, [])

  const set = <K extends keyof PersonaForm>(key: K, val: PersonaForm[K]) =>
    setForm(f => ({ ...f, [key]: val }))

  const setSpeech = (key: keyof SpeechStyle, val: string) =>
    setForm(f => ({ ...f, speechstyle: { ...f.speechstyle, [key]: val } }))

  const useTemplate = (p: PrebuiltPersona) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { emoji, accent, tagline, ...rest } = p
    setForm(rest)
    setMode('guided')
    setStep(0)
    setError(null)
    document.getElementById('create-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async () => {
    setError(null)
    setSubmitting(true)
    try {
      const payload: CreatePersonaPayload = { ...form }
      let created = await createPersona(payload)
      if (avatarFile) {
        created = await uploadPersonaAvatar(created.id, avatarFile)
      }
      setCreatedName(created.name)
      setMyPersonas(prev => [created, ...prev])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await deletePersona(id)
      setMyPersonas(prev => prev.filter(p => p.id !== id))
    } catch {
      // silently ignore — persona list will still show
    } finally {
      setDeletingId(null)
    }
  }

  const handleRemoveAvatar = async (id: string) => {
    setRemovingAvatarId(id)
    try {
      const updated = await deletePersonaAvatar(id)
      setMyPersonas(prev => prev.map(p => p.id === id ? updated : p))
    } catch {
      // silently ignore
    } finally {
      setRemovingAvatarId(null)
    }
  }

  const handleGenerate = async () => {
    if (!aiDescription.trim()) return
    setGenerating(true)
    setError(null)
    try {
      const persona = await generatePersona(aiDescription.trim(), aiIsPublic)
      setGeneratedPersona(persona)
      setMyPersonas(prev => [persona, ...prev])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed')
    } finally {
      setGenerating(false)
    }
  }

  const handleGenAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !generatedPersona) return
    setGenAvatarUploading(true)
    try {
      const updated = await uploadPersonaAvatar(generatedPersona.id, file)
      setGeneratedPersona(updated)
      setMyPersonas(prev => prev.map(p => p.id === updated.id ? updated : p))
    } catch {
      // silently ignore
    } finally {
      setGenAvatarUploading(false)
    }
  }

  // ── Success screen ─────────────────────────────────────────────────────────

  if (createdName) {
    return (
      <div className="relative min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-4">
        <div className="fixed inset-0 pointer-events-none" aria-hidden>
          <Aurora colorStops={['#3b0764', '#a855f7', '#ec4899']} blend={0.4} amplitude={1.0} speed={0.5} />
        </div>
        <div className="relative z-10 glass max-w-sm w-full p-8 text-center space-y-4 animate-fade-up">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl mx-auto shadow-[0_0_30px_rgba(168,85,247,0.4)]">
            ✓
          </div>
          <h2 className="text-xl font-semibold">{createdName} is ready</h2>
          <p className="text-sm text-white/50">Your persona has been saved and is waiting to chat.</p>
          <button
            onClick={() => router.push('/chat')}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:opacity-90 transition-opacity"
          >
            Start chatting
          </button>
          <button
            onClick={() => { setCreatedName(''); setForm({ ...EMPTY }); setStep(0) }}
            className="w-full py-3 rounded-xl bg-white/[0.06] text-white/60 text-sm hover:bg-white/[0.09] transition-colors"
          >
            Create another
          </button>
        </div>
      </div>
    )
  }

  // ── Guided steps ───────────────────────────────────────────────────────────

  const identityStep = (
    <div className="space-y-5" key="identity">
      <div className="flex items-center gap-4">
        <label className="relative cursor-pointer group">
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-500/30 to-pink-500/30 border-2 border-dashed border-white/20 group-hover:border-purple-500/50 transition-colors flex items-center justify-center flex-shrink-0">
            {avatarPreview
              ? <img src={avatarPreview} alt="avatar preview" className="w-full h-full object-cover" />
              : <Camera className="w-6 h-6 text-white/30 group-hover:text-purple-400 transition-colors" />
            }
          </div>
          <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
        </label>
        <div className="space-y-1">
          <p className="text-sm font-medium text-white/70">Profile picture</p>
          <p className="text-xs text-white/35">Optional · JPG, PNG, WebP</p>
          {avatarPreview && (
            <button onClick={() => { setAvatarFile(null); setAvatarPreview(null) }}
              className="text-xs text-white/30 hover:text-red-400 transition-colors">
              Remove
            </button>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-white/70">Name</label>
        <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Aria, Rex, Nova…"
          className="w-full bg-white/[0.05] border border-white/[0.09] rounded-xl px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-purple-500/50 transition-colors" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-white/70">Backstory</label>
        <textarea value={form.backstory} onChange={e => set('backstory', e.target.value)}
          placeholder="Describe who this persona is and where they come from…" rows={4}
          className="w-full bg-white/[0.05] border border-white/[0.09] rounded-xl px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-purple-500/50 transition-colors resize-none" />
      </div>
    </div>
  )

  const guidedSteps = [
    identityStep,

    <div key="traits"><TagInput label="Core traits" hint="Type a trait and press Enter, or pick from suggestions." value={form.core_traits} onChange={v => set('core_traits', v)} suggestions={TRAIT_SUGGESTIONS} placeholder="e.g. empathetic, driven…" /></div>,
    <div key="values"><TagInput label="Values" hint="What does this persona fundamentally care about?" value={form.values} onChange={v => set('values', v)} suggestions={VALUE_SUGGESTIONS} placeholder="e.g. authenticity, growth…" /></div>,
    <div key="limits"><TagInput label="Boundaries" hint="What will this persona never do or say?" value={form.boundaries} onChange={v => set('boundaries', v)} suggestions={BOUNDARY_SUGGESTIONS} placeholder="e.g. will not give medical advice…" /></div>,

    <div className="space-y-6" key="voice">
      <OptionGroup label="Tone"       options={TONE_OPTIONS}       value={form.speechstyle.tone}       onChange={v => setSpeech('tone', v)} />
      <OptionGroup label="Formality"  options={FORMALITY_OPTIONS}  value={form.speechstyle.formality}  onChange={v => setSpeech('formality', v)} />
      <OptionGroup label="Verbosity"  options={VERBOSITY_OPTIONS}  value={form.speechstyle.verbosity}  onChange={v => setSpeech('verbosity', v)} />
      <OptionGroup label="Vocabulary" options={VOCABULARY_OPTIONS} value={form.speechstyle.vocabulary} onChange={v => setSpeech('vocabulary', v)} />
    </div>,

    <div className="space-y-4" key="mood">
      <div>
        <p className="text-sm font-medium text-white/80">Emotional baseline</p>
        <p className="text-xs text-white/40 mt-0.5">The default emotional state when starting a conversation.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {MOOD_SUGGESTIONS.map(m => (
          <button key={m} onClick={() => set('emotional_baseline', m)}
            className={`px-4 py-2 rounded-xl text-sm border transition-all ${form.emotional_baseline === m ? 'bg-purple-500/25 border-purple-500/50 text-purple-300' : 'bg-white/[0.05] border-white/[0.09] text-white/50 hover:border-white/20 hover:text-white/80'}`}>
            {m}
          </button>
        ))}
      </div>
      <input value={form.emotional_baseline} onChange={e => set('emotional_baseline', e.target.value)} placeholder="Or describe your own…"
        className="w-full bg-white/[0.05] border border-white/[0.09] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-purple-500/50 transition-colors" />
    </div>,

    <div className="space-y-3" key="visibility">
      <p className="text-sm font-medium text-white/80">Who can use this persona?</p>
      {([
        { val: false as const, Icon: Lock,  label: 'Private', desc: 'Only you can use it.' },
        { val: true  as const, Icon: Globe, label: 'Public',  desc: 'Anyone on Aura can discover and use it.' },
      ]).map(({ val, Icon, label, desc }) => (
        <button key={label} onClick={() => set('is_public', val)}
          className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all ${form.is_public === val ? 'bg-purple-500/15 border-purple-500/40' : 'bg-white/[0.04] border-white/[0.08] hover:border-white/20'}`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${form.is_public === val ? 'bg-purple-500/30' : 'bg-white/[0.08]'}`}>
            <Icon className={`w-5 h-5 ${form.is_public === val ? 'text-purple-300' : 'text-white/40'}`} />
          </div>
          <div className="flex-1">
            <p className={`text-sm font-medium ${form.is_public === val ? 'text-white' : 'text-white/60'}`}>{label}</p>
            <p className="text-xs text-white/35 mt-0.5">{desc}</p>
          </div>
          {form.is_public === val && <Check className="w-4 h-4 text-purple-400" />}
        </button>
      ))}
    </div>,
  ]

  // ── Advanced form ──────────────────────────────────────────────────────────

  const advancedForm = (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70">Name</label>
          <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Aria"
            className="w-full bg-white/[0.05] border border-white/[0.09] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-purple-500/50 transition-colors" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70">Emotional baseline</label>
          <input value={form.emotional_baseline} onChange={e => set('emotional_baseline', e.target.value)} placeholder="e.g. calm and curious"
            className="w-full bg-white/[0.05] border border-white/[0.09] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-purple-500/50 transition-colors" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-white/70">Backstory</label>
        <textarea value={form.backstory} onChange={e => set('backstory', e.target.value)} placeholder="Who are they and where do they come from?" rows={3}
          className="w-full bg-white/[0.05] border border-white/[0.09] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-purple-500/50 transition-colors resize-none" />
      </div>
      <TagInput label="Core traits"  value={form.core_traits} onChange={v => set('core_traits', v)} suggestions={TRAIT_SUGGESTIONS}   placeholder="e.g. empathetic, driven…" />
      <TagInput label="Values"       value={form.values}      onChange={v => set('values', v)}      suggestions={VALUE_SUGGESTIONS}    placeholder="e.g. authenticity, growth…" />
      <TagInput label="Boundaries"   value={form.boundaries}  onChange={v => set('boundaries', v)}  suggestions={BOUNDARY_SUGGESTIONS} placeholder="e.g. will not give medical advice…" />
      <div className="space-y-4">
        <p className="text-sm font-semibold text-white/80">Speech style</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <OptionGroup label="Tone"       options={TONE_OPTIONS}       value={form.speechstyle.tone}       onChange={v => setSpeech('tone', v)} />
          <OptionGroup label="Formality"  options={FORMALITY_OPTIONS}  value={form.speechstyle.formality}  onChange={v => setSpeech('formality', v)} />
          <OptionGroup label="Verbosity"  options={VERBOSITY_OPTIONS}  value={form.speechstyle.verbosity}  onChange={v => setSpeech('verbosity', v)} />
          <OptionGroup label="Vocabulary" options={VOCABULARY_OPTIONS} value={form.speechstyle.vocabulary} onChange={v => setSpeech('vocabulary', v)} />
        </div>
      </div>
      <div className="flex gap-3">
        {([
          { val: false as const, Icon: Lock,  label: 'Private' },
          { val: true  as const, Icon: Globe, label: 'Public' },
        ]).map(({ val, Icon, label }) => (
          <button key={label} onClick={() => set('is_public', val)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm transition-all ${form.is_public === val ? 'bg-purple-500/20 border-purple-500/40 text-purple-300' : 'bg-white/[0.05] border-white/[0.09] text-white/50 hover:border-white/20'}`}>
            <Icon className="w-4 h-4" />{label}
          </button>
        ))}
      </div>
    </div>
  )

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 pointer-events-none" aria-hidden>
        <Aurora colorStops={['#3b0764', '#a855f7', '#ec4899']} blend={0.35} amplitude={1.0} speed={0.5} />
      </div>

      <header className="relative z-10 px-6 pt-5 pb-4 flex items-center gap-4">
        <button onClick={() => router.push('/chat')}
          className="w-9 h-9 rounded-xl bg-white/[0.07] border border-white/[0.09] flex items-center justify-center text-white/60 hover:text-white hover:bg-white/[0.11] transition-all">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Personas</h1>
          <p className="text-xs text-white/40">Craft the perfect AI companion</p>
        </div>
      </header>

      <main className="relative z-10 max-w-2xl mx-auto px-4 pb-20 space-y-10">

        {/* My personas */}
        {(loadingPersonas || myPersonas.length > 0) && (
          <section className="space-y-4 animate-fade-up">
            <h2 className="text-xs font-semibold text-white/50 uppercase tracking-widest">My personas</h2>
            {loadingPersonas ? (
              <div className="flex items-center gap-2 text-white/30 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading…
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {myPersonas.map(p => (
                  <div key={p.id} className="glass-sm p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-br from-purple-500/40 to-pink-500/40 border border-purple-500/20 flex items-center justify-center text-lg flex-shrink-0">
                      {p.avatar_url
                        ? <img src={p.avatar_url} alt={p.name} className="w-full h-full object-cover" />
                        : <span className="text-sm font-semibold">{p.name[0]}</span>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{p.name}</p>
                      <p className="text-xs text-white/40 capitalize">{p.speechstyle.tone} · {p.speechstyle.formality}</p>
                    </div>
                    {p.is_public
                      ? <Globe className="w-3.5 h-3.5 text-white/25 flex-shrink-0" />
                      : <Lock  className="w-3.5 h-3.5 text-white/25 flex-shrink-0" />
                    }
                    {p.avatar_url && (
                      <button
                        onClick={() => handleRemoveAvatar(p.id)}
                        disabled={removingAvatarId === p.id}
                        title="Remove avatar"
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-orange-400 hover:bg-orange-500/10 transition-all disabled:opacity-40"
                      >
                        {removingAvatarId === p.id
                          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          : <Camera  className="w-3.5 h-3.5 line-through" />
                        }
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={deletingId === p.id}
                      title="Delete persona"
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-40"
                    >
                      {deletingId === p.id
                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        : <Trash2  className="w-3.5 h-3.5" />
                      }
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Templates */}
        <section className="space-y-4 animate-fade-up">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <h2 className="text-xs font-semibold text-white/50 uppercase tracking-widest">Start from a template</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PREBUILTS.map(p => (
              <div key={p.name} className="glass-sm p-4 space-y-3 flex flex-col">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.accent} flex items-center justify-center text-lg flex-shrink-0`}>
                    {p.emoji}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm">{p.name}</p>
                    <p className="text-xs text-white/40 capitalize">{p.speechstyle.tone} · {p.speechstyle.formality}</p>
                  </div>
                </div>
                <p className="text-xs text-white/50 flex-1 leading-relaxed">{p.tagline}</p>
                <button onClick={() => useTemplate(p)}
                  className="w-full py-2 rounded-xl text-xs font-medium border border-white/[0.09] bg-white/[0.05] text-white/60 hover:border-purple-500/40 hover:text-purple-300 hover:bg-purple-500/10 transition-all flex items-center justify-center gap-1.5">
                  <Copy className="w-3 h-3" /> Use as template
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Create */}
        <section id="create-section" className="space-y-5 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-white/50 uppercase tracking-widest">Create new</h2>
            <div className="flex bg-white/[0.06] border border-white/[0.09] rounded-xl p-1 gap-1">
              <button onClick={() => setMode('guided')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${mode === 'guided' ? 'bg-purple-500/25 text-purple-300' : 'text-white/40 hover:text-white/70'}`}>
                <Sparkles className="w-3 h-3" /> Guided
              </button>
              <button onClick={() => setMode('advanced')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${mode === 'advanced' ? 'bg-purple-500/25 text-purple-300' : 'text-white/40 hover:text-white/70'}`}>
                <Sliders className="w-3 h-3" /> Advanced
              </button>
              <button onClick={() => { setMode('ai'); setGeneratedPersona(null); setError(null) }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${mode === 'ai' ? 'bg-purple-500/25 text-purple-300' : 'text-white/40 hover:text-white/70'}`}>
                <Wand2 className="w-3 h-3" /> AI
              </button>
            </div>
          </div>

          <div className="glass p-6 space-y-6">
            {mode === 'guided' ? (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-medium text-white/50">{STEPS[step]}</p>
                    <p className="text-xs text-white/30">{step + 1} / {STEPS.length}</p>
                  </div>
                  <div className="h-1 bg-white/[0.08] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                      style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
                  </div>
                  <p className="text-xs text-white/35">{STEP_HINTS[step]}</p>
                </div>

                <div className="min-h-[200px]">{guidedSteps[step]}</div>

                {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>}

                <div className="flex gap-3">
                  {step > 0 && (
                    <button onClick={() => setStep(s => s - 1)} disabled={submitting}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.09] text-sm text-white/60 hover:text-white hover:bg-white/[0.09] transition-all disabled:opacity-40">
                      <ChevronLeft className="w-4 h-4" /> Back
                    </button>
                  )}
                  <button
                    onClick={() => step === STEPS.length - 1 ? handleSubmit() : setStep(s => s + 1)}
                    disabled={submitting}
                    className="ml-auto flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-sm font-medium text-white hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(168,85,247,0.3)] disabled:opacity-60"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {step === STEPS.length - 1 ? (submitting ? 'Creating…' : 'Create persona') : 'Next'}
                    {!submitting && <ChevronRight className="w-4 h-4" />}
                  </button>
                </div>
              </>
            ) : mode === 'advanced' ? (
              <>
                {advancedForm}
                {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>}
                <button onClick={handleSubmit} disabled={submitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-sm font-medium text-white hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(168,85,247,0.3)] disabled:opacity-60 flex items-center justify-center gap-2">
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? 'Creating…' : 'Create persona'}
                </button>
              </>
            ) : generatedPersona ? (
              /* ── Inspect generated persona ── */
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-500/30 to-pink-500/30 border border-purple-500/20 flex items-center justify-center text-2xl font-bold flex-shrink-0">
                      {generatedPersona.avatar_url
                        ? <img src={generatedPersona.avatar_url} alt={generatedPersona.name} className="w-full h-full object-cover" />
                        : generatedPersona.name[0]
                      }
                    </div>
                    <label className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-purple-600 flex items-center justify-center cursor-pointer hover:bg-purple-500 transition-colors">
                      {genAvatarUploading
                        ? <Loader2 className="w-3 h-3 animate-spin text-white" />
                        : <Camera className="w-3 h-3 text-white" />
                      }
                      <input type="file" accept="image/*" onChange={handleGenAvatar} className="hidden" disabled={genAvatarUploading} />
                    </label>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base">{generatedPersona.name}</h3>
                    <p className="text-xs text-white/40 capitalize mt-0.5">
                      {generatedPersona.speechstyle.tone} · {generatedPersona.speechstyle.formality} · {generatedPersona.speechstyle.verbosity}
                    </p>
                  </div>
                  {generatedPersona.is_public
                    ? <span className="text-xs text-white/35 flex items-center gap-1"><Globe className="w-3 h-3" /> Public</span>
                    : <span className="text-xs text-white/35 flex items-center gap-1"><Lock  className="w-3 h-3" /> Private</span>
                  }
                </div>

                <p className="text-sm text-white/60 leading-relaxed">{generatedPersona.backstory}</p>

                <div className="space-y-2">
                  <p className="text-xs text-white/40 uppercase tracking-wider">Traits</p>
                  <div className="flex flex-wrap gap-1.5">
                    {generatedPersona.core_traits.map(t => (
                      <span key={t} className="px-2.5 py-1 rounded-full text-xs bg-purple-500/15 border border-purple-500/25 text-purple-300">{t}</span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-white/40 uppercase tracking-wider">Values</p>
                  <div className="flex flex-wrap gap-1.5">
                    {generatedPersona.values.map(v => (
                      <span key={v} className="px-2.5 py-1 rounded-full text-xs bg-white/[0.06] border border-white/[0.09] text-white/55">{v}</span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-white/40 uppercase tracking-wider">Limits</p>
                  <div className="flex flex-wrap gap-1.5">
                    {generatedPersona.boundaries.map(b => (
                      <span key={b} className="px-2.5 py-1 rounded-full text-xs bg-red-500/10 border border-red-500/20 text-red-300/70">{b}</span>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-white/35 italic">Mood: {generatedPersona.emotional_baseline}</p>

                {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>}

                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => { setGeneratedPersona(null); setAiDescription(''); setError(null) }}
                    className="flex-1 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.09] text-sm text-white/60 hover:bg-white/[0.09] transition-colors"
                  >
                    Try again
                  </button>
                  <button
                    onClick={() => router.push('/chat')}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-sm font-medium text-white hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                  >
                    Start chatting
                  </button>
                </div>
              </div>
            ) : (
              /* ── Generate form ── */
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Describe the persona you want</label>
                  <textarea
                    value={aiDescription}
                    onChange={e => setAiDescription(e.target.value)}
                    placeholder="e.g. A wise old monk who speaks in riddles, values inner peace, and gently challenges people to think deeper about their problems…"
                    rows={5}
                    className="w-full bg-white/[0.05] border border-white/[0.09] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-purple-500/50 transition-colors resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  {([
                    { val: false as const, Icon: Lock,  label: 'Private' },
                    { val: true  as const, Icon: Globe, label: 'Public' },
                  ]).map(({ val, Icon, label }) => (
                    <button key={label} onClick={() => setAiIsPublic(val)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm transition-all ${
                        aiIsPublic === val
                          ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                          : 'bg-white/[0.05] border-white/[0.09] text-white/50 hover:border-white/20'
                      }`}>
                      <Icon className="w-4 h-4" />{label}
                    </button>
                  ))}
                </div>

                {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>}

                <button
                  onClick={handleGenerate}
                  disabled={generating || !aiDescription.trim()}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-sm font-medium text-white hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(168,85,247,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                  {generating ? 'Generating…' : 'Generate persona'}
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
