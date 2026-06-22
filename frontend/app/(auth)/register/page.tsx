'use client'

import { useState } from 'react'
import { Eye, EyeOff, Sparkles, Globe, User, Mail, Lock, ArrowRight, Check } from 'lucide-react'
import Aurora from '../../../components/Aurora'

const PASSWORD_RULES = [
  { label: 'At least 8 characters',  test: (v: string) => v.length >= 8 },
  { label: 'One uppercase letter',    test: (v: string) => /[A-Z]/.test(v) },
  { label: 'One lowercase letter',    test: (v: string) => /[a-z]/.test(v) },
  { label: 'One number',              test: (v: string) => /[0-9]/.test(v) },
  { label: 'One special character',   test: (v: string) => /[^A-Za-z0-9]/.test(v) },
]

const LOCALES = [
  { value: 'en', flag: '🇺🇸', native: 'English' },
  { value: 'fr', flag: '🇫🇷', native: 'Français' },
  { value: 'ar', flag: '🇸🇦', native: 'العربية' },
]

export default function RegisterPage() {
  const [locale, setLocale]             = useState('en')
  const [password, setPassword]         = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm]   = useState(false)

  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col overflow-hidden">

      {/* Aurora background */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden>
        <Aurora
          colorStops={['#3b0764', '#a855f7', '#ec4899']}
          blend={0.4}
          amplitude={0.9}
          speed={0.4}
        />
      </div>

      {/* Nav */}
      <header className="relative z-10 px-6 pt-5 pb-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5 select-none">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-black text-sm shadow-[0_0_18px_rgba(168,85,247,0.55)]">
            A
          </div>
          <span className="text-[1.1rem] font-semibold tracking-tight">Aura</span>
        </a>
        <a href="/login" className="text-sm text-white/45 hover:text-white/80 transition-colors">
          Already have an account?{' '}
          <span className="text-purple-400 font-medium">Sign in</span>
        </a>
      </header>

      {/* Main */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md space-y-8 animate-fade-up">

          {/* Heading */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-medium">
              <Sparkles size={13} />
              Start for free
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Create your account
            </h1>
            <p className="text-white/40 text-sm">
              Your AI companion that truly remembers you.
            </p>
          </div>

          {/* Card */}
          <div className="glass p-7 sm:p-8 space-y-5">

            {/* Display name */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs font-medium text-white/50 uppercase tracking-widest">
                <User size={12} /> Display name
              </label>
              <input
                type="text"
                placeholder="your_username"
                maxLength={15}
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-white/20 outline-none bg-white/[0.05] border border-white/[0.08] backdrop-blur-sm focus:border-purple-500/60 focus:bg-white/[0.07] focus:shadow-[0_0_0_3px_rgba(168,85,247,0.12)] transition-all"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs font-medium text-white/50 uppercase tracking-widest">
                <Mail size={12} /> Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-white/20 outline-none bg-white/[0.05] border border-white/[0.08] backdrop-blur-sm focus:border-purple-500/60 focus:bg-white/[0.07] focus:shadow-[0_0_0_3px_rgba(168,85,247,0.12)] transition-all"
              />
            </div>

            {/* Language */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs font-medium text-white/50 uppercase tracking-widest">
                <Globe size={12} /> Language
              </label>
              <div className="grid grid-cols-3 gap-2">
                {LOCALES.map(loc => (
                  <button
                    key={loc.value}
                    type="button"
                    onClick={() => setLocale(loc.value)}
                    className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-sm transition-all duration-200 ${
                      locale === loc.value
                        ? 'border-purple-500/60 bg-purple-500/15 text-white shadow-[0_0_16px_rgba(168,85,247,0.2)]'
                        : 'border-white/[0.07] bg-white/[0.03] text-white/45 hover:border-white/20 hover:text-white/70'
                    }`}
                  >
                    <span className="text-xl leading-none">{loc.flag}</span>
                    <span className="text-[11px] font-medium leading-none">{loc.native}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs font-medium text-white/50 uppercase tracking-widest">
                <Lock size={12} /> Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-xl text-sm text-white placeholder:text-white/20 outline-none bg-white/[0.05] border border-white/[0.08] backdrop-blur-sm focus:border-purple-500/60 focus:bg-white/[0.07] focus:shadow-[0_0_0_3px_rgba(168,85,247,0.12)] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* Rules */}
              <ul className="grid grid-cols-2 gap-1.5 pt-1">
                {PASSWORD_RULES.map(rule => {
                  const ok = rule.test(password)
                  return (
                    <li key={rule.label} className={`flex items-center gap-2 text-[11px] transition-colors duration-200 ${ok ? 'text-emerald-400' : 'text-white/30'}`}>
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${ok ? 'bg-emerald-500/20' : 'bg-white/5'}`}>
                        {ok
                          ? <Check size={8} strokeWidth={3} />
                          : <span className="w-1 h-1 rounded-full bg-white/25" />}
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
                  className="w-full px-4 py-3 pr-12 rounded-xl text-sm text-white placeholder:text-white/20 outline-none bg-white/[0.05] border border-white/[0.08] backdrop-blur-sm focus:border-purple-500/60 focus:bg-white/[0.07] focus:shadow-[0_0_0_3px_rgba(168,85,247,0.12)] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all shadow-[0_0_24px_rgba(168,85,247,0.35)] hover:shadow-[0_0_36px_rgba(168,85,247,0.55)] hover:-translate-y-0.5 flex items-center justify-center gap-2 mt-1"
            >
              Create account
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Footer note */}
          <p className="text-center text-[11px] text-white/22 leading-relaxed px-4">
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
