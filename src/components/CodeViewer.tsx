'use client'
import { Highlight, themes } from 'prism-react-renderer'
import { useState } from 'react'

export function CodeViewer({ files, title = 'Source' }: { files: { path: string; code: string }[]; title?: string }) {
  const [i, setI] = useState(0)
  const [copied, setCopied] = useState('')
  const f = files[i]
  if (!f) return null
  const lang = f.path.endsWith('.css') || f.path.endsWith('.scss') ? 'css' : 'tsx'
  const copy = async (text: string, what: string) => {
    await navigator.clipboard.writeText(text); setCopied(what); setTimeout(() => setCopied(''), 1500)
  }
  const all = files.map((x) => `// ===== ${x.path} =====\n${x.code}`).join('\n\n')
  return (
    <section className="cat-panel">
      <header>
        <div className="cat-tabs">
          {files.map((x, j) => (
            <button key={x.path} className={j === i ? 'on' : ''} onClick={() => setI(j)}>{x.path.split('/').slice(2).join('/') || x.path}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6, flex: 'none' }}>
          <button className="cat-btn" onClick={() => copy(f.code, 'file')}>{copied === 'file' ? 'Copied ✓' : 'Copy file'}</button>
          <button className="cat-btn" title="All files, ready to paste into an AI prompt" onClick={() => copy(all, 'all')}>{copied === 'all' ? 'Copied ✓' : 'Copy all for AI'}</button>
        </div>
      </header>
      <div style={{ fontSize: 12, padding: '6px 14px', opacity: .7 }}>{title}: payload-src/{f.path}</div>
      <Highlight theme={themes.vsDark} code={f.code} language={lang}>
        {({ style, tokens, getLineProps, getTokenProps }) => (
          <pre className="cat-code" style={style}>
            {tokens.map((line, k) => (
              <div key={k} {...getLineProps({ line })}>
                <span style={{ display: 'inline-block', width: 36, opacity: .4, userSelect: 'none' }}>{k + 1}</span>
                {line.map((token, key) => <span key={key} {...getTokenProps({ token })} />)}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </section>
  )
}
