"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { BrokerConnection } from "@/components/broker-connection"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Zap, Lock, TrendingUp } from "lucide-react"

export default function BrokersPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-white">Broker Integration</h1>
            <p className="text-slate-400">Connect your trading accounts to enable copy trading</p>
          </div>

          {/* Security Features */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4 text-center">
                <Shield className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white mb-1">Non-Custodial</h3>
                <p className="text-xs text-slate-400">Your funds stay in your broker account</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4 text-center">
                <Lock className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white mb-1">Trade-Only API</h3>
                <p className="text-xs text-slate-400">No withdrawal permissions required</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4 text-center">
                <Zap className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white mb-1">Instant Execution</h3>
                <p className="text-xs text-slate-400">Signals copied within milliseconds</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white mb-1">Risk Management</h3>
                <p className="text-xs text-slate-400">Automated position sizing and stops</p>
              </CardContent>
            </Card>
          </div>

          {/* Broker Connection Component */}
          <BrokerConnection />

          {/* Integration Guide */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Integration Guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Badge className="bg-blue-600 text-white min-w-6 h-6 flex items-center justify-center text-xs">
                    1
                  </Badge>
                  <div>
                    <h4 className="font-medium text-white">Create API Keys</h4>
                    <p className="text-sm text-slate-400">
                      Log into your broker account and generate trade-only API keys with no withdrawal permissions.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Badge className="bg-blue-600 text-white min-w-6 h-6 flex items-center justify-center text-xs">
                    2
                  </Badge>
                  <div>
                    <h4 className="font-medium text-white">Connect Account</h4>
                    <p className="text-sm text-slate-400">
                      Enter your API credentials above to establish a secure connection with your trading account.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Badge className="bg-blue-600 text-white min-w-6 h-6 flex items-center justify-center text-xs">
                    3
                  </Badge>
                  <div>
                    <h4 className="font-medium text-white">Start Copy Trading</h4>
                    <p className="text-sm text-slate-400">
                      Once connected, you can automatically copy signals from our professional traders.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
