import { NextResponse } from "next/server"

interface Broker {
  id: string
  name: string
  logo: string
  supported: boolean
  features: string[]
  apiDocUrl: string
  description: string
}

const supportedBrokers: Broker[] = [
  {
    id: "mt4",
    name: "MetaTrader 4",
    logo: "/generic-trading-platform-logo.png",
    supported: true,
    features: ["Forex", "CFDs", "Copy Trading", "Expert Advisors"],
    apiDocUrl: "https://docs.mql4.com/",
    description: "Most popular forex trading platform with extensive automation support.",
  },
  {
    id: "mt5",
    name: "MetaTrader 5",
    logo: "/mt5-logo.png",
    supported: true,
    features: ["Forex", "Stocks", "Futures", "Options", "Copy Trading"],
    apiDocUrl: "https://docs.mql5.com/",
    description: "Advanced multi-asset platform with enhanced features and faster execution.",
  },
  {
    id: "ctrader",
    name: "cTrader",
    logo: "/ctrader-logo.png",
    supported: true,
    features: ["Forex", "CFDs", "Copy Trading", "Algorithmic Trading"],
    apiDocUrl: "https://help.ctrader.com/",
    description: "Professional ECN trading platform with advanced charting and automation.",
  },
  {
    id: "interactive_brokers",
    name: "Interactive Brokers",
    logo: "/interactive-brokers-logo.png",
    supported: false,
    features: ["Stocks", "Options", "Futures", "Forex", "Bonds"],
    apiDocUrl: "https://interactivebrokers.github.io/",
    description: "Global broker with access to 150+ markets worldwide.",
  },
]

export async function GET() {
  return NextResponse.json({
    success: true,
    data: supportedBrokers,
  })
}
