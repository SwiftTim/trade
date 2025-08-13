"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Calendar, CreditCard, AlertTriangle } from "lucide-react"

interface UserSubscription {
  id: string
  planId: string
  status: "active" | "cancelled" | "past_due" | "trialing"
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
}

export function SubscriptionManager() {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      fetchSubscription()
    }
  }, [user])

  const fetchSubscription = async () => {
    try {
      const response = await fetch(`/api/subscriptions?userId=${user?.id}`)
      const result = await response.json()
      if (result.success) {
        setSubscription(result.data)
      }
    } catch (error) {
      console.error("Failed to fetch subscription:", error)
    }
  }

  const handleCancelSubscription = async () => {
    if (!subscription) return

    setLoading(true)

    try {
      const response = await fetch("/api/subscriptions/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscriptionId: subscription.id,
          cancelAtPeriodEnd: true,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Subscription cancelled",
          description: "Your subscription will end at the current period.",
        })
        fetchSubscription()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Cancellation failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-600"
      case "trialing":
        return "bg-blue-600"
      case "past_due":
        return "bg-yellow-600"
      case "cancelled":
        return "bg-red-600"
      default:
        return "bg-gray-600"
    }
  }

  if (!subscription) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6 text-center">
          <p className="text-slate-400">No active subscription found.</p>
          <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
            <a href="/pricing">View Plans</a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            Current Subscription
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white capitalize">
                {subscription.planId.replace("_monthly", "").replace("_", " ")} Plan
              </h3>
              <p className="text-slate-400">Plan ID: {subscription.planId}</p>
            </div>
            <Badge className={`${getStatusColor(subscription.status)} text-white`}>
              {subscription.status.toUpperCase()}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <div>
                <p className="text-sm text-slate-400">Current Period</p>
                <p className="text-white">
                  {new Date(subscription.currentPeriodStart).toLocaleDateString()} -{" "}
                  {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-slate-400" />
              <div>
                <p className="text-sm text-slate-400">Auto Renewal</p>
                <p className="text-white">{subscription.cancelAtPeriodEnd ? "Disabled" : "Enabled"}</p>
              </div>
            </div>
          </div>

          {subscription.cancelAtPeriodEnd && (
            <div className="bg-yellow-600/20 border border-yellow-600/50 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                <div>
                  <p className="font-medium text-yellow-400">Subscription Ending</p>
                  <p className="text-sm text-yellow-300">
                    Your subscription will end on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-4">
            <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-700 bg-transparent">
              <a href="/pricing">Change Plan</a>
            </Button>

            {!subscription.cancelAtPeriodEnd && (
              <Button
                onClick={handleCancelSubscription}
                disabled={loading}
                variant="destructive"
                className="bg-red-600 hover:bg-red-700"
              >
                {loading ? "Cancelling..." : "Cancel Subscription"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Usage Limits */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Plan Limits & Usage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-slate-700/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">15/25</div>
              <div className="text-sm text-slate-400">Signals Today</div>
            </div>

            <div className="text-center p-4 bg-slate-700/50 rounded-lg">
              <div className="text-2xl font-bold text-green-400">2/3</div>
              <div className="text-sm text-slate-400">Traders Following</div>
            </div>

            <div className="text-center p-4 bg-slate-700/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">1/2</div>
              <div className="text-sm text-slate-400">Broker Connections</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
