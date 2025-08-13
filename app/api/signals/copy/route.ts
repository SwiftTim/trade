import { type NextRequest, NextResponse } from "next/server"

const BROKER_CONFIGS = {
  MT4: { minLot: 0.01, maxLot: 100, commission: 7 },
  MT5: { minLot: 0.01, maxLot: 100, commission: 7 },
  cTrader: { minLot: 0.01, maxLot: 100, commission: 5 },
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { signalId, userId, lotSize, brokerType = "MT5" } = body

    if (!signalId || !userId) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const brokerConfig = BROKER_CONFIGS[brokerType as keyof typeof BROKER_CONFIGS]
    if (!brokerConfig) {
      return NextResponse.json({ success: false, error: "Unsupported broker type" }, { status: 400 })
    }

    const lot = lotSize || 0.1
    if (lot < brokerConfig.minLot || lot > brokerConfig.maxLot) {
      return NextResponse.json(
        {
          success: false,
          error: `Lot size must be between ${brokerConfig.minLot} and ${brokerConfig.maxLot}`,
        },
        { status: 400 },
      )
    }

    const executionDelay = Math.random() * 2000 + 500 // 0.5-2.5 seconds
    const slippage = (Math.random() - 0.5) * 0.0002 // ±0.2 pips slippage

    const copyTrade = {
      id: Date.now().toString(),
      signalId,
      userId,
      lotSize: lot,
      brokerType,
      status: "pending",
      timestamp: new Date().toISOString(),
      executionPrice: null,
      slippage: 0,
      commission: brokerConfig.commission * lot,
      estimatedExecution: new Date(Date.now() + executionDelay).toISOString(),
    }

    setTimeout(() => {
      copyTrade.status = "executed"
      copyTrade.slippage = Number(slippage.toFixed(5))
      // In real implementation, this would update the database
    }, executionDelay)

    return NextResponse.json({
      success: true,
      data: copyTrade,
      message: `Signal copied successfully via ${brokerType}. Execution pending...`,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to copy signal" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const tradeId = searchParams.get("tradeId")
  const userId = searchParams.get("userId")

  if (!tradeId && !userId) {
    return NextResponse.json({ success: false, error: "Missing tradeId or userId" }, { status: 400 })
  }

  // Mock response - in production this would query the database
  const mockTrades = [
    {
      id: tradeId || "123",
      signalId: "1",
      userId: userId || "user123",
      lotSize: 0.1,
      brokerType: "MT5",
      status: "executed",
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      executionPrice: 1.0847,
      slippage: 0.0001,
      commission: 0.7,
      currentPnL: 15.5,
    },
  ]

  return NextResponse.json({
    success: true,
    data: tradeId ? mockTrades[0] : mockTrades,
  })
}
