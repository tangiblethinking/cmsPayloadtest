'use client'
import { useMemo, useState } from 'react'
import { Sparkles, Search, ChevronLeft, ChevronRight, ChevronDown, Lightbulb, MessageSquare, ShoppingCart, Users } from 'lucide-react'
import { opportunities, growthPlays, OPPORTUNITY_TOTAL } from './data'

function Opportunities() {
  const [q, setQ] = useState('')
  const [per, setPer] = useState(5)
  const [page, setPage] = useState(0)
  const rows = useMemo(() => {
    const t = q.trim().toLowerCase()
    return t ? opportunities.filter((o) => (o.name + o.title + o.detail).toLowerCase().includes(t)) : opportunities
  }, [q])
  const pages = Math.max(1, Math.ceil(rows.length / per))
  const p = Math.min(page, pages - 1)
  const shown = rows.slice(p * per, p * per + per)
  return (
    <section className="card pp-card">
      <div className="pp-card__head">
        <div>
          <h3 className="pp-card__title"><span className="pp-ico-sq"><Sparkles size={13} /></span>Growth Opportunities <span className="pp-badge-amber">{OPPORTUNITY_TOTAL}</span></h3>
          <p className="pp-muted pp-small pp-sub">Our predictive model surfaces team members most likely to break through next period — rank, PV, enrollments, or milestones.</p>
        </div>
      </div>
      <label className="pp-search pp-search--inline">
        <Search size={14} />
        <input value={q} onChange={(e) => { setQ(e.target.value); setPage(0) }} placeholder="Search members or signals…" aria-label="Search opportunities" />
      </label>
      <div className="table pp-table">
        <table>
          <thead><tr><th>Member</th><th>Signal</th><th aria-label="Actions" /></tr></thead>
          <tbody>
            {shown.map((o) => (
              <tr key={o.id}>
                <td className="pp-member">
                  {o.confidence === 'High' && <span className="pill pill--size-small pp-pill-high">High</span>}
                  <a href="#" className="pp-link"><b>{o.name}</b></a>
                </td>
                <td><b className="pp-signal-title">{o.title}</b><div className="pp-muted pp-small">{o.detail}</div></td>
                <td className="pp-actions">
                  <button className="btn btn--style-ghost btn--icon-only btn--size-small" aria-label="Message"><MessageSquare size={14} /></button>
                  <button className="btn btn--style-ghost btn--icon-only btn--size-small" aria-label="Suggest cart"><ShoppingCart size={14} /></button>
                </td>
              </tr>
            ))}
            {!shown.length && <tr><td colSpan={3} className="pp-muted">No matches.</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="pp-pager pp-small">
        <span className="pp-muted">Rows per page</span>
        <select value={per} onChange={(e) => { setPer(+e.target.value); setPage(0) }} aria-label="Rows per page">
          {[5, 10, 25].map((n) => <option key={n}>{n}</option>)}
        </select>
        <span>{rows.length ? `${p * per + 1}–${p * per + shown.length}` : '0'} of {q ? rows.length : OPPORTUNITY_TOTAL}</span>
        <button className="btn btn--style-ghost btn--icon-only btn--size-small" disabled={p === 0} onClick={() => setPage(p - 1)} aria-label="Previous"><ChevronLeft size={15} /></button>
        <button className="btn btn--style-ghost btn--icon-only btn--size-small" disabled={p >= pages - 1} onClick={() => setPage(p + 1)} aria-label="Next"><ChevronRight size={15} /></button>
      </div>
    </section>
  )
}

function Plays() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section className="card pp-card">
      <div className="pp-card__head">
        <div>
          <h3 className="pp-card__title"><span className="pp-ico-sq"><Lightbulb size={13} /></span>Growth Plays <span className="pp-act-now">Act Now</span></h3>
          <p className="pp-muted pp-small pp-sub">Current-period signals you can still influence. Each is a recommendation based on recent patterns, not a guarantee.</p>
        </div>
        <span className="pp-count">{growthPlays.length}</span>
      </div>
      <ul className="pp-plays">
        {growthPlays.map((g) => (
          <li key={g.id} className={open === g.id ? 'is-open' : ''}>
            <div className="pp-play-row">
              <span className="pill pill--size-small pp-pill-high">{g.level}</span>
              <span className="pp-play-text">{g.before}<a href="#" className="pp-link"><b>{g.name}</b></a>{g.after}</span>
              <span className="pill pill--size-small pill--style-light-gray pp-conf">{g.confidence}% confidence</span>
              <button className="btn btn--style-ghost btn--icon-only btn--size-small" aria-label="Message"><MessageSquare size={14} /></button>
              <button className="btn btn--style-ghost btn--icon-only btn--size-small" aria-label="View in CRM"><Users size={14} /></button>
              <button className="btn btn--style-ghost btn--icon-only btn--size-small pp-chev" aria-expanded={open === g.id} aria-label="Expand" onClick={() => setOpen(open === g.id ? null : g.id)}><ChevronDown size={15} /></button>
            </div>
            {open === g.id && <p className="pp-play-detail pp-muted pp-small">{g.detail}</p>}
          </li>
        ))}
      </ul>
    </section>
  )
}

export function FocusTabs() {
  const [tab, setTab] = useState<'growth' | 'coaching'>('growth')
  return (
    <>
      <div className="pp-seg" role="tablist">
        {(['growth', 'coaching'] as const).map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? 'is-active' : ''} onClick={() => setTab(t)}>
            {t === 'growth' ? 'Growth' : 'Coaching'}
          </button>
        ))}
      </div>
      {tab === 'growth' ? (<><Opportunities /><Plays /></>) : (
        <section className="card pp-card">
          <h3 className="pp-card__title">Coaching</h3>
          <p className="pp-muted pp-small">Coaching insights for your team will appear here — conversation prompts, at-risk members and follow-ups.</p>
        </section>
      )}
    </>
  )
}
