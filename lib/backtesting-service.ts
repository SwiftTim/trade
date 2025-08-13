interface BacktestResult {
  strategy: string
  pair: string
  timeframe: string
  startDate: string
  endDate: string
  totalTrades: number
  winningTrades: number
  losingTrades: number
  winRate: number
  totalReturn: number
  maxDrawdown: number
  sharpeRatio: number
  profitFactor: number
  averageWin: number
  averageLoss: number
  trades: BacktestTrade[]
}

interface BacktestTrade {
  id: string
  entryDate: string
  exitDate: string
  direction: "BUY" | "SELL"
  entryPrice: number
  exitPrice: number
  pnl: number
  pnlPercent: number
  reason: string
  indicators: any
}

interface HistoricalDataPoint {
  timestamp: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export class BacktestingService {
  private marketData: any
  private indicators: any

  constructor() {
    // Initialize with market data and indicators services
  }

  async runBacktest(
    strategy: string,
    pair: string,
    timeframe: string,
    startDate: string,
    endDate: string,
    parameters: any = {},
  ): Promise<BacktestResult> {
    try {
      // Get historical data for the specified period
      const historicalData = await this.getHistoricalDataRange(pair, timeframe, startDate, endDate)

      if (!historicalData || historicalData.length < 50) {
        throw new Error("Insufficient historical data for backtesting")
      }

      const trades: BacktestTrade[] = []
      let currentPosition: any = null
      let balance = 10000 // Starting balance
      let maxBalance = balance
      let maxDrawdown = 0

      // Run strategy simulation
      for (let i = 20; i < historicalData.length; i++) {
        const currentBar = historicalData[i]
        const previousBars = historicalData.slice(0, i + 1)

        // Calculate indicators for current position
        const indicators = await this.calculateIndicatorsForBacktest(previousBars, parameters)

        // Generate signal based on strategy
        const signal = this.generateStrategySignal(strategy, indicators, currentBar, parameters)

        // Handle position management
        if (!currentPosition && signal) {
          // Open new position
          currentPosition = {
            id: `bt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            entryDate: currentBar.timestamp,
            direction: signal.direction,
            entryPrice: currentBar.close,
            indicators: indicators,
          }
        } else if (currentPosition) {
          // Check exit conditions
          const exitSignal = this.checkExitConditions(currentPosition, currentBar, indicators, parameters)

          if (exitSignal) {
            // Close position
            const pnl = this.calculatePnL(currentPosition, currentBar.close)
            const pnlPercent = (pnl / balance) * 100

            balance += pnl
            maxBalance = Math.max(maxBalance, balance)
            const drawdown = ((maxBalance - balance) / maxBalance) * 100
            maxDrawdown = Math.max(maxDrawdown, drawdown)

            trades.push({
              id: currentPosition.id,
              entryDate: currentPosition.entryDate,
              exitDate: currentBar.timestamp,
              direction: currentPosition.direction,
              entryPrice: currentPosition.entryPrice,
              exitPrice: currentBar.close,
              pnl: pnl,
              pnlPercent: pnlPercent,
              reason: exitSignal.reason,
              indicators: indicators,
            })

            currentPosition = null
          }
        }
      }

      // Close any remaining position
      if (currentPosition) {
        const lastBar = historicalData[historicalData.length - 1]
        const pnl = this.calculatePnL(currentPosition, lastBar.close)

        trades.push({
          id: currentPosition.id,
          entryDate: currentPosition.entryDate,
          exitDate: lastBar.timestamp,
          direction: currentPosition.direction,
          entryPrice: currentPosition.entryPrice,
          exitPrice: lastBar.close,
          pnl: pnl,
          pnlPercent: (pnl / balance) * 100,
          reason: "End of backtest period",
          indicators: {},
        })
      }

      // Calculate performance metrics
      const winningTrades = trades.filter((t) => t.pnl > 0).length
      const losingTrades = trades.filter((t) => t.pnl < 0).length
      const totalReturn = ((balance - 10000) / 10000) * 100
      const averageWin = trades.filter((t) => t.pnl > 0).reduce((sum, t) => sum + t.pnl, 0) / (winningTrades || 1)
      const averageLoss =
        Math.abs(trades.filter((t) => t.pnl < 0).reduce((sum, t) => sum + t.pnl, 0)) / (losingTrades || 1)
      const profitFactor = averageWin / (averageLoss || 1)

      // Calculate Sharpe ratio (simplified)
      const returns = trades.map((t) => t.pnlPercent)
      const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length
      const stdDev = Math.sqrt(returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length)
      const sharpeRatio = avgReturn / (stdDev || 1)

      return {
        strategy,
        pair,
        timeframe,
        startDate,
        endDate,
        totalTrades: trades.length,
        winningTrades,
        losingTrades,
        winRate: trades.length > 0 ? (winningTrades / trades.length) * 100 : 0,
        totalReturn,
        maxDrawdown,
        sharpeRatio,
        profitFactor,
        averageWin,
        averageLoss,
        trades,
      }
    } catch (error) {
      console.error("Backtesting error:", error)
      throw error
    }
  }

  private async getHistoricalDataRange(
    pair: string,
    timeframe: string,
    startDate: string,
    endDate: string,
  ): Promise<HistoricalDataPoint[]> {
    // Generate realistic historical data for backtesting
    const start = new Date(startDate).getTime()
    const end = new Date(endDate).getTime()
    const interval = timeframe === "1h" ? 3600000 : 86400000 // 1 hour or 1 day

    const data: HistoricalDataPoint[] = []
    let currentPrice = this.getBasePrice(pair)

    for (let timestamp = start; timestamp <= end; timestamp += interval) {
      // Simulate realistic price movement
      const volatility = this.getVolatility(pair)
      const change = (Math.random() - 0.5) * volatility * 2
      const trend = Math.sin(timestamp / (86400000 * 30)) * 0.001 // Monthly trend

      currentPrice *= 1 + change + trend

      const high = currentPrice * (1 + Math.random() * volatility)
      const low = currentPrice * (1 - Math.random() * volatility)
      const open = data.length > 0 ? data[data.length - 1].close : currentPrice

      data.push({
        timestamp: new Date(timestamp).toISOString(),
        open,
        high: Math.max(open, currentPrice, high),
        low: Math.min(open, currentPrice, low),
        close: currentPrice,
        volume: Math.floor(Math.random() * 1000000) + 100000,
      })
    }

    return data
  }

  private async calculateIndicatorsForBacktest(data: HistoricalDataPoint[], parameters: any) {
    const prices = data.map((d) => d.close)

    if (prices.length < 20) return {}

    // Calculate basic indicators
    const rsi = this.calculateRSI(prices.slice(-14))
    const sma20 = prices.slice(-20).reduce((sum, p) => sum + p, 0) / 20
    const sma50 = prices.length >= 50 ? prices.slice(-50).reduce((sum, p) => sum + p, 0) / 50 : sma20

    return {
      rsi: rsi[rsi.length - 1] || 50,
      sma20,
      sma50,
      currentPrice: prices[prices.length - 1],
    }
  }

  private generateStrategySignal(strategy: string, indicators: any, currentBar: HistoricalDataPoint, parameters: any) {
    const { rsi, sma20, sma50, currentPrice } = indicators

    switch (strategy) {
      case "rsi_mean_reversion":
        if (rsi < 30) return { direction: "BUY" as const, confidence: 75 }
        if (rsi > 70) return { direction: "SELL" as const, confidence: 75 }
        break

      case "moving_average_crossover":
        if (currentPrice > sma20 && sma20 > sma50) return { direction: "BUY" as const, confidence: 70 }
        if (currentPrice < sma20 && sma20 < sma50) return { direction: "SELL" as const, confidence: 70 }
        break

      case "trend_following":
        if (rsi > 50 && currentPrice > sma20) return { direction: "BUY" as const, confidence: 65 }
        if (rsi < 50 && currentPrice < sma20) return { direction: "SELL" as const, confidence: 65 }
        break
    }

    return null
  }

  private checkExitConditions(position: any, currentBar: HistoricalDataPoint, indicators: any, parameters: any) {
    const { rsi } = indicators
    const pnl = this.calculatePnL(position, currentBar.close)
    const pnlPercent = Math.abs(pnl / currentBar.close) * 100

    // Stop loss (2% loss)
    if (pnlPercent > 2 && pnl < 0) {
      return { reason: "Stop loss triggered" }
    }

    // Take profit (3% gain)
    if (pnlPercent > 3 && pnl > 0) {
      return { reason: "Take profit triggered" }
    }

    // RSI reversal
    if (position.direction === "BUY" && rsi > 70) {
      return { reason: "RSI overbought exit" }
    }
    if (position.direction === "SELL" && rsi < 30) {
      return { reason: "RSI oversold exit" }
    }

    return null
  }

  private calculatePnL(position: any, exitPrice: number): number {
    const multiplier = 100000 // Standard lot size
    if (position.direction === "BUY") {
      return (exitPrice - position.entryPrice) * multiplier
    } else {
      return (position.entryPrice - exitPrice) * multiplier
    }
  }

  private calculateRSI(prices: number[], period = 14): number[] {
    if (prices.length < period + 1) return [50]

    const gains: number[] = []
    const losses: number[] = []

    for (let i = 1; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1]
      gains.push(change > 0 ? change : 0)
      losses.push(change < 0 ? Math.abs(change) : 0)
    }

    const avgGain = gains.slice(-period).reduce((sum, g) => sum + g, 0) / period
    const avgLoss = losses.slice(-period).reduce((sum, l) => sum + l, 0) / period

    if (avgLoss === 0) return [100]

    const rs = avgGain / avgLoss
    const rsi = 100 - 100 / (1 + rs)

    return [rsi]
  }

  private getBasePrice(pair: string): number {
    const basePrices: Record<string, number> = {
      EURUSD: 1.085,
      GBPUSD: 1.265,
      USDJPY: 149.5,
      GBPJPY: 189.25,
      XAUUSD: 2025.5,
      BTCUSD: 43250.0,
    }
    return basePrices[pair] || 1.0
  }

  private getVolatility(pair: string): number {
    const volatilities: Record<string, number> = {
      EURUSD: 0.008,
      GBPUSD: 0.012,
      USDJPY: 0.01,
      GBPJPY: 0.015,
      XAUUSD: 0.02,
      BTCUSD: 0.04,
    }
    return volatilities[pair] || 0.01
  }
}
