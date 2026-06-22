'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Lock, Sparkles, ArrowRight, Check, CheckCircle } from 'lucide-react'
import Aurora from '../../../components/Aurora'
import { resetPassword } from '../../../services/authservice'

const PASSWORD_RULES = [
  { label: 'At least 8 characters',  test: (v: string) => v.length >= 8 },
  { label: 'One uppercase letter',    test: (v: string) => /[A-Z]/.test(v) },
  { label: 'One lowercase letter',    test: (v: string) => /[a-z]/.test(v) },
  { label: 'One number',             test: (v: string) => /[0-9]/.test(v) },
  { label: 'One special character',  test: (v: string) => /[^A-Za-z0-9]/.test(v) },
]

function ResetForm() {
  const router       = useRouter()
  const params       = useSearchParams()
  const token        = params.get('token') ?? ''

  const [password, setPassword]         = useState('')
  const [confirm, setConfirm]           = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm]   = useState(false)
  const [error, setError]               = useState<string | null>(null)
  const [loading, setLoading]           = useState(false)
  const [done, setDone]                 = useState(false)

  const allRulesPass   = PASSWORD_RULES.every(r => r.test(password))
  const passwordsMatch = password === confirm && confirm.length > 0

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    if (!token)          { setError('Invalid or missing reset token.'); return }
    if (!allRulesPass)   { setError('Password does not meet all requirements.'); return }
    if (!passwordsMatch) { setError('Passwords do not match.'); return }
    setError(null)
    setLoading(true)
    try {
      await resetPassword(password, token)
      setDone(true)
      setTimeout(() => router.push('/login'), 2500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reset failed')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="glass p-8 text-center space-y-3">
        <p className="font-semibold text-red-400">Invalid reset link</p>
        <p className="text-sm text-white/40">This link is missing a token. Please request a new one.</p>
        <a href="/forgot-password" className="inline-block mt-2 text-sm text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors">Request new link</a>
      </div>
    )
  }

  if (done) {
    return (
      <div className="glass p-8 flex flex-col items-center gap-4 text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
          <CheckCircle size={28} className="text-emerald-400" />
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-white">Password updated!</p>
          <p className="text-sm text-white/40">Redirecting you to login…</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="glass p-7 sm:p-8 space-y-5">
      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>
      )}

      {/* New password */}
      <div className="space-y-1.5">
        <label className="flex items-center gap-2 text-xs font-medium text-white/50 uppercase tracking-widest">
          <Lock size={12} /> New password
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a strong password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 pr-12 rounded-xl text-sm text-white placeholder:text-white/20 outline-none bg-white/[0.05] border border-white/[0.08] backdrop-blur-sm focus:border-purple-500/60 focus:bg-white/[0.07] focus:shadow-[0_0_0_3px_rgba(168,85,247,0.12)] transition-all"
          />
          <button type="button" onClick={() => setShowPassword(v => !v)} tabIndex={-1}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors text-xs font-medium">
            {showPassword ? 'Hide' : 'Show'}
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

      {/* Confirm password */}
      <div className="space-y-1.5">
        <label className="flex items-center gap-2 text-xs font-medium text-white/50 uppercase tracking-widest">
          <Lock size={12} /> Confirm password
        </label>
        <div className="relative">
          <input
            type={showConfirm ? 'text' : 'password'}
            placeholder="Repeat your password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
            className={`w-full px-4 py-3 pr-12 rounded-xl text-sm text-white placeholder:text-white/20 outline-none bg-white/[0.05] border backdrop-blur-sm focus:shadow-[0_0_0_3px_rgba(168,85,247,0.12)] transition-all ${
              confirm.length > 0
                ? passwordsMatch ? 'border-emerald-500/50 focus:border-emerald-500/70' : 'border-red-500/50 focus:border-red-500/70'
                : 'border-white/[0.08] focus:border-purple-500/60'
            }`}
          />
          <button type="button" onClick={() => setShowConfirm(v => !v)} tabIndex={-1}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors text-xs font-medium">
            {showConfirm ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all shadow-[0_0_24px_rgba(168,85,247,0.35)] hover:shadow-[0_0_36px_rgba(168,85,247,0.55)] hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        {loading ? 'Updating…' : 'Set new password'}
        {!loading && <ArrowRight size={16} />}
      </button>
    </form>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col overflow-hidden">

      <div className="fixed inset-0 pointer-events-none" aria-hidden>
        <Aurora colorStops={['#3b0764', '#a855f7', '#ec4899']} blend={0.4} amplitude={1.0} speed={0.5} />
      </div>

      <header className="relative z-10 px-6 pt-5 pb-4 flex items-center">
        <a href="/" className="flex items-center gap-2.5 select-none">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-black text-sm shadow-[0_0_18px_rgba(168,85,247,0.55)]">A</div>
          <span className="text-[1.1rem] font-semibold tracking-tight">Aura</span>
        </a>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm space-y-8 animate-fade-up">

          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-medium">
              <Sparkles size={13} />
              Reset password
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Set a new password</h1>
            <p className="text-white/40 text-sm">Choose something strong and memorable.</p>
          </div>

          <Suspense fallback={<div className="glass p-8 text-center text-white/40 text-sm">Loading…</div>}>
            <ResetForm />
          </Suspense>
        </div>
      </main>
    </div>
  )
}
