"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Copy } from "lucide-react"
import { Activity } from "lucide-react" // Added import for Activity

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
}

export function SignalsFeed() {
  const signals: Signal[] = [
    {
      id: "1",
      symbol: "EURUSD",
      action: "BUY",
      price: 1.0875,
      target: 1.0925,
      stopLoss: 1.0825,
      confidence: 95,
      timestamp: "2 min ago",
      trader: "ProTrader_Alpha",
      status: "active",
    },
    {
      id: "2",
      symbol: "GBPJPY",
      action: "SELL",
      price: 189.45,
      target: 188.8,
      stopLoss: 190.1,
      confidence: 88,
      timestamp: "5 min ago",
      trader: "FX_Master",
      status: "active",
    },
    {
      id: "3",
      symbol: "XAUUSD",
      action: "BUY",
      price: 2045.3,
      target: 2055.0,
      stopLoss: 2035.0,
      confidence: 92,
      timestamp: "8 min ago",
      trader: "GoldExpert",
      status: "filled",
    },
  ]

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
              <div className={`p-2 rounded-full ${signal.action === "BUY" ? "bg-green-600/20" : "bg-red-600/20"}`}>
                {signal.action === "BUY" ? (
                  <TrendingUp className="h-4 w-4 text-green-400" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-400" />
                )}
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-white">{signal.symbol}</span>
                  <Badge variant={signal.action === "BUY" ? "default" : "destructive"}>{signal.action}</Badge>
                  <Badge variant="outline" className="text-slate-300 border-slate-600">
                    {signal.confidence}% confidence
                  </Badge>
                </div>
                <div className="text-sm text-slate-400 mt-1">
                  Entry: {signal.price} | Target: {signal.target} | SL: {signal.stopLoss}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  by {signal.trader} • {signal.timestamp}
                </div>
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
