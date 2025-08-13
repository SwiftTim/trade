import { type NextRequest, NextResponse } from "next/server"

// Mock database - same as in route.ts
const signals = [
  {
    id: "1",
    symbol: "EURUSD",
    action: "BUY" as const,
    price: 1.0875,
    target: 1.0925,
    stopLoss: 1.0825,
    confidence: 95,
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    trader: "ProTrader_Alpha",
    status: "active" as const,
    description: "Strong bullish momentum with ECB dovish stance",
    riskReward: 1.0,
  },
  // ... other signals
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const signal = signals.find((s) => s.id === params.id)

  if (!signal) {
    return NextResponse.json({ success: false, error: "Signal not found" }, { status: 404 })
  }

  return NextResponse.json({
    success: true,
    data: signal,
  })
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const signalIndex = signals.findIndex((s) => s.id === params.id)

    if (signalIndex === -1) {
      return NextResponse.json({ success: false, error: "Signal not found" }, { status: 404 })
    }

    // Update signal
    signals[signalIndex] = {
      ...signals[signalIndex],
      ...body,
      id: params.id, // Ensure ID doesn't change
    }

    return NextResponse.json({
      success: true,
      data: signals[signalIndex],
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const signalIndex = signals.findIndex((s) => s.id === params.id)

  if (signalIndex === -1) {
    return NextResponse.json({ success: false, error: "Signal not found" }, { status: 404 })
  }

  signals.splice(signalIndex, 1)

  return NextResponse.json({
    success: true,
    message: "Signal deleted successfully",
  })
}
