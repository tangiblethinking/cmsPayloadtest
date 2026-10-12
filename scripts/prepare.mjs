// Generates:
//  - public/payload-ui.css : Payload's real UI CSS (tokens + every element/field stylesheet)
//  - src/generated/catalog.json : list of every element/field and its source files
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const SRC = path.join(root, 'payload-src')
// The Git repo stores payload-src as one bundle file (payload-src.bundle.json); unpack it if the folder is missing.
const BUNDLE = path.join(root, 'payload-src.bundle.json')
if (!fs.existsSync(SRC) && fs.existsSync(BUNDLE)) {
  for (const [rel, content] of Object.entries(JSON.parse(fs.readFileSync(BUNDLE, 'utf8')))) {
    fs.mkdirSync(path.dirname(path.join(SRC, rel)), { recursive: true })
    fs.writeFileSync(path.join(SRC, rel), content)
  }
}
const CODE_EXT = /\.(tsx|ts|css|scss)$/

function inlineImports(file, seen = new Set()) {
  if (seen.has(file)) return ''
  seen.add(file)
  const css = fs.readFileSync(file, 'utf8')
  return css.replace(/^@import\s+['"](.+?)['"];?\s*$/gm, (_, rel) =>
    inlineImports(path.resolve(path.dirname(file), rel), seen),
  )
}

function walk(dir) {
  const out = []
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) out.push(...walk(p))
    else if (!e.name.startsWith('._') && CODE_EXT.test(e.name) && !/\.spec\./.test(e.name)) out.push(p)
  }
  return out.sort()
}

// ---- CSS bundle
let css = '/* Generated from payload-src — do not edit. */\n'
css += inlineImports(path.join(SRC, 'css/app.css')) + '\n'
for (const group of ['icons', 'fields', 'elements']) {
  for (const f of walk(path.join(SRC, group)).filter((f) => f.endsWith('.css'))) {
    css += `\n/* ${path.relative(SRC, f)} */\n` + inlineImports(f) + '\n'
  }
}
fs.mkdirSync(path.join(root, 'public'), { recursive: true })
fs.writeFileSync(path.join(root, 'public/payload-ui.css'), css)

// Derive BEM info (base class, __elements, --modifiers) from a component's own tsx/css, for auto stand-in previews
function autoInfo(files) {
  const read = (f) => fs.readFileSync(path.join(SRC, f), 'utf8')
  const top = files.filter((f) => f.split('/').length === 3)
  const tsx = top.filter((f) => f.endsWith('.tsx')).map(read).join('\n')
  const css = top.filter((f) => f.endsWith('.css')).map(read).join('\n')
  if (!css) return null
  let base = (tsx.match(/baseClass\s*=\s*['"]([a-z0-9-]+)['"]/) || [])[1]
  const classes = [...new Set([...css.matchAll(/\.([a-z][a-z0-9_-]*)/g)].map((m) => m[1]))]
  if (!base || !classes.some((c) => c === base || c.startsWith(base + '_') || c.startsWith(base + '-'))) {
    base = classes.find((c) => !c.includes('__') && !c.includes('--') && !['btn', 'icon', 'fill', 'stroke', 'field-type'].includes(c)) || classes[0]
  }
  if (!base) return null
  const elements = classes.filter((c) => c.startsWith(base + '__') && !c.includes('--')).map((c) => c.slice(base.length + 2))
  const modifiers = classes.filter((c) => c.startsWith(base + '--')).map((c) => c.slice(base.length + 2))
  return { base, elements: elements.slice(0, 14), modifiers: modifiers.slice(0, 20) }
}

// ---- Catalog
const catalog = []
for (const [group, category] of [['elements', 'elements'], ['fields', 'fields']]) {
  for (const e of fs.readdirSync(path.join(SRC, group), { withFileTypes: true })) {
    if (!e.isDirectory()) continue
    const files = walk(path.join(SRC, group, e.name)).map((f) => path.relative(SRC, f))
    if (!files.length) continue
    catalog.push({ category, name: e.name, slug: e.name, files, auto: autoInfo(files) })
  }
}
fs.mkdirSync(path.join(root, 'src/generated'), { recursive: true })
fs.writeFileSync(path.join(root, 'src/generated/catalog.json'), JSON.stringify(catalog, null, 1))
console.log(`prepare: ${catalog.length} components, css ${(css.length / 1024).toFixed(0)} KB`)
