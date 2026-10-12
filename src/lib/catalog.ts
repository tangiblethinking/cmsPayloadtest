import fs from 'node:fs'
import path from 'node:path'
import catalog from '@/generated/catalog.json'

export type Entry = { category: 'elements' | 'fields'; name: string; slug: string; files: string[]; auto?: { base: string; elements: string[]; modifiers: string[] } | null }
export const entries = catalog as Entry[]
export const getEntry = (category: string, slug: string) =>
  entries.find((e) => e.category === category && e.slug === slug)

export function readSource(entry: Entry) {
  return entry.files.map((rel) => ({
    path: rel,
    code: fs.readFileSync(path.join(process.cwd(), 'payload-src', rel), 'utf8'),
  }))
}
