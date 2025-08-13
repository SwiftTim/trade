"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Check, Star } from "lucide-react"

interface SubscriptionPlan {
  id: string
  name: string
  tier: "free" | "basic" | "premium" | "vip"
  price: number
  billingPeriod: "monthly" | "yearly"
  features: string[]
  popular?: boolean
}

export default function PricingPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState("")
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      const response = await fetch("/api/subscriptions/plans")
      const result = await response.json()
      if (result.success) {
        setPlans(result.data)
      }
    } catch (error) {
      console.error("Failed to fetch plans:", error)
    }
  }

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to subscribe to a plan.",
        variant: "destructive",
      })
      return
    }

    setLoading(planId)

    try {
      const response = await fetch("/api/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          planId,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Subscription activated!",
          description: "Your new plan is now active.",
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      })
    } finally {
      setLoading("")
    }
  }

  const getPlanColor = (tier: string) => {
    switch (tier) {
      case "vip":
        return "border-purple-500 bg-purple-500/10"
      case "premium":
        return "border-blue-500 bg-blue-500/10"
      case "basic":
        return "border-green-500 bg-green-500/10"
      default:
        return "border-slate-600"
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Choose Your Plan</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Unlock the full potential of copy trading with our professional subscription plans
          </p>
        </div>

        {/* Current Plan */}
        {user && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">Current Plan</h3>
                  <p className="text-slate-400">
                    You are currently on the{" "}
                    <span className="font-medium text-white capitalize">{user.subscription_tier}</span> plan
                  </p>
                </div>
                <Badge className={`${getPlanColor(user.subscription_tier)} text-white`}>
                  {user.subscription_tier.toUpperCase()}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative ${getPlanColor(plan.tier)} ${
                plan.popular ? "ring-2 ring-blue-500" : ""
              } transition-all hover:scale-105`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-3 py-1">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-white text-xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-white">${plan.price}</span>
                  {plan.price > 0 && <span className="text-slate-400">/month</span>}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={loading === plan.id || user?.subscription_tier === plan.tier}
                  className={`w-full ${
                    plan.tier === "free"
                      ? "bg-slate-600 hover:bg-slate-700"
                      : plan.tier === "vip"
                        ? "bg-purple-600 hover:bg-purple-700"
                        : plan.tier === "premium"
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {loading === plan.id
                    ? "Processing..."
                    : user?.subscription_tier === plan.tier
                      ? "Current Plan"
                      : plan.price === 0
                        ? "Get Started"
                        : "Subscribe"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold text-white mb-2">Can I change my plan anytime?</h4>
              <p className="text-slate-400">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately for upgrades
                and at the end of your billing cycle for downgrades.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-2">Is there a free trial?</h4>
              <p className="text-slate-400">
                All paid plans come with a 7-day free trial. You can cancel anytime during the trial period without
                being charged.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-2">What payment methods do you accept?</h4>
              <p className="text-slate-400">
                We accept all major credit cards, PayPal, and bank transfers. All payments are processed securely
                through Stripe.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-2">Can I cancel my subscription?</h4>
              <p className="text-slate-400">
                Yes, you can cancel your subscription at any time. You'll continue to have access to your plan features
                until the end of your current billing period.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
