import { type NextRequest, NextResponse } from "next/server"
import { SignalTrackingService } from "@/lib/signal-tracking-service"

const trackingService = new SignalTrackingService()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { signalId, outcome, exitPrice, pnl } = body

    if (!signalId || !outcome) {
      return NextResponse.json({ error: "Signal ID and outcome are required" }, { status: 400 })
    }

    await trackingService.updateSignalOutcome(signalId, outcome, exitPrice, pnl)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error tracking signal outcome:", error)
    return NextResponse.json({ error: "Failed to track signal outcome" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const days = Number.parseInt(searchParams.get("days") || "30")

    const metrics = await trackingService.calculatePerformanceMetrics(days)

    return NextResponse.json(metrics)
  } catch (error) {
    console.error("Error getting performance metrics:", error)
    return NextResponse.json({ error: "Failed to get performance metrics" }, { status: 500 })
  }
}
