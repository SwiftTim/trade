import { NextResponse } from "next/server"

interface Trader {
  id: string
  name: string
  avatar?: string
  winRate: number
  totalSignals: number
  followers: number
  monthlyReturn: number
  verified: boolean
  tier: "bronze" | "silver" | "gold" | "platinum"
  specialties: string[]
}

const traders: Trader[] = [
  {
    id: "1",
    name: "ProTrader_Alpha",
    winRate: 87.5,
    totalSignals: 245,
    followers: 1250,
    monthlyReturn: 12.8,
    verified: true,
    tier: "platinum",
    specialties: ["EUR/USD", "GBP/USD", "Forex Majors"],
  },
  {
    id: "2",
    name: "FX_Master",
    winRate: 82.3,
    totalSignals: 189,
    followers: 890,
    monthlyReturn: 9.4,
    verified: true,
    tier: "gold",
    specialties: ["GBP/JPY", "USD/JPY", "Yen Pairs"],
  },
  {
    id: "3",
    name: "GoldExpert",
    winRate: 91.2,
    totalSignals: 156,
    followers: 2100,
    monthlyReturn: 15.6,
    verified: true,
    tier: "platinum",
    specialties: ["XAU/USD", "Commodities", "Precious Metals"],
  },
]

export async function GET() {
  return NextResponse.json({
    success: true,
    data: traders.sort((a, b) => b.winRate - a.winRate),
  })
}
