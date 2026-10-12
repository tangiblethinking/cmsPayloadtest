import { DashSidebar } from '@/components/dashboard/Sidebar'
import { ImpersonationBanner, Topbar } from '@/components/dashboard/Topbar'
import { Briefing, Contest, MonthAndRank, Kickoff, BottomCards, GearFab } from '@/components/dashboard/Sections'
import { FocusTabs } from '@/components/dashboard/Tabs'
import { user } from '@/components/dashboard/data'

export default function DashboardPage() {
  return (
    <div className="pp">
      <ImpersonationBanner />
      <div className="pp-shell">
        <DashSidebar />
        <div className="pp-main">
          <Topbar />
          <main className="pp-content">
            <header className="pp-hero">
              <h1>Today, {user.first}</h1>
              <p className="pp-muted">Welcome back — switch between Growth and Coaching to focus your day.</p>
            </header>
            <Briefing />
            <Contest />
            <MonthAndRank />
            <Kickoff />
            <FocusTabs />
            <BottomCards />
          </main>
        </div>
      </div>
      <GearFab />
    </div>
  )
}
