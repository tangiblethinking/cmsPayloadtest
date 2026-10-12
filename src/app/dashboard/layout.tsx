import type { Metadata } from 'next'
import './dashboard.css'

export const metadata: Metadata = { title: 'Dashboard | Plexus Pulse' }

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" />
      {children}
    </>
  )
}
