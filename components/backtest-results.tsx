"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
  trades: any[]
}

interface BacktestResultsProps {
  result: BacktestResult | null
  isLoading: boolean
  onRunBacktest: (params: any) => void
}

export function BacktestResults({ result, isLoading, onRunBacktest }: BacktestResultsProps) {
  const [selectedStrategy, setSelectedStrategy] = useState("rsi_mean_reversion")
  const [selectedPair, setSelectedPair] = useState("EURUSD")
  const [startDate, setStartDate] = useState("2023-01-01")
  const [endDate, setEndDate] = useState("2023-12-31")

  const handleRunBacktest = () => {
    onRunBacktest({
      strategy: selectedStrategy,
      pair: selectedPair,
      timeframe: "1h",
      startDate,
      endDate,
    })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`
  }

  return (
    <div className="space-y-6">
      {/* Backtest Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Backtest Configuration</CardTitle>
          <CardDescription>Test trading strategies against historical data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Strategy</label>
              <select
                value={selectedStrategy}
                onChange={(e) => setSelectedStrategy(e.target.value)}
                className="w-full mt-1 p-2 border rounded-md bg-background"
              >
                <option value="rsi_mean_reversion">RSI Mean Reversion</option>
                <option value="moving_average_crossover">MA Crossover</option>
                <option value="trend_following">Trend Following</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Pair</label>
              <select
                value={selectedPair}
                onChange={(e) => setSelectedPair(e.target.value)}
                className="w-full mt-1 p-2 border rounded-md bg-background"
              >
                <option value="EURUSD">EUR/USD</option>
                <option value="GBPUSD">GBP/USD</option>
                <option value="USDJPY">USD/JPY</option>
                <option value="XAUUSD">XAU/USD</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full mt-1 p-2 border rounded-md bg-background"
              />
            </div>
            <div>
              <label className="text-sm font-medium">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full mt-1 p-2 border rounded-md bg-background"
              />
            </div>
          </div>
          <Button onClick={handleRunBacktest} disabled={isLoading} className="w-full md:w-auto">
            {isLoading ? "Running Backtest..." : "Run Backtest"}
          </Button>
        </CardContent>
      </Card>

      {/* Backtest Results */}
      {result && (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trades">Trade History</TabsTrigger>
            <TabsTrigger value="metrics">Detailed Metrics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Return</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{formatPercentage(result.totalReturn)}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{result.winRate.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">
                    {result.winningTrades}/{result.totalTrades} trades
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Max Drawdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">-{result.maxDrawdown.toFixed(2)}%</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Profit Factor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{result.profitFactor.toFixed(2)}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Strategy Performance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Strategy:</span>
                    <Badge variant="outline">{result.strategy}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Pair:</span>
                    <span className="font-medium">{result.pair}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Period:</span>
                    <span className="font-medium">
                      {new Date(result.startDate).toLocaleDateString()} -{" "}
                      {new Date(result.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Trades:</span>
                    <span className="font-medium">{result.totalTrades}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Win:</span>
                    <span className="font-medium text-green-600">{formatCurrency(result.averageWin)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Loss:</span>
                    <span className="font-medium text-red-600">{formatCurrency(-result.averageLoss)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trades" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Trade History</CardTitle>
                <CardDescription>Detailed list of all trades executed during the backtest</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {result.trades.map((trade, index) => (
                    <div key={trade.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge variant={trade.direction === "BUY" ? "default" : "secondary"}>{trade.direction}</Badge>
                        <div>
                          <p className="font-medium">{result.pair}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(trade.entryDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${trade.pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {formatCurrency(trade.pnl)}
                        </p>
                        <p className="text-sm text-muted-foreground">{trade.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Risk Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Sharpe Ratio:</span>
                    <span className="font-medium">{result.sharpeRatio.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max Drawdown:</span>
                    <span className="font-medium text-red-600">-{result.maxDrawdown.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Profit Factor:</span>
                    <span className="font-medium">{result.profitFactor.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Trade Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Trades:</span>
                    <span className="font-medium">{result.totalTrades}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Winning Trades:</span>
                    <span className="font-medium text-green-600">{result.winningTrades}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Losing Trades:</span>
                    <span className="font-medium text-red-600">{result.losingTrades}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Win Rate:</span>
                    <span className="font-medium">{result.winRate.toFixed(1)}%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
