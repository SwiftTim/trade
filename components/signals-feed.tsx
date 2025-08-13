"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Copy, Activity } from "lucide-react"

interface Signal {
  id: string
  pair: string
  direction: "BUY" | "SELL"
  entryPrice: number
  takeProfit: number
  stopLoss: number
  confidence: number
  timestamp: string
  trader: string
  status: "active" | "filled" | "cancelled"
  pnl: number
  analysis: string
}

export function SignalsFeed() {
  const [signals, setSignals] = useState<Signal[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSignals = async () => {
    try {
      const response = await fetch("/api/signals")
      const data = await response.json()
      setSignals(data.signals || [])
    } catch (error) {
      console.error("Failed to fetch signals:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSignals()
    const interval = setInterval(fetchSignals, 15000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Activity className="mr-2 h-5 w-5 text-blue-400" />
            Live Trading Signals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-slate-400">Loading live signals...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Activity className="mr-2 h-5 w-5 text-blue-400" />
          Live Trading Signals
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {signals.map((signal) => (
          <div
            key={signal.id}
            className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600"
          >
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-full ${signal.direction === "BUY" ? "bg-green-600/20" : "bg-red-600/20"}`}>
                {signal.direction === "BUY" ? (
                  <TrendingUp className="h-4 w-4 text-green-400" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-400" />
                )}
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-white">{signal.pair}</span>
                  <Badge variant={signal.direction === "BUY" ? "default" : "destructive"}>{signal.direction}</Badge>
                  <Badge variant="outline" className="text-slate-300 border-slate-600">
                    {signal.confidence}% confidence
                  </Badge>
                  <Badge variant={signal.pnl >= 0 ? "default" : "destructive"} className="text-xs">
                    {signal.pnl >= 0 ? "+" : ""}
                    {signal.pnl.toFixed(2)} pips
                  </Badge>
                </div>
                <div className="text-sm text-slate-400 mt-1">
                  Entry: {signal.entryPrice} | Target: {signal.takeProfit} | SL: {signal.stopLoss}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  by {signal.trader} • {signal.timestamp}
                </div>
                <div className="text-xs text-slate-400 mt-1 max-w-md truncate">{signal.analysis}</div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Badge
                variant={signal.status === "active" ? "default" : signal.status === "filled" ? "secondary" : "outline"}
                className="text-xs"
              >
                {signal.status}
              </Badge>
              {signal.status === "active" && (
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
