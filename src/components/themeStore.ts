'use client'
export type ThemeState = { mode: 'light' | 'dark'; vars: Record<string, string> }
const KEY = 'cmspayload-theme'
export function loadTheme(): ThemeState {
  try { return { mode: 'light', vars: {}, ...JSON.parse(localStorage.getItem(KEY) || '{}') } } catch { return { mode: 'light', vars: {} } }
}
export function applyTheme(t: ThemeState) {
  const el = document.documentElement
  el.setAttribute('data-theme', t.mode)
  let style = document.getElementById('cmspayload-overrides') as HTMLStyleElement | null
  if (!style) { style = document.createElement('style'); style.id = 'cmspayload-overrides'; document.head.appendChild(style) }
  style.textContent = themeToCss(t)
}
export function saveTheme(t: ThemeState) {
  localStorage.setItem(KEY, JSON.stringify(t)); applyTheme(t)
  window.dispatchEvent(new CustomEvent('cmspayload-theme', { detail: t }))
}
/** Unlayered :root overrides — exactly what you'd paste into your Payload app's custom.css */
export function themeToCss(t: ThemeState) {
  const lines = Object.entries(t.vars).filter(([, v]) => v).map(([k, v]) => `  ${k}: ${v};`)
  return lines.length ? `:root,\n[data-theme] {\n${lines.join('\n')}\n}\n` : ''
}
