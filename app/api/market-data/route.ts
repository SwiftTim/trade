import { type NextRequest, NextResponse } from "next/server"

// Real-time market data simulation
const FOREX_PAIRS = {
  EURUSD: {
    price: 1.0847,
    bid: 1.0846,
    ask: 1.0848,
    change: 0.0023,
    changePercent: 0.21,
    high24h: 1.0867,
    low24h: 1.0821,
    volume: 1250000,
  },
  GBPUSD: {
    price: 1.2634,
    bid: 1.2633,
    ask: 1.2635,
    change: -0.0045,
    changePercent: -0.35,
    high24h: 1.2689,
    low24h: 1.2598,
    volume: 980000,
  },
  USDJPY: {
    price: 149.82,
    bid: 149.81,
    ask: 149.83,
    change: 0.67,
    changePercent: 0.45,
    high24h: 150.12,
    low24h: 149.23,
    volume: 1100000,
  },
  AUDUSD: {
    price: 0.6598,
    bid: 0.6597,
    ask: 0.6599,
    change: 0.0012,
    changePercent: 0.18,
    high24h: 0.6612,
    low24h: 0.6578,
    volume: 750000,
  },
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pair = searchParams.get("pair")
    const pairs = searchParams.get("pairs")?.split(",")

    // Add small random fluctuations to simulate real-time data
    const liveData = Object.entries(FOREX_PAIRS).reduce((acc, [symbol, data]) => {
      const fluctuation = (Math.random() - 0.5) * 0.0001
      const newPrice = data.price + fluctuation

      acc[symbol] = {
        ...data,
        price: Number.parseFloat(newPrice.toFixed(5)),
        bid: Number.parseFloat((newPrice - 0.0001).toFixed(5)),
        ask: Number.parseFloat((newPrice + 0.0001).toFixed(5)),
        timestamp: new Date().toISOString(),
      }
      return acc
    }, {} as any)

    if (pair) {
      const pairData = liveData[pair.toUpperCase()]
      if (!pairData) {
        return NextResponse.json({ success: false, error: "Pair not found" }, { status: 404 })
      }
      return NextResponse.json({
        success: true,
        data: pairData,
      })
    }

    if (pairs) {
      const filteredData = pairs.reduce((acc, p) => {
        const pairData = liveData[p.toUpperCase()]
        if (pairData) acc[p.toUpperCase()] = pairData
        return acc
      }, {} as any)

      return NextResponse.json({
        success: true,
        data: filteredData,
      })
    }

    return NextResponse.json({
      success: true,
      data: liveData,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch market data" }, { status: 500 })
  }
}
