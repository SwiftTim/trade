import { NextResponse } from "next/server"

interface SubscriptionPlan {
  id: string
  name: string
  tier: "free" | "basic" | "premium" | "vip"
  price: number
  billingPeriod: "monthly" | "yearly"
  features: string[]
  limits: {
    signalsPerDay: number
    tradersToFollow: number
    brokerConnections: number
    prioritySupport: boolean
    advancedAnalytics: boolean
    customRiskSettings: boolean
  }
  popular?: boolean
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    tier: "free",
    price: 0,
    billingPeriod: "monthly",
    features: ["5 signals per day", "Follow 1 trader", "Basic analytics", "Email support", "1 broker connection"],
    limits: {
      signalsPerDay: 5,
      tradersToFollow: 1,
      brokerConnections: 1,
      prioritySupport: false,
      advancedAnalytics: false,
      customRiskSettings: false,
    },
  },
  {
    id: "basic_monthly",
    name: "Basic",
    tier: "basic",
    price: 49,
    billingPeriod: "monthly",
    features: [
      "25 signals per day",
      "Follow up to 3 traders",
      "Advanced analytics",
      "Priority email support",
      "2 broker connections",
      "Risk management tools",
    ],
    limits: {
      signalsPerDay: 25,
      tradersToFollow: 3,
      brokerConnections: 2,
      prioritySupport: true,
      advancedAnalytics: true,
      customRiskSettings: true,
    },
  },
  {
    id: "premium_monthly",
    name: "Premium",
    tier: "premium",
    price: 99,
    billingPeriod: "monthly",
    popular: true,
    features: [
      "Unlimited signals",
      "Follow up to 10 traders",
      "Real-time analytics",
      "24/7 priority support",
      "5 broker connections",
      "Custom risk settings",
      "API access",
    ],
    limits: {
      signalsPerDay: -1, // Unlimited
      tradersToFollow: 10,
      brokerConnections: 5,
      prioritySupport: true,
      advancedAnalytics: true,
      customRiskSettings: true,
    },
  },
  {
    id: "vip_monthly",
    name: "VIP",
    tier: "vip",
    price: 199,
    billingPeriod: "monthly",
    features: [
      "Everything in Premium",
      "Follow unlimited traders",
      "Dedicated account manager",
      "Custom signal creation",
      "Unlimited broker connections",
      "White-label options",
      "Direct trader communication",
    ],
    limits: {
      signalsPerDay: -1,
      tradersToFollow: -1, // Unlimited
      brokerConnections: -1, // Unlimited
      prioritySupport: true,
      advancedAnalytics: true,
      customRiskSettings: true,
    },
  },
]

export async function GET() {
  return NextResponse.json({
    success: true,
    data: subscriptionPlans,
  })
}
