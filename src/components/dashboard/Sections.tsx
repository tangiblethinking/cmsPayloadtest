import { Sparkles, ThumbsUp, ThumbsDown, Trophy, ArrowRight, Gem, Play, CalendarDays, MapPin, Tag, Rocket, BookOpen, Settings } from 'lucide-react'
import { briefing, contest, thisMonth, kickoff, hubPosts, upcomingEvent, courses, user } from './data'
import { Icon } from './Icon'

const fmt = (n: number) => n.toLocaleString('en-US')

export function Briefing() {
  return (
    <section className="card pp-card pp-briefing">
      <div className="pp-card__head">
        <h3 className="pp-card__title"><span className="pp-ico-sq"><Sparkles size={13} /></span>Good afternoon, {user.first}</h3>
        <span className="pp-muted pp-small">Briefing by <b>PleXi</b></span>
      </div>
      <p className="pp-body">{briefing.before}<a href="#" className="pp-link"><b>{briefing.name}</b></a>{briefing.after}</p>
      <div className="pp-feedback">
        <button className="btn btn--style-ghost btn--icon-only btn--size-small" aria-label="Helpful"><ThumbsUp size={14} /></button>
        <button className="btn btn--style-ghost btn--icon-only btn--size-small" aria-label="Not helpful"><ThumbsDown size={14} /></button>
      </div>
    </section>
  )
}

export function Contest() {
  return (
    <section className="card pp-card">
      <div className="pp-card__head">
        <div className="pp-row">
          <span className="pp-ico-circle"><Trophy size={16} /></span>
          <div><h3 className="pp-card__title">{contest.name}</h3><div className="pp-muted pp-small">{contest.dates}</div></div>
        </div>
        <div className="pp-row">
          <div className="pp-bignum">{fmt(contest.points)}<span>points</span></div>
          <span className="pill pill--style-success pp-pill-tier"><i className="pp-dot pp-dot--white" />{contest.tier}</span>
        </div>
      </div>
      <div className="pp-progress-labels pp-small"><span>{contest.tier}</span><span>Top tier reached</span></div>
      <div className="pp-bar"><span style={{ width: `${contest.progress}%` }} /></div>
      <div className="pp-tiles">
        {contest.tiles.map((t) => (
          <div key={t.label} className="pp-tile">
            <span className="pp-ico-circle pp-ico-circle--sm"><Icon name={t.icon} size={12} /></span>
            <div className="pp-tile__text"><div className="pp-micro pp-ellipsis" title={t.label}>{t.label}</div><b>{fmt(t.value)}</b></div>
          </div>
        ))}
      </div>
      <button className="btn btn--style-secondary btn--size-small pp-btn-outline">View contest details</button>
    </section>
  )
}

export function MonthAndRank() {
  return (
    <div className="pp-grid-2">
      <section className="card pp-card">
        <div className="pp-card__head"><h3 className="pp-card__title">This Month</h3><a href="#" className="pp-link pp-small">Pulse Check →</a></div>
        <div className="pp-stats">
          <div><div className="pp-micro">Team Points</div><b>{fmt(thisMonth.teamPoints)}</b></div>
          <div><div className="pp-micro">New Enrollments</div><b>{thisMonth.newEnrollments}</b></div>
          <div><div className="pp-micro">Sub Rate</div><b>{thisMonth.subRate}%</b></div>
        </div>
      </section>
      <a href="#" className="card card--has-onclick pp-card pp-rank">
        <span className="pp-ico-circle"><Gem size={15} /></span>
        <div style={{ flex: 1 }}><div className="pp-micro">Rank Progress</div><b>You&apos;ve reached the top rank — maintain {user.rank}</b></div>
        <ArrowRight size={16} />
      </a>
    </div>
  )
}

export function Kickoff() {
  return (
    <section className="pp-kickoff">
      <div className="pp-kickoff__main">
        <div className="pp-kickoff__eyebrow"><i className="pp-dot pp-dot--green" />{kickoff.eyebrow}</div>
        <h2>{kickoff.title}</h2>
        <p>{kickoff.body}</p>
        <div className="pp-chips">{kickoff.chips.map((c) => <span key={c} className="pill pill--style-dark pp-chip">{c}</span>)}</div>
      </div>
      <div className="pp-kickoff__side">
        <div className="pp-video">
          <span className="pp-play"><Play size={18} fill="currentColor" /></span>
          <span className="pp-video__title">{kickoff.video}</span><span className="pp-video__dur">{kickoff.duration}</span>
        </div>
        <div className="pp-kickoff__foot">
          <span>{kickoff.daysLeft} days left in period</span>
          <button className="btn btn--style-secondary btn--size-small pp-btn-white">Open Kickoff →</button>
        </div>
      </div>
    </section>
  )
}

export function BottomCards() {
  return (
    <div className="pp-grid-3">
      <section className="card pp-card">
        <div className="pp-card__head"><h3 className="pp-card__title">From the Hub</h3><a href="#" className="pp-link pp-small">View all →</a></div>
        <ul className="pp-list">
          {hubPosts.map((p) => (
            <li key={p.title}>
              <span className="pp-ico-circle pp-ico-circle--sm">{p.category === 'Specials' ? <Tag size={12} /> : <Rocket size={12} />}</span>
              <div><div className="pp-micro">{p.category} · {p.when}</div><a href="#" className="pp-strong-link">{p.title}</a></div>
            </li>
          ))}
        </ul>
      </section>
      <section className="card pp-card">
        <div className="pp-card__head"><h3 className="pp-card__title">Upcoming Events</h3></div>
        <div className="pp-event">
          <b>{upcomingEvent.title}</b>
          <div className="pp-muted pp-small"><CalendarDays size={12} /> {upcomingEvent.date}</div>
          <div className="pp-muted pp-small"><MapPin size={12} /> {upcomingEvent.place}</div>
        </div>
      </section>
      <section className="card pp-card">
        <div className="pp-card__head"><h3 className="pp-card__title">Continue Learning</h3></div>
        {courses.map((c) => {
          const pct = Math.round((c.done / c.total) * 100)
          return (
            <div key={c.title} className="pp-course">
              <div className="pp-row pp-between"><span className="pp-row"><BookOpen size={13} /><b>{c.title}</b></span><span className="pp-muted pp-small">{c.done}/{c.total} courses</span></div>
              <div className="pp-bar pp-bar--thin"><span style={{ width: `${pct}%` }} /></div>
            </div>
          )
        })}
      </section>
    </div>
  )
}

export function GearFab() {
  return <button className="pp-fab" aria-label="Settings"><Settings size={18} /></button>
}
