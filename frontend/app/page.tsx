'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

export default function LandingPage() {
  const revealRefs = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.15 }
    );

    revealRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const addReveal = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-surface)', color: 'var(--color-on-surface)' }}>

      {/* Nav */}
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md border-b" style={{ borderColor: 'var(--color-outline)', background: 'rgba(17,24,39,0.85)' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: 'var(--color-primary)' }}>A</span>
            <span className="font-semibold tracking-tight">AI Companion</span>
          </div>
          <nav className="flex items-center gap-3">
            <Link href="/auth/login" className="px-4 py-1.5 text-sm rounded-lg transition-colors" style={{ color: 'var(--color-on-surface-variant)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-on-surface)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-on-surface-variant)')}>
              Sign in
            </Link>
            <Link href="/auth/register" className="px-4 py-1.5 text-sm rounded-lg font-medium text-white transition-opacity hover:opacity-90" style={{ background: 'var(--color-primary)' }}>
              Get started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-40 pb-28 px-6 text-center overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-3xl opacity-20" style={{ background: 'var(--color-primary)' }} />
        </div>

        <div className="relative max-w-3xl mx-auto">
          <span className="inline-block mb-5 px-3 py-1 text-xs font-medium rounded-full border" style={{ borderColor: 'var(--color-outline)', color: 'var(--color-on-surface-variant)', background: 'var(--color-surface-container)' }}>
            Voice &amp; Text · Powered by AI
          </span>

          <h1 className="text-5xl sm:text-6xl font-bold leading-tight tracking-tight mb-6">
            Your personal{' '}
            <span style={{
              background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 50%, #a78bfa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              AI companion
            </span>
            <br />always by your side
          </h1>

          <p className="text-lg mb-10 max-w-xl mx-auto leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
            Chat by typing or speaking. Your companion remembers context, adapts to you, and is available 24/7 — ready for anything from quick questions to deep conversations.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/auth/register" className="px-7 py-3 rounded-xl font-semibold text-white transition-opacity hover:opacity-90 shadow-lg" style={{ background: 'var(--color-primary)', boxShadow: '0 0 24px rgba(99,102,241,0.4)' }}>
              Start for free
            </Link>
            <Link href="/auth/login" className="px-7 py-3 rounded-xl font-semibold transition-colors border" style={{ borderColor: 'var(--color-outline)', color: 'var(--color-on-surface)', background: 'var(--color-surface-container)' }}>
              Sign in
            </Link>
          </div>
        </div>

        {/* Mock chat preview */}
        <div ref={addReveal} className="reveal relative mt-20 max-w-lg mx-auto rounded-2xl overflow-hidden border shadow-2xl text-left" style={{ borderColor: 'var(--color-outline)', background: 'var(--color-surface-container)' }}>
          <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: 'var(--color-outline)', background: 'rgba(0,0,0,0.2)' }}>
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
            <span className="ml-2 text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>AI Companion · Chat</span>
          </div>
          <div className="p-5 flex flex-col gap-4 text-sm">
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0" style={{ background: 'var(--color-primary)' }}>A</div>
              <div className="rounded-2xl rounded-tl-none px-4 py-2.5 max-w-xs" style={{ background: 'var(--color-outline)', color: 'var(--color-on-surface)' }}>
                Hey! How can I help you today? You can type or use the mic 🎙️
              </div>
            </div>
            <div className="flex gap-3 items-start justify-end">
              <div className="rounded-2xl rounded-tr-none px-4 py-2.5 max-w-xs text-white" style={{ background: 'var(--color-primary)' }}>
                Summarize my meeting notes and suggest action items.
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0" style={{ background: 'var(--color-primary)' }}>A</div>
              <div className="rounded-2xl rounded-tl-none px-4 py-2.5 max-w-xs" style={{ background: 'var(--color-outline)', color: 'var(--color-on-surface)' }}>
                <span className="inline-flex gap-1">
                  <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--color-primary)', animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--color-primary)', animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--color-primary)', animationDelay: '300ms' }} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div ref={addReveal} className="reveal text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything you need, nothing you don't</h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--color-on-surface-variant)' }}>
              Built around natural conversation — text, voice, or both.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                ),
                title: 'Natural Chat',
                desc: 'Fluid multi-turn conversations with full context memory. Ask follow-ups, clarify, and get thoughtful responses.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 016 0v6a3 3 0 01-3 3z" />
                  </svg>
                ),
                title: 'Voice Input',
                desc: 'Speak naturally and let the companion transcribe and respond. Hands-free and effortless.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M12 12h.01M8.464 15.536a5 5 0 010-7.072M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Voice Playback',
                desc: 'Hear responses read aloud with natural-sounding speech — great for multitasking.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                ),
                title: 'Conversation History',
                desc: 'Every conversation is saved and searchable. Pick up exactly where you left off.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                title: 'Personalization',
                desc: 'Tune the companion to your workflow via the settings panel — tone, behavior, and more.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
                title: 'Secure & Private',
                desc: 'Your conversations stay yours. Auth-gated access with no data shared with third parties.',
              },
            ].map((feat, i) => (
              <div
                key={feat.title}
                ref={addReveal}
                className="reveal rounded-2xl p-6 border transition-colors group"
                style={{
                  borderColor: 'var(--color-outline)',
                  background: 'var(--color-surface-container)',
                  transitionDelay: `${i * 60}ms`,
                }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 text-white/70 group-hover:text-white transition-colors" style={{ background: 'rgba(99,102,241,0.15)' }}>
                  {feat.icon}
                </div>
                <h3 className="font-semibold mb-2">{feat.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div
          ref={addReveal}
          className="reveal max-w-3xl mx-auto rounded-3xl p-12 text-center border relative overflow-hidden"
          style={{ borderColor: 'var(--color-outline)', background: 'var(--color-surface-container)' }}
        >
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl opacity-10" style={{ background: 'var(--color-primary)' }} />
          </div>
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to meet your companion?</h2>
            <p className="mb-8 text-base" style={{ color: 'var(--color-on-surface-variant)' }}>
              Sign up in seconds — no credit card required.
            </p>
            <Link
              href="/auth/register"
              className="inline-block px-8 py-3.5 rounded-xl font-semibold text-white transition-opacity hover:opacity-90 shadow-lg"
              style={{ background: 'var(--color-primary)', boxShadow: '0 0 32px rgba(99,102,241,0.35)' }}
            >
              Create free account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-6" style={{ borderColor: 'var(--color-outline)' }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ background: 'var(--color-primary)' }}>A</span>
            AI Companion
          </div>
          <div className="flex gap-6">
            <Link href="/auth/login" className="hover:text-white transition-colors">Sign in</Link>
            <Link href="/auth/register" className="hover:text-white transition-colors">Register</Link>
            <Link href="/settings" className="hover:text-white transition-colors">Settings</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
