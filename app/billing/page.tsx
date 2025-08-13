"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { SubscriptionManager } from "@/components/subscription-manager"

export default function BillingPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-white">Billing & Subscription</h1>
            <p className="text-slate-400">Manage your subscription and billing information</p>
          </div>

          {/* Subscription Manager */}
          <SubscriptionManager />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
