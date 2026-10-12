'use client'
import { ChevronRight, Activity, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { navGroups } from './data'
import { Icon } from './Icon'

export function DashSidebar() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button className="pp-menu-toggle btn btn--style-ghost btn--icon-only" aria-label="Open menu" onClick={() => setOpen(true)}><Menu size={18} /></button>
      {open && <div className="pp-scrim" onClick={() => setOpen(false)} />}
      <aside className={`pp-sidebar${open ? ' pp-sidebar--open' : ''}`}>
        <div className="pp-brand">
          <span className="pp-brand__tile"><Activity size={16} /></span>
          <span>
            <span className="pp-brand__name">Plexus <em>Pulse</em></span>
            <span className="pp-brand__sub">Analytics</span>
          </span>
          <button className="pp-sidebar__close" aria-label="Close menu" onClick={() => setOpen(false)}><X size={16} /></button>
        </div>
        <nav>
          {navGroups.map((g) => (
            <div key={g.label} className="pp-nav-group">
              <div className="pp-nav-group__label">{g.label}</div>
              {g.items.map((it) => (
                <a key={it.label} href={it.href} className={`pp-nav-item${it.active ? ' pp-nav-item--active' : ''}`} aria-current={it.active ? 'page' : undefined}>
                  <Icon name={it.icon} size={15} />
                  <span>{it.label}</span>
                  {it.chevron && <ChevronRight size={14} className="pp-nav-item__chev" />}
                </a>
              ))}
            </div>
          ))}
        </nav>
      </aside>
    </>
  )
}
