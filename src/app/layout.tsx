import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CMSPayload — Payload UI Catalog',
  description: 'Interactive catalog of Payload CMS admin UI components with source code and theming.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        {/* Payload's real UI stylesheet (generated from payload-src by scripts/prepare.mjs) */}
        <link rel="stylesheet" href="/payload-ui.css" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
