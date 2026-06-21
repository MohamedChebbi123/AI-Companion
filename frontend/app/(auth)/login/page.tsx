'use client'

import { useState } from 'react'
import { Eye, EyeOff, Sparkles, Mail, Lock, ArrowRight } from 'lucide-react'
import Aurora from '../../../components/Aurora'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative min-h-screen bg-[#050508] text-white flex flex-col overflow-hidden">

      {/* Aurora background */}
      <div className="fixed inset-0 pointer-events-none" style={{ width: '100vw', height: '100vh' }} aria-hidden>
        <Aurora
          colorStops={['#3b0764', '#a855f7', '#ec4899']}
          blend={0.4}
          amplitude={1.0}
          speed={0.5}
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
        <a href="/register" className="text-sm text-white/45 hover:text-white/80 transition-colors">
          No account?{' '}
          <span className="text-purple-400 font-medium">Sign up</span>
        </a>
      </header>

      {/* Main */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm space-y-8 animate-fade-up">

          {/* Heading */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-medium">
              <Sparkles size={13} />
              Welcome back
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Sign in to Aura
            </h1>
            <p className="text-white/40 text-sm">
              Your companion is waiting for you.
            </p>
          </div>

          {/* Card */}
          <div className="glass p-7 sm:p-8 space-y-5">

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

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-medium text-white/50 uppercase tracking-widest">
                  <Lock size={12} /> Password
                </label>
                <a href="/forgot-password" className="text-[11px] text-purple-400 hover:text-purple-300 transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Your password"
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
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all shadow-[0_0_24px_rgba(168,85,247,0.35)] hover:shadow-[0_0_36px_rgba(168,85,247,0.55)] hover:-translate-y-0.5 flex items-center justify-center gap-2 mt-1"
            >
              Sign in
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Footer note */}
          <p className="text-center text-[11px] text-white/22 leading-relaxed">
            By signing in you agree to our{' '}
            <a href="/terms" className="text-white/40 hover:text-white/60 underline underline-offset-2 transition-colors">Terms</a>
            {' '}and{' '}
            <a href="/privacy" className="text-white/40 hover:text-white/60 underline underline-offset-2 transition-colors">Privacy Policy</a>.
          </p>
        </div>
      </main>
    </div>
  )
}
