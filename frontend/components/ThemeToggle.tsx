'use client'

import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="fixed right-4 bottom-6 z-[9999] w-11 h-11 rounded-full glass flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-[0_0_20px_rgba(168,85,247,0.35)] hover:shadow-[0_0_32px_rgba(168,85,247,0.55)]"
    >
      {theme === 'dark'
        ? <Sun size={18} className="text-amber-300" />
        : <Moon size={18} className="text-purple-600" />}
    </button>
  )
}
