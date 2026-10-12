'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

type Item = { category: string; slug: string; name: string; kind: 'live' | 'standin' | 'logic' }
export function Sidebar({ items }: { items: Item[] }) {
  const [q, setQ] = useState('')
  const [liveOnly, setLiveOnly] = useState(false)
  const pathname = usePathname()
  const live = items.filter((i) => i.kind !== 'logic').length
  return (
    <nav className="cat-side">
      <h1><Link href="/">CMSPayload</Link></h1>
      <div className="sub">Payload UI catalog · {items.length} components · {live} with previews</div>
      <div className="toplinks">
        <Link href="/">Overview</Link>
        <Link href="/theme">🎨 Theme / rebrand</Link>
      </div>
      <input className="cat-search" placeholder="Search components…" value={q} onChange={(e) => setQ(e.target.value)} />
      <label className="cat-filter"><input type="checkbox" checked={liveOnly} onChange={(e) => setLiveOnly(e.target.checked)} /> Hide logic-only items</label>
      {['elements', 'fields'].map((cat) => {
        const list = items.filter((i) => i.category === cat && (!liveOnly || i.kind !== 'logic') && i.name.toLowerCase().includes(q.toLowerCase()))
        return (
          <div key={cat}>
            <div className="group">{cat} ({list.length})</div>
            <ul>
              {list.map((i) => {
                const href = `/c/${i.category}/${i.slug}`
                return (
                  <li key={href}>
                    <Link className={pathname === href ? 'active' : ''} href={href}>
                      <span>{i.name}</span>{i.kind === 'live' ? <span className="dot">live</span> : i.kind === 'standin' ? <span className="dot" style={{ opacity: .7 }}>preview</span> : <span className="dot" style={{ background: 'transparent', opacity: .5 }}>logic</span>}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </nav>
  )
}
