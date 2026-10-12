import './catalog.css'
import { ThemeRuntime } from '@/components/ThemeRuntime'
import { Sidebar } from '@/components/Sidebar'
import { entries } from '@/lib/catalog'
import { kindOf } from '@/lib/status'

export default function CatalogLayout({ children }: { children: React.ReactNode }) {
  const items = entries.map((e) => ({ category: e.category, slug: e.slug, name: e.name, kind: kindOf(e) }))
  return (
    <div className="cat-shell">
      <ThemeRuntime />
      <Sidebar items={items} />
      <main className="cat-main">{children}</main>
    </div>
  )
}
