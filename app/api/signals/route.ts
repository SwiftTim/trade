import { type NextRequest, NextResponse } from "next/server"

interface Signal {
  id: string
  symbol: string
  action: "BUY" | "SELL"
  price: number
  target: number
  stopLoss: number
  confidence: number
  timestamp: string
  trader: string
  status: "active" | "filled" | "cancelled"
  description?: string
  riskReward: number
  currentPrice?: number
  pnl?: number
}

const REAL_MARKET_DATA = {
  EURUSD: { price: 1.0847, spread: 0.0002 },
  GBPUSD: { price: 1.2634, spread: 0.0002 },
  USDJPY: { price: 149.82, spread: 0.02 },
  GBPJPY: { price: 189.45, spread: 0.03 },
  XAUUSD: { price: 2045.3, spread: 0.5 },
  BTCUSD: { price: 43250.0, spread: 10.0 },
  ETHUSD: { price: 2580.0, spread: 2.0 },
}

const signals: Signal[] = [
  {
    id: "1",
    symbol: "EURUSD",
    action: "BUY",
    price: 1.0847,
    target: 1.0897,
    stopLoss: 1.0797,
    confidence: 95,
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    trader: "ProTrader_Alpha",
    status: "active",
    description: "ECB dovish stance creating bullish momentum. Strong support at 1.0800",
    riskReward: 1.0,
    currentPrice: 1.0847,
    pnl: 0,
  },
  {
    id: "2",
    symbol: "GBPJPY",
    action: "SELL",
    price: 189.45,
    target: 188.8,
    stopLoss: 190.1,
    confidence: 88,
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    trader: "FX_Master",
    status: "active",
    description: "Strong resistance at 190.00 level. BoJ intervention risk above 190",
    riskReward: 1.0,
    currentPrice: 189.45,
    pnl: 0,
  },
  {
    id: "3",
    symbol: "XAUUSD",
    action: "BUY",
    price: 2045.3,
    target: 2065.0,
    stopLoss: 2025.0,
    confidence: 92,
    timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    trader: "GoldExpert",
    status: "active",
    description: "Gold breaking key resistance. Fed dovish pivot supporting precious metals",
    riskReward: 0.97,
    currentPrice: 2045.3,
    pnl: 0,
  },
  {
    id: "4",
    symbol: "BTCUSD",
    action: "BUY",
    price: 43250.0,
    target: 45000.0,
    stopLoss: 41500.0,
    confidence: 85,
    timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    trader: "CryptoKing",
    status: "active",
    description: "Bitcoin ETF approval momentum. Strong institutional demand above 43k",
    riskReward: 1.0,
    currentPrice: 43250.0,
    pnl: 0,
  },
  {
    id: "5",
    symbol: "USDJPY",
    action: "SELL",
    price: 149.82,
    target: 148.5,
    stopLoss: 151.0,
    confidence: 78,
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    trader: "YenSpecialist",
    status: "active",
    description: "BoJ intervention risk at 150.00. USD weakness on Fed pause expectations",
    riskReward: 1.12,
    currentPrice: 149.82,
    pnl: 0,
  },
]

function updateSignalsWithMarketData() {
  signals.forEach((signal) => {
    const marketData = REAL_MARKET_DATA[signal.symbol as keyof typeof REAL_MARKET_DATA]
    if (marketData) {
      // Add small random fluctuation to simulate real-time movement
      const fluctuation = (Math.random() - 0.5) * marketData.spread * 2
      signal.currentPrice = Number((marketData.price + fluctuation).toFixed(signal.symbol.includes("JPY") ? 2 : 4))

      // Calculate P&L based on current price vs entry price
      if (signal.action === "BUY") {
        signal.pnl = Number(((signal.currentPrice - signal.price) * 100000).toFixed(2)) // Standard lot calculation
      } else {
        signal.pnl = Number(((signal.price - signal.currentPrice) * 100000).toFixed(2))
      }
    }
  })
}

export async function GET(request: NextRequest) {
  updateSignalsWithMarketData()

  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")
  const trader = searchParams.get("trader")
  const symbol = searchParams.get("symbol")

  let filteredSignals = signals

  if (status) {
    filteredSignals = filteredSignals.filter((signal) => signal.status === status)
  }

  if (trader) {
    filteredSignals = filteredSignals.filter((signal) => signal.trader === trader)
  }

  if (symbol) {
    filteredSignals = filteredSignals.filter((signal) => signal.symbol === symbol)
  }

  return NextResponse.json({
    success: true,
    data: filteredSignals.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    marketUpdate: new Date().toISOString(),
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { symbol, action, price, target, stopLoss, confidence, trader, description } = body

    // Validate required fields
    if (!symbol || !action || !price || !target || !stopLoss || !confidence || !trader) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const marketData = REAL_MARKET_DATA[symbol.toUpperCase() as keyof typeof REAL_MARKET_DATA]
    if (!marketData) {
      return NextResponse.json({ success: false, error: "Unsupported trading pair" }, { status: 400 })
    }

    const priceDiff = Math.abs(price - marketData.price) / marketData.price
    if (priceDiff > 0.01) {
      // 1% tolerance
      return NextResponse.json(
        {
          success: false,
          error: `Price ${price} too far from current market price ${marketData.price}`,
        },
        { status: 400 },
      )
    }

    // Calculate risk-reward ratio
    const riskReward = Math.abs(target - price) / Math.abs(price - stopLoss)

    const newSignal: Signal = {
      id: Date.now().toString(),
      symbol: symbol.toUpperCase(),
      action,
      price: Number(price),
      target: Number(target),
      stopLoss: Number(stopLoss),
      confidence: Number(confidence),
      timestamp: new Date().toISOString(),
      trader,
      status: "active",
      description,
      riskReward: Number(riskReward.toFixed(2)),
      currentPrice: marketData.price,
      pnl: 0,
    }

    signals.unshift(newSignal)

    return NextResponse.json({
      success: true,
      data: newSignal,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 })
  }
}
