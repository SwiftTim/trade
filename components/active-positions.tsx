"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"

interface Position {
  id: string
  symbol: string
  side: "LONG" | "SHORT"
  size: number
  entryPrice: number
  currentPrice: number
  pnl: number
  pnlPercent: number
}

export function ActivePositions() {
  const positions: Position[] = [
    {
      id: "1",
      symbol: "EURUSD",
      side: "LONG",
      size: 0.5,
      entryPrice: 1.085,
      currentPrice: 1.0875,
      pnl: 125.0,
      pnlPercent: 2.3,
    },
    {
      id: "2",
      symbol: "GBPJPY",
      side: "SHORT",
      size: 0.3,
      entryPrice: 189.8,
      currentPrice: 189.45,
      pnl: 105.0,
      pnlPercent: 1.8,
    },
    {
      id: "3",
      symbol: "XAUUSD",
      side: "LONG",
      size: 0.1,
      entryPrice: 2040.0,
      currentPrice: 2045.3,
      pnl: 53.0,
      pnlPercent: 0.26,
    },
  ]

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Active Positions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {positions.map((position) => (
          <div key={position.id} className="p-3 bg-slate-700/50 rounded-lg border border-slate-600">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-white">{position.symbol}</span>
                <Badge variant={position.side === "LONG" ? "default" : "destructive"}>{position.side}</Badge>
              </div>
              <div className="flex items-center space-x-1">
                {position.pnl >= 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-400" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-400" />
                )}
                <span className={`text-sm font-medium ${position.pnl >= 0 ? "text-green-400" : "text-red-400"}`}>
                  ${position.pnl.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="text-xs text-slate-400 space-y-1">
              <div>Size: {position.size} lots</div>
              <div>
                Entry: {position.entryPrice} | Current: {position.currentPrice}
              </div>
              <div className={position.pnl >= 0 ? "text-green-400" : "text-red-400"}>
                P&L: {position.pnlPercent >= 0 ? "+" : ""}
                {position.pnlPercent.toFixed(2)}%
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
