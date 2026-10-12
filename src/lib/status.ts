import { logicOnly } from '@/components/classify'
import { previewKeys } from '@/components/previewKeys'
import type { Entry } from './catalog'
export type Kind = 'live' | 'standin' | 'logic'
export function kindOf(e: Entry & { auto?: any }): Kind {
  const id = `${e.category}/${e.slug}`
  if (previewKeys.includes(id)) return 'live'
  if (logicOnly[id]) return 'logic'
  if (e.auto) return 'standin'
  return 'logic'
}
