'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Sparkles, Mail, Lock, ArrowRight, Check, User, Globe } from 'lucide-react'
import Aurora from '../../../components/Aurora'
import { register } from '../../../services/authservice'

const PASSWORD_RULES = [
  { label: 'At least 8 characters',  test: (v: string) => v.length >= 8 },
  { label: 'One uppercase letter',    test: (v: string) => /[A-Z]/.test(v) },
  { label: 'One lowercase letter',    test: (v: string) => /[a-z]/.test(v) },
  { label: 'One number',             test: (v: string) => /[0-9]/.test(v) },
  { label: 'One special character',  test: (v: string) => /[^A-Za-z0-9]/.test(v) },
]

const LOCALES = [
  { value: 'en' as const, flag: '🇺🇸', native: 'English' },
  { value: 'fr' as const, flag: '🇫🇷', native: 'Français' },
  { value: 'ar' as const, flag: '🇸🇦', native: 'العربية' },
]

function randomUsername() {
  return 'user' + Math.floor(1000 + Math.random() * 9000)
}

export default function RegisterPage() {
  const router = useRouter()

  // step 1
  const [email, setEmail]               = useState('')
  const [password, setPassword]         = useState('')
  const [confirm, setConfirm]           = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm]   = useState(false)

  // step 2
  const [displayName, setDisplayName] = useState('')

  // step 3
  const [locale, setLocale] = useState<'en' | 'fr' | 'ar'>('en')

  const [step, setStep]     = useState(1)
  const [error, setError]   = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const allRulesPass   = PASSWORD_RULES.every(r => r.test(password))
  const passwordsMatch = password === confirm && confirm.length > 0

  // ── Step 1 → Step 2 ──────────────────────────────────────────────
  function handleStep1(e: { preventDefault(): void }) {
    e.preventDefault()
    setError(null)
    if (!allRulesPass)    { setError('Password does not meet all requirements'); return }
    if (!passwordsMatch)  { setError('Passwords do not match'); return }
    setStep(2)
  }

  // ── Step 2 → Step 3 ──────────────────────────────────────────────
  function handleStep2(e: { preventDefault(): void }, skip = false) {
    e.preventDefault()
    setError(null)
    const name = skip ? randomUsername() : displayName.trim()
    if (!skip && name.length < 3)  { setError('Display name must be at least 3 characters'); return }
    if (!skip && !/^[A-Za-z0-9_]+$/.test(name)) { setError('Only letters, numbers and underscores allowed'); return }
    if (skip) setDisplayName(name)
    setStep(3)
  }

  // ── Step 3 → API ─────────────────────────────────────────────────
  async function handleStep3(e: { preventDefault(): void }, localeOverride?: 'en' | 'fr' | 'ar') {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const name = displayName.trim() || randomUsername()
      await register({ email, password, display_name: name, locale: localeOverride ?? locale })
      router.push('/login')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const stepLabels = ['Account', 'Username', 'Language']

  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col overflow-hidden">

      <div className="fixed inset-0 pointer-events-none" aria-hidden>
        <Aurora colorStops={['#3b0764', '#a855f7', '#ec4899']} blend={0.4} amplitude={0.9} speed={0.4} />
      </div>

      {/* Nav */}
      <header className="relative z-10 px-6 pt-5 pb-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5 select-none">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-black text-sm shadow-[0_0_18px_rgba(168,85,247,0.55)]">A</div>
          <span className="text-[1.1rem] font-semibold tracking-tight">Aura</span>
        </a>
        <a href="/login" className="text-sm text-white/45 hover:text-white/80 transition-colors">
          Already have an account?{' '}
          <span className="text-purple-400 font-medium">Sign in</span>
        </a>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm space-y-6 animate-fade-up">

          {/* Heading */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-medium">
              <Sparkles size={13} />
              Start for free
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Create your account</h1>
            <p className="text-white/40 text-sm">Your AI companion that truly remembers you.</p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-0">
            {stepLabels.map((label, i) => {
              const num      = i + 1
              const active   = num === step
              const done     = num < step
              return (
                <div key={label} className="flex items-center" style={{ flex: i < stepLabels.length - 1 ? '1' : 'none' }}>
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      done   ? 'bg-emerald-500 text-white' :
                      active ? 'bg-purple-500 text-white shadow-[0_0_12px_rgba(168,85,247,0.6)]' :
                               'bg-white/10 text-white/30'
                    }`}>
                      {done ? <Check size={12} strokeWidth={3} /> : num}
                    </div>
                    <span className={`text-[10px] font-medium transition-colors duration-300 ${active ? 'text-purple-300' : done ? 'text-emerald-400' : 'text-white/25'}`}>
                      {label}
                    </span>
                  </div>
                  {i < stepLabels.length - 1 && (
                    <div className={`flex-1 h-px mx-2 mb-4 transition-colors duration-500 ${done ? 'bg-emerald-500/50' : 'bg-white/10'}`} />
                  )}
                </div>
              )
            })}
          </div>

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <form onSubmit={handleStep1} className="glass p-7 space-y-5">
              {error && <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>}

              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-medium text-white/50 uppercase tracking-widest"><Mail size={12} /> Email</label>
                <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required
                  className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-white/20 outline-none bg-white/[0.05] border border-white/[0.08] backdrop-blur-sm focus:border-purple-500/60 focus:bg-white/[0.07] focus:shadow-[0_0_0_3px_rgba(168,85,247,0.12)] transition-all" />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-medium text-white/50 uppercase tracking-widest"><Lock size={12} /> Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} placeholder="Create a strong password" value={password} onChange={e => setPassword(e.target.value)} required
                    className="w-full px-4 py-3 pr-12 rounded-xl text-sm text-white placeholder:text-white/20 outline-none bg-white/[0.05] border border-white/[0.08] backdrop-blur-sm focus:border-purple-500/60 focus:bg-white/[0.07] focus:shadow-[0_0_0_3px_rgba(168,85,247,0.12)] transition-all" />
                  <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors" tabIndex={-1}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <ul className="grid grid-cols-2 gap-1.5 pt-1">
                  {PASSWORD_RULES.map(rule => {
                    const ok = rule.test(password)
                    return (
                      <li key={rule.label} className={`flex items-center gap-2 text-[11px] transition-colors duration-200 ${ok ? 'text-emerald-400' : 'text-white/30'}`}>
                        <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 ${ok ? 'bg-emerald-500/20' : 'bg-white/5'}`}>
                          {ok ? <Check size={8} strokeWidth={3} /> : <span className="w-1 h-1 rounded-full bg-white/25" />}
                        </span>
                        {rule.label}
                      </li>
                    )
                  })}
                </ul>
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-medium text-white/50 uppercase tracking-widest"><Lock size={12} /> Confirm password</label>
                <div className="relative">
                  <input type={showConfirm ? 'text' : 'password'} placeholder="Repeat your password" value={confirm} onChange={e => setConfirm(e.target.value)} required
                    className={`w-full px-4 py-3 pr-12 rounded-xl text-sm text-white placeholder:text-white/20 outline-none bg-white/[0.05] border backdrop-blur-sm focus:shadow-[0_0_0_3px_rgba(168,85,247,0.12)] transition-all ${
                      confirm.length > 0
                        ? passwordsMatch ? 'border-emerald-500/50 focus:border-emerald-500/70' : 'border-red-500/50 focus:border-red-500/70'
                        : 'border-white/[0.08] focus:border-purple-500/60'
                    }`} />
                  <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors" tabIndex={-1}>
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit"
                className="w-full py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all shadow-[0_0_24px_rgba(168,85,247,0.35)] hover:shadow-[0_0_36px_rgba(168,85,247,0.55)] hover:-translate-y-0.5 flex items-center justify-center gap-2">
                Continue <ArrowRight size={16} />
              </button>
            </form>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <form onSubmit={handleStep2} className="glass p-7 space-y-5">
              {error && <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>}

              <div className="text-center space-y-1 pb-1">
                <p className="text-white/60 text-sm">What should we call you?</p>
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-medium text-white/50 uppercase tracking-widest"><User size={12} /> Display name</label>
                <input type="text" placeholder="your_username" maxLength={15} value={displayName} onChange={e => setDisplayName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-white/20 outline-none bg-white/[0.05] border border-white/[0.08] backdrop-blur-sm focus:border-purple-500/60 focus:bg-white/[0.07] focus:shadow-[0_0_0_3px_rgba(168,85,247,0.12)] transition-all" />
                <p className="text-[11px] text-white/30">Letters, numbers and underscores only.</p>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={e => handleStep2(e, true)}
                  className="flex-1 py-3.5 rounded-xl font-medium text-sm border border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.07] text-white/50 hover:text-white/70 transition-all">
                  Skip
                </button>
                <button type="submit"
                  className="flex-1 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all shadow-[0_0_24px_rgba(168,85,247,0.35)] hover:shadow-[0_0_36px_rgba(168,85,247,0.55)] hover:-translate-y-0.5 flex items-center justify-center gap-2">
                  Continue <ArrowRight size={16} />
                </button>
              </div>
            </form>
          )}

          {/* ── STEP 3 ── */}
          {step === 3 && (
            <form onSubmit={handleStep3} className="glass p-7 space-y-5">
              {error && <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>}

              <div className="text-center space-y-1 pb-1">
                <p className="text-white/60 text-sm">Pick your language</p>
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-medium text-white/50 uppercase tracking-widest"><Globe size={12} /> Language</label>
                <div className="grid grid-cols-3 gap-2">
                  {LOCALES.map(loc => (
                    <button key={loc.value} type="button" onClick={() => setLocale(loc.value)}
                      className={`flex flex-col items-center gap-1.5 py-4 px-2 rounded-xl border text-sm transition-all duration-200 ${
                        locale === loc.value
                          ? 'border-purple-500/60 bg-purple-500/15 text-white shadow-[0_0_16px_rgba(168,85,247,0.2)]'
                          : 'border-white/[0.07] bg-white/[0.03] text-white/45 hover:border-white/20 hover:text-white/70'
                      }`}>
                      <span className="text-2xl leading-none">{loc.flag}</span>
                      <span className="text-[11px] font-medium leading-none">{loc.native}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => handleStep3({ preventDefault() {} }, 'en')}
                  className="flex-1 py-3.5 rounded-xl font-medium text-sm border border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.07] text-white/50 hover:text-white/70 transition-all"
                  disabled={loading}>
                  Skip
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all shadow-[0_0_24px_rgba(168,85,247,0.35)] hover:shadow-[0_0_36px_rgba(168,85,247,0.55)] hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0">
                  {loading ? 'Creating…' : 'Create account'} {!loading && <ArrowRight size={16} />}
                </button>
              </div>
            </form>
          )}

          <p className="text-center text-[11px] text-white/22 leading-relaxed">
            By creating an account you agree to our{' '}
            <a href="/terms" className="text-white/40 hover:text-white/60 underline underline-offset-2 transition-colors">Terms</a>
            {' '}and{' '}
            <a href="/privacy" className="text-white/40 hover:text-white/60 underline underline-offset-2 transition-colors">Privacy Policy</a>.
          </p>
        </div>
      </main>
    </div>
  )
}
