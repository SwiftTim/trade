import { type NextRequest, NextResponse } from "next/server"

interface AdminSignal {
  id: string
  symbol: string
  action: "BUY" | "SELL"
  trader: string
  status: "active" | "filled" | "cancelled"
  confidence: number
  copies: number
  performance: number
  created_at: string
  flagged: boolean
}

const adminSignals: AdminSignal[] = [
  {
    id: "1",
    symbol: "EURUSD",
    action: "BUY",
    trader: "ProTrader_Alpha",
    status: "active",
    confidence: 95,
    copies: 45,
    performance: 2.3,
    created_at: "2024-01-20T14:30:00Z",
    flagged: false,
  },
  {
    id: "2",
    symbol: "GBPJPY",
    action: "SELL",
    trader: "FX_Master",
    status: "filled",
    confidence: 88,
    copies: 32,
    performance: -1.2,
    created_at: "2024-01-20T13:15:00Z",
    flagged: true,
  },
  {
    id: "3",
    symbol: "XAUUSD",
    action: "BUY",
    trader: "GoldExpert",
    status: "filled",
    confidence: 92,
    copies: 67,
    performance: 4.1,
    created_at: "2024-01-20T12:45:00Z",
    flagged: false,
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")
  const flagged = searchParams.get("flagged")

  let filteredSignals = adminSignals

  if (status) {
    filteredSignals = filteredSignals.filter((signal) => signal.status === status)
  }

  if (flagged === "true") {
    filteredSignals = filteredSignals.filter((signal) => signal.flagged)
  }

  return NextResponse.json({
    success: true,
    data: filteredSignals,
  })
}
