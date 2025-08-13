"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Clock,
  Target,
  Search,
  Activity,
  BarChart3,
  Zap,
} from "lucide-react"
import Link from "next/link"

interface Signal {
  id: string
  pair: string
  direction: "BUY" | "SELL"
  entryPrice: number
  stopLoss: number
  takeProfit: number
  confidence: number
  timestamp: string
  trader: string
  status: string
  analysis: string
  riskReward: number
  timeframe: string
  currentPrice: number
  pnl: number
}

interface PerformanceMetrics {
  winRate: number
  totalSignals: number
  avgPnl: number
  sharpeRatio: number
  maxDrawdown: number
}

export default function DemoPage() {
  const [signals, setSignals] = useState<Signal[]>([])
  const [performance, setPerformance] = useState<PerformanceMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDirection, setFilterDirection] = useState<string>("all")
  const [filterPair, setFilterPair] = useState<string>("all")

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        const response = await fetch("/api/signals")
        const data = await response.json()
        if (data.success) {
          setSignals(data.signals || [])
          setPerformance(data.performance || null)
          setLastUpdate(new Date())
        }
      } catch (error) {
        console.error("Error fetching signals:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSignals()
    const interval = setInterval(fetchSignals, 15000)

    return () => clearInterval(interval)
  }, [])

  const filteredSignals = signals.filter((signal) => {
    const matchesSearch =
      signal.pair.toLowerCase().includes(searchTerm.toLowerCase()) ||
      signal.trader.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDirection = filterDirection === "all" || signal.direction === filterDirection
    const matchesPair = filterPair === "all" || signal.pair === filterPair

    return matchesSearch && matchesDirection && matchesPair
  })

  const uniquePairs = [...new Set(signals.map((s) => s.pair))]

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading live trading signals...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Live Trading Signals Demo
          </h1>
          <p className="text-slate-300 mb-2">Real-time signals from professional traders with live market analysis</p>
          {lastUpdate && (
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <p className="text-sm text-green-400">Live • Last updated: {lastUpdate.toLocaleTimeString()}</p>
            </div>
          )}
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Zap className="h-4 w-4 mr-2" />
                Get Full Access - Register Now
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="border-blue-400 text-blue-400 bg-transparent hover:bg-blue-400/10">
                Already Have Account? Login
              </Button>
            </Link>
          </div>
        </div>

        {/* Performance Metrics */}
        {performance && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-400">{performance.winRate.toFixed(1)}%</div>
                <div className="text-sm text-slate-400">Win Rate</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">{performance.totalSignals}</div>
                <div className="text-sm text-slate-400">Total Signals</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">{performance.avgPnl.toFixed(2)}%</div>
                <div className="text-sm text-slate-400">Avg P&L</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400">{performance.sharpeRatio.toFixed(2)}</div>
                <div className="text-sm text-slate-400">Sharpe Ratio</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-400">{performance.maxDrawdown.toFixed(2)}%</div>
                <div className="text-sm text-slate-400">Max Drawdown</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters and Search */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search by pair or trader..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
              <Select value={filterDirection} onValueChange={setFilterDirection}>
                <SelectTrigger className="w-full md:w-32 bg-slate-700 border-slate-600">
                  <SelectValue placeholder="Direction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="BUY">Buy</SelectItem>
                  <SelectItem value="SELL">Sell</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterPair} onValueChange={setFilterPair}>
                <SelectTrigger className="w-full md:w-32 bg-slate-700 border-slate-600">
                  <SelectValue placeholder="Pair" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Pairs</SelectItem>
                  {uniquePairs.map((pair) => (
                    <SelectItem key={pair} value={pair}>
                      {pair}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Signals Grid */}
        <div className="grid gap-6">
          {filteredSignals.map((signal, index) => (
            <Card
              key={signal.id}
              className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    {signal.direction === "BUY" ? (
                      <TrendingUp className="h-5 w-5 text-green-400" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-400" />
                    )}
                    {signal.pair}
                    <Badge variant="outline" className="text-xs text-green-400 border-green-400 animate-pulse">
                      <Activity className="h-3 w-3 mr-1" />
                      LIVE
                    </Badge>
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={signal.direction === "BUY" ? "default" : "destructive"}
                      className={`${signal.direction === "BUY" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"} transition-colors`}
                    >
                      {signal.direction}
                    </Badge>
                    {signal.pnl !== 0 && (
                      <Badge
                        variant="outline"
                        className={signal.pnl > 0 ? "text-green-400 border-green-400" : "text-red-400 border-red-400"}
                      >
                        {signal.pnl > 0 ? "+" : ""}
                        {signal.pnl.toFixed(2)}%
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-slate-700/50 p-3 rounded-lg">
                    <div className="text-sm text-slate-400">Entry Price</div>
                    <div className="font-semibold text-lg">{signal.entryPrice}</div>
                  </div>
                  <div className="bg-slate-700/50 p-3 rounded-lg">
                    <div className="text-sm text-slate-400">Stop Loss</div>
                    <div className="font-semibold text-lg text-red-400">{signal.stopLoss}</div>
                  </div>
                  <div className="bg-slate-700/50 p-3 rounded-lg">
                    <div className="text-sm text-slate-400">Take Profit</div>
                    <div className="font-semibold text-lg text-green-400">{signal.takeProfit}</div>
                  </div>
                  <div className="bg-slate-700/50 p-3 rounded-lg">
                    <div className="text-sm text-slate-400">Risk/Reward</div>
                    <div className="font-semibold text-lg">1:{signal.riskReward}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-300 font-medium">{signal.trader}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-300">
                        <span className="font-medium">{signal.confidence}%</span> confidence
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-300">{signal.timeframe}</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 p-4 rounded-lg mb-4 border-l-4 border-blue-400">
                  <div className="text-sm text-slate-300 leading-relaxed">{signal.analysis}</div>
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                    disabled
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Copy Trade (Login Required)
                  </Button>
                  <Button
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                    disabled
                  >
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSignals.length === 0 && (
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="text-slate-400 mb-2">No signals match your filters</div>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setFilterDirection("all")
                  setFilterPair("all")
                }}
                variant="outline"
                className="border-slate-600 text-slate-300"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Call to Action */}
        <div className="mt-8 text-center">
          <Card className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-slate-600 backdrop-blur-sm">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Start Trading?</h3>
              <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                This is just a preview! Register now to copy these trades automatically, access your portfolio
                dashboard, get real-time notifications, and track your performance with detailed analytics.
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Start Trading - Register Free
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-blue-400 text-blue-400 hover:bg-blue-400/10 bg-transparent"
                  >
                    View Pricing Plans
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
