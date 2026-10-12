import { notFound } from 'next/navigation'
import { CodeViewer } from '@/components/CodeViewer'
import { AutoPreview, LivePreview } from '@/components/Previews'
import { logicOnly } from '@/components/classify'
import { kindOf } from '@/lib/status'
import { entries, getEntry, readSource } from '@/lib/catalog'

export const dynamicParams = false
export function generateStaticParams() {
  return entries.map((e) => ({ category: e.category, slug: e.slug }))
}

export default async function ComponentPage({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params
  const entry = getEntry(category, slug)
  if (!entry) notFound()
  const id = `${category}/${slug}`
  const kind = kindOf(entry)
  // index.tsx first, then its css, then the rest
  const files = readSource(entry).sort((a, b) => rank(a.path) - rank(b.path) || a.path.localeCompare(b.path))
  const importPath = `@payloadcms/ui`
  return (
    <div>
      <div className="cat-muted">{category}</div>
      <h2>{entry.name}</h2>
      <p className="cat-muted">
        Source: <code>packages/ui/src/{id}</code> · {files.length} file{files.length === 1 ? '' : 's'} · Import in a Payload app via <code>{importPath}</code>
      </p>
      {kind === 'live' && <LivePreview id={id} />}
      {kind === 'standin' && <AutoPreview name={entry.name} auto={[entry.auto]} />}
      {kind === 'logic' && (
        <div className="cat-note">
          <b>Logic only, nothing to display.</b> {logicOnly[id] || 'This is behind-the-scenes code with no visual output of its own.'}
          {' '}The source is below if you want to reuse or adapt it.
        </div>
      )}
      <CodeViewer files={files} />
    </div>
  )
}

function rank(p: string) {
  const n = p.split('/').pop()!
  if (n === 'index.tsx') return 0
  if (n === 'index.css') return 1
  if (n === 'Input.tsx') return 2
  return 3 + p.split('/').length
}
