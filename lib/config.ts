// Centralized configuration management
export const config = {
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000,
  },

  // Market Data Configuration
  marketData: {
    updateInterval: 15000, // 15 seconds
    historyLimit: 100,
    supportedPairs: [
      "EURUSD",
      "GBPUSD",
      "USDJPY",
      "GBPJPY",
      "XAUUSD",
      "BTCUSD",
      "ETHUSD",
      "USDCAD",
      "AUDUSD",
      "NZDUSD",
      "USDCHF",
      "EURJPY",
      "EURGBP",
      "AUDCAD",
      "GBPCAD",
    ],
    fallbackPrices: {
      EURUSD: 1.085,
      GBPUSD: 1.265,
      USDJPY: 149.5,
      GBPJPY: 189.25,
      XAUUSD: 2025.5,
      BTCUSD: 43250.0,
      ETHUSD: 2650.0,
      USDCAD: 1.365,
      AUDUSD: 0.665,
      NZDUSD: 0.615,
      USDCHF: 0.875,
      EURJPY: 162.5,
      EURGBP: 0.858,
      AUDCAD: 0.908,
      GBPCAD: 1.728,
    },
  },

  // Trading Configuration
  trading: {
    maxSignalsPerRequest: 10,
    signalExpiryHours: 4,
    minConfidenceLevel: 65,
    maxRiskReward: 5.0,
    minRiskReward: 1.0,
    defaultStopLossPercent: 2.0,
    defaultTakeProfitPercent: 3.0,
  },

  // Cache Configuration
  cache: {
    marketDataTTL: 30 * 1000, // 30 seconds
    signalsTTL: 60 * 1000, // 1 minute
    performanceTTL: 5 * 60 * 1000, // 5 minutes
    userDataTTL: 10 * 60 * 1000, // 10 minutes
  },

  // Rate Limiting Configuration
  rateLimits: {
    api: { windowMs: 60 * 1000, maxRequests: 100 },
    signals: { windowMs: 60 * 1000, maxRequests: 30 },
    auth: { windowMs: 15 * 60 * 1000, maxRequests: 5 },
  },

  // Database Configuration
  database: {
    connectionPoolSize: 10,
    queryTimeout: 30000,
    retryAttempts: 3,
  },

  // Feature Flags
  features: {
    realTimeUpdates: true,
    backtesting: true,
    multiAssetSupport: true,
    advancedAnalytics: true,
    socialTrading: false,
    mobileApp: false,
  },

  // Environment
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
}

// Validation function
export function validateConfig(): boolean {
  const required = [
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  ]

  return required.every((env) => env && env.length > 0)
}
