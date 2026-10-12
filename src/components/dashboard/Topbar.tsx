import { Search, Sparkles, HelpCircle, Bell, Eye, X } from 'lucide-react'
import { user } from './data'

export function ImpersonationBanner() {
  return (
    <div className="pp-imp">
      <Eye size={14} />
      <span>You are impersonating <b>{user.full}</b> with ID {user.id} — Rank <b>{user.rank}</b></span>
      <button className="pp-imp__clear" type="button"><X size={11} /> Clear</button>
    </div>
  )
}

export function Topbar() {
  return (
    <header className="pp-topbar">
      <label className="pp-search">
        <Search size={14} />
        <input placeholder="Search people, orders, signals…" aria-label="Search" />
        <kbd>⌘K</kbd>
      </label>
      <div className="pp-topbar__right">
        <span className="pp-sparkle"><Sparkles size={14} /></span>
        <button className="pp-iconbtn" aria-label="Help"><HelpCircle size={17} /></button>
        <button className="pp-iconbtn pp-bell" aria-label="Notifications"><Bell size={17} /><i /></button>
        <svg className="pp-flag" width="20" height="14" viewBox="0 0 20 14" aria-label="US">
          <rect width="20" height="14" fill="#fff" />
          {Array.from({ length: 7 }, (_, i) => <rect key={i} y={i * 2} width="20" height="1" fill="#B22234" />)}
          <rect width="9" height="7" fill="#3C3B6E" />
        </svg>
        <span className="pp-avatar">{user.initials}<i /></span>
      </div>
    </header>
  )
}
