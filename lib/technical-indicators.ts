export interface TechnicalIndicators {
  rsi: number
  macd: {
    macd: number
    signal: number
    histogram: number
  }
  ema: {
    ema12: number
    ema26: number
  }
  bollinger: {
    upper: number
    middle: number
    lower: number
  }
  sma: {
    sma20: number
    sma50: number
  }
}

export class TechnicalAnalysis {
  static calculateRSI(prices: number[], period = 14): number {
    if (prices.length < period + 1) return 50

    let gains = 0
    let losses = 0

    // Calculate initial average gain and loss
    for (let i = 1; i <= period; i++) {
      const change = prices[i] - prices[i - 1]
      if (change > 0) {
        gains += change
      } else {
        losses += Math.abs(change)
      }
    }

    let avgGain = gains / period
    let avgLoss = losses / period

    // Calculate RSI using Wilder's smoothing
    for (let i = period + 1; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1]
      const gain = change > 0 ? change : 0
      const loss = change < 0 ? Math.abs(change) : 0

      avgGain = (avgGain * (period - 1) + gain) / period
      avgLoss = (avgLoss * (period - 1) + loss) / period
    }

    if (avgLoss === 0) return 100
    const rs = avgGain / avgLoss
    return 100 - 100 / (1 + rs)
  }

  static calculateEMA(prices: number[], period: number): number {
    if (prices.length === 0) return 0
    if (prices.length < period) return prices[prices.length - 1]

    const multiplier = 2 / (period + 1)
    let ema = prices[0]

    for (let i = 1; i < prices.length; i++) {
      ema = prices[i] * multiplier + ema * (1 - multiplier)
    }

    return ema
  }

  static calculateSMA(prices: number[], period: number): number {
    if (prices.length < period) return 0

    const slice = prices.slice(-period)
    return slice.reduce((sum, price) => sum + price, 0) / period
  }

  static calculateMACD(prices: number[]): { macd: number; signal: number; histogram: number } {
    const ema12 = this.calculateEMA(prices, 12)
    const ema26 = this.calculateEMA(prices, 26)
    const macd = ema12 - ema26

    // Calculate signal line (9-period EMA of MACD)
    const macdHistory = [macd] // In real implementation, you'd maintain MACD history
    const signal = this.calculateEMA(macdHistory, 9)
    const histogram = macd - signal

    return { macd, signal, histogram }
  }

  static calculateBollingerBands(
    prices: number[],
    period = 20,
    stdDev = 2,
  ): {
    upper: number
    middle: number
    lower: number
  } {
    const sma = this.calculateSMA(prices, period)

    if (prices.length < period) {
      return { upper: sma, middle: sma, lower: sma }
    }

    const slice = prices.slice(-period)
    const variance = slice.reduce((sum, price) => sum + Math.pow(price - sma, 2), 0) / period
    const standardDeviation = Math.sqrt(variance)

    return {
      upper: sma + standardDeviation * stdDev,
      middle: sma,
      lower: sma - standardDeviation * stdDev,
    }
  }

  static calculateAllIndicators(prices: number[]): TechnicalIndicators {
    return {
      rsi: this.calculateRSI(prices),
      macd: this.calculateMACD(prices),
      ema: {
        ema12: this.calculateEMA(prices, 12),
        ema26: this.calculateEMA(prices, 26),
      },
      bollinger: this.calculateBollingerBands(prices),
      sma: {
        sma20: this.calculateSMA(prices, 20),
        sma50: this.calculateSMA(prices, 50),
      },
    }
  }

  static generateSignal(
    indicators: TechnicalIndicators,
    currentPrice: number,
  ): {
    action: "BUY" | "SELL" | "HOLD"
    confidence: number
    reasons: string[]
  } {
    const reasons: string[] = []
    let bullishSignals = 0
    let bearishSignals = 0
    let totalSignals = 0

    // RSI Analysis
    if (indicators.rsi < 30) {
      bullishSignals++
      reasons.push("RSI oversold (< 30)")
    } else if (indicators.rsi > 70) {
      bearishSignals++
      reasons.push("RSI overbought (> 70)")
    }
    totalSignals++

    // MACD Analysis
    if (indicators.macd.macd > indicators.macd.signal && indicators.macd.histogram > 0) {
      bullishSignals++
      reasons.push("MACD bullish crossover")
    } else if (indicators.macd.macd < indicators.macd.signal && indicators.macd.histogram < 0) {
      bearishSignals++
      reasons.push("MACD bearish crossover")
    }
    totalSignals++

    // EMA Analysis
    if (indicators.ema.ema12 > indicators.ema.ema26) {
      bullishSignals++
      reasons.push("EMA12 above EMA26")
    } else {
      bearishSignals++
      reasons.push("EMA12 below EMA26")
    }
    totalSignals++

    // Bollinger Bands Analysis
    if (currentPrice <= indicators.bollinger.lower) {
      bullishSignals++
      reasons.push("Price at lower Bollinger Band")
    } else if (currentPrice >= indicators.bollinger.upper) {
      bearishSignals++
      reasons.push("Price at upper Bollinger Band")
    }
    totalSignals++

    // SMA Analysis
    if (currentPrice > indicators.sma.sma20 && indicators.sma.sma20 > indicators.sma.sma50) {
      bullishSignals++
      reasons.push("Price above SMA20, SMA20 above SMA50")
    } else if (currentPrice < indicators.sma.sma20 && indicators.sma.sma20 < indicators.sma.sma50) {
      bearishSignals++
      reasons.push("Price below SMA20, SMA20 below SMA50")
    }
    totalSignals++

    // Determine action and confidence
    const bullishRatio = bullishSignals / totalSignals
    const bearishRatio = bearishSignals / totalSignals

    let action: "BUY" | "SELL" | "HOLD"
    let confidence: number

    if (bullishRatio >= 0.6) {
      action = "BUY"
      confidence = Math.min(bullishRatio * 100, 95)
    } else if (bearishRatio >= 0.6) {
      action = "SELL"
      confidence = Math.min(bearishRatio * 100, 95)
    } else {
      action = "HOLD"
      confidence = 50 + Math.abs(bullishRatio - bearishRatio) * 50
    }

    return { action, confidence, reasons }
  }
}
