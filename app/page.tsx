import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Shield, Zap, BarChart3, Eye, AlertTriangle, Info } from "lucide-react"

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
            <span className="block text-blue-400">Educational Demo Platform</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Explore our trading signal demonstration platform. Learn about trading strategies, risk management, and
            market analysis through our educational interface.
          </p>

          <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6 mb-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-400" />
              <span className="text-red-400 font-bold text-lg">IMPORTANT RISK WARNING</span>
            </div>
            <div className="text-left space-y-3 text-slate-300">
              <p className="font-semibold text-red-300">
                This is a DEMO/EDUCATIONAL platform. Following these signals with real money carries VERY HIGH RISK of
                loss.
              </p>
              <ul className="space-y-2 text-sm">
                <li>
                  • <strong>Algorithmic Signals:</strong> Generated using time-based algorithms, not real market
                  analysis
                </li>
                <li>
                  • <strong>No Backtesting:</strong> Success rates and confidence levels are artificially generated
                </li>
                <li>
                  • <strong>High Loss Probability:</strong> Following these signals is essentially gambling (50/50 or
                  worse odds)
                </li>
                <li>
                  • <strong>Educational Purpose Only:</strong> Designed to demonstrate trading interfaces, not provide
                  investment advice
                </li>
              </ul>
              <p className="text-xs text-slate-400 mt-4">
                Never risk money you cannot afford to lose. Consult licensed financial advisors for real trading
                decisions.
              </p>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <BarChart3 className="h-5 w-5 text-blue-400" />
              <span className="text-blue-400 font-semibold">DEMO TRADING PLATFORM</span>
            </div>
            <p className="text-slate-300 mb-4">
              Experience a realistic trading interface with simulated signals, portfolio tracking, and educational
              content about trading concepts.
            </p>
            <Link href="/demo">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 mr-4">
                <Eye className="h-4 w-4 mr-2" />
                View Demo Signals
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center space-x-4">
            <Link href="/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                Explore Demo Platform
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-800 bg-transparent"
              >
                Access Demo Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <Info className="h-12 w-12 text-blue-400 mb-4" />
              <CardTitle className="text-white">Educational Demo</CardTitle>
              <CardDescription className="text-slate-300">
                Learn trading concepts through realistic simulations without financial risk.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <Zap className="h-12 w-12 text-blue-400 mb-4" />
              <CardTitle className="text-white">Simulated Signals</CardTitle>
              <CardDescription className="text-slate-300">
                Experience algorithmic signal generation and learn about trading interfaces.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <Shield className="h-12 w-12 text-blue-400 mb-4" />
              <CardTitle className="text-white">Risk Education</CardTitle>
              <CardDescription className="text-slate-300">
                Understand trading risks and the importance of proper risk management.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-8 mb-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">Demo Platform Statistics</h3>
            <p className="text-slate-400 text-sm">*Simulated data for demonstration purposes only</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-2">Demo</div>
              <div className="text-slate-300">Algorithmic Signals</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-2">Educational</div>
              <div className="text-slate-300">Purpose Only</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-2">High Risk</div>
              <div className="text-slate-300">If Used for Real Trading</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-2">24/7</div>
              <div className="text-slate-300">Learning Platform</div>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 max-w-4xl mx-auto">
          <p className="mb-2">
            <strong>DISCLAIMER:</strong> This platform is for educational and demonstration purposes only. All trading
            signals are generated algorithmically and do not constitute financial advice.
          </p>
          <p>
            Trading involves substantial risk of loss. Past performance does not guarantee future results. Always
            consult with qualified financial professionals before making investment decisions.
          </p>
        </div>
      </main>
    </div>
  )
}
