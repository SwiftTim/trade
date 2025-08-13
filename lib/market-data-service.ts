interface MarketDataProvider {
  name: string
  fetchPrice: (symbol: string) => Promise<PriceData>
  fetchHistorical: (symbol: string, period: string) => Promise<HistoricalData[]>
}

interface PriceData {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
  timestamp: number
  bid?: number
  ask?: number
}

interface HistoricalData {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

class AlphaVantageProvider implements MarketDataProvider {
  name = "Alpha Vantage"
  private apiKey: string
  private baseUrl = "https://www.alphavantage.co/query"

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async fetchPrice(symbol: string): Promise<PriceData> {
    try {
      const response = await fetch(`${this.baseUrl}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.apiKey}`)
      const data = await response.json()

      if (data["Error Message"] || data["Note"]) {
        throw new Error("API limit reached or invalid symbol")
      }

      const quote = data["Global Quote"]
      return {
        symbol: quote["01. symbol"],
        price: Number.parseFloat(quote["05. price"]),
        change: Number.parseFloat(quote["09. change"]),
        changePercent: Number.parseFloat(quote["10. change percent"].replace("%", "")),
        volume: Number.parseInt(quote["06. volume"]),
        timestamp: Date.now(),
      }
    } catch (error) {
      throw new Error(`Alpha Vantage API error: ${error}`)
    }
  }

  async fetchHistorical(symbol: string, period = "1min"): Promise<HistoricalData[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${period}&apikey=${this.apiKey}`,
      )
      const data = await response.json()

      const timeSeries = data[`Time Series (${period})`]
      if (!timeSeries) {
        throw new Error("No historical data available")
      }

      return Object.entries(timeSeries)
        .map(([timestamp, values]: [string, any]) => ({
          timestamp: new Date(timestamp).getTime(),
          open: Number.parseFloat(values["1. open"]),
          high: Number.parseFloat(values["2. high"]),
          low: Number.parseFloat(values["3. low"]),
          close: Number.parseFloat(values["4. close"]),
          volume: Number.parseInt(values["5. volume"]),
        }))
        .slice(0, 100) // Limit to 100 data points
    } catch (error) {
      throw new Error(`Alpha Vantage historical data error: ${error}`)
    }
  }
}

class BinanceProvider implements MarketDataProvider {
  name = "Binance"
  private baseUrl = "https://api.binance.com/api/v3"

  async fetchPrice(symbol: string): Promise<PriceData> {
    try {
      // Convert symbol format (AAPL -> BTCUSDT for crypto)
      const binanceSymbol = this.convertSymbol(symbol)

      const [tickerResponse, bookResponse] = await Promise.all([
        fetch(`${this.baseUrl}/ticker/24hr?symbol=${binanceSymbol}`),
        fetch(`${this.baseUrl}/ticker/bookTicker?symbol=${binanceSymbol}`),
      ])

      const ticker = await tickerResponse.json()
      const book = await bookResponse.json()

      return {
        symbol: ticker.symbol,
        price: Number.parseFloat(ticker.lastPrice),
        change: Number.parseFloat(ticker.priceChange),
        changePercent: Number.parseFloat(ticker.priceChangePercent),
        volume: Number.parseFloat(ticker.volume),
        timestamp: Date.now(),
        bid: Number.parseFloat(book.bidPrice),
        ask: Number.parseFloat(book.askPrice),
      }
    } catch (error) {
      throw new Error(`Binance API error: ${error}`)
    }
  }

  async fetchHistorical(symbol: string, period = "1m"): Promise<HistoricalData[]> {
    try {
      const binanceSymbol = this.convertSymbol(symbol)
      const response = await fetch(`${this.baseUrl}/klines?symbol=${binanceSymbol}&interval=${period}&limit=100`)
      const data = await response.json()

      return data.map((kline: any[]) => ({
        timestamp: kline[0],
        open: Number.parseFloat(kline[1]),
        high: Number.parseFloat(kline[2]),
        low: Number.parseFloat(kline[3]),
        close: Number.parseFloat(kline[4]),
        volume: Number.parseFloat(kline[5]),
      }))
    } catch (error) {
      throw new Error(`Binance historical data error: ${error}`)
    }
  }

  private convertSymbol(symbol: string): string {
    // Convert traditional symbols to crypto pairs
    const cryptoMap: { [key: string]: string } = {
      BTC: "BTCUSDT",
      ETH: "ETHUSDT",
      BNB: "BNBUSDT",
      ADA: "ADAUSDT",
      SOL: "SOLUSDT",
    }
    return cryptoMap[symbol] || `${symbol}USDT`
  }
}

export class MarketDataService {
  private providers: MarketDataProvider[] = []
  private cache = new Map<string, { data: PriceData; timestamp: number }>()
  private cacheTimeout = 30000 // 30 seconds

  constructor() {
    // Initialize providers based on available API keys
    if (process.env.ALPHA_VANTAGE_API_KEY) {
      this.providers.push(new AlphaVantageProvider(process.env.ALPHA_VANTAGE_API_KEY))
    }

    // Binance doesn't require API key for public data
    this.providers.push(new BinanceProvider())
  }

  async getPrice(symbol: string): Promise<PriceData> {
    // Check cache first
    const cacheKey = `price_${symbol}`
    const cached = this.cache.get(cacheKey)

    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data
    }

    // Try each provider until one succeeds
    for (const provider of this.providers) {
      try {
        const data = await provider.fetchPrice(symbol)
        this.cache.set(cacheKey, { data, timestamp: Date.now() })
        return data
      } catch (error) {
        console.warn(`${provider.name} failed for ${symbol}:`, error)
        continue
      }
    }

    throw new Error(`No provider could fetch data for ${symbol}`)
  }

  async getHistoricalData(symbol: string, period = "1m"): Promise<HistoricalData[]> {
    for (const provider of this.providers) {
      try {
        return await provider.fetchHistorical(symbol, period)
      } catch (error) {
        console.warn(`${provider.name} historical data failed for ${symbol}:`, error)
        continue
      }
    }

    throw new Error(`No provider could fetch historical data for ${symbol}`)
  }

  async getMultiplePrices(symbols: string[]): Promise<PriceData[]> {
    const promises = symbols.map((symbol) =>
      this.getPrice(symbol).catch((error) => {
        console.warn(`Failed to fetch ${symbol}:`, error)
        return null
      }),
    )

    const results = await Promise.all(promises)
    return results.filter((result): result is PriceData => result !== null)
  }

  clearCache(): void {
    this.cache.clear()
  }

  getProviderStatus(): { name: string; available: boolean }[] {
    return this.providers.map((provider) => ({
      name: provider.name,
      available: true, // Could add health checks here
    }))
  }
}

export const marketDataService = new MarketDataService()
