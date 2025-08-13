"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, DollarSign, Users, Clock, Target } from "lucide-react"
import Link from "next/link"

export default function DemoPage() {
  const [signals, setSignals] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        const response = await fetch("/api/signals")
        const data = await response.json()
        if (data.success) {
          setSignals(data.signals || [])
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading live trading signals...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Live Trading Signals Demo</h1>
          <p className="text-slate-300 mb-2">
            Real-time signals from professional traders - This data updates every 15 seconds!
          </p>
          {lastUpdate && (
            <p className="text-sm text-blue-400 mb-6">
              Last updated: {lastUpdate.toLocaleTimeString()} - Data refreshes automatically
            </p>
          )}
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button className="bg-blue-600 hover:bg-blue-700">Get Full Access - Register Now</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="border-blue-400 text-blue-400 bg-transparent">
                Already Have Account? Login
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-6">
          {signals.map((signal, index) => (
            <Card key={signal.id} className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    {signal.direction === "BUY" ? (
                      <TrendingUp className="h-5 w-5 text-green-400" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-400" />
                    )}
                    {signal.pair}
                    <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                      LIVE
                    </Badge>
                  </CardTitle>
                  <Badge
                    variant={signal.direction === "BUY" ? "default" : "destructive"}
                    className={signal.direction === "BUY" ? "bg-green-600" : "bg-red-600"}
                  >
                    {signal.direction}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-slate-400">Entry Price</div>
                    <div className="font-semibold">{signal.entryPrice}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">Stop Loss</div>
                    <div className="font-semibold text-red-400">{signal.stopLoss}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">Take Profit</div>
                    <div className="font-semibold text-green-400">{signal.takeProfit}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">Risk/Reward</div>
                    <div className="font-semibold">1:{signal.riskReward}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-300">{signal.trader}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-300">{signal.confidence}% confidence</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-300">{signal.timeframe}</span>
                  </div>
                </div>

                <div className="bg-slate-700 p-3 rounded-lg mb-4">
                  <div className="text-sm text-slate-300">{signal.analysis}</div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700" disabled>
                    <DollarSign className="h-4 w-4 mr-2" />
                    Copy Trade (Login Required)
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Card className="bg-slate-800 border-slate-700 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Ready to Start Trading?</h3>
            <p className="text-slate-300 mb-6">
              This is just a preview! Register now to copy these trades automatically, access your portfolio dashboard,
              and get real-time notifications.
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Start Trading - Register Free
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}
