"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, DollarSign, Activity } from "lucide-react"

export function PortfolioStats() {
  const stats = [
    {
      title: "Total Portfolio Value",
      value: "$127,450.32",
      change: "+12.5%",
      changeType: "positive" as const,
      icon: DollarSign,
    },
    {
      title: "Today's P&L",
      value: "+$2,847.21",
      change: "+2.3%",
      changeType: "positive" as const,
      icon: TrendingUp,
    },
    {
      title: "Active Signals",
      value: "8",
      change: "3 new",
      changeType: "neutral" as const,
      icon: Activity,
    },
    {
      title: "Win Rate",
      value: "87.5%",
      change: "+1.2%",
      changeType: "positive" as const,
      icon: TrendingUp,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <p
              className={`text-xs ${
                stat.changeType === "positive"
                  ? "text-green-400"
                  : stat.changeType === "negative"
                    ? "text-red-400"
                    : "text-slate-400"
              }`}
            >
              {stat.change} from yesterday
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
