'use client'
/**
 * Live previews. Each preview renders the SAME DOM structure + BEM class names as the
 * Payload component source (payload-src/...), styled by Payload's real CSS (public/payload-ui.css).
 * They are lightweight re-implementations so they run without Payload's config/i18n/form providers.
 */
import React, { useEffect, useState } from 'react'

type Control =
  | { name: string; type: 'select'; options: string[]; default: string }
  | { name: string; type: 'bool'; default: boolean }
  | { name: string; type: 'text'; default: string }
type Values = Record<string, any>
type Preview = { controls?: Control[]; render: (v: Values) => React.ReactNode; note?: string }

const cx = (...c: any[]) => c.filter(Boolean).join(' ')

// --- icons (simplified copies of payload-src/icons)
const Chevron = ({ dir = 'down' }: { dir?: string }) => (
  <svg className={`icon icon--chevron`} width="24" height="24" viewBox="0 0 24 24" fill="none"
    style={{ transform: { down: 'none', up: 'rotate(180deg)', left: 'rotate(90deg)', right: 'rotate(-90deg)' }[dir] }}>
    <path className="stroke" d="M8 10l4 4 4-4" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)
const Plus = () => (<svg className="icon icon--plus" width="24" height="24" viewBox="0 0 24 24"><path className="stroke" d="M12 6v12M6 12h12" stroke="currentColor" strokeWidth="1.5" /></svg>)
const X = () => (<svg className="icon icon--x" width="24" height="24" viewBox="0 0 24 24"><path className="stroke" d="M7 7l10 10M17 7L7 17" stroke="currentColor" strokeWidth="1.5" /></svg>)
const SpinnerIcon = () => (
  <svg className="icon icon--spinner" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity=".2" strokeWidth="2" />
    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur=".8s" repeatCount="indefinite" />
    </path>
  </svg>
)
const icons: Record<string, React.ReactNode> = { none: null, plus: <Plus />, chevron: <Chevron />, x: <X /> }

const Button = ({ buttonStyle = 'primary', size = 'medium', icon, children, disabled, round, loading, onClick }: any) => (
  <button type="button" onClick={onClick} disabled={disabled || loading} aria-disabled={!!(disabled || loading)}
    className={cx('btn', icon && 'btn--icon', icon && !children && 'btn--icon-only', `btn--size-${size}`, icon && 'btn--icon-position-right',
      'btn--withoutPopup', loading && 'btn--loading', `btn--style-${buttonStyle}`, (disabled || loading) && 'btn--disabled', round && 'btn--round')}>
    {loading && <span className="btn__loading"><SpinnerIcon /></span>}
    <span className="btn__content">
      {children && <span className="btn__label">{children}</span>}
      {icon && <span className="btn__icon">{icon}</span>}
    </span>
  </button>
)

const FieldLabel = ({ label, required, localized, htmlFor }: any) => (
  <label className="field-label" htmlFor={htmlFor}>
    {label}{required && <span className="required">*</span>}{localized && <span className="localized"> — EN</span>}
  </label>
)
const TooltipBox = ({ children, position = 'top', caret = 'center', className, style }: any) => (
  <aside className={cx('tooltip', className, 'tooltip--show', `tooltip--caret-${caret}`, `tooltip--position-${position}`)} role="tooltip" style={style}>
    <svg aria-hidden="true" className="tooltip__caret" height="14" viewBox="0 0 14 14" width="15">
      <path className="tooltip__caret-stroke" d="M0,0 H14 L7.875,6.125 Q7,7 6.125,6.125 Z" />
      <path className="tooltip__caret-fill" d="M0,0 H14 L7.875,6.125 Q7,7 6.125,6.125 Z" />
    </svg>
    <div className="tooltip-content">{children}</div>
  </aside>
)
const FieldError = ({ message }: any) => (
  <div style={{ position: 'relative' }}><TooltipBox className="field-error" style={{ position: 'absolute', bottom: '100%', right: 0 }}>{message}</TooltipBox></div>
)
const FieldDescription = ({ children }: any) => <div className="field-description">{children}</div>

const InputField = ({ type, kind, label, placeholder, required, error, readOnly, description, size }: any) => {
  const id = `field-${kind}`
  return (
    <div className={cx('field-type', kind, error && 'error', readOnly && 'read-only')} data-size={size} style={{ maxWidth: 420 }}>
      <FieldLabel htmlFor={id} label={label} required={required} />
      <div className="field-type__wrap">
        {error && <FieldError message="This field is required." />}
        {kind === 'textarea' ? (
          <label className="textarea-outer" htmlFor={id}><div className="textarea-inner"><div className="textarea-clone" />
            <textarea className="form-input" id={id} placeholder={placeholder} readOnly={readOnly} rows={4} /></div></label>
        ) : (
          <input className="form-input" id={id} type={type} placeholder={placeholder} readOnly={readOnly} />
        )}
      </div>
      {description && <FieldDescription>{description}</FieldDescription>}
    </div>
  )
}
const fieldControls: Control[] = [
  { name: 'label', type: 'text', default: 'Title' },
  { name: 'placeholder', type: 'text', default: 'Enter a value…' },
  { name: 'required', type: 'bool', default: true },
  { name: 'error', type: 'bool', default: false },
  { name: 'readOnly', type: 'bool', default: false },
  { name: 'description', type: 'text', default: 'Helpful description text' },
]

const Checkbox = ({ label, checked: c0, readOnly, indeterminate }: any) => {
  const [checked, set] = useState(c0)
  useEffect(() => set(c0), [c0])
  return (
    <div className="field-type checkbox">
      <div className={cx('checkbox-input', checked && 'checkbox-input--checked', indeterminate && 'checkbox-input--indeterminate', readOnly && 'checkbox-input--read-only')}>
        <div className="checkbox-input__wrap">
          <div className="checkbox-input__input">
            <input className="checkbox-input__control" id="cb" type="checkbox" checked={!!checked} disabled={readOnly} onChange={() => set(!checked)}
              ref={(el) => { if (el) el.indeterminate = !!indeterminate }} />
            <span className="checkbox-input__visuals">
              <svg className="checkbox-input__mixed checkbox-input__mark" viewBox="0 0 16 16" width="16" height="16"><path d="M4 8h8" stroke="currentColor" strokeWidth="2" /></svg>
              <svg className="checkbox-input__check checkbox-input__mark" viewBox="0 0 16 16" width="16" height="16"><path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
            </span>
          </div>
          <FieldLabel htmlFor="cb" label={label} />
        </div>
      </div>
    </div>
  )
}

const Radio = ({ layout, readOnly }: any) => {
  const [v, set] = useState('draft')
  const opts = [['draft', 'Draft'], ['published', 'Published'], ['archived', 'Archived']]
  return (
    <div className={cx('field-type', 'radio-group', `radio-group--layout-${layout}`, readOnly && 'radio-group--read-only')}>
      <FieldLabel label="Status" required />
      <div className="field-type__wrap">
        <ul className="radio-group--group">
          {opts.map(([value, label]) => (
            <li key={value}><label htmlFor={`r-${value}`}>
              <div className={cx('radio-input', v === value && 'radio-input--is-selected')}>
                <input id={`r-${value}`} type="radio" name="status" checked={v === value} disabled={readOnly} onChange={() => set(value)} />
                <span className={cx('radio-input__styled-radio', readOnly && 'radio-input__styled-radio--disabled')} />
                <span className="radio-input__label">{label}</span>
              </div>
            </label></li>
          ))}
        </ul>
      </div>
    </div>
  )
}

const Collapsible = ({ label, style: s, startCollapsed }: any) => {
  const [collapsed, set] = useState(startCollapsed)
  useEffect(() => set(startCollapsed), [startCollapsed])
  return (
    <div className={cx('collapsible', collapsed && 'collapsible--collapsed', `collapsible--style-${s}`)} style={{ maxWidth: 560 }}>
      <div className="collapsible__toggle-wrap">
        <button type="button" aria-expanded={!collapsed} className={cx('collapsible__toggle', `collapsible__toggle--${collapsed ? 'collapsed' : 'open'}`)} onClick={() => set(!collapsed)}>
          <span>Toggle block</span>
        </button>
        <div className="collapsible__header-wrap"><span className="row-label">{label}</span></div>
        <div className="collapsible__actions-wrap"><div className="collapsible__actions">
          <span className="collapsible__indicator"><Chevron dir={collapsed ? 'down' : 'up'} /></span>
        </div></div>
      </div>
      {!collapsed && <div className="collapsible__content"><InputField kind="text" type="text" label="Nested field" placeholder="Inside a collapsible" /></div>}
    </div>
  )
}

const rows = [
  { id: '64f1', title: 'Hello world', status: 'Published', updated: 'Oct 10, 2026' },
  { id: '64f2', title: 'Rebranding Payload', status: 'Draft', updated: 'Oct 11, 2026' },
  { id: '64f3', title: 'Custom components', status: 'Draft', updated: 'Oct 12, 2026' },
]

const PopupDemo = ({ size }: any) => {
  const [open, set] = useState(true)
  return (
    <div className="popup" style={{ position: 'relative', minHeight: 200 }}>
      <div className="popup__trigger-wrap"><Button buttonStyle="secondary" icon={<Chevron />} >{open ? 'Close menu' : 'Open menu'}</Button></div>
      <span onClick={() => set(!open)} style={{ position: 'absolute', inset: '0 auto auto 0', width: 140, height: 40, cursor: 'pointer' }} />
      {open && (
        <div className={cx('popup__content', `popup--size-${size}`, 'popup--v-bottom')} role="menu" style={{ position: 'absolute', top: 44, left: 0, display: 'block', opacity: 1, visibility: 'visible' }}>
          <div className="popup__scroll-container">
            <div className="popup-button-list">
              {['Edit', 'Duplicate', 'Unpublish', 'Delete'].map((l) => (
                <button key={l} type="button" className="popup-button-list__button" role="menuitem">{l}</button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const DrawerDemo = ({ title }: any) => {
  const [open, set] = useState(false)
  return (
    <>
      <Button onClick={() => set(true)}>Open drawer</Button>
      {open && (
        <div className="drawer drawer--is-open" role="dialog" style={{ position: 'fixed', inset: 0, zIndex: 9000, display: 'flex' }}>
          <div className="drawer__blur-bg" />
          <button className="drawer__close" aria-label="Close" onClick={() => set(false)} type="button" />
          <div className="drawer__content">
            <div className="drawer__content-children">
              <div className="drawer__header">
                <Button buttonStyle="ghost" icon={<Chevron dir="left" />} onClick={() => set(false)} />
                <h2 className="drawer__header__title">{title}</h2>
              </div>
              <div style={{ padding: 'var(--spacer-3, 24px)' }}>
                <InputField kind="text" type="text" label="Title" placeholder="Document title" required />
                <p style={{ marginTop: 16 }}>Click the backdrop or the chevron to close.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export const previews: Record<string, Preview> = {
  'elements/Button': {
    controls: [
      { name: 'buttonStyle', type: 'select', options: ['primary', 'primary-ghost', 'secondary', 'tertiary', 'ghost', 'pill', 'subtle', 'error', 'none'], default: 'primary' },
      { name: 'size', type: 'select', options: ['xsmall', 'small', 'medium', 'large'], default: 'medium' },
      { name: 'icon', type: 'select', options: ['none', 'plus', 'chevron', 'x'], default: 'none' },
      { name: 'label', type: 'text', default: 'Save changes' },
      { name: 'disabled', type: 'bool', default: false },
      { name: 'loading', type: 'bool', default: false },
      { name: 'round', type: 'bool', default: false },
    ],
    render: (v) => (
      <div className="cat-stage-row">
        <Button {...v} icon={icons[v.icon]}>{v.label}</Button>
        <span className="cat-muted">All styles →</span>
        {['primary', 'secondary', 'tertiary', 'ghost', 'subtle', 'error'].map((s) => <Button key={s} buttonStyle={s} size={v.size}>{s}</Button>)}
      </div>
    ),
  },
  'elements/Pill': {
    controls: [
      { name: 'pillStyle', type: 'select', options: ['light', 'light-gray', 'dark', 'always-white', 'success', 'warning', 'error'], default: 'light' },
      { name: 'size', type: 'select', options: ['small', 'medium'], default: 'medium' },
      { name: 'rounded', type: 'bool', default: false },
      { name: 'withIcon', type: 'bool', default: false },
      { name: 'label', type: 'text', default: 'Published' },
    ],
    render: (v) => (
      <div className="cat-stage-row">
        <div className={cx('pill', `pill--style-${v.pillStyle}`, `pill--size-${v.size}`, v.rounded && 'pill--rounded', v.withIcon && 'pill--has-icon')}>
          <span className="pill__label">{v.label}</span>{v.withIcon && <span className="pill__icon"><X /></span>}
        </div>
        {['light', 'dark', 'success', 'warning', 'error'].map((s) => <div key={s} className={cx('pill', `pill--style-${s}`, `pill--size-${v.size}`)}><span className="pill__label">{s}</span></div>)}
      </div>
    ),
  },
  'elements/Banner': {
    controls: [
      { name: 'type', type: 'select', options: ['default', 'brand', 'success', 'warning', 'danger'], default: 'success' },
      { name: 'text', type: 'text', default: 'Document saved successfully.' },
      { name: 'icon', type: 'bool', default: true },
    ],
    render: (v) => (
      <div className={cx('banner', `banner--type-${v.type}`, v.icon && 'banner--align-icon-left')}>
        {v.icon && <span className="banner__icon"><Plus /></span>}<span className="banner__content">{v.text}</span>
      </div>
    ),
  },
  'elements/Card': {
    controls: [{ name: 'title', type: 'text', default: 'Posts' }, { name: 'actions', type: 'bool', default: true }],
    render: (v) => (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 220px)', gap: 16 }}>
        {[v.title, 'Media', 'Users'].map((t) => (
          <div key={t} className="card card--has-onclick">
            <h3 className="card__title">{t}</h3>
            {v.actions && <div className="card__actions"><Button buttonStyle="secondary" size="small" round icon={<Plus />} /></div>}
          </div>
        ))}
      </div>
    ),
  },
  'elements/Collapsible': {
    controls: [
      { name: 'label', type: 'text', default: 'SEO settings' },
      { name: 'style', type: 'select', options: ['default', 'error'], default: 'default' },
      { name: 'startCollapsed', type: 'bool', default: false },
    ],
    render: (v) => <Collapsible {...v} />,
  },
  'fields/Collapsible': { render: () => <Collapsible label="Collapsible field" style="default" startCollapsed={false} /> },
  'elements/Tooltip': {
    controls: [
      { name: 'position', type: 'select', options: ['top', 'bottom', 'left', 'right'], default: 'top' },
      { name: 'caret', type: 'select', options: ['center', 'left', 'right'], default: 'center' },
      { name: 'text', type: 'text', default: 'Helpful tooltip' },
    ],
    render: (v) => (
      <div style={{ position: 'relative', padding: 60, display: 'inline-block' }}>
        <Button buttonStyle="secondary">Hover target</Button>
        <TooltipBox position={v.position} caret={v.caret} style={{ position: 'absolute', ...{ top: { bottom: '100%', left: '35%' }, bottom: { top: '100%', left: '35%' }, left: { right: '85%', top: 60 }, right: { left: '85%', top: 60 } }[v.position] }}>{v.text}</TooltipBox>
      </div>
    ),
  },
  'elements/Spinner': {
    controls: [{ name: 'size', type: 'select', options: ['sm', 'md', 'lg'], default: 'md' }, { name: 'text', type: 'text', default: 'Loading...' }],
    render: (v) => <div className={cx('spinner', `spinner--${v.size}`)}><SpinnerIcon /><span className="spinner__text">{v.text}</span></div>,
  },
  'elements/Loading': {
    controls: [{ name: 'show', type: 'bool', default: true }],
    render: (v) => (
      <div style={{ position: 'relative', height: 200, overflow: 'hidden', border: '1px dashed #999' }}>
        <p style={{ padding: 16 }}>Content behind the overlay</p>
        {v.show && <div className="loading-overlay loading-overlay--entering loading-overlay--withoutNav" style={{ position: 'absolute' }}>
          <div className="spinner spinner--lg"><SpinnerIcon /><span className="spinner__text">Loading...</span></div></div>}
      </div>
    ),
  },
  'elements/ShimmerEffect': {
    controls: [{ name: 'height', type: 'text', default: '60px' }],
    render: (v) => <div style={{ display: 'grid', gap: 8, maxWidth: 480 }}>{[1, 2, 3].map((i) => <div key={i} className="shimmer-effect" style={{ height: v.height, width: '100%' }}><div className="shimmer-effect__shine" /></div>)}</div>,
  },
  'elements/Gutter': {
    controls: [{ name: 'left', type: 'bool', default: true }, { name: 'right', type: 'bool', default: true }],
    render: (v) => <div style={{ background: 'var(--color-bg-secondary)' }}><div className={cx('gutter', v.left && 'gutter--left', v.right && 'gutter--right')} style={{ background: 'var(--color-bg-brand-tertiary)' }}>Content inside the admin gutter (horizontal page padding)</div></div>,
  },
  'elements/Table': {
    controls: [{ name: 'appearance', type: 'select', options: ['default', 'condensed'], default: 'default' }],
    render: (v) => (
      <div className={cx('table', v.appearance === 'condensed' && 'table--appearance-condensed')}>
        <table cellPadding={0} cellSpacing={0}>
          <thead><tr>{['ID', 'Title', 'Status', 'Updated'].map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead>
          <tbody>{rows.map((r, i) => (
            <tr key={r.id} className={`row-${i + 1}`}>
              <td className="cell-id">{r.id}</td><td className="cell-title"><a className="cell-link" href="#">{r.title}</a></td>
              <td className="cell-status"><div className={cx('pill', 'pill--size-small', r.status === 'Published' ? 'pill--style-success' : 'pill--style-light')}><span className="pill__label">{r.status}</span></div></td>
              <td className="cell-updated">{r.updated}</td>
            </tr>))}</tbody>
        </table>
      </div>
    ),
  },
  'elements/Popup': { controls: [{ name: 'size', type: 'select', options: ['small', 'medium', 'large', 'fit-content'], default: 'medium' }], render: (v) => <PopupDemo {...v} /> },
  'elements/Drawer': { controls: [{ name: 'title', type: 'text', default: 'Edit document' }], render: (v) => <DrawerDemo {...v} /> },
  'elements/Pagination': {
    render: () => {
      const P = () => {
        const [p, set] = useState(2)
        return (
          <div className="paginator">
            <button className={cx('clickable-arrow', 'clickable-arrow--left', p <= 1 && 'clickable-arrow--is-disabled')} onClick={() => set(Math.max(1, p - 1))} type="button"><Chevron dir="left" /></button>
            <div className="paginator__page-input-wrapper">
              <input className="paginator__page-input" value={p} onChange={(e) => set(Number(e.target.value) || 1)} />
              <span className="paginator__page-total">of 10</span>
            </div>
            <button className={cx('clickable-arrow', 'clickable-arrow--right', p >= 10 && 'clickable-arrow--is-disabled')} onClick={() => set(Math.min(10, p + 1))} type="button"><Chevron dir="right" /></button>
          </div>
        )
      }
      return <P />
    },
  },
  'fields/Text': { controls: fieldControls, render: (v) => <InputField kind="text" type="text" {...v} /> },
  'fields/Textarea': { controls: fieldControls, render: (v) => <InputField kind="textarea" {...v} /> },
  'fields/Number': { controls: fieldControls, render: (v) => <InputField kind="number" type="number" {...v} label={v.label === 'Title' ? 'Price' : v.label} /> },
  'fields/Email': { controls: fieldControls, render: (v) => <InputField kind="email" type="email" {...v} label="Email" /> },
  'fields/Password': { controls: fieldControls, render: (v) => <InputField kind="password" type="password" {...v} label="Password" /> },
  'fields/DateTime': {
    note: 'Payload uses react-datepicker for the calendar popup; this preview uses the native date input inside Payload field markup.',
    controls: fieldControls, render: (v) => <InputField kind="date-time-field" type="date" {...v} label="Publish date" />,
  },
  'fields/Code': {
    note: 'The real Code/JSON fields embed the Monaco editor; shown here as field chrome with a monospace textarea.',
    render: () => <div className="field-type code" style={{ maxWidth: 520 }}><FieldLabel label="Custom code" /><div className="field-type__wrap"><textarea className="form-input" rows={6} style={{ fontFamily: 'var(--font-mono)' }} defaultValue={'export const hello = () => "world"'} /></div></div>,
  },
  'fields/JSON': {
    note: 'The real JSON field embeds the Monaco editor; shown here as field chrome with a monospace textarea.',
    render: () => <div className="field-type json-field" style={{ maxWidth: 520 }}><FieldLabel label="Metadata" /><div className="field-type__wrap"><textarea className="form-input" rows={6} style={{ fontFamily: 'var(--font-mono)' }} defaultValue={'{\n  "featured": true\n}'} /></div></div>,
  },
  'fields/Select': {
    note: 'Payload renders selects with react-select (elements/ReactSelect). This preview shows the field wrapper with a native select.',
    controls: fieldControls.slice(0, 1).concat(fieldControls.slice(2)),
    render: (v) => (
      <div className={cx('field-type', 'select', v.error && 'error')} style={{ maxWidth: 420 }}>
        <FieldLabel label={v.label === 'Title' ? 'Category' : v.label} required={v.required} />
        <div className="field-type__wrap">
          {v.error && <FieldError message="Please select an option." />}
          <select className="form-input" disabled={v.readOnly}><option>News</option><option>Product</option><option>Engineering</option></select>
        </div>
        {v.description && <FieldDescription>{v.description}</FieldDescription>}
      </div>
    ),
  },
  'fields/Checkbox': {
    controls: [{ name: 'label', type: 'text', default: 'Featured post' }, { name: 'checked', type: 'bool', default: true }, { name: 'indeterminate', type: 'bool', default: false }, { name: 'readOnly', type: 'bool', default: false }],
    render: (v) => <Checkbox {...v} />,
  },
  'fields/RadioGroup': {
    controls: [{ name: 'layout', type: 'select', options: ['horizontal', 'vertical'], default: 'horizontal' }, { name: 'readOnly', type: 'bool', default: false }],
    render: (v) => <Radio {...v} />,
  },
  'fields/FieldLabel': {
    controls: [{ name: 'label', type: 'text', default: 'Title' }, { name: 'required', type: 'bool', default: true }, { name: 'localized', type: 'bool', default: false }],
    render: (v) => <FieldLabel {...v} />,
  },
  'fields/FieldError': { controls: [{ name: 'message', type: 'text', default: 'This field is required.' }], render: (v) => <div style={{ paddingTop: 50, maxWidth: 420 }}><InputField kind="text" type="text" label="Title" error /></div> },
  'fields/FieldDescription': { controls: [{ name: 'text', type: 'text', default: 'Shown under the field to explain it.' }], render: (v) => <FieldDescription>{v.text}</FieldDescription> },
  'fields/Row': {
    render: () => <div className="field-type row" style={{ display: 'flex', gap: 'var(--spacer-3, 24px)' }}><div style={{ flex: 1 }}><InputField kind="text" type="text" label="First name" /></div><div style={{ flex: 1 }}><InputField kind="text" type="text" label="Last name" /></div></div>,
  },
}

export function LivePreview({ id }: { id: string }) {
  const p = previews[id]
  const init = Object.fromEntries((p?.controls || []).map((c) => [c.name, c.default]))
  const [v, setV] = useState<Values>(init)
  if (!p) return null
  return (
    <section className="cat-panel">
      <header><span>Live preview</span><span className="cat-muted" style={{ fontWeight: 400 }}>styled by Payload’s real CSS</span></header>
      <div className="cat-stage">{p.render(v)}</div>
      {p.controls?.length ? (
        <div className="cat-controls">
          {p.controls.map((c) => (
            <label key={c.name}>
              {c.name}
              {c.type === 'select' && <select value={v[c.name]} onChange={(e) => setV({ ...v, [c.name]: e.target.value })}>{c.options.map((o) => <option key={o}>{o}</option>)}</select>}
              {c.type === 'bool' && <input type="checkbox" checked={!!v[c.name]} onChange={(e) => setV({ ...v, [c.name]: e.target.checked })} />}
              {c.type === 'text' && <input type="text" value={v[c.name]} onChange={(e) => setV({ ...v, [c.name]: e.target.value })} />}
            </label>
          ))}
        </div>
      ) : null}
      {p.note && <div className="cat-note" style={{ margin: 12 }}>{p.note}</div>}
    </section>
  )
}

// ===================== Expanded previews =====================
type Auto = { base: string; elements: string[]; modifiers: string[] } | null
const human = (s: string) => s.replace(/[-_]+/g, ' ').replace(/^\w/, (c) => c.toUpperCase())

/** Generic stand-in: builds the component's BEM structure straight from its own CSS classes. */
export function AutoPreview({ name, auto }: { name: string; auto: Auto[] }) {
  const a = auto.find(Boolean)!
  const [mod, setMod] = useState('none')
  return (
    <section className="cat-panel">
      <header><span>Stand-in preview</span><span className="cat-muted" style={{ fontWeight: 400 }}>built from <code>.{a.base}</code> classes in Payload’s CSS</span></header>
      <div className="cat-stage">
        <div className={cx(a.base, mod !== 'none' && `${a.base}--${mod}`)} style={{ maxWidth: 720 }}>
          {a.elements.length ? a.elements.map((el) => (
            <div key={el} className={`${a.base}__${el}`} style={{ minHeight: 8 }}>
              {/(title|label|header|heading|name|value|text|description)/.test(el) ? <span>{human(el)}</span>
                : /(button|action|add|remove|toggle|close|trigger)/.test(el) ? <Button buttonStyle="secondary" size="small">{human(el)}</Button>
                : /(input|search)/.test(el) ? <input className="form-input" placeholder={human(el)} />
                : <span className="cat-muted" style={{ fontSize: 12 }}>{human(el)}</span>}
            </div>
          )) : <span>{name}</span>}
        </div>
      </div>
      {a.modifiers.length > 0 && (
        <div className="cat-controls"><label>variant (--modifier)
          <select value={mod} onChange={(e) => setMod(e.target.value)}><option>none</option>{a.modifiers.map((m) => <option key={m}>{m}</option>)}</select></label></div>
      )}
      <div className="cat-note" style={{ margin: 12 }}>This is an approximate stand-in: Payload’s real styles applied to the component’s class structure, with placeholder content. The real component fills it with live CMS data.</div>
    </section>
  )
}

const Dialog = ({ title, body, actions, size = 'small' }: any) => (
  <div className={cx('dialog', `dialog--${size}`)} role="dialog" style={{ position: 'relative', margin: '0 auto', background: 'var(--color-bg-elevated)', boxShadow: 'var(--elevation-3, 0 8px 30px rgba(0,0,0,.15))', borderRadius: 'var(--radius-large, 12px)', maxWidth: 480 }}>
    <div className="dialog__header"><h2 className="dialog__title">{title}</h2></div>
    <div className="dialog__body">{body}</div>
    <div className="dialog__footer" style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>{actions}</div>
  </div>
)
const confirm = (title: string, body: string, ok: string, danger = false): Preview => ({
  render: () => <Dialog title={title} body={body} actions={<><Button buttonStyle="secondary">Cancel</Button><Button buttonStyle={danger ? 'error' : 'primary'}>{ok}</Button></>} />,
})
const btn = (label: string, style = 'primary', icon?: React.ReactNode, extra?: string): Preview => ({
  controls: [{ name: 'disabled', type: 'bool', default: false }, { name: 'loading', type: 'bool', default: false }],
  render: (v) => <div className="cat-stage-row"><Button buttonStyle={style} icon={icon} {...v}>{label}</Button>{extra && <span className="cat-muted">{extra}</span>}</div>,
})

const SwitchDemo = ({ disabled, label }: any) => {
  const [on, set] = useState(true)
  return (
    <label className={cx('switch', disabled && 'switch--disabled')}>
      <input className="switch__input" type="checkbox" role="switch" checked={on} disabled={disabled} onChange={() => set(!on)} />
      <span className={cx('switch__track', on && 'switch__track--checked')}><span className="switch__knob" /></span>
      <span className="switch__label">{label}</span>
    </label>
  )
}
const Segmented = ({ options }: { options: string[] }) => {
  const [v, set] = useState(options[0])
  return (
    <div className="segmented-control" role="radiogroup"><div className="segmented-control__options">
      {options.map((o) => (
        <label key={o} className="segmented-control__option" data-checked={v === o || undefined}>
          <input className="segmented-control__input" type="radio" checked={v === o} onChange={() => set(o)} />{o}
        </label>
      ))}
    </div></div>
  )
}
const TabsDemo = ({ tabs }: { tabs: string[] }) => {
  const [a, set] = useState(0)
  return (
    <div className="tabs-field"><div className="tabs__tabs-wrap"><div className="tabs__tabs">
      {tabs.map((t, i) => <button key={t} type="button" className={cx('tabs__tab-button', i === a && 'tabs__tab-button--active')} onClick={() => set(i)}>{t}</button>)}
    </div></div><div style={{ padding: '16px 0' }}>Content of “{tabs[a]}”</div></div>
  )
}
const Chip = ({ variant, size, label, removable }: any) => (
  <span className={cx('chip', `chip--variant-${variant}`, `chip--size-${size}`)}>
    <span className="chip__label">{label}</span>{removable && <button type="button" className="chip__remove" aria-label="Remove"><X /></button>}
  </span>
)

Object.assign(previews, {
  'elements/Switch': { controls: [{ name: 'label', type: 'text', default: 'Enable drafts' }, { name: 'disabled', type: 'bool', default: false }], render: (v: Values) => <SwitchDemo {...v} /> },
  'elements/SegmentedControl': { render: () => <Segmented options={['Day', 'Week', 'Month']} /> },
  'elements/LayoutToggle': { render: () => <Segmented options={['List', 'Grid']} /> },
  'elements/Tabs': { render: () => <TabsDemo tabs={['Content', 'SEO', 'Settings']} /> },
  'fields/Tabs': { render: () => <TabsDemo tabs={['Hero', 'Content', 'Meta']} /> },
  'elements/Chip': {
    controls: [{ name: 'variant', type: 'select', options: ['default', 'success', 'warning', 'danger'], default: 'default' }, { name: 'size', type: 'select', options: ['medium', 'large'], default: 'medium' }, { name: 'label', type: 'text', default: 'Tag' }, { name: 'removable', type: 'bool', default: true }],
    render: (v: Values) => <div className="cat-stage-row"><Chip {...v} />{['success', 'warning', 'danger'].map((s) => <Chip key={s} variant={s} size={v.size} label={s} />)}</div>,
  },
  'elements/ErrorPill': { controls: [{ name: 'count', type: 'text', default: '3' }], render: (v: Values) => <span className="error-pill">{v.count}</span> },
  'elements/IDLabel': { controls: [{ name: 'id', type: 'text', default: '64f1a2b3c4' }], render: (v: Values) => <div className="id-label"><span className="id-label__prefix">ID:&nbsp;</span><span className="id-label__value">{v.id}</span></div> },
  'elements/Status': { render: () => <div className="status"><div className="status__value-wrap"><span className="status__label">Status: </span><span className="status__value">Published</span></div></div> },
  'elements/NoListResults': {
    render: () => <div className="no-results"><h3 className="no-results__title">No Posts found</h3><p className="no-results__description">Either no Posts exist yet or none match your filters.</p><div className="no-results__actions"><Button>Create new Post</Button></div></div>,
  },
  'elements/Dialog': { controls: [{ name: 'size', type: 'select', options: ['small', 'medium', 'large'], default: 'small' }, { name: 'title', type: 'text', default: 'Dialog title' }], render: (v: Values) => <Dialog {...v} body="Dialog body content." actions={<><Button buttonStyle="secondary">Cancel</Button><Button>Confirm</Button></>} /> },
  'elements/ConfirmationModal': confirm('Are you sure?', 'This action needs your confirmation.', 'Confirm'),
  'elements/Modal': confirm('Modal', 'Generic modal container used by all dialogs.', 'OK'),
  'elements/FullscreenModal': confirm('Fullscreen modal', 'Covers the whole screen in the real admin.', 'Close'),
  'elements/LeaveWithoutSaving': confirm('Leave without saving', 'Your changes have not been saved. If you leave now, you will lose your changes.', 'Leave anyway', true),
  'elements/StayLoggedIn': confirm('Stay logged in', 'You haven’t been active in a little while and will shortly be automatically logged out.', 'Stay logged in'),
  'elements/DocumentTakeOver': confirm('Document locked', 'Another user is editing this document. Take over editing?', 'Take over'),
  'elements/DocumentStaleData': confirm('Document modified', 'This document was modified by someone else. Reload to see the latest version.', 'Reload'),
  'elements/GenerateConfirmation': confirm('Generate new API key?', 'Generating a new API key will invalidate the previous key.', 'Generate', true),
  'elements/DeleteDocument': { ...confirm('Delete Post', 'You are about to delete the Post “Hello world”. Are you sure?', 'Delete', true) },
  'elements/DeleteMany': confirm('Delete 3 Posts', 'You are about to delete 3 Posts. Are you sure?', 'Delete', true),
  'elements/PublishMany': confirm('Publish 3 Posts', 'You are about to publish 3 Posts. Are you sure?', 'Publish'),
  'elements/UnpublishMany': confirm('Unpublish 3 Posts', 'You are about to unpublish 3 Posts. Are you sure?', 'Unpublish'),
  'elements/RestoreMany': confirm('Restore 3 Posts', 'Restore these Posts from trash?', 'Restore'),
  'elements/SaveButton': btn('Save'),
  'elements/SaveDraftButton': btn('Save draft', 'secondary'),
  'elements/PublishButton': btn('Publish changes'),
  'elements/UnpublishButton': btn('Unpublish', 'secondary'),
  'elements/SchedulePublishButton': btn('Schedule publish', 'secondary'),
  'elements/RestoreButton': btn('Restore', 'secondary'),
  'elements/PermanentlyDeleteButton': btn('Delete permanently', 'error'),
  'elements/PreviewButton': btn('Preview', 'secondary'),
  'elements/CreateDocumentButton': btn('Create new', 'primary', <Plus />),
  'elements/CollapseAllToggle': btn('Collapse all', 'ghost'),
  'elements/ListColumnSelectionButton': btn('Columns', 'secondary', <Chevron />),
  'elements/ListGroupByButton': btn('Group by', 'secondary', <Chevron />),
  'elements/SelectMany': btn('Select 3', 'secondary'),
  'elements/Logout': btn('Log out', 'ghost'),
  'elements/LLMInstructionsMenuItem': btn('Copy instructions for AI', 'ghost'),
  'elements/CloseModalButton': { render: () => <Button buttonStyle="ghost" icon={<X />} /> },
  'elements/DelayedSpinner': { note: 'Shows a spinner only if loading takes longer than a short delay.', render: () => <div className="spinner spinner--md"><SpinnerIcon /><span className="spinner__text">Loading...</span></div> },
  'elements/LoadingOverlay': { render: () => <div style={{ position: 'relative', height: 160 }}><div className="loading-overlay loading-overlay--entering" style={{ position: 'absolute' }}><div className="spinner spinner--lg"><SpinnerIcon /><span className="spinner__text">Loading...</span></div></div></div> },
  'elements/Logo': { note: 'Renders the Payload logo, or your own logo if configured in admin.components.graphics.Logo.', render: () => <svg width="160" height="40" viewBox="0 0 160 40"><rect x="2" y="4" width="32" height="32" rx="6" fill="currentColor" /><text x="44" y="28" fontSize="22" fontWeight="700" fill="currentColor">Payload</text></svg> },
  'elements/MenuSeparator': { render: () => <div style={{ width: 240 }}><div>Item above</div><hr className="menu-separator" /><div>Item below</div></div> },
  'elements/ViewDescription': { render: () => <div className="custom-view-description">A short description shown under a collection’s title.</div> },
  'elements/Link': { render: () => <a href="#" onClick={(e) => e.preventDefault()}>A Payload-aware Next.js link</a> },
  'elements/ListDrawer': { note: 'Opens a drawer listing documents to pick from (see Drawer).', render: () => <DrawerDemo title="Select a Post" /> },
  'elements/HierarchyTypeField': { render: (v: Values) => <div className="field-type select" style={{ maxWidth: 420 }}><FieldLabel label="Type" /><div className="field-type__wrap"><select className="form-input"><option>Folder</option><option>Document</option></select></div></div> },
  'fields/RichText': { note: 'The real rich text editor comes from @payloadcms/richtext-lexical; this is only the field frame.', render: () => <div className="field-type rich-text" style={{ maxWidth: 560 }}><FieldLabel label="Content" /><div className="field-type__wrap"><div className="form-input" contentEditable suppressContentEditableWarning style={{ minHeight: 120, padding: 12 }}><b>Rich text</b> placeholder — type here…</div></div></div> },
  'fields/ConfirmPassword': { controls: fieldControls, render: (v: Values) => <InputField kind="confirm-password" type="password" {...v} label="Confirm password" /> },
  'fields/Slug': { controls: fieldControls, render: (v: Values) => <InputField kind="slug-field" type="text" {...v} label="Slug" placeholder="hello-world" /> },
  'fields/Point': { render: () => <div className="field-type point" style={{ display: 'flex', gap: 16, maxWidth: 520 }}><div style={{ flex: 1 }}><InputField kind="number" type="number" label="Longitude" /></div><div style={{ flex: 1 }}><InputField kind="number" type="number" label="Latitude" /></div></div> },
} as Record<string, Preview>)

const NavDemo = () => {
  const [sel, set] = useState('Posts')
  const groups: [string, string[]][] = [['Collections', ['Posts', 'Pages', 'Media', 'Users']], ['Globals', ['Header', 'Footer']]]
  return (
    <aside className="nav" style={{ position: 'relative', height: 360, width: 260, transform: 'none', visibility: 'visible', opacity: 1 }}>
      <div className="nav__scroll"><nav className="nav__wrap">
        {groups.map(([g, links]) => (
          <div key={g} className="nav-group">
            <div className="nav__label" style={{ padding: '12px 8px 4px', fontSize: 12, opacity: .6 }}>{g}</div>
            {links.map((l) => <a key={l} href="#" onClick={(e) => { e.preventDefault(); set(l) }} className={cx('nav__link', sel === l && 'nav__link--selected')} style={{ display: 'block' }}>{l}</a>)}
          </div>
        ))}
        <div className="nav__controls"><a className="nav__log-out" href="#">Log out</a></div>
      </nav></div>
    </aside>
  )
}
const ArrayDemo = ({ label, kind }: any) => {
  const [rows, setRows] = useState(['Row 01', 'Row 02'])
  return (
    <div className={cx('field-type', kind)} style={{ maxWidth: 640 }}>
      <div className={`${kind}__header`}><div className={`${kind}__header-wrap`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 className={`${kind}__title`} style={{ margin: 0 }}>{label}</h3><Button buttonStyle="ghost" size="small">Collapse all</Button></div></div>
      <div className={`${kind}__draggable-rows`} style={{ display: 'grid', gap: 8, margin: '12px 0' }}>
        {rows.map((r) => <Collapsible key={r} label={r} style="default" startCollapsed={r !== 'Row 01'} />)}
      </div>
      <Button buttonStyle="secondary" icon={<Plus />} onClick={() => setRows([...rows, `Row 0${rows.length + 1}`])}>Add {kind === 'blocks-field' ? 'Block' : 'Row'}</Button>
    </div>
  )
}
Object.assign(previews, {
  'elements/Nav': { render: () => <NavDemo /> },
  'fields/Array': { render: () => <ArrayDemo label="Slides" kind="array-field" /> },
  'fields/Blocks': { render: () => <ArrayDemo label="Layout blocks" kind="blocks-field" /> },
  'fields/Group': { render: () => <div className="field-type group-field" style={{ maxWidth: 560 }}><h3 className="group-field__title">Meta</h3><div style={{ display: 'grid', gap: 16 }}><InputField kind="text" type="text" label="Meta title" /><InputField kind="textarea" label="Meta description" /></div></div> },
  'elements/DocumentDrawer': { render: () => <DrawerDemo title="Edit Post" /> },
  'elements/DuplicateDocument': btn('Duplicate', 'secondary'),
  'elements/ListWhereBuilder': btn('Filters', 'secondary', <Chevron />),
  'elements/QueryPresets': btn('Select preset', 'secondary', <Chevron />),
  'elements/Search': { render: () => <div className="search-filter" style={{ maxWidth: 420 }}><input className="form-input" placeholder="Search by Title" /></div> },
  'elements/FileDetails': { render: () => <div className="file-details" style={{ display: 'flex', gap: 16, alignItems: 'center' }}><div className="thumbnail thumbnail--size-medium" style={{ width: 80, height: 80, background: 'var(--color-bg-tertiary)' }} /><div><b>hero-image.jpg</b><div className="cat-muted">1920×1080 · 412 KB · image/jpeg</div></div></div> },
  'elements/Hierarchy': { render: () => <ul style={{ lineHeight: 1.9 }}><li>📁 Marketing<ul><li>📁 Campaigns</li><li>📄 Landing page</li></ul></li><li>📁 Blog</li></ul> },
  'elements/LivePreview': { note: 'In the real admin this shows your website in an iframe next to the editor, updating as you type.', render: () => <div style={{ display: 'flex', gap: 16 }}><div style={{ flex: 1 }}><InputField kind="text" type="text" label="Title" placeholder="Edit me" /></div><div style={{ flex: 1, border: '1px solid var(--special-border-translucent,#ccc)', borderRadius: 8, height: 180, display: 'grid', placeItems: 'center' }} className="cat-muted">Website preview (iframe)</div></div> },
} as Record<string, Preview>)
