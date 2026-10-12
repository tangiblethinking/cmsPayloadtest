'use client'
import { useEffect, useState } from 'react'
import { applyTheme, loadTheme, saveTheme } from './themeStore'

/** Applies saved theme on load and renders a floating light/dark toggle. */
export function ThemeRuntime() {
  const [mode, setMode] = useState<'light' | 'dark'>('light')
  useEffect(() => {
    const t = loadTheme(); applyTheme(t); setMode(t.mode)
    const on = (e: Event) => setMode((e as CustomEvent).detail.mode)
    window.addEventListener('cmspayload-theme', on)
    return () => window.removeEventListener('cmspayload-theme', on)
  }, [])
  return (
    <button className="cat-btn" style={{ position: 'fixed', top: 12, right: 16, zIndex: 9999 }}
      onClick={() => { const t = loadTheme(); t.mode = mode === 'light' ? 'dark' : 'light'; saveTheme(t) }}>
      {mode === 'light' ? '☾ Dark' : '☀ Light'}
    </button>
  )
}
