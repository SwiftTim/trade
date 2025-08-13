import { NextResponse } from "next/server"

interface PlatformAnalytics {
  totalUsers: number
  activeUsers: number
  totalSignals: number
  totalRevenue: number
  conversionRate: number
  churnRate: number
  userGrowth: Array<{ date: string; users: number }>
  revenueGrowth: Array<{ date: string; revenue: number }>
  subscriptionBreakdown: Array<{ tier: string; count: number; percentage: number }>
}

export async function GET() {
  // Mock analytics data
  const analytics: PlatformAnalytics = {
    totalUsers: 1247,
    activeUsers: 892,
    totalSignals: 15678,
    totalRevenue: 89450,
    conversionRate: 12.5,
    churnRate: 3.2,
    userGrowth: [
      { date: "2024-01-01", users: 850 },
      { date: "2024-01-07", users: 920 },
      { date: "2024-01-14", users: 1050 },
      { date: "2024-01-21", users: 1247 },
    ],
    revenueGrowth: [
      { date: "2024-01-01", revenue: 65000 },
      { date: "2024-01-07", revenue: 72000 },
      { date: "2024-01-14", revenue: 81000 },
      { date: "2024-01-21", revenue: 89450 },
    ],
    subscriptionBreakdown: [
      { tier: "Free", count: 623, percentage: 50 },
      { tier: "Basic", count: 312, percentage: 25 },
      { tier: "Premium", count: 249, percentage: 20 },
      { tier: "VIP", count: 63, percentage: 5 },
    ],
  }

  return NextResponse.json({
    success: true,
    data: analytics,
  })
}
