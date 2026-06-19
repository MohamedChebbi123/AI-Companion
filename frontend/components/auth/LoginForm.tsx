'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from 'next-themes';

const LIGHT = {
  card:        { background: '#fdf6f0', border: '1px solid #e8cfc9', boxShadow: '0 0 0 1px #e8cfc9, 0 8px 32px rgba(45,31,26,0.09), 0 1px 2px rgba(45,31,26,0.05)' },
  divider:     '1px solid #f0ddd7',
  logo:        { background: '#f2c4b4', border: '1px solid rgba(192,101,74,0.30)' },
  logoDot:     '#c0654a',
  logoRing:    'rgba(192,101,74,0.45)',
  primary:     '#2d1f1a',
  muted:       '#a07060',
  label:       '#b06060',
  forgot:      '#c0654a',
  footer:      '#a07060',
  footerLink:  '#c0654a',
  input:       { background: '#ffffff', border: '1px solid #e8cfc9', color: '#2d1f1a', transition: 'border-color 0.15s ease' },
  focusBorder: '#c0654a',
  blurBorder:  '#e8cfc9',
  button:      { background: '#c0654a', boxShadow: '0 1px 2px rgba(45,31,26,0.25), 0 0 0 1px rgba(192,101,74,0.45)' },
};

const DARK = {
  card:        { background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 8px 48px rgba(0,0,0,0.55), 0 1px 2px rgba(0,0,0,0.4)' },
  divider:     '1px solid rgba(255,255,255,0.05)',
  logo:        { background: 'rgba(124,92,255,0.10)', border: '1px solid rgba(124,92,255,0.22)' },
  logoDot:     '#7C5CFF',
  logoRing:    'rgba(124,92,255,0.45)',
  primary:     '#FFFFFF',
  muted:       'rgba(255,255,255,0.38)',
  label:       'rgba(255,255,255,0.50)',
  forgot:      'rgba(255,255,255,0.30)',
  footer:      'rgba(255,255,255,0.28)',
  footerLink:  'rgba(255,255,255,0.50)',
  input:       { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#FFFFFF', transition: 'border-color 0.15s ease' },
  focusBorder: '#7C5CFF',
  blurBorder:  'rgba(255,255,255,0.08)',
  button:      { background: '#7C5CFF', boxShadow: '0 1px 2px rgba(0,0,0,0.35), 0 0 0 1px rgba(124,92,255,0.45)' },
};

export function LoginForm() {
  const { login } = useAuth();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => setMounted(true), []);

  const t = mounted && resolvedTheme === 'light' ? LIGHT : DARK;

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[368px]">
      <div className="rounded-2xl backdrop-blur-sm overflow-hidden" style={t.card}>

        {/* Logo + wordmark */}
        <div className="flex flex-col items-center pt-8 pb-6 px-7" style={{ borderBottom: t.divider }}>
          <div className="flex h-9 w-9 items-center justify-center rounded-[10px] mb-3" style={t.logo}>
            <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="3" fill={t.logoDot} />
              <circle cx="9" cy="9" r="6.5" stroke={t.logoRing} strokeWidth="1" />
            </svg>
          </div>
          <span className="text-[14px] font-semibold tracking-[-0.01em]" style={{ color: t.primary }}>
            Aura
          </span>
        </div>

        {/* Heading */}
        <div className="px-7 pt-6 pb-2">
          <h1 className="text-[24px] font-semibold tracking-[-0.022em] leading-tight" style={{ color: t.primary }}>
            Welcome back
          </h1>
          <p className="mt-1 text-[14px]" style={{ color: t.muted }}>
            Continue your conversation
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-7 pt-5 pb-7 flex flex-col gap-3.5">
          {error && (
            <div className="rounded-xl px-3.5 py-2.5 text-[13px]" style={{ background: 'rgba(192,101,74,0.10)', border: '1px solid rgba(192,101,74,0.22)', color: '#c0654a' }}>
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-[12.5px] font-medium tracking-[0.005em]" style={{ color: t.label }}>
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl px-3.5 py-2.5 text-[14px] outline-none placeholder:opacity-40"
              style={t.input}
              onFocus={(e) => { e.currentTarget.style.borderColor = t.focusBorder; }}
              onBlur={(e)  => { e.currentTarget.style.borderColor = t.blurBorder; }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-[12.5px] font-medium tracking-[0.005em]" style={{ color: t.label }}>
                Password
              </label>
              <a href="#" className="text-[12px] transition-opacity hover:opacity-70" style={{ color: t.forgot }}>
                Forgot password?
              </a>
            </div>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl px-3.5 py-2.5 text-[14px] outline-none placeholder:opacity-40"
              style={t.input}
              onFocus={(e) => { e.currentTarget.style.borderColor = t.focusBorder; }}
              onBlur={(e)  => { e.currentTarget.style.borderColor = t.blurBorder; }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-1 rounded-xl py-2.5 text-[14px] font-medium text-white transition-opacity disabled:opacity-50 hover:opacity-90 active:opacity-80"
            style={t.button}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-3.5 w-3.5 opacity-75" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Signing in
              </span>
            ) : 'Sign in'}
          </button>
        </form>

        {/* Footer */}
        <div className="px-7 py-4 text-center" style={{ borderTop: t.divider }}>
          <p className="text-[13px]" style={{ color: t.footer }}>
            No account?{' '}
            <a href="/register" className="transition-opacity hover:opacity-70" style={{ color: t.footerLink }}>
              Create one
            </a>
          </p>
        </div>

      </div>
    </div>
  );
}
