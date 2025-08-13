"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { SignalsFeed } from "@/components/signals-feed"
import { PerformanceChart } from "@/components/performance-chart"
import { ActivePositions } from "@/components/active-positions"
import { PortfolioStats } from "@/components/portfolio-stats"
import { RecentActivity } from "@/components/recent-activity"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Portfolio Overview */}
          <PortfolioStats />

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Signals Feed */}
            <div className="lg:col-span-2 space-y-6">
              <SignalsFeed />
              <PerformanceChart />
            </div>

            {/* Right Column - Positions & Activity */}
            <div className="space-y-6">
              <ActivePositions />
              <RecentActivity />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
