import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Shield, Users, Zap, BarChart3, Eye } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-8 w-8 text-blue-400" />
            <span className="text-2xl font-bold text-white">CopyTrade Syndicate</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/demo">
              <Button variant="ghost" className="text-blue-400 hover:text-blue-300">
                <Eye className="h-4 w-4 mr-2" />
                Live Demo
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost" className="text-white hover:text-blue-400">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            Professional Trading Signals
            <span className="block text-blue-400">Copy Expert Trades</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Join our exclusive syndicate of professional traders. Get real-time signals, copy trades automatically, and
            grow your portfolio with proven strategies.
          </p>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <BarChart3 className="h-5 w-5 text-green-400" />
              <span className="text-green-400 font-semibold">LIVE TRADING PLATFORM</span>
            </div>
            <p className="text-slate-300 mb-4">
              This is a fully functional trading application with real-time signals, portfolio tracking, and automated
              copy trading.
            </p>
            <Link href="/demo">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 mr-4">
                <Eye className="h-4 w-4 mr-2" />
                See Live Trading Signals
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center space-x-4">
            <Link href="/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-800 bg-transparent"
              >
                Access Full Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <Shield className="h-12 w-12 text-blue-400 mb-4" />
              <CardTitle className="text-white">Non-Custodial</CardTitle>
              <CardDescription className="text-slate-300">
                Your funds stay in your broker account. We never hold your money.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <Zap className="h-12 w-12 text-blue-400 mb-4" />
              <CardTitle className="text-white">Real-Time Signals</CardTitle>
              <CardDescription className="text-slate-300">
                Get instant notifications for entry, exit, and risk management signals.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <Users className="h-12 w-12 text-blue-400 mb-4" />
              <CardTitle className="text-white">Expert Traders</CardTitle>
              <CardDescription className="text-slate-300">
                Follow verified traders with proven track records and transparent performance.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-400 mb-2">95%</div>
            <div className="text-slate-300">Success Rate</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-400 mb-2">$2.5M+</div>
            <div className="text-slate-300">Assets Under Management</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-400 mb-2">1,200+</div>
            <div className="text-slate-300">Active Traders</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-400 mb-2">24/7</div>
            <div className="text-slate-300">Market Coverage</div>
          </div>
        </div>
      </main>
    </div>
  )
}
