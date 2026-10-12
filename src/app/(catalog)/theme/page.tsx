import fs from 'node:fs'
import path from 'node:path'
import { ThemeEditor } from '@/components/ThemeEditor'

// Collect the CSS custom properties Payload defines in its token files (first/light definition wins)
function tokens() {
  const files = ['theme.css', 'colors.css', 'radius.css', 'spacing.css', 'typography.css']
  const groups: { file: string; vars: { name: string; value: string }[] }[] = []
  for (const f of files) {
    const css = fs.readFileSync(path.join(process.cwd(), 'payload-src/css', f), 'utf8')
    const seen = new Set<string>(); const vars: { name: string; value: string }[] = []
    for (const m of css.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/g)) {
      if (seen.has(m[1])) continue; seen.add(m[1]); vars.push({ name: m[1], value: m[2].trim() })
    }
    groups.push({ file: f, vars })
  }
  return groups
}

export default function ThemePage() {
  return (
    <div>
      <h2>Theme / rebrand</h2>
      <p className="cat-muted" style={{ maxWidth: 760 }}>
        Payload v4 styles everything with CSS custom properties inside <code>@layer payload-default</code>, so plain <code>:root</code> overrides win.
        Change values here — they apply to every page of this catalog instantly (saved in your browser). Export the CSS and put it in your Payload
        app’s <code>app/(payload)/custom.css</code>.
      </p>
      <ThemeEditor groups={tokens()} />
    </div>
  )
}
