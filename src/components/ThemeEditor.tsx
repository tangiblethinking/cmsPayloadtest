'use client'
import { useEffect, useMemo, useState } from 'react'
import { LivePreview } from './Previews'
import { loadTheme, saveTheme, themeToCss, type ThemeState } from './themeStore'

type Group = { file: string; vars: { name: string; value: string }[] }
const PRESETS: Record<string, Record<string, string>> = {
  Default: {},
  Plexus: { '--color-bg-brand': '#6d28d9', '--color-bg-brand-hover': '#5b21b6', '--color-bg-brand-pressed': '#4c1d95', '--color-text-brand': '#6d28d9', '--color-bg-brand-tertiary': '#ede9fe', '--button-radius': '999px', '--field-border-radius': '10px' },
  Forest: { '--color-bg-brand': '#15803d', '--color-bg-brand-hover': '#166534', '--color-bg-brand-pressed': '#14532d', '--color-text-brand': '#15803d', '--color-bg-brand-tertiary': '#dcfce7', '--button-radius': '4px' },
  Sunset: { '--color-bg-brand': '#ea580c', '--color-bg-brand-hover': '#c2410c', '--color-bg-brand-pressed': '#9a3412', '--color-text-brand': '#c2410c', '--color-bg-brand-tertiary': '#ffedd5', '--button-radius': '12px', '--field-border-radius': '12px' },
}
const isHex = (v: string) => /^#[0-9a-f]{6}$/i.test(v)

export function ThemeEditor({ groups }: { groups: Group[] }) {
  const [t, setT] = useState<ThemeState>({ mode: 'light', vars: {} })
  const [q, setQ] = useState('brand')
  const [copied, setCopied] = useState(false)
  useEffect(() => setT(loadTheme()), [])
  const update = (next: ThemeState) => { setT(next); saveTheme(next) }
  const setVar = (k: string, v: string) => { const vars = { ...t.vars }; if (v) vars[k] = v; else delete vars[k]; update({ ...t, vars }) }
  const css = themeToCss(t)
  const filtered = useMemo(() => groups.map((g) => ({ ...g, vars: g.vars.filter((v) => v.name.includes(q)) })).filter((g) => g.vars.length), [groups, q])
  return (
    <div>
      <div className="cat-stage-row" style={{ margin: '16px 0' }}>
        <b>Presets:</b>
        {Object.keys(PRESETS).map((p) => <button key={p} className="cat-btn" onClick={() => update({ ...t, vars: { ...PRESETS[p] } })}>{p}</button>)}
        <button className="cat-btn" onClick={() => update({ ...t, mode: t.mode === 'light' ? 'dark' : 'light' })}>Mode: {t.mode}</button>
        <button className="cat-btn" onClick={() => update({ mode: t.mode, vars: {} })}>Reset</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 24 }}>
        <div>
          <LivePreview id="elements/Button" />
          <LivePreview id="fields/Text" />
          <LivePreview id="elements/Pill" />
        </div>
        <div>
          <section className="cat-panel">
            <header><span>Exported overrides (custom.css)</span>
              <button className="cat-btn" onClick={async () => { await navigator.clipboard.writeText(css); setCopied(true); setTimeout(() => setCopied(false), 1500) }}>{copied ? 'Copied ✓' : 'Copy CSS'}</button></header>
            <pre className="cat-code" style={{ background: '#1e1e1e', color: '#ddd', minHeight: 80 }}>{css || '/* No overrides yet — pick a preset or edit a variable */'}</pre>
          </section>
        </div>
      </div>
      <h3>CSS variables</h3>
      <input className="cat-btn" style={{ width: 320, padding: 8 }} placeholder="Filter variables (e.g. brand, radius, font)" value={q} onChange={(e) => setQ(e.target.value)} />
      {filtered.map((g) => (
        <div key={g.file}>
          <h4 style={{ margin: '18px 0 8px' }}>{g.file}</h4>
          <div className="cat-theme-grid">
            {g.vars.map((v) => {
              const cur = t.vars[v.name] ?? ''
              return (
                <label key={v.name} title={`default: ${v.value}`}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.name}</span>
                  <span style={{ display: 'flex', gap: 4 }}>
                    <input type="color" value={isHex(cur) ? cur : '#000000'} onChange={(e) => setVar(v.name, e.target.value)} />
                    <input type="text" placeholder={v.value} value={cur} onChange={(e) => setVar(v.name, e.target.value)} />
                  </span>
                </label>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
