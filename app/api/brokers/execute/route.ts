import { type NextRequest, NextResponse } from "next/server"

interface TradeExecution {
  id: string
  signalId: string
  userId: string
  brokerId: string
  symbol: string
  action: "BUY" | "SELL"
  volume: number
  price: number
  stopLoss?: number
  takeProfit?: number
  status: "pending" | "executed" | "failed" | "cancelled"
  executedAt?: string
  executedPrice?: number
  orderId?: string
}

const executions: TradeExecution[] = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { signalId, userId, brokerId, symbol, action, volume, price, stopLoss, takeProfit } = body

    if (!signalId || !userId || !brokerId || !symbol || !action || !volume || !price) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Create execution record
    const execution: TradeExecution = {
      id: Date.now().toString(),
      signalId,
      userId,
      brokerId,
      symbol,
      action,
      volume,
      price,
      stopLoss,
      takeProfit,
      status: "pending",
    }

    executions.push(execution)

    // Simulate trade execution
    setTimeout(
      () => {
        const isSuccessful = Math.random() > 0.1 // 90% success rate

        if (isSuccessful) {
          execution.status = "executed"
          execution.executedAt = new Date().toISOString()
          execution.executedPrice = price + (Math.random() - 0.5) * 0.0001 // Small slippage
          execution.orderId = `ORD_${Date.now()}`
        } else {
          execution.status = "failed"
        }
      },
      1000 + Math.random() * 2000,
    ) // 1-3 second delay

    return NextResponse.json({
      success: true,
      data: execution,
      message: "Trade execution initiated",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to execute trade" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ success: false, error: "User ID required" }, { status: 400 })
  }

  const userExecutions = executions.filter((exec) => exec.userId === userId)

  return NextResponse.json({
    success: true,
    data: userExecutions.sort(
      (a, b) => new Date(b.executedAt || b.id).getTime() - new Date(a.executedAt || a.id).getTime(),
    ),
  })
}
