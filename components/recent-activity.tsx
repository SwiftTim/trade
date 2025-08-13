"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, TrendingUp, TrendingDown, X } from "lucide-react"

interface Activity {
  id: string
  type: "signal_copied" | "position_closed" | "signal_cancelled"
  symbol: string
  action: "BUY" | "SELL"
  result?: "profit" | "loss"
  amount?: number
  timestamp: string
}

export function RecentActivity() {
  const activities: Activity[] = [
    {
      id: "1",
      type: "position_closed",
      symbol: "USDJPY",
      action: "BUY",
      result: "profit",
      amount: 245.5,
      timestamp: "10 min ago",
    },
    {
      id: "2",
      type: "signal_copied",
      symbol: "EURUSD",
      action: "BUY",
      timestamp: "15 min ago",
    },
    {
      id: "3",
      type: "position_closed",
      symbol: "GBPUSD",
      action: "SELL",
      result: "loss",
      amount: -85.2,
      timestamp: "1 hour ago",
    },
    {
      id: "4",
      type: "signal_cancelled",
      symbol: "XAUUSD",
      action: "SELL",
      timestamp: "2 hours ago",
    },
  ]

  const getActivityIcon = (type: string, action: string, result?: string) => {
    if (type === "signal_cancelled") return <X className="h-3 w-3 text-gray-400" />
    if (type === "position_closed") {
      return result === "profit" ? (
        <TrendingUp className="h-3 w-3 text-green-400" />
      ) : (
        <TrendingDown className="h-3 w-3 text-red-400" />
      )
    }
    return action === "BUY" ? (
      <TrendingUp className="h-3 w-3 text-blue-400" />
    ) : (
      <TrendingDown className="h-3 w-3 text-blue-400" />
    )
  }

  const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case "signal_copied":
        return `Copied ${activity.action} signal for ${activity.symbol}`
      case "position_closed":
        return `Closed ${activity.action} position on ${activity.symbol}`
      case "signal_cancelled":
        return `${activity.action} signal cancelled for ${activity.symbol}`
      default:
        return "Unknown activity"
    }
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Clock className="mr-2 h-5 w-5 text-blue-400" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
            <div className="flex items-center space-x-3">
              {getActivityIcon(activity.type, activity.action, activity.result)}
              <div>
                <div className="text-sm text-white">{getActivityText(activity)}</div>
                <div className="text-xs text-slate-400">{activity.timestamp}</div>
              </div>
            </div>
            {activity.amount && (
              <Badge variant={activity.result === "profit" ? "default" : "destructive"} className="text-xs">
                {activity.amount > 0 ? "+" : ""}${activity.amount.toFixed(2)}
              </Badge>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
