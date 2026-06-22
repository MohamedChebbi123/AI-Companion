'use client'

import { useState } from 'react'
import { Mail, Sparkles, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react'
import Aurora from '../../../components/Aurora'
import { forgotPassword } from '../../../services/authservice'

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState('')
  const [error, setError]     = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await forgotPassword(email)
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col overflow-hidden">

      <div className="fixed inset-0 pointer-events-none" aria-hidden>
        <Aurora colorStops={['#3b0764', '#a855f7', '#ec4899']} blend={0.4} amplitude={1.0} speed={0.5} />
      </div>

      <header className="relative z-10 px-6 pt-5 pb-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5 select-none">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-black text-sm shadow-[0_0_18px_rgba(168,85,247,0.55)]">A</div>
          <span className="text-[1.1rem] font-semibold tracking-tight">Aura</span>
        </a>
        <a href="/login" className="flex items-center gap-1.5 text-sm text-white/45 hover:text-white/80 transition-colors">
          <ArrowLeft size={14} />
          Back to login
        </a>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm space-y-8 animate-fade-up">

          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-medium">
              <Sparkles size={13} />
              Password recovery
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Forgot your password?</h1>
            <p className="text-white/40 text-sm">
              {sent ? "Check your inbox for the reset link." : "Enter your email and we'll send you a reset link."}
            </p>
          </div>

          {sent ? (
            <div className="glass p-8 flex flex-col items-center gap-4 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                <CheckCircle size={28} className="text-emerald-400" />
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-white">Email sent!</p>
                <p className="text-sm text-white/40">We sent a reset link to <span className="text-white/70 font-medium">{email}</span>. Check your spam folder if you don't see it.</p>
              </div>
              <a href="/login"
                className="mt-2 w-full py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all shadow-[0_0_24px_rgba(168,85,247,0.35)] hover:shadow-[0_0_36px_rgba(168,85,247,0.55)] hover:-translate-y-0.5 flex items-center justify-center gap-2">
                Back to login <ArrowRight size={16} />
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="glass p-7 sm:p-8 space-y-5">
              {error && (
                <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>
              )}

              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-medium text-white/50 uppercase tracking-widest">
                  <Mail size={12} /> Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-white/20 outline-none bg-white/[0.05] border border-white/[0.08] backdrop-blur-sm focus:border-purple-500/60 focus:bg-white/[0.07] focus:shadow-[0_0_0_3px_rgba(168,85,247,0.12)] transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all shadow-[0_0_24px_rgba(168,85,247,0.35)] hover:shadow-[0_0_36px_rgba(168,85,247,0.55)] hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {loading ? 'Sending…' : 'Send reset link'}
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  )
}
