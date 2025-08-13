import { type NextRequest, NextResponse } from "next/server"

interface BrokerConnection {
  id: string
  userId: string
  brokerId: string
  accountId: string
  apiKey: string
  apiSecret?: string
  server?: string
  status: "connected" | "disconnected" | "error"
  lastSync: string
  balance: number
  equity: number
  margin: number
  freeMargin: number
}

// Mock database for broker connections
const connections: BrokerConnection[] = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { brokerId, accountId, apiKey, apiSecret, server, userId } = body

    if (!brokerId || !accountId || !apiKey || !userId) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // In a real application, this would:
    // 1. Validate API credentials with the broker
    // 2. Encrypt and store API keys securely
    // 3. Test connection and fetch account info

    // Mock connection validation
    const isValidConnection = Math.random() > 0.2 // 80% success rate for demo

    if (!isValidConnection) {
      return NextResponse.json(
        { success: false, error: "Invalid API credentials or connection failed" },
        { status: 400 },
      )
    }

    const newConnection: BrokerConnection = {
      id: Date.now().toString(),
      userId,
      brokerId,
      accountId,
      apiKey: apiKey.substring(0, 8) + "****", // Mask API key in response
      apiSecret: apiSecret ? "****" : undefined,
      server,
      status: "connected",
      lastSync: new Date().toISOString(),
      balance: 10000 + Math.random() * 50000, // Mock balance
      equity: 10000 + Math.random() * 50000,
      margin: Math.random() * 5000,
      freeMargin: 8000 + Math.random() * 40000,
    }

    connections.push(newConnection)

    return NextResponse.json({
      success: true,
      data: newConnection,
      message: "Broker connected successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to connect broker" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ success: false, error: "User ID required" }, { status: 400 })
  }

  const userConnections = connections.filter((conn) => conn.userId === userId)

  return NextResponse.json({
    success: true,
    data: userConnections,
  })
}
