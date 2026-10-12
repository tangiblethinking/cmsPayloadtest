import Link from 'next/link'
import { kindOf } from '@/lib/status'
import { entries } from '@/lib/catalog'

export default function Home() {
  const live = entries.filter((e) => kindOf(e) === 'live')
  const standin = entries.filter((e) => kindOf(e) === 'standin').length
  const logic = entries.filter((e) => kindOf(e) === 'logic').length
  return (
    <div>
      <h2>Payload UI Catalog</h2>
      <p className="cat-muted" style={{ maxWidth: 760 }}>
        Every element and field from Payload’s <code>packages/ui</code> with its full source (TSX + CSS). {live.length} have interactive previews, {standin} have stand-in previews built from their CSS classes, and {logic} are logic only (nothing to display). All previews use Payload’s real stylesheet. <Link href="/dashboard"><b>Open the Plexus Pulse dashboard demo →</b></Link>. Use the <Link href="/theme">Theme panel</Link> to rebrand
        via CSS variables and export the overrides, and “Copy all for AI” on any page to feed a component’s source to an AI tool.
      </p>
      <h3 style={{ marginTop: 28 }}>Live previews ({live.length})</h3>
      <div className="cat-grid">{live.map((e) => <Link key={e.category + e.slug} href={`/c/${e.category}/${e.slug}`}>{e.name}<div className="cat-muted" style={{ fontSize: 12 }}>{e.category}</div></Link>)}</div>
      {(['elements', 'fields'] as const).map((cat) => (
        <div key={cat}>
          <h3 style={{ marginTop: 28 }}>All {cat} ({entries.filter((e) => e.category === cat).length})</h3>
          <div className="cat-grid">{entries.filter((e) => e.category === cat).map((e) => <Link key={e.slug} href={`/c/${e.category}/${e.slug}`}>{e.name}</Link>)}</div>
        </div>
      ))}
    </div>
  )
}
