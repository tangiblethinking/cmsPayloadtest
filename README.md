# CMSPayload — Payload UI Catalog

An interactive catalog of the Payload CMS admin UI (`packages/ui`, v4.0.0-beta.0 source):

- **190 components** (157 elements + 33 fields) — every one with its full source (`.tsx`, `.ts`, `.css`), syntax highlighted, with **Copy file** and **Copy all for AI** buttons.
- **94 interactive previews** (hand-built, many with variant controls), **81 stand-in previews** auto-assembled from each component's own CSS classes, and **15 items marked “Logic only, nothing to display”** (background helpers with no visual).
- **Theme / rebrand panel** (`/theme`): edit any Payload CSS variable (colors, radius, spacing, typography), presets, light/dark mode, and export the overrides as `custom.css` for your Payload app.

## How it works

- `payload-src/` — a copy of `packages/ui/src/{elements,fields,icons,css}` from the Payload monorepo.
- `scripts/prepare.mjs` (runs automatically before `dev`/`build`) generates:
  - `public/payload-ui.css` — Payload's real stylesheet (tokens + every component CSS)
  - `src/generated/catalog.json` — the component list + source files
- Live previews (`src/components/Previews.tsx`) render the same DOM/BEM classes as Payload's components, styled by Payload's real CSS. They are lightweight re-implementations, so they run without Payload's config, i18n, form state or a database. Components that need the full Payload runtime are listed **source only**.

To refresh from a newer Payload checkout, replace `payload-src/` with the new `packages/ui/src` folders (`elements fields icons css styles.css`) and rebuild.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # production
```

Requires Node 18.18+ (20+ recommended).

## Push to GitHub

```bash
git init
git add .
git commit -m "CMSPayload: Payload UI catalog"
git branch -M main
git remote add origin https://github.com/<you>/CMSPayload.git
git push -u origin main
```

## Deploy to Vercel

1. vercel.com → **Add New… → Project** → import the GitHub repo.
2. Framework preset: **Next.js** (auto-detected). No env vars, no database.
3. Deploy. (Or from the CLI: `npx vercel` then `npx vercel --prod`.)

## Building custom components with AI

Open a component → **Copy all for AI** → paste into your AI tool with a prompt like
“Using this Payload UI component as reference, create a `PlexusStatCard` that uses the same CSS variables and BEM conventions.”
Add the result as a new preview in `src/components/Previews.tsx` (and its key in `previewKeys.ts`).

## Note on `payload-src`

In the GitHub repo, the Payload source is stored as a single file, `payload-src.bundle.json`. `npm run dev` / `npm run build` unpack it to `payload-src/` automatically (the folder is git-ignored). To update it from a new Payload checkout, replace `payload-src/` and regenerate the bundle with:
`node -e "const fs=require('fs'),p=require('path');const o={};(function w(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const f=p.join(d,e.name);e.isDirectory()?w(f):o[p.relative('payload-src',f)]=fs.readFileSync(f,'utf8')}})('payload-src');fs.writeFileSync('payload-src.bundle.json',JSON.stringify(o))"`
