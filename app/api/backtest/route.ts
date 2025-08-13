import { type NextRequest, NextResponse } from "next/server"
import { BacktestingService } from "@/lib/backtesting-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { strategy, pair, timeframe, startDate, endDate, parameters } = body

    // Validate required parameters
    if (!strategy || !pair || !timeframe || !startDate || !endDate) {
      return NextResponse.json({ success: false, error: "Missing required parameters" }, { status: 400 })
    }

    // Validate date range
    const start = new Date(startDate)
    const end = new Date(endDate)
    const now = new Date()

    if (start >= end) {
      return NextResponse.json({ success: false, error: "Start date must be before end date" }, { status: 400 })
    }

    if (end > now) {
      return NextResponse.json({ success: false, error: "End date cannot be in the future" }, { status: 400 })
    }

    // Run backtest
    const backtestingService = new BacktestingService()
    const result = await backtestingService.runBacktest(strategy, pair, timeframe, startDate, endDate, parameters || {})

    return NextResponse.json({
      success: true,
      result,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Backtest API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Backtesting failed",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  // Return available strategies and pairs for backtesting
  return NextResponse.json({
    success: true,
    availableStrategies: [
      {
        id: "rsi_mean_reversion",
        name: "RSI Mean Reversion",
        description: "Buy when RSI < 30, sell when RSI > 70",
      },
      {
        id: "moving_average_crossover",
        name: "Moving Average Crossover",
        description: "Trade based on price vs moving average relationship",
      },
      {
        id: "trend_following",
        name: "Trend Following",
        description: "Follow trends using RSI and moving averages",
      },
    ],
    availablePairs: ["EURUSD", "GBPUSD", "USDJPY", "GBPJPY", "XAUUSD", "BTCUSD"],
    availableTimeframes: ["1h", "1d"],
    maxBacktestPeriod: "12 months",
  })
}
